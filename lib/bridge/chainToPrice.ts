// import z from "https://deno.land/x/zod@v3.22.4/index.ts";
// import { responseSchema } from "./dsVortex/data/dexscreener.ts";
// import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/mod.ts";

// type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends
//   readonly (infer ElementType)[] ? ElementType : never;

// export function chainToPrice(
//   chain: Chain,
//   dsData: z.infer<typeof responseSchema>,
// ) {
//   let dsChainId: string;
//   switch (chain.chainId) {
//     case 11155111:
//       dsChainId = "ethereum";
//       break;
//     case 421614:
//       dsChainId = "arbitrum";
//       break;
//     case 84532:
//       dsChainId = "base";
//       break;
//     case 43113:
//       dsChainId = "avalanche";
//       break;
//     case 97:
//       dsChainId = "bsc";
//       break;
//     default:
//       return undefined;
//   }
//   let foo: undefined | ArrayElement<typeof dsData["pairs"]>;
//   for (const pair of dsData.pairs) {
//     if (
//       pair.chainId == dsChainId &&
//       pair.liquidity.usd > (foo?.liquidity.usd ?? -Infinity)
//     ) foo = pair;
//   }
//   return foo?.priceUsd;
// }
