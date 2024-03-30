import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { P1193 } from "../../../state2/providers.ts";
import { evmVortex } from "../evmVortex.ts";
import { VortexDatum } from "../../../state2/Vortex.ts";

export const addresses: VortexDatum = {
  invalidatedBy: ["init", "account"],
  dependsOn: ["p1193"],
  async updater() {
    if (this.operator.get()) return;
    if (!this.operator.knows(this.dependencies)) return;
    const p1193 = this.operator.get("p1193") as P1193;
    const error = this.operator.errors(this.dependencies)[0] as
      | undefined
      | Error;
    if (error) {
      this.operator.set(error);
      return;
    }
    const addresses = this.flow == "init"
      ? await p1193.request({
        method: "eth_requestAccounts",
        params: [],
      })
        .catch((reason) => {
          console.error(reason);
          this.operator.controller.abort();
          for (const key in this.operator.tState) {
            this.operator.tState[key] = undefined;
          }
          evmVortex.updaters.value = new Set();
          return new Error(JSON.stringify(reason));
        }) as string[]
      : await p1193.request({ method: "eth_accounts", params: [] })
        .catch(
          (reason) => new Error(String(reason)),
        ) as Error | string[];
    this.operator.set(
      addresses instanceof Error
        ? addresses
        : addresses.length
        ? addresses
        : new Error("no connected addresses"),
    );
  },
  schema: z.string().array(),
} as const;
