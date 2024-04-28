import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { Snail } from "lib/mod.ts";
import { goNext, robinController } from "lib/bridge/madness/robin.ts";
import { state } from "lib/state.ts";

type Pair = {
  chainId: string;
  liquidity: { usd: number };
  priceUsd: string;
};

export type DexscreenerData = {
  pairs: Pair[];
};

export function getPrice(chainId: number) {
  const data = state.dexscreener.value;
  if (!data) return 0;
  let dsChainId;
  switch (chainId) {
    case 1:
    case 11155111:
      dsChainId = "ethereum";
      break;
    case 56:
    case 97:
      dsChainId = "bsc";
      break;
    case 42161:
    case 421613:
      dsChainId = "arbitrum";
      break;
    case 43114:
    case 43113:
      dsChainId = "avalanche";
      break;
    case 8453:
    case 84532:
      dsChainId = "base";
      break;
    default:
      dsChainId = "ethereum";
  }
  let pair;
  for (const p of data.pairs) {
    if (p.chainId != dsChainId) continue;
    if (!pair) {
      pair = p;
      continue;
    }
    if (p.liquidity.usd > pair.liquidity.usd) pair = p;
  }
  return Number(pair!.priceUsd);
}

const lastGot = { value: -Infinity };

export async function getDexscreener() {
  // get signal, if aborted return
  const { signal } = robinController.value;
  if (signal.aborted) return;

  // wait 30s between gets for dexscreener data (cache length)
  if (Date.now() - lastGot.value < 30000) return goNext();

  // 🐌
  const lazy = () =>
    fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE",
    );
  const snail = new Snail({ lazy, signal });
  toad.feed(snail).catch(() => {});
  await snail.born;
  if (signal.aborted) return;
  state.loading.dexscreener.value = "loading-[#80ffff2b]";
  const response = await snail.died.catch((e: Error) => e);
  if (response instanceof Error) return goNext();
  const data = await response
    .json()
    .catch((e: Error) => e) as Error | DexscreenerData;
  if (signal.aborted) return;
  state.loading.dexscreener.value = "unload-[]";

  // update state if not error and there is a difference
  if (!(data instanceof Error)) {
    state.dexscreener.value = data;
    lastGot.value = Date.now();
  }

  // goNext
  return goNext();
}
