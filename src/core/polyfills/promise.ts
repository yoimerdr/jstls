import {PromiseExecutor, PromiseFilled, PromiseRejected, PromiseState} from "../../types/core/polyfills"
import {requireFunction} from "../objects/validators";
import {writeable} from "../definer";
import {isFunction} from "../objects/types";
import {uid} from "./symbol";
import {hasOwn} from "./objects/es2022";
import {bind} from "../functions/bind";
import {get, set} from "../objects/handlers/getset";
import {concat, len} from "../shortcuts/indexable";
import {funclass2} from "../definer/classes/funclass";
import {forEach} from "../shortcuts/array";
import {FunctionClassSimpleStatics} from "../../types/core/definer";
import {nullable} from "../utils/types";

const promiseState = uid("mS"),
  promiseResult = uid("mR"),
  promiseCalls = uid("mC");

function resolveOrReject($this: Promise<any>, state: PromiseState, value: any, index: number) {

  if (get($this, promiseState) !== "pending")
    return;
  if (value && isFunction(value.then)) {
    const rej = bind(reject, $this);
    const res = bind(resolve, $this);
    if (value === $this)
      rej(new TypeError("Chaining cycle detected for promise."))
    else value.then(res, rej)
    return;
  }
  set($this, promiseState, state);
  set($this, promiseResult, value);

  if (!hasOwn($this, promiseCalls))
    return;
  const calls: Function[] = get($this, promiseCalls);
  if (len(calls) === 1)
    calls[0](value)
  else calls[index](value)
}

function resolve(this: Promise<any>, value: any) {
  resolveOrReject(this, "fulfilled", value, 0)
}

function reject(this: Promise<any>, reason: any) {
  resolveOrReject(this, "rejected", reason, 1)
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

export interface Promise<T> {
  finally<U>(onFinally?: () => U | Promise<U>): Promise<U>;

  catch<R = never>(onrejected?: PromiseRejected<T, R>): Promise<R>;

  then<R = never>(onfulfilled?: PromiseFilled<T, R>, onrejected?: PromiseRejected<T, R>): Promise<R>;

  toString(): string;
}

export interface PromiseConstructor {
  resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;

  reject<T = never>(reason?: any): Promise<T>;

  all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;

  new<T>(executor: PromiseExecutor<T>): Promise<T>;
}

export const Promise: PromiseConstructor = funclass2({
  construct: function (executor) {
    requireFunction(executor);
    const $this = this,
      rej = bind(reject, $this);

    writeable($this, promiseState, 'pending');
    try {
      executor(bind(resolve, $this), rej)
    } catch (e) {
      rej(e)
    }
  },
  statics: {
    resolve(value) {
      return new Promise((res) => res(value));
    },
    reject(reason) {
      return new Promise((_, reject) => reject(reason));
    },
    all(values) {
      return new Promise((resolve, reject) => {
        let count = 0;
        const size = len(values),
          results: any[] = [];

        forEach(values, (promise, index) => {
          Promise.resolve(promise)
            .then((result) => {
              results[index] = result;
              count++;
              count === size && resolve(results);
            }, reject);
        })

        count === 0 && resolve(results);
      })
    }
  },
  prototype: <FunctionClassSimpleStatics<Promise<unknown>>>{
    finally(onFinally) {
      const $this = this;
      return new Promise((resolve, reject) => {
        switch (get($this, promiseState) as PromiseState) {
          case "pending":
            set($this, promiseCalls, [finallyPromise($this, resolve, reject, onFinally)]);
            break;
          case "fulfilled":
          case "rejected":
            finallyPromise($this, resolve, reject, onFinally, true)();
            break;
        }
      })
    },
    catch(onrejected) {
      return this.then(nullable, onrejected)
    },
    then(onfulfilled, onrejected) {
      const $this = this;
      return new Promise((resolve, reject) => {
        const res = resolverPromise(resolve, reject, onfulfilled),
          rej = resolverPromise(reject, reject, onrejected),
          result = get($this, promiseResult);

        switch (get($this, promiseState) as PromiseState) {
          case "pending":
            set($this, promiseCalls, [res, rej]);
            break;
          case "fulfilled":
            res(result)
            break;
          case "rejected":
            rej(result)
            break;
        }
      })
    },
    toString() {
      return concat<string>("Promise { <", get(this, promiseState), "> }",)
    }
  }
})
