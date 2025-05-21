
import {paginator, Paginator} from "@/core/geometry/paginator";
import {Instanceable} from "@/types/core";
import {requireObject} from "@/core/objects/validators";
import {PagePagination, PagePaginationOptions} from "./page";
import {wasFirstLoad, Pagination, PaginationOptions} from "./simple";


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
export {remove} from "./simple"
