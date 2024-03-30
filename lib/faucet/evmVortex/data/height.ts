import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { ejra } from "../../ejra.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const height: VortexDatum = {
  invalidatedBy: ["init", "chain"],
  dependsOn: ["rpc"],
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
    const height = await ejra.height(this.operator.get("rpc") as string);
    this.operator.set(height);
  },
  schema: z.bigint(),
} as const;
