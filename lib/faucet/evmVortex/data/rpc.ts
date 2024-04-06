// import z from "https://deno.land/x/zod@v3.22.4/index.ts";
// import * as chainlist from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/mod.ts";
// import { VortexDatum } from "../../../state2/Vortex.ts";
// import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.3/lib/types/chain.ts";

// export const rpc: VortexDatum = {
//   invalidatedBy: ["chain"],
//   dependsOn: ["chain"],
//   updater() {
//     if (this.operator.get()) return;
//     if (!this.operator.knows(this.dependencies)) return;
//     const error = this.operator.errors(this.dependencies)[0] as
//       | undefined
//       | Error;
//     if (error) {
//       this.operator.set(error);
//       return;
//     }
//     const chain = this.operator.get("chain") as  Chain
//     this.operator.set(
//       chain instanceof Error
//         ? chain
//         : chain.rpc[0]
//         ? chain.rpc[0]
//         : new Error(`no rpc for chain ${chain.chainId}`),
//     );
//   },
//   schema: z.string(),
// } as const;
