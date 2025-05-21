import {defineException, ErrorConstructor} from "@jstls/core/exceptions/shared";

export interface RequiredArgumentError extends Error {
}

export interface RequiredArgumentErrorConstructor extends ErrorConstructor<RequiredArgumentError> {
}

export const RequiredArgumentError: RequiredArgumentErrorConstructor = defineException("RequiredArgumentError")
