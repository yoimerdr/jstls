import {SizeArgument} from "./size";
import {isSize, Size, sizeToString,} from "./size";
import {round} from "@jstls/core/shortcuts/math";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {protocall} from "@jstls/core/functions/prototype/call";
import {isDefined} from "@jstls/core/objects/types";
import {toInt} from "@jstls/core/extensions/string";
import {nullable} from "@jstls/core/utils/types";
import {partial} from "@jstls/core/functions/partial";

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
    toString: partial(sizeToString, 'SizeInt')
  }
}, Size)
