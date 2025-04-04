import {isString} from "../objects/types";
import {readonly} from "../definer";
import {KeyableObject} from "../../types/core/objects";
import {keys} from "../objects/handlers/properties";
import {PromiseConstructor} from "../../types/core/polyfills";
import {extend} from "../extensions/array";
import {setTo} from "../objects/handlers/getset";
import {forEach} from "../shortcuts/array";
import {reduce} from "../iterable";
import {nullable} from "../utils/types";

declare const Promise: PromiseConstructor;

export function fetch(input: RequestInfo | URL, init?: RequestInit) {
  if (typeof XMLHttpRequest === "undefined")
    throw new ReferenceError('This fetch polyfills requires XMLHttpRequest. You must call this on the browser.');
  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest(),
      isPlainUrl = isString(input),
      options = {
        url: isPlainUrl ? input : "",
        method: "GET",
        headers: <Record<string, any>>{},
        body: <ReadableStream<Uint8Array> | null | BodyInit>nullable
      }

    const assignKeys: any[] = ["url", "method", "headers"]
    isPlainUrl || setTo(input as Request, extend(["url"], assignKeys,), options)

    // map init object
    init && setTo(init, assignKeys, options)

    function createResponse($this: XMLHttpRequest): Response {
      const init = <ResponseInit>{};
      setTo($this, ["status", "statusText"], init);
      init.headers = reduce($this.getAllResponseHeaders().split("\r\n"), (headers, current) => {
        const [name, value] = current.split(': ');
        name && value && (headers[name] = value);
        return headers;
      }, <KeyableObject>{});

      const response = new Response($this.response, init);
      readonly(response, 'url', $this.responseURL)
      return response;
    }

    xhr.onload = function () {
      resolve(createResponse(this))
    }

    xhr.onerror = function () {
      reject(createResponse(this))
    }

    const {headers} = options;
    forEach(keys(headers), (key) => xhr.setRequestHeader(key, headers[key]));

    xhr.open(options.method, options.url as string, true)
    xhr.send(options.body as XMLHttpRequestBodyInit)
  })
}
