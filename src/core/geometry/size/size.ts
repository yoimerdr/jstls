import {coerceAtLeast} from "../../extensions/number";
import {toFloat} from "../../extensions/string";
import {writeable} from "../../definer";
import {isDefined, isNumber} from "../../objects/types";
import {uid} from "../../polyfills/symbol";
import {KeyableObject, WithPrototype} from "../../../types/core/objects";
import {string} from "../../objects/handlers";
import {len} from "../../shortcuts/indexable";
import {concat} from "../../shortcuts/string";
import {funclass} from "../../definer/classes/funclass";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {indefinite, nullable} from "../../utils/types";
import {Maybe} from "../../../types/core";
import {requiredWithType} from "../../objects/validators";
import {parseSize} from "./shared";

export type SizeArgument = Size | string | number;

export type MaybeSizeArgument = Maybe<SizeArgument>;

export function isSize(value: any): boolean {
  return value instanceof Size;
}

export function scaleOrAdjustSize<R extends Size>($this: R, target: SizeArgument, adjust?: boolean): R {
  const ratio = $this.ratio(),
    constructor = $this.constructor as SizeConstructor;

  let width = $this.getWidth(),
    height = $this.getHeight(),
    targetRatio: number;

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

  return new constructor(width, height) as R;
}


function setSizeProperty($this: Size & KeyableObject, args: IArguments, property: string,): number {
  property = property === 'w' ? sizeWidth : sizeHeight;
  if (len(args) > 0 && isDefined(args[0])) {
    let value = (isSize(args[0])) ? args[0][property] : args[0]
    value = requiredWithType(toFloat(value), 'number',);
    $this[property] = coerceAtLeast(0, value);
  }

  return $this[property];
}

function withSize<R extends Size>(constructor: SizeConstructor,
                                  width?: MaybeSizeArgument, height?: MaybeSizeArgument,
                                  ratio?: MaybeSizeArgument): R {
  height = (isSize(height)) ? (<Size>height).getHeight() : height;
  width = (isSize(height)) ? (<Size>width).getWidth() : width;
  return parseSize(constructor, isSize, concat(string(width), ":", string(height)), ratio)
}

export function equalsSize($this: Size, size: SizeArgument,): boolean {
  const constructor = $this.constructor as SizeConstructor;
  size = isSize(size) ? size as Size : constructor.parse(size as string);
  return size.getWidth() === $this.getWidth() && $this.getHeight() === size.getHeight();
}

export function sizeToString($this: Size, name: string): string {
  return concat(name, "{ width: ", $this.getWidth(), ", height: ", $this.getHeight(), " }");
}

const sizeWidth = uid("mW"),
  sizeHeight = uid("mH");

export interface Size {
  /**
   * Gets or sets the width of the size.
   * @param width - The width to set.
   * @returns The width of the size.
   */
  width(width?: MaybeSizeArgument): number

  /**
   * Gets or sets the height of the size.
   * @param height - The height to set.
   * @returns The height of the size.
   */
  height(height?: MaybeSizeArgument): number

  /**
   * Gets the width of the size.
   * @returns The width of the size.
   */
  getWidth(): number

  /**
   * Sets the width of the size.
   * @param width - The width to set.
   */
  setWidth(width: SizeArgument): void;

  /**
   * Gets the height of the size.
   * @returns The height of the size.
   */
  getHeight(): number

  /**
   * Sets the height of the size.
   * @param height - The height to set.
   */
  setHeight(height: SizeArgument): void;

  /**
   * Calculates the aspect ratio of the current size.
   * @returns The aspect ratio, or 0 if the height is zero.
   */
  ratio(): number

  /**
   * Returns the format of the size like "width:height".
   * @returns The format of the size.
   */
  toFormat(): string

  /**
   * Returns the string representation of the size.
   * @returns The string representation of the size.
   */
  toString(): string

  /**
   * Scales the current size to match the target size maintaining the aspect ratio.
   * @param target - The target size to scale to.
   * @returns A new Size instance representing the scaled size.
   */
  scale(target: SizeArgument): Size;

  /**
   * Adjusts the current size to match the target aspect ratio.
   * @param ratio - The target aspect ratio to adjust to.
   * @returns A new Size instance representing the adjusted size.
   */
  adjust(ratio: SizeArgument): Size;

  /**
   * Checks if the current size is equal to the target size.
   * @param size - The size to compare with.
   * @returns True if the sizes are equal, false otherwise.
   */
  equals(size: SizeArgument): void;

  /**
   * Checks if the current size is empty (both width and height are zero).
   * @returns True if the size is empty, false otherwise.
   */
  isEmpty(): boolean;
}

export interface SizeConstructor extends WithPrototype<Size> {
  new(width: number | Size, height?: number): Size;

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
  parse(format: number | string, ratio?: MaybeSizeArgument): Size;

  /**
   * Creates a new Size instance with the specified height and optional aspect ratio.
   * @param height - The height of the size.
   * @param ratio - Aspect ratio to determine the width.
   * @returns A new Size instance.
   */
  withHeight(height: SizeArgument, ratio?: MaybeSizeArgument): Size;

  /**
   * Creates a new Size instance with the specified width and optional aspect ratio.
   * @param width - The width of the size.
   * @param ratio - Aspect ratio to determine the height.
   * @returns A new Size instance.
   */
  withWidth(width: SizeArgument, ratio?: MaybeSizeArgument): Size;
}

/**
 * Represents a size with width and height properties.
 * @class
 */
export const Size: SizeConstructor = funclass({
  construct: function (width, height) {
    if (width instanceof Size) {
      height = width.getHeight();
      width = width.getWidth();
    } else if (!isDefined(height))
      height = width as number;
    const $this = this;
    writeable($this, sizeWidth, indefinite);
    writeable($this, sizeHeight, indefinite);
    $this.width(width);
    $this.height(height);
  },
  statics: {
    parse(format, ratio) {
      return parseSize(this, isSize, format, ratio);
    },
    withHeight(height, ratio) {
      return withSize(this, nullable, height, ratio);
    },
    withWidth(width, ratio) {
      return withSize(this, width, nullable, ratio);
    }
  },
  prototype: <FunctionClassSimpleStatics<Size>>{
    width() {
      return setSizeProperty(this, arguments, 'w')
    },
    height() {
      return setSizeProperty(this, arguments, 'h')
    },
    getWidth() {
      return this.width();
    },
    setWidth(width) {
      this.width(width);
    },
    getHeight() {
      return this.height();
    },
    setHeight(height) {
      this.height(height);
    },
    ratio() {
      const $this = this,
        height = $this.height();

      return height === 0 ? 0 : $this.getWidth() / height;
    },
    scale(target) {
      return scaleOrAdjustSize(this, target,);
    },
    adjust(ratio) {
      return scaleOrAdjustSize(this, ratio, true);
    },
    equals(size) {
      return equalsSize(this, size,);
    },
    isEmpty() {
      const $this = this;
      return $this.getWidth() === 0 && $this.getHeight() === 0;
    },
    toFormat() {
      const $this = this;
      return concat("", $this.getWidth(), ":", $this.getHeight());
    },
    toString() {
      return sizeToString(this, 'Size');
    }
  }
})

export {parseSize}
