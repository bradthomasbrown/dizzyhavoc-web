import * as jsonRpc from "../jsonRpc/mod.ts";

export function badMethod() {
  return jsonRpc.error({
    code: -32601,
    message: "Method not found.",
    status: 404,
  });
}
