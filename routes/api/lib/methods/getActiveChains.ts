import * as jsonRpc from "../jsonRpc/mod.ts";
import { JsonRpcRequest } from "../types/mod.ts";
import { kv } from "../kv.ts";

export async function getActiveChains({ id }: Pick<JsonRpcRequest, "id">) {
  const kvem = await kv.get<number[]>(["chains"]);
  return jsonRpc.response({ result: kvem.value, id });
}
