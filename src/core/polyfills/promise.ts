import {PromiseExecutor, PromiseFilled, PromiseRejected, PromiseState} from "../../types/core/polyfills"
import {requireFunction} from "../objects/validators";
import {writeable} from "../definer";
import {loop} from "../utils";
import {isFunction} from "../objects/types";
import {uid} from "./symbol";
import {hasOwn} from "./objects/es2022";
import {apply} from "../functions/apply";
import {bind} from "../functions/bind";
import {get, set} from "../objects/handlers/getset";

const promiseState = uid("Promise#state")
const promiseResult = uid("Promise#result")
const promiseCalls = uid("Promise#calls")

function resolveOrReject(this: Promise<any>, state: PromiseState, value: any, index: number) {
  if (get(this, promiseState) !== "pending")
    return;
  if (value && isFunction(value.then)) {
    const rej = bind(reject, this);
    const res = bind(resolve, this);
    if (value === this)
      rej(new TypeError("Chaining cycle detected for promise."))
    else value.then(res, rej)
    return;
  }
  set(this, promiseState, state);
  set(this, promiseResult, value);

  if (!hasOwn(this, promiseCalls))
    return;
  const calls: Function[] = get(this, promiseCalls);
  if (calls.length === 1)
    calls[0](value)
  else calls[index](value)
}

function resolve(this: Promise<any>, value: any) {
  apply(resolveOrReject, this, ["fulfilled", value, 0])
}

function reject(this: Promise<any>, reason: any) {
  apply(resolveOrReject, this, ["rejected", reason, 1])
}

function resolverPromise(resolve: Function, reject: Function, resolver: any) {
  return (result: any) => {
    setTimeout(() => {
      if (isFunction(resolver)) {
        try {
          resolve(resolver!(result))
        } catch (e) {
          reject(e)
        }
      } else resolve(result)
    }, 0)
  }
}

function finallyPromise(target: Promise<any>, resolve: Function, reject: Function, final: any, first?: boolean) {
  return () => {
    setTimeout(() => {
      if (first)
        final();
      resolve(target);
      if (!first)
        final()
    }, 0)
  }

}

export class Promise<T> {

  constructor(executor: PromiseExecutor<T>) {
    requireFunction(executor);

    writeable(this as Promise<T>, promiseState, 'pending');
    const rej = bind(reject, this);
    try {
      executor(bind(resolve, this), rej)
    } catch (e) {
      rej(e)
    }
  }

  toString() {
    return `Promise { <${get(this, promiseState)}> }`
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
      switch (get(this, promiseState) as PromiseState) {
        case "pending":
          set(this, promiseCalls, [finallyPromise(this, resolve, reject, onFinally)]);
          break;
        case "fulfilled":
        case "rejected":
          finallyPromise(this, resolve, reject, onFinally, true)();
          break;
      }
    })
  }

  catch<R = never>(onrejected?: PromiseRejected<T, R>): Promise<R> {
    return this.then(null, onrejected)
  }

  then<R = never>(onfulfilled?: PromiseFilled<T, R>, onrejected?: PromiseRejected<T, R>): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const res = resolverPromise(resolve, reject, onfulfilled);
      const rej = resolverPromise(reject, reject, onrejected);

      const result = get(this, promiseResult);
      switch (get(this, promiseState) as PromiseState) {
        case "pending":
          set(this, promiseCalls, [res, rej]);
          break;
        case "fulfilled":
          res(result)
          break;
        case "rejected":
          rej(result)
          break;
      }
    })

  }

}
