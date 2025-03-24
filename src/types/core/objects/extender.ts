import {MethodKeys, SafeParameters, SafeReturnType} from "../index";


export interface ExtendMethodBuilder<T, K extends MethodKeys<T>> {
  /**
   * Function to replace the current call.
   *
   * @note This function will affect other function calls by all other extensions made before this definition.
   *
   * @param original The original method (Or an extended version)
   * @param args The original method arguments (Or the modified version)
   */
  replace?(this: T, original: T[K], ...args: SafeParameters<T[K]>): SafeReturnType<T[K]>,

  /**
   * Function to returns a modified array of arguments.
   *
   * @note This function will affect arguments received by all other extensions made before this definition.
   *
   * @param args The original method arguments (Or other modified arguments if it has been used before this call.)
   */
  modifyParameters?(this: T, ...args: SafeParameters<T[K]>): SafeParameters<T[K]>

  /**
   * Function to call before the method.
   *
   * @note The last extension will be called first. It will follow the order: last, second last, ... first.
   *
   * @param args The original method arguments (Or the modified version)
   */
  beforeCall?(this: T, ...args: SafeParameters<T[K]>): void,

  /**
   * Function to call after the method
   *
   * @note The first extension will be called first. It will follow the order: first, second, ... last.
   *
   * @param ret The original method returned result (Or the modified version)
   * @param args The original method arguments (Or the modified version)
   */
  afterCall?(this: T, ret: SafeReturnType<T[K]>, ...args: SafeParameters<T[K]>): SafeReturnType<T[K]>
}

export type ExtendMethodBuilders<T> = {
  [P in MethodKeys<T>]?: ExtendMethodBuilder<T, P>
}
