import {Size,} from "../../core/geometry/size";
import {Maybe} from "./index";

export {ParseableSize} from "../../core/geometry/size/shared";

export {SizeConstructor} from "../../core/geometry/size/size";

export type SizeArgument = Size | string | number;

export type MaybeSizeArgument = Maybe<SizeArgument>;
