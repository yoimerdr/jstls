import {Pagination, PaginationCommon, PaginationOptions} from "./simple";
import {PaginationActLabel} from "./shared";
import {WithPrototype} from "../../core/objects";
import {Paginator} from "./paginator";

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
 * Configuration for page-based pagination
 */
export type PagePaginationConfig<T = any> = PaginationCommon<T> & {
  /** Element creation functions */
  elements: PagePaginationElements<T>;
  /** URL parameter name */
  parameter?: string;
  /** Whether to reload on page change */
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
