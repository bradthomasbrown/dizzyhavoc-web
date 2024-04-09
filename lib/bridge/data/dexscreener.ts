import { effect, Signal } from "@preact/signals";
import { dzkv, toad } from "lib/mod.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

const url =
  "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE";

const pairSchema = z.object({
  chainId: z.string(),
  priceUsd: z.string().transform(Number),
  liquidity: z.object({ usd: z.number() }).passthrough(),
}).passthrough();
export const responseSchema = z.object({ pairs: pairSchema.array() });

type Data = z.infer<typeof responseSchema>;
type T = Signal<null | Data>;

function key() {
  return ["dexscreener"];
}

function ensure() {
  return dzkv.ensure<T>(key(), new Signal(null));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
}

function set(data: Data) {
  get().value = data;
}

const refresh = new Signal(Symbol());
if (IS_BROWSER) {
  effect(async () => {
    // watch refresh
    refresh.value;

    // get data, returning if error
    const lazy: Lazy<Error | Data> = async () =>
      await fetch(url)
        .then((response) => response.json())
        .then(responseSchema.parseAsync)
        .catch((reason) => new Error(reason));
    const snail = new Snail({ lazy });
    snail.died.catch((reason) => new Error(reason));
    const data = await toad.feed(snail).catch((reason) => new Error(reason));
    if (data instanceof Error) {
      setTimeout(() => refresh.value = Symbol(), 30000);
      return;
    }

    // set data
    set(data);

    // refresh sym, dexscreener api has you cache for 30s normally
    setTimeout(() => refresh.value = Symbol(), 30000);
  });
}
