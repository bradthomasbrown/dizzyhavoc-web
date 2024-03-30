import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { query } from "../../../chains/query.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const rpc: VortexDatum = {
  invalidatedBy: ["init", "chain"],
  dependsOn: ["chain"],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;
    const error = this.operator.errors(this.dependencies)[0] as
      | undefined
      | Error;
    if (error) {
      this.operator.set(error);
      return;
    }
    const chain = await query({
      id: this.operator.get("chain") as number,
    });
    this.operator.set(
      chain instanceof Error
        ? chain
        : chain.rpc[0]
        ? chain.rpc[0]
        : new Error(`no rpc for chain ${chain.chainId}`),
    );
  },
  schema: z.string(),
} as const;
