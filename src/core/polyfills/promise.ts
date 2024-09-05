import {PromiseExecutor, PromiseFilled, PromiseRejected, PromiseState} from "../../types/core/polyfills"
import {requireFunction} from "../objects/validators";
import {writeables} from "../definer";
import {loop} from "../utils";
import {isFunction} from "../objects/types";

export class Promise<T> {
  private __state__!: PromiseState;
  private __callbacks__!: Function[]
  private __result__!: T

  constructor(executor: PromiseExecutor<T>) {
    requireFunction(executor);

    const resolveOrReject = (state: PromiseState, value: PromiseLike<T> | T, index: number) => {
      if (this.__state__ !== "pending")
        return;
      if (value && isFunction((value as PromiseLike<T>).then)) {
        if (value === this)
          reject(new TypeError("Chaining cycle detected for promise."))
        else (value as PromiseLike<T>).then(resolve, reject)
        return;
      }

      this.__state__ = state;
      this.__result__ = (value as T)

      if (!this.__callbacks__)
        return;

      if (this.__callbacks__.length === 1)
        this.__callbacks__[0](value)
      else this.__callbacks__[index](value)
    }

    function resolve(value: T | PromiseLike<T>) {
      resolveOrReject("fulfilled", value, 0)
    }

    function reject(reason: any) {
      resolveOrReject("rejected", reason, 1)
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }

    writeables(this as Promise<T>, {
      _state: 'pending'
    })
  }

  toString() {
    return `Promise { <${this.__state__}> }`
  }

  static resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>> {
    return new Promise(resolve => resolve(value as any))
  }

  static reject<T = never>(reason?: any): Promise<T> {
    return new Promise((_, reject) => reject(reason))
  }

  static all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }> {
    return new Promise((resolve, reject) => {
      let count = 0;
      const len = values.length
      const results: any[] = []
      loop(index => {
        const promise = values[index];
        Promise.resolve(promise)
          .then(function (result) {
            results[index] = result;
            count++;
            if (count === len)
              resolve(results as any);
          }, function (reason) {
            reject(reason);
          });
      }, len)
      if (count === 0)
        resolve(results as any);
    })
  }

  finally<U>(onFinally?: () => U | Promise<U>): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      this.__callbacks__ = [
        () => {
          setTimeout(() => {
            try {
              resolve(this as any)
            } catch (e) {
              reject(e)
            }
            onFinally!()
          }, 0)
        }
      ]
    })
  }

  catch<R = never>(onrejected?: PromiseRejected<T, R>): Promise<R> {
    return this.then(null, onrejected)
  }

  then<R = never>(onfulfilled?: PromiseFilled<T, R>, onrejected?: PromiseRejected<T, R>): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const res = (result: T) => {
        setTimeout(() => {
          if (isFunction(onfulfilled)) {
            try {
              resolve(onfulfilled!(result))
            } catch (e) {
              reject(e)
            }
          } else resolve(result as any)
        }, 0)
      }

      const rej = (reason: any) => {
        setTimeout(() => {
          if (isFunction(onrejected)) {
            try {
              reject(onrejected!(reason))
            } catch (e) {
              reject(e)
            }
          } else reject(reason)
        }, 0)
      }
      switch (this.__state__) {
        case "pending":
          this.__callbacks__ = [res, rej];
          break;
        case "fulfilled":
          res(this.__result__)
          break;
        case "rejected":
          rej(this.__result__)
          break;
      }
    })
  }

}
