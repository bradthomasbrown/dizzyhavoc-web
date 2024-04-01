import * as jsonRpc from "../jsonRpc/mod.ts";

export function badParse() {
  return jsonRpc.error({ code: -32700, message: "Parse error.", status: 500 });
}
