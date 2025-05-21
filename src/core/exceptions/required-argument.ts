import {defineException, ErrorConstructor} from "@/core/exceptions/shared";

export interface RequiredArgumentError extends Error {
}

export interface RequiredArgumentErrorConstructor extends ErrorConstructor<RequiredArgumentError> {
}

export const RequiredArgumentError: RequiredArgumentErrorConstructor = defineException("RequiredArgumentError")
