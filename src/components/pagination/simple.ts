import {KeyableObject, RequiredAll, WithPrototype} from "@jstls/types/core/objects";
import {
  PaginationActivePages,
  PaginationActLabel, PaginationLabels,
  PaginationResponsive
} from "@jstls/types/components/pagination";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {isDefined, isFunction, isObject, isString} from "@jstls/core/objects/types";
import {IllegalArgumentError} from "@jstls/core/exceptions";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {uid} from "@jstls/core/polyfills/symbol";
import {configurable, readonlys, writeable} from "@jstls/core/definer";
import {Entry, Maybe, MaybeNumber} from "@jstls/types/core";
import {eachprv} from "@jstls/core/iterable/each";
import {last} from "@jstls/core/extensions/shared/iterables";
import {entries} from "@jstls/core/polyfills/objects/es2017";
import {noact} from "@jstls/core/utils";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {assign, deepAssign} from "@jstls/core/objects/factory";
import {bind} from "@jstls/core/functions/bind";
import {floor, max, min} from "@jstls/core/shortcuts/math";
import {requireObject} from "@jstls/core/objects/validators";
import {actEl, ellipsisEl, pageEl} from "./simple-elements";
import {forEach} from "@jstls/core/shortcuts/array";
import {concat} from "@jstls/core/shortcuts/indexable";
import {addClass, append, create, onEvent, selector, toggleClass} from "@jstls/components/shared";
import {descriptor2} from "@jstls/core/definer/shared";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {apply} from "@jstls/core/functions/apply";
import {toInt} from "@jstls/core/extensions/string";
import {deletes} from "@jstls/core/objects/handlers/deletes";
import {Paginator} from "@jstls/core/geometry/paginator";
import {PaginationOnElements} from "@jstls/types/components/pagination/shared";
import {emitter} from "@jstls/core/emitter";
import {win} from "@jstls/components/shared/constants";
import {dataAttribute} from "@jstls/components/shared/elements/attributes";

/**
 * A handler for creates a pagination component.
 */
export interface Pagination<T, C extends PaginationConfig<T> = PaginationConfig<T>> extends PaginationOnElements<T, C> {

  /**
   * The container element
   * */
  readonly container: HTMLElement;

  /**
   * Get responsive breakpoints and their configurations
   * */
  get responsives(): Entry<PaginationResponsive, number>[];

  /**
   * Render pagination UI
   * @param target The mode to render the component.
   * */
  paginate(target?: 'full' | 'pages'): void;
}

export interface PaginationConstructor extends WithPrototype<Pagination<any>> {
  new<T, C extends PaginationConfig<T> = PaginationConfig<T>>(config: C, paginator: Paginator): Pagination<T, C>;
}


/**
 * Common pagination configuration options
 */
export type PaginationCommon<T = any> = {
  /**
   * Optional source array to paginate.
   * */
  source?: T[];
  /**
   * Container element or selector
   * */
  container: string | HTMLElement;
  /**
   * Label configurations
   * */
  labels?: PaginationLabels;
  /**
   * Text to show for ellipsis
   * */
  ellipsisText?: string;
  /**
   * The page name
   * */
  name?: string;
  /**
   * Whether to scroll on page change
   * */
  scroll?: boolean;
  /**
   * Callback when page changes
   * */
  onPageChange?(this: Pagination<T>, page: number, items: T[]): void | Promise<T>;
  /**
   * Responsive configurations
   * */
  responsive?: Record<number | string, PaginationResponsive>;
} & PaginationResponsive;

/**
 * Element creation functions for pagination
 */
export type PaginationElements<T = any> = {
  /**
   * Creates action button element
   * */
  act(this: Pagination<T>, label: PaginationActLabel): HTMLElement;
  /**
   * Creates page number element
   * */
  page(this: Pagination<T>, page: number | string): HTMLElement;
  /**
   * Creates ellipsis element
   * */
  ellipsis(this: Pagination<T>, text: string): HTMLElement;
}

/**
 * Configuration for simple pagination
 */
export type PaginationConfig<T = any> = PaginationCommon<T> & {
  /**
   * Element creation functions
   * */
  elements: PaginationElements<T>;
}

/**
 * Options for simple pagination
 */
export type PaginationOptions<T = any> = PaginationCommon<T> & {
  /**
   * Total number of items
   * */
  total?: number;
  /**
   * Number of items per page
   * */
  perPage: number;
  /**
   * Custom paginator instance
   * */
  paginator?: Paginator
};

/**
 * Creates default pagination configuration by merging provided config with defaults
 */
