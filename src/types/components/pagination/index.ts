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


