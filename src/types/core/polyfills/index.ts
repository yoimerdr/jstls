export type PromiseFilled<T, R = T> = ((value: T) => R | PromiseLike<R>) | undefined | null | void
export type PromiseRejected<T, TResult2 = never> =
  ((reason: any) => TResult2 | PromiseLike<TResult2>)
  | undefined
  | null
export type PromiseExecutor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
export type PromiseState = "pending" | "rejected" | "fulfilled"

export type PromiseConstructor = new <T>(executor: PromiseExecutor<T>) => Promise<T>;
