import {ArrayLike} from "@/types/core/array";
import {isNumber} from "@/core/objects/types";
import {Paginator} from "./paginator";
import {Instanceable} from "@/types/core";
import {requireObject} from "@/core/objects/validators";
import {PagePagination, PagePaginationOptions} from "./page";
import {wasFirstLoad, Pagination, PaginationOptions} from "./simple";


/**
 * Creates a paginator based on the given arguments.
 * @param total Total number of items or array-like object to paginate
 * @param perPage Number of items per page
 * @param page Current page number
 */
export function paginator(total: number | ArrayLike, perPage?: number, page?: number): Paginator {
  total = isNumber(total) ? total as number : (total as ArrayLike).length;
  return new Paginator(total, perPage, page);
}

function create<T, P extends Pagination<T>>(options: PaginationOptions<T>, cls: Instanceable<P>): P {
  requireObject(options, "options");
  let {paginator: pgr, source, total, perPage} = options;
  if (!(pgr instanceof Paginator))
    pgr = paginator(source || total || 1, perPage);
  const pagination = new cls(options, pgr);
  wasFirstLoad(pagination) || pagination.paginate("full");
  return pagination;
}

/**
 * Creates a simple pagination.
 * @param options Pagination options
 */
export function pagination<T = never>(options: PaginationOptions<T>): Pagination<T> {
  return create(options, Pagination);
}

/**
 * Creates a page pagination.
 * @param options Page pagination options
 */
export function pagination2<T = never>(options: PagePaginationOptions<T>): PagePagination<T> {
  return create(options, PagePagination);
}


export {Pagination, PagePagination}
export {Paginator} from "./paginator";
export {remove} from "./simple"
