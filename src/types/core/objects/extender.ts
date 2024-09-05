import {MethodKeys, SafeParameters, SafeReturnType} from "../index";


export interface ExtendMethodBuilder<T, K extends MethodKeys<T>> {
  replace?(this: T, original: T[K], ...args: SafeParameters<T[K]>): SafeReturnType<T[K]>,

  modifyParameters?(this: T, ...args: SafeParameters<T[K]>): SafeParameters<T[K]>

  beforeCall?(this: T, ...args: SafeParameters<T[K]>): void,

  afterCall?(this: T, ret: SafeReturnType<T[K]>, ...args: SafeParameters<T[K]>): SafeReturnType<T[K]>
}

export type ExtendMethodBuilders<T> = {
  [P in MethodKeys<T>]?: ExtendMethodBuilder<T, P>
}
