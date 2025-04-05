import {PagePagination, Pagination, Paginator} from "../../components/pagination";

/**
 * Properties for active pages display
 */
export interface PaginationActivePages {
  /**
   * Container element
   * */
  container: HTMLElement;
  /**
   * Total number of pages
   * */
  pages: number;
  /**
   * Number of pages to pin at start/end
   * */
  pinedPages: number;
  /**
   * Whether to show ellipsis
   * */
  showEllipsis?: boolean;
}

/**
 * Responsive configuration options
 */
export interface PaginationResponsive {
  /**
   * Whether to show first page button
   * */
  showFirst?: boolean;
  /**
   * Whether to show last page button
   * */
  showLast?: boolean;
  /**
   * Whether to show ellipsis
   * */
  showEllipsis?: boolean;
  /**
   * Number of pages to display
   * */
  pages?: number;
  /**
   * Number of pages to pin
   * */
  pinedPages?: number;
}

/** Types of pagination action labels */
export type PaginationActLabel = "first" | "last" | "previous" | "next"

/**
 * Configuration for a pagination label
 */
export interface PaginationLabel {
  /**
   * Label name
   * */
  name?: string;
  /**
   * Label display text. It can include html code.
   * */
  text?: string;
}

/**
 * Configuration for all pagination labels
 */
export interface PaginationLabels {
  /**
   * Next page label
   * */
  next?: PaginationLabel;
  /**
   * Previous page label
   * */
  previous?: PaginationLabel;
  /**
   * First page label
   * */
  first?: PaginationLabel;
  /**
   * Last page label
   * */
  last?: PaginationLabel;
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
  onPageChange?(this: Paginator, page: number, items: T[]): void | Promise<T>;
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
 * Configuration for simple pagination
 */
export type PaginationConfig<T = any> = PaginationCommon<T> & {
  /**
   * Element creation functions
   * */
  elements: PaginationElements<T>;
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
