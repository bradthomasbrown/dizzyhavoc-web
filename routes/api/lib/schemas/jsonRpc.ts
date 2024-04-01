import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const jsonRpc = {
  get base() {
    return z.object({
      jsonrpc: z.literal("2.0"),
      id: z.string().or(z.number()).or(z.null()),
    });
  },

  get request() {
    return jsonRpc.base.and(z.object({
      method: z.string(),
      params: z.object({}).passthrough(),
    }));
  },

  get errorObject() {
    return z.object({
      code: z.number(),
      message: z.string(),
    });
  },

  get errorResponse() {
    return jsonRpc.base.and(z.object({
      error: jsonRpc.errorObject,
    }));
  },

  get response() {
    return jsonRpc.base.and(z.object({
      result: z.unknown(),
    }));
  },
};
