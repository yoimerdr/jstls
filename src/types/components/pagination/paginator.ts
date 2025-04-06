import {WithPrototype} from "../../core/objects";

/**
 * Paginating through collections of items
 */
export interface Paginator {
  /**
   * Total number of items
   * */
  readonly total: number;

  /**
   * Number of items per page
   * */
  perPage: number;

  /**
   * Current page number
   * */
  readonly current: number;

  /**
   * Total number of pages
   * */
  readonly pages: number;

  /**
   * Whether there is a next page available
   * */
  readonly hasNext: boolean;

  /**
   *  Whether there is a previous page available
   *  */
  readonly hasPrevious: boolean;

  /**
   * Starting index of current page
   * */
  readonly start: number;

  /**
   * Ending index of current page
   * */
  readonly end: number;

  /**
   * Move to next page if available
   * */
  next(): boolean;

  /**
   * Move to previous page if available
   * */
  previous(): boolean;

  /**
   * Move to specific page
   * @param page Page number or string that can be parsed as page number
   * @returns Whether the page changed
   */
  goto(page: number | string): boolean;

  /**
   * Get items for current page from source array
   * @param source Array-like source of items
   * @returns Array of items for current page
   */
  items<T>(source: ArrayLike<T>): T[];

  /**
   * Normalize a page number to be within valid range
   * @param value Page number or string to normalize
   * @returns Normalized page number
   */
  norm(value: string | number): number;
}

export interface PaginatorConstructor extends WithPrototype<Paginator> {
  new(total: number, perPage?: number, page?: number): Paginator;
}
