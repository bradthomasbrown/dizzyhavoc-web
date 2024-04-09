import { effect, Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";
import { data } from "lib/bridge/mod.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

function key(id: string) {
  return ["dollars", id];
}

function ensure(id: string) {
  return dzkv.ensure<Signal<null | string>>(
    key(id),
    new Signal("$0.00"),
  );
}

export function get(id: string) {
  ensure(id);
  return dzkv.get<Signal<null | string>>(key(id))!;
}

function set(id: string, dollars: string) {
  get(id).value = dollars;
}

if (IS_BROWSER) {
  effect(() => {
    // get dependencies
    const x = data.dexscreener.get().value;
    const chain = data.chain.get(["from"]).value;
    const input = data.control.from.input.get().value ?? 0n;
    if (!x || !chain) return;

    const { pairs } = x;
    let pair;
    for (const p of pairs) {
      if (chain.chainId == 1 && p.chainId !== "ethereum") continue;
      if (chain.chainId == 11155111 && p.chainId !== "ethereum") continue;
      if (chain.chainId == 42161 && p.chainId !== "arbitrum") continue;
      if (chain.chainId == 421614 && p.chainId !== "arbitrum") continue;
      if (chain.chainId == 56 && p.chainId !== "bsc") continue;
      if (chain.chainId == 97 && p.chainId !== "bsc") continue;
      if (chain.chainId == 43114 && p.chainId !== "avalanche") continue;
      if (chain.chainId == 43113 && p.chainId !== "avalanche") continue;
      if (chain.chainId == 8453 && p.chainId !== "base") continue;
      if (chain.chainId == 84532 && p.chainId !== "base") continue;
      if (p.liquidity.usd <= (pair?.liquidity.usd ?? -Infinity)) continue;
      pair = p;
    }
    if (!pair) return;

    const dollars = (pair.priceUsd * Number(input / 10n ** 18n))
      .toLocaleString("en-US", { style: "currency", currency: "USD" });

    set("from", dollars);
  });
}
