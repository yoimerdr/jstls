import {
  afterPageChange,
  goto,
  Pagination,
  paginationConfig,
  wasFirstLoad
} from "./simple";
import {KeyableObject} from "../../types/core/objects";
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
import {PagePagination, PagePaginationConfig, PagePaginationConstructor} from "../../types/components/pagination/page";
import {PaginationConstructor} from "../../types/components/pagination/simple";


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

const PagePagination: PagePaginationConstructor = funclass<PagePaginationConstructor, PaginationConstructor>({
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

export {PagePagination}
