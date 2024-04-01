import * as jsonRpc from "../jsonRpc/mod.ts";

export function rateLimit() {
  return jsonRpc.error({ code: -32005, message: "Rate limited.", status: 429 });
}
