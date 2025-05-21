import {defineException, ErrorConstructor} from "@/core/exceptions/shared";

export interface IllegalArgumentError extends Error {
}

export interface IllegalArgumentErrorConstructor extends ErrorConstructor<IllegalArgumentError> {
}

export const IllegalArgumentError: IllegalArgumentErrorConstructor = defineException("IllegalArgumentError")
