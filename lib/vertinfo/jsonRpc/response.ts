import { JsonRpcResponse, JsonRpcResponseOptions } from "../types/mod.ts";

function replacer(_key: string, value: unknown) {
  return typeof value == "bigint" ? `0x${value.toString(16)}` : value;
}

export function response({ result, id }: JsonRpcResponseOptions) {
  const response: JsonRpcResponse = { jsonrpc: "2.0", result, id: id ?? null };
  return new Response(JSON.stringify(response, replacer), { status: 200 });
}
