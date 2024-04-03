import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";
import { toad } from "../toad.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";
import { chosenChains } from "../../chosenChains.ts";

const pairSchema = z.object({
  chainId: z.string(),
  priceUsd: z.string().transform(Number),
  liquidity: z.object({ usd: z.number() }).passthrough(),
}).passthrough();
export const responseSchema = z.object({ pairs: pairSchema.array() });

export const dexscreener: VortexDatum = {
  invalidatedBy: ["priceCheck"],
  dependsOn: [],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;

    // if no chains are chosen, NOOP and don't call dexscreener
    if (!chosenChains.get('from') && !chosenChains.get('to')) {
      this.operator.noop();
      return
    }

    const { signal } = this.operator.controller;
    const lazy: Lazy<Error | z.infer<typeof responseSchema>> = async () =>
      await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE",
        { signal },
      )
        .then((response) => response.json())
        .then(responseSchema.parseAsync)
        .catch((reason) => new Error(reason));
    const snail = new Snail({ lazy, signal });
    snail.died.catch((reason) => new Error(reason));
    const response = await toad.feed(snail).catch((reason) =>
      new Error(reason)
    );
    // if we get an error, NOOP
    if (response instanceof Error) {
      this.operator.noop();
      return;
    }

    this.operator.set(response);
  },
  schema: responseSchema,
} as const;
