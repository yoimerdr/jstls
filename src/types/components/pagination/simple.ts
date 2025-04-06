import {PaginationActLabel, PaginationLabels, PaginationResponsive} from "./shared";
import {WithPrototype} from "../../core/objects";
import {Paginator} from "./paginator";
import {Entry} from "../../core";

/**
 * A handler for creates a pagination component.
 */
export interface Pagination<T, C extends PaginationConfig<T> = PaginationConfig<T>> {
  /**
   * The paginator instance
   * */
  readonly paginator: Paginator;
  /**
   * The container element
   * */
  readonly container: HTMLElement;
  /**
   * The pagination configuration
   * */
  readonly cfg: C;

  /**
   * Get responsive breakpoints and their configurations
   * */
  get responsives(): Entry<PaginationResponsive, number>[];

  /**
   * Navigate to first page
   * */
  toFirst(): boolean;

  /**
   * Navigate to last page
   * */
  toLast(): boolean;

  /**
   * Navigate to next page
   * */
  next(): boolean;

  /**
   * Navigate to previous page
   * */
  previous(): boolean;

  /**
   * Navigate to specific page
   * @param page The page to go
   * */
  goto(page: number | string): boolean;

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
