import {Maybe} from "../../../types/core";
import {SizeArgument} from "../../../types/core/size";
import {equalsSize, isSize, parseSize, scaleOrAdjustSize, setSizeProperty, Size, sizeToString, withSize} from "./size";
import {apply} from "../../utils/functions";

/**
 * Represents a size with width and height properties.
 * @class
 */
export class SizeInt extends Size {


  static withWidth(width: SizeArgument, ratio?: Maybe<SizeArgument>): SizeInt {
    return withSize(SizeInt, isSize, width, undefined, ratio)
  }

  static withHeight(height: SizeArgument, ratio?: Maybe<SizeArgument>): SizeInt {
    return withSize(SizeInt, isSize, undefined, height, ratio);
  }

  static parse(format: number | string, ratio?: Maybe<SizeArgument>): SizeInt {
    return parseSize(SizeInt, isSize, format, ratio);
  }

  adjust(ratio: SizeArgument): SizeInt {
    return apply(scaleOrAdjustSize, this, [ratio, SizeInt, isSize, true]);
  }

  scale(target: SizeArgument): SizeInt {
    return apply(scaleOrAdjustSize, this, [target, SizeInt, isSize]);
  }

  width(width?: Maybe<SizeArgument>): number {
    return apply(setSizeProperty, this, [arguments, '__width__', isSize, Math.round,] );
  }

  height(height?: Maybe<SizeArgument>): number {
    return apply(setSizeProperty, this, [arguments, '__height__', isSize, Math.round]);
  }

  equals(size: SizeArgument): boolean {
    return apply(equalsSize, this, [size, SizeInt, isSize],);
  }

  toString(): string {
    return apply(sizeToString, this, ['SizeInt'])
  }
}
