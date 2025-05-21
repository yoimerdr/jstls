import {apply} from "@/core/functions/apply";
import {slice} from "@/core/iterable";
import {nullable} from "./types";
import {concat, len} from "@/core/shortcuts/indexable";


/**
 * Returns the input value unchanged.
 * @param value - The value to return.
 */
export function self<T>(value: T): T {
  return value;
}

/**
 * Creates a function that always returns the passed value.
 * @param value - The value to be returned.
 */
export function returns<T>(value: T) {
  return () => value;
}

/**
 * Creates a function that returns the negated result of the provided function.
 * @param fn - The function whose result should be negated.
 */
export function nreturns<T extends (...args: any[]) => boolean>(fn: T) {
  return function () {
    return !apply(fn, nullable!, slice(arguments) as any)
  }
}

/**
 * A no-operation function that does nothing.
 * @param args - Any arguments (which will be ignored).
 */
export function noact(...args: any) {
}

/**
 * Reduces a text to a maximum length by joining words until the limit is reached.
 *
 * @example
 * reduceText("lorem ipsum dolor sit amet, consectetur adipiscing elit", 40) // "lorem ipsum dolor sit amet, consectetur"
 *
 * @example
 * reduceText("lorem ipsum dolor sit amet, consectetur adipiscing elit", 40, /\W/, "-") // lorem-ipsum-dolor-sit-amet-consectetur
 *
 * @param text The input text string to reduce
 * @param length The maximum length
 * @param separator The word's separator
 * @param joiner The string to join the words.
 *
 * @returns The reduced text
 */
export function reduceText(text: string, length?: number, separator?: string | RegExp, joiner?: string) {
  let result = "";
  joiner = joiner || " ";
  separator = separator || " "
  const source = text.split(separator)
  for (let i = 0; i < len(source); i++) {
    let value = source[i];
    if (!value)
      continue;
    value = concat(result, joiner, value);
    if (length && len(value) > length)
      break;
    result = value;
  }

  return result.slice(1);
}
