import {SizeArgument} from "./size";
import {isSize, Size, sizeToString,} from "./size";
import {round} from "../../shortcuts/math";
import {WithPrototype} from "../../../types/core/objects";
import {funclass2} from "../../definer/classes/funclass";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {protocall} from "../../functions/prototype/call";
import {isDefined} from "../../objects/types";
import {toInt} from "../../extensions/string";
import {nullable} from "../../utils/types";

export interface SizeInt extends Size {
  adjust(ratio: SizeArgument): SizeInt;

  scale(ratio: SizeArgument): SizeInt;
}

export interface SizeIntConstructor extends WithPrototype<SizeInt> {
  new(width: number | Size, height?: number): SizeInt;
}

export const SizeInt: SizeIntConstructor = funclass2({
  prototype: <FunctionClassSimpleStatics<SizeInt>>{
    width(width) {
      if (isSize(width))
        width = (width as SizeInt).getWidth();
      else if (isDefined(width))
        width = round(toInt(nullable, width as string)!);
      return protocall(Size, 'width', this, width);
    },
    height(height) {
      if (isSize(height))
        height = (height as SizeInt).getWidth();
      else if (isDefined(height))
        height = round(toInt(nullable, height! as string)!);
      return protocall(Size, 'height', this, height);
    },
    toString() {
      return sizeToString(this, 'SizeInt')
    }
  }
}, Size)
