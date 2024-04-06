// import z from "https://deno.land/x/zod@v3.22.4/index.ts";
// import { VortexDatum } from "../../../state2/Vortex.ts";
// import { chosenChains } from "../../../bridge/chosenChains.ts";

// export const chain: VortexDatum = {
//   invalidatedBy: ["chain"],
//   dependsOn: [],
//   updater() {

//     if (this.operator.get()) return;
//     if (!this.operator.knows(this.dependencies)) return;

//     if (!chosenChains.get('from')!.value) this.operator.set(new Error('no chosen chain'))
//     else this.operator.set(chosenChains.get('from')!.value)

//     // const p1193 = this.operator.get("p1193") as P1193;
//     // const error = this.operator.errors(this.dependencies)[0] as
//     //   | undefined
//     //   | Error;
//     // if (error) {
//     //   this.operator.set(error);
//     //   return;
//     // }
//     // const chain = await p1193.request({
//     //   method: "eth_chainId",
//     //   params: [],
//     // })
//     //   .then(z.string().transform(BigInt).parseAsync)
//     //   .catch((reason) => new Error(String(reason))) as Error | bigint;
//     // this.operator.set(chain);
//   },
//   schema: z.bigint(),
// } as const;
