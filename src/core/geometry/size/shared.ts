import {FunctionType, Instanceable} from "@jstls/types/core";
import {isDefined, isFunction, isNumber} from "@jstls/core/objects/types";
import {string} from "@jstls/core/objects/handlers";
import {toFloat} from "@jstls/core/extensions/string";
import {IllegalArgumentError} from "@jstls/core/exceptions/illegal-argument";
import {concat} from "@jstls/core/shortcuts/indexable";
import {get2} from "@jstls/core/objects/handlers/getset";

export interface ParseableSize {
  /**
   * Calculates the aspect ratio of the current size.
   */
  ratio(): number;

  /**
   * Adjusts the current size to match the target aspect ratio.
   * @param ratio The target aspect ratio to adjust to.
   */
  adjust(ratio: number | string | ParseableSize): this;
}

/**
 * Parses a format into a size.
 *
 * @example Accepted formats
 * var size1 = parseSize(constructor, isSize, "1280:720", 1) // "width:height" format, ratio is ignored.
 * var size2 = parseSize(constructor, isSize, "1280",) // "width" format, ratio value (default 1) is taken.
 * var size3 = parseSize(constructor, isSize, ":720", 16 / 9) // "height" format, ratio value (default 1) is taken.
 *
 * @param constructor The size object constructor
 * @param isSize The condition to checks whether an object is size
 * @param format The size format.
 * @param ratio The ratio aspect.
 */
export function parseSize<R extends ParseableSize>(constructor: FunctionType<R, [width: number, height: number]>,
                                                   isSize: FunctionType<void, [size: R], boolean>,
                                                   format: number | string,
                                                   ratio?: string | number | R,): R;

/**
 * Parses a format into a size.
 *
 * @example Accepted formats
 * var size1 = parseSize(constructor, isSize, "1280:720", 1) // "width:height" format, ratio is ignored.
 * var size2 = parseSize(constructor, isSize, "1280",) // "width" format, ratio value (default 1) is taken.
 * var size3 = parseSize(constructor, isSize, ":720", 16 / 9) // "height" format, ratio value (default 1) is taken.
 *
 * @param constructor The size object constructor
 * @param isSize The condition to checks whether an object is size
 * @param format The size format.
 * @param ratio The ratio aspect.
 */
export function parseSize<R extends ParseableSize>(constructor: Instanceable<R, [width: number, height: number]>,
                                                   isSize: FunctionType<void, [size: R], boolean>,
                                                   format: number | string,
                                                   ratio?: string | number | R,): R;

export function parseSize<R extends ParseableSize>(constructor: any,
                                                   isSize: FunctionType<void, [size: R], boolean>,
                                                   format: number | string,
                                                   ratio?: string | number | R): R {
  let aspectRatio: number = 1;
  if (!isDefined(ratio))
    aspectRatio = parseSize(constructor, isSize, format, 0).ratio()
  else if (isNumber(ratio))
    aspectRatio = ratio as number;
  else if (!isSize(ratio as R))
    aspectRatio = parseSize(constructor, isSize, ratio as any, 0).ratio();
  else if (isFunction(get2(ratio as any, "ratio")))
    aspectRatio = (ratio as R).ratio()

  const match = string(format)
    .split(":");


  let width = toFloat(match[0])!,
    height = toFloat(match[1])!;

  if (isDefined(width) && isDefined(height)) {
    return new constructor(width, height)
      .adjust(aspectRatio);
  } else if (isDefined(width))
    height = width / (aspectRatio || 1);
  else if (isDefined(height))
    width = height * (aspectRatio || 1);
  else throw new IllegalArgumentError(concat("The format ", format, " is not valid."));

  return new constructor(width, height);
}
