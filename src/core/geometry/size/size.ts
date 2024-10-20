import {coerceAtLeast} from "../../extensions/number";
import {IllegalArgumentError} from "../../exceptions";
import {toFloat} from "../../extensions/string";
import {MaybeSizeArgument, SizeArgument, SizeConstructor} from "../../../types/core/size";
import {writeables} from "../../definer";
import {isDefined, isNumber} from "../../objects/types";
import {requiredWithType} from "../../objects/validators";
import {get, string} from "../../objects/handlers";
import {apply} from "../../functions/apply";
import {uid} from "../../polyfills/symbol";
import {KeyableObject} from "../../../types/core/objects";

export function isSize(value: any): boolean {
  return value instanceof Size;
}

export function parseSize<R extends Size>(constructor: SizeConstructor<R>,
                                          isSize: (value: any) => boolean,
                                          format: number | string,
                                          ratio?: MaybeSizeArgument,
                                          defaultRatio?: boolean,): R {
  let aspectRatio: number = 1;
  if (!isDefined(ratio))
    aspectRatio = parseSize(constructor, isSize, format, 1, true).ratio()
  else if (isNumber(ratio))
    aspectRatio = ratio as number;
  else if (!isSize(ratio))
    aspectRatio = parseSize(constructor, isSize, ratio as any, 1, true).ratio();

  const match = string(format)
    .split(":");


  let width = apply(toFloat, match[0])!;
  let height = apply(toFloat, match[1])!;

  if (isDefined(width) && isDefined(height))
    return new constructor(width, height)
      .adjust(defaultRatio ? 0 : aspectRatio) as R;
  else if (isDefined(width))
    height = width / aspectRatio;
  else if (isDefined(height))
    width = height * aspectRatio;
  else throw new IllegalArgumentError(`The ${defaultRatio ? 'ratio' : 'format'} '${format}' is not valid.`);

  return new constructor(width, height);
}

export function scaleOrAdjustSize<R extends Size>(this: Size, target: SizeArgument,
                                                  constructor: SizeConstructor<R>,
                                                  isSize: (value: any) => boolean,
                                                  adjust?: boolean): R {
  let width = this.getWidth();
  let height = this.getHeight();
  const ratio = this.ratio();

  let targetRatio: number;
  if (adjust && isNumber(target))
    targetRatio = target as number;
  else {
    target = (isSize(target)) ? target as Size : constructor.parse(target as string);
    targetRatio = target.ratio();
    if (!adjust) {
      width = target.getWidth();
      height = target.getHeight();
    }
  }

  if (targetRatio !== 0 && targetRatio !== ratio) {
    if (ratio > targetRatio) {
      width = adjust ? height * targetRatio : width;
      height = adjust ? height : width / ratio;
    } else {
      width = adjust ? width : height * ratio;
      height = adjust ? width / targetRatio : height;
    }
  }

  return new constructor(width, height);
}


export function setSizeProperty(this: Size & KeyableObject, args: IArguments, property: string,
                                isSize: (value: any) => boolean,
                                modify?: (value: number) => number): number {
  if (args.length > 0) {
    let value = (isSize(args[0])) ? args[0][property] : args[0]
    value = requiredWithType(apply(toFloat, value), 'number', property.substring(1));
    this[property] = apply(coerceAtLeast, modify ? modify(value) : value, [0]);
  }

  return this[property];
}

export function withSize<R extends Size>(constructor: SizeConstructor<R>, isSize: (value: any) => boolean,
                                         width?: MaybeSizeArgument, height?: MaybeSizeArgument,
                                         ratio?: MaybeSizeArgument): R {
  height = (isSize(height)) ? (<Size>height).getHeight() : height;
  width = (isSize(height)) ? (<Size>width).getWidth() : width;
  return parseSize(constructor, isSize, `${string(width)}:${string(height)}`, ratio)
}

export function equalsSize<R extends Size>(this: Size, size: SizeArgument, constructor: SizeConstructor<R>, isSize: (value: any) => boolean): boolean {
  size = isSize(size) ? size as Size : constructor.parse(size as string);
  return size.getWidth() === this.getWidth() && this.getHeight() === size.getHeight();
}

export function sizeToString(this: Size, name: string): string {
  return `${name} { width: ${this.getWidth()}, height: ${this.getHeight()} }`;
}

export const sizeWidth = uid("Size#width");
export const sizeHeight = uid("Size#height");

/**
 * Represents a size with width and height properties.
 * @class
 */
export class Size {

