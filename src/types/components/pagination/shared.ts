import {Paginator} from "../../../components/pagination/paginator";
import {KeyableObject} from "../../core/objects";

export interface PaginationOnElements<T, C extends KeyableObject = KeyableObject> {
  /**
   * The pagination configuration
   * */
  readonly cfg: C;

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
