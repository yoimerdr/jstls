import {SizeArgument} from "../../../types/core/size";
import {
  isSize,
  Size,
  sizeToString,
} from "./size";
import {apply} from "../../functions/apply";
import {round} from "../../shortcuts/math";
import {WithPrototype} from "../../../types/core/objects";
import {funclass} from "../../definer/classes";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {protocall} from "../../functions/prototype";
import {isDefined} from "../../objects/types";
import {toInt} from "../../extensions/string";

export interface SizeInt extends Size {
  adjust(ratio: SizeArgument): SizeInt;

  scale(ratio: SizeArgument): SizeInt;
}

export interface SizeIntConstructor extends WithPrototype<SizeInt> {
  new(width: number | Size, height?: number): SizeInt;
}

export const SizeInt: SizeIntConstructor = funclass({
  prototype: <FunctionClassSimpleStatics<SizeInt>>{
    width(width) {
      if (isSize(width))
        width = (width as SizeInt).getWidth();
      else if (isDefined(width))
        width = round(apply(toInt, width! as string)!);
      return protocall(Size, 'width', this, width);
    },
    height(height) {
      if (isSize(height))
        height = (height as SizeInt).getWidth();
      else if (isDefined(height))
        height = round(apply(toInt, height! as string)!);
      return protocall(Size, 'height', this, height);
    },
    toString() {
      return apply(sizeToString, this, ['SizeInt'])
    }
  }
}, Size)
