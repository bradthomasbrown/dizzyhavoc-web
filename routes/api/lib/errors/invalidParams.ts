import * as jsonRpc from "../jsonRpc/mod.ts";
import { JsonRpcId } from "../types/mod.ts";

export function invalidParams(id: JsonRpcId) {
  return jsonRpc.error({
    code: -32602,
    message: "Invalid params.",
    status: 500,
    id,
  });
}
