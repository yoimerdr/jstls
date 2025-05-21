import {SizeArgument} from "./size";
import {isSize, Size, sizeToString,} from "./size";
import {round} from "@/core/shortcuts/math";
import {WithPrototype} from "@/types/core/objects";
import {funclass2} from "@/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@/types/core/definer";
import {protocall} from "@/core/functions/prototype/call";
import {isDefined} from "@/core/objects/types";
import {toInt} from "@/core/extensions/string";
import {nullable} from "@/core/utils/types";

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
