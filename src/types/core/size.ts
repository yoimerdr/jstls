import {Size} from "../../core/geometry/size";
import {Constructor, Maybe} from "./index";

export type SizeArgument = Size | string | number;

export type MaybeSizeArgument = Maybe<SizeArgument>;

export type SizeConstructor<R extends Size> = Constructor<R, [width: number | Size, height?: number]> & {
  parse(format: string | number, ratio?: MaybeSizeArgument): R;
};
