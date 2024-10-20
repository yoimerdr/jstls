import {isString} from "../objects/types";
import {readonly} from "../definer";
import {KeyableObject} from "../../types/core/objects";
import {keys} from "../objects/handlers/properties";
import {apply} from "../functions/apply";
import {each} from "../iterable/each";
import {PromiseConstructor} from "../../types/core/polyfills";
import {extend} from "../extensions/array";
import {setTo} from "../objects/handlers/getset";

declare const Promise: PromiseConstructor;

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
    const assignKeys: any[] = ["url", "method", "headers"]
    if (!isPlainUrl)
      setTo(input as Request, apply(extend<any>, assignKeys, [["url"]]), options)

    // map init object
    if (init)
      setTo(init, assignKeys, options)

    function createResponse(this: XMLHttpRequest): Response {
      const init = <ResponseInit>{};
      setTo(this, ["status", "statusText"], init);
      init.headers = this.getAllResponseHeaders()
        .split('\r\n')
        .reduce((acc, current) => {
          const [name, value] = current.split(': ');
          if (name && value)
            acc[name] = value;
          return acc;
        }, <KeyableObject>{})
      const response = new Response(this.response, init);
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
