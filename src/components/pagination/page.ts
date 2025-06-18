import {
  on,
  Pagination, PaginationCommon,
  paginationConfig, PaginationConstructor, PaginationOptions,
  wasFirstLoad
} from "./simple";
import {KeyableObject, WithPrototype} from "@jstls/types/core/objects";
import {assign, deepAssign} from "@jstls/core/objects/factory";
import {actEl, pageEl} from "./page-elements";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {descriptor2} from "@jstls/core/definer/shared";
import {call} from "@jstls/core/functions/call";
import {toInt} from "@jstls/core/extensions/string";
import {attribute} from "@jstls/components/shared";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {singleton} from "@jstls/core/wrappers/singleton/fn";
import {nullable} from "@jstls/core/utils/types";
import {PaginationActLabel} from "@jstls/types/components/pagination";
import {Paginator} from "@jstls/core/geometry/paginator";
import {PagePaginationOnElements} from "@jstls/types/components/pagination/shared";
import {get2} from "@jstls/core/objects/handlers/getset";
import {his, loc} from "@jstls/components/shared/constants";
import {protoapply} from "@jstls/core/functions/prototype/apply";
import {string} from "@jstls/core/objects/handlers";
import {classSelector} from "@jstls/components/shared/elements/selectors";
import {withPrefix} from "@jstls/components/pagination/simple-elements";

/**
 * A handler for creates a page pagination component.
 */
export interface PagePagination<T, C extends PagePaginationConfig<T> = PagePaginationConfig<T>> extends Pagination<T, C>, PagePaginationOnElements<T, C> {
  /**
   * Current page number from URL parameter.
   */
  readonly parameter: number;
}

export interface PagePaginationConstructor extends WithPrototype<PagePagination<any>> {
  new<T, C extends PagePaginationConfig<T> = PagePaginationConfig<T>>(config: C, paginator: Paginator): PagePagination<T, C>;
}

/**
 * Configuration for page-based pagination
 */
export type PagePaginationConfig<T = any> = PaginationCommon<T> & {
  /**
   * Element creation functions
   * */
  elements: PagePaginationElements<T>;
  /**
   * URL parameter name
   * */
  parameter?: string;
  /**
   * Whether to reload on page change
   * */
  reload?: boolean;
  /**
   * Callback when page changes
   * */
  onPageChange?(this: PagePagination<T>, page: number, items: T[]): void | Promise<T>;
}

/**
 * Element creation functions for page pagination
 */
export type PagePaginationElements<T = any> = {
  /**
   * Creates action button element
   * */
  act(this: PagePagination<T>, label: PaginationActLabel): HTMLElement;
  /**
   * Creates page number element
   * */
  page(this: PagePagination<T>, page: number | string): HTMLElement;
  /**
   * Creates ellipsis element
   * */
  ellipsis(this: PagePagination<T>, text: string): HTMLElement;
}

/**
 * Options for page-based pagination
 */
export type PagePaginationOptions<T = any> = PaginationOptions<T> & {
  /**
   * URL parameter name
   * */
  parameter?: string;
  /**
   * Whether to reload on page change
   * */
  reload?: boolean;
}


/**
 * Creates default pagination configuration by merging provided config with defaults
 */
export function pagePaginationConfig<C extends PagePaginationConfig>(config: C): C {
  const $config: KeyableObject = deepAssign(<C>{
    parameter: "page",
    reload: false,
  }, paginationConfig(config));

  $config.elements = assign<KeyableObject>({
    act: actEl,
    page: pageEl,
  }, config.elements)

  return $config;
}

export const PagePagination: PagePaginationConstructor = funclass2<PagePaginationConstructor, PaginationConstructor>({
  prototype: <FunctionClassSimpleStatics<PagePagination<any>>>{
    url(page) {
      const $this = this,
        url = new URL(loc.href),
        params = url.searchParams,
        name = $this.cfg.parameter!;

      page > 1 ? params.set(name, page as string) : params.delete(name);
      return string(url);
    },
    goto(page, force) {
      const $this = this;
      if (wasFirstLoad($this) && $this.cfg.reload) {
        loc.href = $this.url(page);
        return true;
      }

      return protoapply(Pagination, 'goto', $this, [page, force]);
    }
  },
  protodescriptor: {
    parameter: descriptor2(function (this: PagePagination<any>) {
      const page = new URL(loc.href)
        .searchParams
        .get(this.cfg.parameter!)

      return toInt(nullable, page!) || 1;
    })
  },
  cls: (_, parent) => {
    return function (config, paginator) {
      return singleton(this, ($this) => {
        config = pagePaginationConfig(config);
        call(parent, $this, config, paginator);
        paginator.goto($this.parameter);
        on(get2($this, '_ev_change'), ($this: PagePagination<any>, page: number) => {
          const container = $this.container;
          his.replaceState({}, "", $this.url(page));

          const prev = classSelector(withPrefix("previous"), container),
            next = classSelector(withPrefix("next"), container),
            paginator = $this.paginator,
            nxtPage = page + 1,
            prevPage = page - 1;

          prev && prevPage && attribute(prev, "href", $this.url(prevPage));
          next && nxtPage <= paginator.pages && attribute(next, "href", $this.url(nxtPage));
        });
        return $this;
      });
    }
  }
}, Pagination);

