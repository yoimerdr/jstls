import {Entry, FunctionType, Keys} from "@jstls/types/core";
import {KeyableObject} from "./index";

type SetTransformValue<T = any, P extends Keys<T> = any> = string | Entry<FunctionType<void, [value: T[P]], any>>;

export type SetTransformDescriptor<T> = {
  [P in Keys<T>]?: SetTransformValue<T, P>;
} | KeyableObject<SetTransformValue>;
