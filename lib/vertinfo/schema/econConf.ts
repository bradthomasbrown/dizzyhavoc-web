import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const econConf = z.object({
  gasLimitMultiplier: z.tuple([
    z.string().transform(BigInt), 
    z.string().transform(BigInt)
  ]),
  gasPriceMultiplier: z.tuple([
    z.string().transform(BigInt), 
    z.string().transform(BigInt)
  ]),
  baseFee: z.string().transform(BigInt)
})