export function paginationConfig<C extends PaginationConfig>(config: C): C {
  requireObject(config, "options");
  return deepAssign<KeyableObject>({
    pinedPages: 1,
    pages: 3,
    labels: {
      first: {
        name: "First page",
        text: '«'
      },
      last: {
        name: "Last page",
        text: '»'
      },
      next: {
        name: "Next page",
        text: '›'
      },
      previous: {
        name: "Previous page",
        text: '‹'
      }
    },
    showFirst: true,
    showLast: true,
    showEllipsis: true,
    onPageChange: noact,
    responsive: {},
    elements: {
      act: actEl,
      page: pageEl,
      ellipsis: ellipsisEl,
    },
    scroll: true,
    ellipsisText: "...",
    name: "Page"
  }, config,);
}

function addMediaQuery<T>($this: Pagination<T>, width: number, next?: number) {
  onEvent(window.matchMedia(concat('(min-width:', width, 'px')), "change", (ev) => {
    let responsive: Maybe<PaginationResponsive> = nullable,
      source = $this.cfg.responsive!;
    if (ev.matches)
      responsive = source[width];
    else if (next && window.innerWidth >= next)
      responsive = source[next];
    set2($this, metaResponsive, responsive);
    $this.paginate("full");
  })

}

function init($this: Pagination<any>) {
  const container = $this.container;

  let responsive = get2($this, metaResponsive);

  // clears the container
  container.innerHTML = "";

  const el = create("div");
  addClass(el, "pagination");

  const options = $this.cfg as RequiredAll<PaginationConfig>;

  // checks responsive options
  if (isObject(responsive)) {
    // assign default values to responsive
    responsive = assign({
      pinedPages: options.pinedPages,
      pages: options.pages,
      showFirst: options.showFirst,
      showLast: options.showLast,
      showEllipsis: options.showEllipsis,
    }, responsive!);
  } else responsive = options;

  // unpack options
  let {pinedPages, pages, showFirst, showLast, showEllipsis} = responsive as RequiredAll<PaginationResponsive>;
  const {pages: totalPages,} = $this.paginator;

  // Validate and normalize parameters to paginate active pages
  pinedPages = max(0, min(pinedPages, floor(totalPages / 2)));
  pages = max(1, min(pages, totalPages - (pinedPages * 2)));

  function act(label: PaginationActLabel) {
    let el = apply(options.elements.act, $this, [label]),
      target = [];

    dataAttribute(el, "action", label);
    if (label === "first" || label === "previous")
      target = get2($this, metaFirsts);
    else if (label === "last" || label === "next")
      target = get2($this, metaLasts);

    target.push(el)
    return el;
  }

  // creates the actions pages
  showFirst && append(el, act("first"));
  append(el, act("previous"));

  const div = create('div');
  div.className = "pagination-pages";

  // assign the active options
  set2($this, metaActive, {
    pinedPages,
    container: div,
    showEllipsis,
    pages,
  })

  append(el, div);

  // create the action pages
  const next = act("next");
  let last: Maybe<HTMLElement> = showLast ? act("last") : indefinite;

  // paginate
  $this.paginate('pages');

  // append action pages
  append(el, next);
  last && append(el, last);
  append(container, el);
}


/**
 * Checks if this is first load of pagination.
 * @param $this The pagination instance
 */
export function wasFirstLoad($this: Pagination<any>): boolean {
  return get2($this, metaFirst);
}

const metaPagination = uid("p"),
  metaActive = uid("mA"),
  metaResponsive = uid("mR"),
  metaFirsts = uid("mF"),
  metaLasts = uid("mL"),
  metaFirst = uid("mF"),
  disabledClass = 'pagination-disabled',
  {on, emit, off} = emitter();

function getContainer(target: HTMLElement | string): HTMLElement {
  if (isString(target)) {
    target = selector(target as string) as HTMLElement;
    if (!target)
      throw new IllegalArgumentError(concat("Not exists an element for '", target, "'."));
  }

  return target as HTMLElement;
}

/**
 * Removes the pagination from container and clear it.
 */
export function remove(target: HTMLElement | string) {
  target = getContainer(target);
  target.innerHTML = "";
  deletes(target, metaPagination);
}

function disableActions($this: Pagination<any>, page: number) {
  forEach(get2($this, metaFirsts), (el: HTMLElement) => toggleClass(el, disabledClass, page === 1))
  forEach(get2($this, metaLasts), (el: HTMLElement) => toggleClass(el, disabledClass, page === $this.paginator.pages));
}

