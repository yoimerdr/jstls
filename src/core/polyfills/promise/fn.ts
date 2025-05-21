import {PromiseConstructor} from "./index";

declare const Promise: PromiseConstructor;

export function resolve(): Promise<void>;
export function resolve<T>(result: T): Promise<T>;
export function resolve<T>(result?: T): Promise<T> {
  return new Promise(res => res(result)) as any;
}

export function reject(): Promise<void>;
export function reject<T>(result: T): Promise<T>;
export function reject<T>(result?: T): Promise<T> {
  return new Promise((_, rej) => rej(result)) as any;
}
