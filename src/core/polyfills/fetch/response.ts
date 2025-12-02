import {funclass2} from "@jstls/core/definer/classes/funclass";
import {readonly} from "@jstls/core/definer";
import {HeadersPolyfill} from "./headers";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {WithPrototype} from "@jstls/types/core/objects";
import {uid} from "@jstls/core/polyfills/symbol";
import {resolve} from "@jstls/core/polyfills/promise/fn";
import {isDefined} from "@jstls/core/objects/types";
import {string} from "@jstls/core/objects/handlers";

const bodyKey = uid("body");

export interface ResponsePolyfill {
  readonly type: string;
  readonly status: number;
  readonly ok: boolean;
  readonly statusText: string;
  readonly headers: HeadersPolyfill;
  readonly url: string;

  text(): Promise<string>;

  json(): Promise<any>;

  blob(): Promise<any>;

  arrayBuffer(): Promise<ArrayBuffer>;

  clone(): ResponsePolyfill;
}

export interface ResponsePolyfillConstructor extends WithPrototype<ResponsePolyfill> {
  new(body?: any, options?: ResponseInit): ResponsePolyfill
}

export const ResponsePolyfill: ResponsePolyfillConstructor = funclass2({
  construct: function (body?: any, options?: ResponseInit) {
    options = options || ({} as ResponseInit);
    const $this = this;
    readonly($this, "type", "default");
    readonly($this, "status", options.status || 200);
    readonly($this, "statusText", options.statusText || "");
    readonly($this, "headers", new Headers(options.headers || {}));
    readonly($this, bodyKey, isDefined(body) ? body : null);
    set2($this, "url", "")
  },
  prototype: {
    text() {
      const body = get2(this, bodyKey as any);
      return resolve(string(body));
    },
    json() {
      return this.text()
        .then(JSON.parse);
    },
    blob() {
      const $this = this,
        headers = $this.headers,
        body = get2($this, bodyKey as any);
      return resolve({
        _fakeBlob: true,
        data: body,
        type: headers && headers.get("content-type") || "application/octet-stream"
      });
    },
    arrayBuffer() {
      const body = get2(this, bodyKey as any),
        bodyStr = string(body),
        buf = new Uint8Array(bodyStr.length);
      for (let i = 0; i < bodyStr.length; i++) buf[i] = bodyStr.charCodeAt(i) & 0xff;
      return resolve(buf.buffer);
    },
    clone() {
      const $this = this,
        init: any = {
          status: $this.status,
          statusText: $this.statusText,
          headers: $this.headers
        };

      return new Response(get2($this, bodyKey), init);
    }
  }
});
