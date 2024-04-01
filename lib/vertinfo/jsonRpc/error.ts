import {
  JsonRpcErrorObject,
  JsonRpcErrorOptions,
  JsonRpcErrorResponse,
} from "../types/mod.ts";

export function error({ code, message, status, id }: JsonRpcErrorOptions) {
  const error: JsonRpcErrorObject = { code, message };
  const response: JsonRpcErrorResponse = {
    jsonrpc: "2.0",
    error,
    id: id ?? null,
  };
  return new Response(JSON.stringify(response), { status });
}
