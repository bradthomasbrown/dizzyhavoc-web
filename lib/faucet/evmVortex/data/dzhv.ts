import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { ejra } from "../../ejra.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const dzhv: VortexDatum = {
  invalidatedBy: ["init", "chain", "block"],
  dependsOn: ["rpc", "height"],
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
    const rpc = this.operator.get("rpc") as string;
    const address = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
    const height = this.operator.get("height") as bigint;
    const code = await ejra.code(rpc, address, height);
    this.operator.set(
      code instanceof Error
        ? code
        : code == "0x"
        ? new Error("dzhv not on this chain")
        : { address },
    );
  },
  schema: z.object({
    address: z.literal("0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe"),
  }),
} as const;
