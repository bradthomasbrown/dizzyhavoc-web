import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const chain: VortexDatum = {
  invalidatedBy: ["to"],
  dependsOn: [],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;
    
    this.operator.set(0)
  },
  schema: z.bigint(),
} as const;
