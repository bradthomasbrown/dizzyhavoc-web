import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";
import { toad } from "../toad.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";
import * as vertigo from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.15/mod.ts'
import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.0/mod.ts'

const schema = z.number().array()

export const activeChains = {
  invalidatedBy: ["chainsCheck"],
  dependsOn: [],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;

    const { signal } = this.operator.controller;
    const lazy: Lazy<Error|z.infer<typeof schema>> = () =>
      vertigo.api.activeChains({ url: '/api', signal })
        .then((response) => response.json())
        .then(jra.response.parseAsync)
        .then(({ result }) => schema.parseAsync(result))
        .catch((reason) => new Error(reason));
    const snail = new Snail({ lazy, signal });
    snail.died.catch((reason) => new Error(reason));
    const response = await toad.feed(snail).catch((reason) =>
      new Error(reason)
    );

    if (response instanceof Error) {
      this.operator.noop();
      return;
    }

    this.operator.set(response);

  },
  schema,
} as const satisfies VortexDatum
