import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const chain = z.object({
  name: z.string(),
  chain: z.string(),
  rpc: z.string().array().transform((urls) => {
    return urls.filter((url) =>
      !url.match(/wss|API_KEY/i) &&
      !url.match(/mycryptoapi.com/)
    );
  }), // don't support wss or nodes requiring an API key (yet)
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
  }),
  chainId: z.number(),
  explorers: z.object({
    name: z.string(),
    url: z.string(),
    standard: z.string(),
  }).array(),
  shortName: z.string(),
});
