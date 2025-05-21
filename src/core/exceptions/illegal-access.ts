import {defineException, ErrorConstructor} from "@jstls/core/exceptions/shared";

export interface IllegalAccessError extends Error {
}

export interface IllegalAccessErrorConstructor extends ErrorConstructor<IllegalAccessError> {
}

export const IllegalAccessError: IllegalAccessErrorConstructor = defineException("IllegalAccessError");
