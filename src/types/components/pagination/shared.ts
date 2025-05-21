import {KeyableObject} from "@jstls/types/core/objects";
import {Paginator} from "@jstls/core/geometry/paginator";

export interface PaginationOnElements<T, C extends KeyableObject = KeyableObject> {
  /**
   * The pagination configuration
   * */
  readonly cfg: C;

  /**
   * Navigate to first page
   * */
  toFirst(force?: boolean): boolean;

  /**
   * Navigate to last page
   * */
  toLast(force?: boolean): boolean;

  /**
   * Navigate to next page
   * */
  next(force?: boolean): boolean;

  /**
   * Navigate to previous page
   * */
  previous(force?: boolean): boolean;

  /**
   * Navigate to specific page
   * @param page The page to go
   * @param force
   * */
  goto(page: number | string, force?: boolean): boolean;

  /**
   * The paginator instance
   * */
  readonly paginator: Paginator;
}

export interface PagePaginationOnElements<T, C extends KeyableObject = KeyableObject> extends PaginationOnElements<T, C> {
  /**
   * Generates URL for a given page number
   * @param page Page number or string
   */
  url(page: number | string): string;
}