export const Pagination: PaginationConstructor = funclass2({
  construct: function (config, paginator) {
    const $this = this;

    writeable($this, metaResponsive, indefinite)
    writeable($this, metaFirst, false)
    writeable($this, metaActive, indefinite)
    writeable($this, metaFirsts, [])
    writeable($this, metaLasts, [])

    // checks already created pagination
    const container = getContainer(config.container),
      current = get2(container, metaPagination);
    if (current)
      return current;

    config = paginationConfig(config);

    readonlys($this, {
      paginator,
      container: container as HTMLElement,
      cfg: config,
      _ev_change: uid('c'),
    });

    configurable(container, metaPagination, $this)

    // add responsive listeners
    const responsive = $this.responsives,
      win = window;
    if (win && responsive.length) {
      let target: MaybeNumber = nullable;
      eachprv(responsive, function (current, previous) {
        const act = current.key,
          prev = previous.key
        // gets the first valid large value according to window width
        if (!target) {
          const width = win.innerWidth;
          if (width >= act)
            target = act;
          else if (width >= prev)
            target = prev;
        }

        addMediaQuery($this, act, prev)
      })

      // check last responsive value
      let width = responsive[0].key;
      addMediaQuery($this, width);
      if (!target) {
        width = last(responsive).key;
        if (win.innerWidth >= width)
          target = width;
      }

      target && writeable($this, metaResponsive, $this.cfg.responsive![target]);
    }

    on(get2($this, '_ev_change'), ($this: Pagination<any>, page: number) => {
      get2($this, metaFirst) && $this.paginate('pages');

      // disable elements
      disableActions($this, page);
    });
  },
  prototype: <FunctionClassSimpleStatics<Pagination<any>> & ThisType<Pagination<any>>>{
    toFirst(force) {
      return this.goto(1, force);
    },
    toLast(force) {
      const $this = this;
      return $this.goto($this.paginator.pages, force);
    },
    next(force) {
      const $this = this;
      return $this.goto($this.paginator.current + 1, force);
    },
    previous(force) {
      const $this = this;
      return $this.goto($this.paginator.current - 1, force);
    },
    goto(page, force) {
      const $this = this,
        {paginator, cfg} = $this;
      let current = paginator.current;

      paginator.goto(page);

      if (get2($this, metaFirst) && current === paginator.current && !force)
        return false;

      if (win && cfg.scroll)
        win.scroll({
          top: 0,
          behavior: "smooth"
        })

      current = paginator.current;

      const items = cfg.source ? paginator.items(cfg.source) : indefinite;

      const res = apply(cfg.onPageChange!, $this, [current, items!]),
        change = get2($this, '_ev_change');
      if (res && isFunction(get2(res, "then"))) {
        (res as PromiseLike<any>)
          .then(() => emit(change, $this, $this, current))
      } else emit(change, $this, $this, current);

      return true;
    },
    paginate(target) {
      const $this = this,
        paginator = $this.paginator;

      if (target === 'pages') {
        if (!get2($this, metaActive))
          return;

        const config = $this.cfg;
        // unpack active pages parameters
        const {container, pinedPages, pages, showEllipsis} = get2($this, metaActive) as PaginationActivePages,
          {pages: totalPages, current} = paginator,
          elements = config.elements;

        const page = bind(elements.page, $this),
          ellipsis = bind(elements.ellipsis, $this),
          ellipsisText = config.ellipsisText!;

        // clear container
        container.innerHTML = "";

        // Add pined pages at start
        for (let i = 1; i <= pinedPages; i++)
          append(container, page(i));

        // Calculate range of pages to show around current
        const half = floor(pages / 2);
        let start = max(pinedPages + 1, current - half),
          end = min(totalPages - pinedPages, start + pages - 1);

        // Adjust range if it hits the boundaries
        if (end - start + 1 < pages) {
          if (start === pinedPages + 1)
            end = min(totalPages - pinedPages, start + pages - 1);
          else start = max(pinedPages + 1, end - pages + 1);
        }

        // Add ellipsis if there's a gap after pined pages
        if (showEllipsis && start > pinedPages + 1)
          append(container, ellipsis(ellipsisText));

        // Add pages in the calculated range
        for (let i = start; i <= end; i++)
          append(container, page(i));

        // Add ellipsis if there's a gap before end pined pages
        if (showEllipsis && end < totalPages - pinedPages)
          append(container, ellipsis(ellipsisText));

        // Add pined pages at end
        for (let i = Math.max(end + 1, totalPages - pinedPages + 1); i <= totalPages; i++)
          append(container, page(i));
      } else {
        init($this);
        get2($this, metaFirst) && disableActions($this, $this.paginator.current);
      }

      if (!get2($this, metaFirst)) {
        $this.goto(paginator.current);
        set2($this, metaFirst, true)
      }
    }
  },
  protodescriptor:
    {
      responsives: descriptor2<Pagination<any>>(function () {
        return entries(this.cfg.responsive!)
          .map(values => {
            try {
              const key = toInt(nullable, values[0]);

              return isDefined(key) ? {
                key: key!,
                value: values[1]
              } : nullable!;
            } catch (e) {
            }
            return nullable!;
          })
          .filter(isDefined)
          .sort((a, b) => a.key - b.key)
      })
    }
})

export {on, off}
