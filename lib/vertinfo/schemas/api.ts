import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const api = {
  get chainIdOnlyParam() {
    return z.object({ chainId: z.number() });
  },

  get getBurnStatusParam() {
    return z.object({ hash: z.string() });
  },

  get methods() {
    return z.union([
      z.literal("get_econConf"),
      z.literal("get_activeChains"),
      z.literal("get_confirmations"),
      z.literal("get_burnStatus"),
    ]);
  },
};
