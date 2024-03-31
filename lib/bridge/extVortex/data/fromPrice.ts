import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";
import { toad } from "../toad.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.0/mod.ts";
import { chosenChains } from "../../../../islands/bridge/UI.tsx";

const pairSchema = z.object({
  chainId: z.string(),
  priceUsd: z.string().transform(Number),
}).passthrough();
const responseSchema = z.object({ pairs: pairSchema.array() });

export const fromPrice: VortexDatum = {
  invalidatedBy: ["init"],
  dependsOn: [],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;

    const lazy: Lazy<Error | z.infer<typeof responseSchema>> = async () =>
      await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE",
      )
        .then((response) => response.json())
        .then(responseSchema.parseAsync)
        .catch((reason) => new Error(reason));
    const snail = new Snail(lazy);
    snail.died.catch((reason) => new Error(reason));
    const response = await toad.feed(snail).catch((reason) =>
      new Error(reason)
    );
    if (response instanceof Error) {
      this.operator.set(response);
      return;
    }
    const { pairs } = response;

    // we want to get the price of the most liquid chain corresponding to the picked "from" chain

    console.log(response);
    this.operator.set(0);
  },
  schema: z.number(),
} as const;