  constructor(
    width: SizeArgument,
    height?: number
  ) {
    if (width instanceof Size) {
      height = width.getHeight();
      width = width.getWidth();
    } else if (!isDefined(height))
      height = width as number;
    const source: KeyableObject = {};
    source[sizeHeight] = undefined;
    source[sizeWidth] = undefined;
    writeables(this as Size, source);

    this.width(width);
    this.height(height);
  }

  /**
   * Parses a size from a given format and optional aspect ratio.
   * @param format - The size format to parse.
   * @param ratio - Aspect ratio to apply to the parsed size.
   *
   * @example
   *
   * Size.parse(1080).toString() -> Size { width: 1080, height: 1080 }
   * Size.parse(1920, 16 / 9).toString() -> Size { width: 1920, height: 1080 }
   * Size.parse(":1080", "16:9").toString() -> Size { width: 1920, height: 1080 }
   * Size.parse("1920:1080").toString() -> Size { width: 1920, height: 1080 }
   *
   * @returns A new Size instance based on the parsed format and aspect ratio.
   */
  static parse(format: number | string, ratio?: MaybeSizeArgument): Size {
    return parseSize(Size, isSize, format, ratio);
  }

  /**
   * Creates a new Size instance with the specified height and optional aspect ratio.
   * @param height - The height of the size.
   * @param ratio - Aspect ratio to determine the width.
   * @returns A new Size instance.
   */
  static withHeight(height: SizeArgument, ratio?: MaybeSizeArgument): Size {
    return withSize(Size, isSize, null, height, ratio)
  }

  /**
   * Creates a new Size instance with the specified width and optional aspect ratio.
   * @param width - The width of the size.
   * @param ratio - Aspect ratio to determine the height.
   * @returns A new Size instance.
   */
  static withWidth(width: SizeArgument, ratio?: MaybeSizeArgument): Size {
    return withSize(Size, isSize, width, null, ratio);
  }

  /**
   * Gets or sets the width of the size.
   * @param width - The width to set.
   * @returns The width of the size.
   */
  width(width?: MaybeSizeArgument): number {
    return apply(setSizeProperty, this, [arguments, sizeWidth, isSize]);
  }

  /**
   * Gets or sets the height of the size.
   * @param height - The height to set.
   * @returns The height of the size.
   */
  height(height?: MaybeSizeArgument): number {
    return apply(setSizeProperty, this, [arguments, sizeHeight, isSize]);
  }

  /**
   * Gets the width of the size.
   * @returns The width of the size.
   */
  getWidth(): number {
    return get(this, sizeWidth);
  }

  /**
   * Sets the width of the size.
   * @param width - The width to set.
   */
  setWidth(width: SizeArgument) {
    this.width(width);
  }

  /**
   * Gets the height of the size.
   * @returns The height of the size.
   */
  getHeight(): number {
    return get(this, sizeHeight);
  }

  /**
   * Sets the height of the size.
   * @param height - The height to set.
   */
  setHeight(height: SizeArgument) {
    this.height(height);
  }

  /**
   * Calculates the aspect ratio of the current size.
   * @returns The aspect ratio, or 0 if the height is zero.
   */
  ratio(): number {
    const height = this.getHeight();
    return height === 0 ? 0 : this.getWidth() / height;
  }

  /**
   * Returns the format of the size like "width:height".
   * @returns The format of the size.
   */
  toFormat(): string {
    return `${this.getWidth()}:${this.getHeight()}`;
  }

  /**
   * Returns the string representation of the size.
   * @returns The string representation of the size.
   */
  toString(): string {
    return apply(sizeToString, this, ['Size'])
  }

  /**
   * Scales the current size to match the target size maintaining the aspect ratio.
   * @param target - The target size to scale to.
   * @returns A new Size instance representing the scaled size.
   */
  scale(target: SizeArgument): Size {
    return apply(scaleOrAdjustSize, this, [target, Size, isSize]);
  }

  /**
   * Adjusts the current size to match the target aspect ratio.
   * @param ratio - The target aspect ratio to adjust to.
   * @returns A new Size instance representing the adjusted size.
   */
  adjust(ratio: SizeArgument): Size {
    return apply(scaleOrAdjustSize, this, [ratio, Size, isSize, true]);
  }

  /**
   * Checks if the current size is equal to the target size.
   * @param size - The size to compare with.
   * @returns True if the sizes are equal, false otherwise.
   */
  equals(size: SizeArgument) {
    return apply(equalsSize, this, [size, Size, isSize])
  }

  /**
   * Checks if the current size is empty (both width and height are zero).
   * @returns True if the size is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.getWidth() === 0 && this.getHeight() === 0;
  }
}
