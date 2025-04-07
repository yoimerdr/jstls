import {
  afterPageChange,
  goto,
  Pagination, PaginationCommon,
  paginationConfig, PaginationConstructor, PaginationOptions,
  wasFirstLoad
} from "./simple";
import {KeyableObject, WithPrototype} from "../../types/core/objects";
import {assign, deepAssign} from "../../core/objects/factory";
import {actEl, pageEl} from "./page-elements";
import {funclass} from "../../core/definer/classes/funclass";
import {descriptor2} from "../../core/definer/shared";
import {call} from "../../core/functions/call";
import {toInt} from "../../core/extensions/string";
import {attribute, selector} from "../shared";
import {FunctionClassSimpleStatics} from "../../types/core/definer";
import {singleton} from "../../core/wrappers/singleton";
import {nullable} from "../../core/utils/types";
import {PaginationActLabel} from "../../types/components/pagination";
import {Paginator} from "./paginator";
import {PagePaginationOnElements} from "../../types/components/pagination/shared";

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

export const PagePagination: PagePaginationConstructor = funclass<PagePaginationConstructor, PaginationConstructor>({
  prototype: <FunctionClassSimpleStatics<PagePagination<any>>>{
    url(page) {
      const $this = this,
        url = new URL(location.href);
      url.searchParams.set($this.cfg.parameter!, page as string)
      return url.toString();
    },
    goto(page) {
      const $this = this;
      if (wasFirstLoad($this) && $this.cfg.reload) {
        location.href = $this.url(page);
        return true;
      }

      return goto($this, page, function ($this, page) {
        const container = $this.container;
        afterPageChange($this, page);
        history.replaceState({}, "", $this.url(page));
        const prev = selector(container, '[pagination-role="previous"]'),
          next = selector(container, '[pagination-role="next"]');

        prev && attribute(prev, "href", $this.url(page - 1));
        next && attribute(next, "href", $this.url(page + 1));
      });
    }
  },
  protodescriptor: {
    parameter: descriptor2(function (this: PagePagination<any>) {
      const page = new URL(location.href)
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
        return $this;
      });
    }
  }
}, Pagination);

