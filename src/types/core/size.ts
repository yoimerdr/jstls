import {Size,} from "@jstls/core/geometry/size";
import {Maybe} from "./index";

export {ParseableSize} from "@jstls/core/geometry/size/shared";

export {SizeConstructor} from "@jstls/core/geometry/size/size";

export type SizeArgument = Size | string | number;

export type MaybeSizeArgument = Maybe<SizeArgument>;
