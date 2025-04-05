import {PagePaginationConfig} from "../../types/components/pagination";
import {
  afterPageChange,
  goto,
  Pagination,
  paginationConfig,
  PaginationConstructor,
  wasFirstLoad
} from "./simple-pagination";
import {KeyableObject, WithPrototype} from "../../types/core/objects";
import {Paginator} from "./paginator";
import {assign, deepAssign} from "../../core/objects/factory";
import {actEl, pageEl} from "./page-elements";
import {funclass} from "../../core/definer/classes";
import {descriptor2} from "../../core/definer/shared";
import {call} from "../../core/functions/call";
import {toInt} from "../../core/extensions/string";
import {attribute, selector} from "../shared";
import {FunctionClassSimpleStatics} from "../../types/core/definer";
import {singleton} from "../../core/wrappers/singleton";
import {nullable} from "../../core/utils/types";

/**
 * A handler for creates a page pagination component.
 */
export interface PagePagination<T, C extends PagePaginationConfig<T> = PagePaginationConfig<T>> extends Pagination<T, C> {
  /**
   * Current page number from URL parameter.
   */
  readonly parameter: number;

  /**
   * Generates URL for a given page number
   * @param page Page number or string
   */
  url(page: number | string): string;
}

export interface PagePaginationConstructor extends WithPrototype<PagePagination<any>> {
  new<T, C extends PagePaginationConfig<T> = PagePaginationConfig<T>>(config: C, paginator: Paginator): PagePagination<T, C>;
}

/**
 * Creates default pagination configuration by merging provided config with defaults
 */
export function pagePaginationConfig<C extends PagePaginationConfig>(config: C): C {
  const $config: KeyableObject = deepAssign(<C>{
    parameter: "page",
    reload: false,
  }, paginationConfig(config));

  $config.elements = assign({
    act: actEl,
    page: pageEl,
  }, config.elements)

  return $config;
}

export const PagePagination = funclass<PagePaginationConstructor, PaginationConstructor>({
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
