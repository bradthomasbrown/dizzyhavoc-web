import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { ejra } from "../../ejra.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const dzhvBalance: VortexDatum = {
  invalidatedBy: ["init", "chain", "account", "block"],
  dependsOn: ["rpc", "addresses", "dzhv", "height"],
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
    const address = (this.operator.get("addresses") as string[])[0] as string;
    const dzhv = this.operator.get("dzhv") as { address: string };
    const height = this.operator.get("height") as bigint;
    const txCallObject = {
      to: dzhv.address,
      input: `0x70a08231${address.slice(2).padStart(64, "0")}`,
    };
    const balance = await ejra.call(rpc, txCallObject, height)
      .then(z.string().transform(BigInt).parseAsync)
      .catch((reason) => new Error(reason));
    this.operator.set(balance);
  },
  schema: z.bigint(),
} as const;
