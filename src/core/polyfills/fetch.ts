import {isString} from "../objects/types";
import {readonly} from "../definer";
import {KeyableObject} from "../../types/core/objects";
import {keys} from "../objects/handlers";
import {each} from "../iterable";
import {hasOwn} from "./objects/es2022";
import {apply} from "../functions/apply";

export function fetch(input: RequestInfo | URL, init?: RequestInit) {
  if (typeof XMLHttpRequest === "undefined")
    throw new ReferenceError('This fetch polyfills requires XMLHttpRequest. You must call this on the browser.');
  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const isPlainUrl = isString(input);
    const options = {
      url: isPlainUrl ? input : "",
      method: "GET",
      headers: {},
      body: <ReadableStream<Uint8Array> | null | BodyInit>null
    }
    if (!isPlainUrl) {
      if (hasOwn(input, "url"))
        options.url = (input as Request).url;
      if (hasOwn(input, "method"))
        options.method = (input as Request).method;
      if (hasOwn(input, "headers"))
        options.headers = (input as Request).headers;
      if (hasOwn(input, "body"))
        options.body = (input as Request).body;
    }

    // map init object
    if (init) {
      if (init.method)
        options.method = init.method;
      if (init.headers)
        options.headers = init.headers;
      if (init.body)
        options.body = init.body;
    }

    function createResponse(this: XMLHttpRequest): Response {
      const response = new Response(this.response, <ResponseInit>{
        status: this.status,
        headers: this.getAllResponseHeaders()
          .split('\r\n')
          .reduce((acc, current) => {
            const [name, value] = current.split(': ');
            if (name && value)
              acc[name] = value;
            return acc;
          }, <KeyableObject>{}),
        statusText: this.statusText,
      })
      readonly(response, 'url', this.responseURL)
      return response
    }

    xhr.onload = function (ev) {
      resolve(apply(createResponse, this))
    }

    xhr.onerror = function (ev) {
      reject(apply(createResponse, this))
    }

    each(keys(options.headers), function (key) {
      this.setRequestHeader(key as string, options.headers[key])
    }, xhr)

    xhr.open(options.method, options.url as string, true)
    xhr.send(options.body as XMLHttpRequestBodyInit)
  })
}
