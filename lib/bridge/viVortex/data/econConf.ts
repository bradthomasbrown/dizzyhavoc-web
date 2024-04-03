import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";
import { toad } from "../toad.ts";
import { Lazy } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";
import { chosenChains } from "../../chosenChains.ts";
import * as vertigo from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.14/mod.ts'
import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.0/mod.ts'
import * as chainlist from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.1/mod.ts'

const schema = z.map(chainlist.schemas.chain, vertigo.schemas.econConf)

export const econConf = {
  invalidatedBy: ["econConfCheck"],
  dependsOn: [],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;

    const chain = chosenChains.get('to')!.value
    if (!chain) { this.operator.noop(); return }
    const { chainId } = chain

    const { signal } = this.operator.controller;
    const lazy: Lazy<Error|vertigo.types.EconConf> = () =>
      vertigo.api.econConf({ url: '/api', signal, chainId })
        .then((response) => response.json())
        .then(jra.response.parseAsync)
        .then(({ result }) => vertigo.schemas.econConf.parseAsync(result))
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
    
    const map = this.operator.get() as undefined|z.infer<typeof schema> ?? new Map()

    this.operator.set(new Map([...map, [chosenChains.get('to')!.value, response]]));

  },
  schema,
} as const satisfies VortexDatum
