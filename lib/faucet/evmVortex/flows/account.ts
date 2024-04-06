// import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
// import { batch } from "@preact/signals";
// import { TStateOperator, VortexFlow } from "../../../state2/Vortex.ts";
// import { poll } from "../poll.ts";
// import { evmVortex } from "../evmVortex.ts";

// export const account: VortexFlow = async function () {
//   const controller = this.controller.reset();
//   for (const key of this.invalidate) this.tState[key] = undefined;
//   while (this.updaters.value.size) {
//     const { signal } = controller;
//     await Promise.all([...this.updaters.value].map((updater) => {
//       const { tState, updaters, flow } = this;
//       const key = this.dataKey.get(updater) as string;
//       const dependencies = this.dependencies.get(updater) as string[];
//       const operator = new TStateOperator({
//         tState,
//         key,
//         controller,
//         updater,
//         updaters,
//       });
//       const datumUpdaterContext = { operator, dependencies, flow };
//       return updater.bind(datumUpdaterContext)();
//     }));
//   }
//   const gate = new Gate<void>();
//   batch(() => {
//     if (!controller.signal.aborted) {
//       for (const [key, value] of Object.entries(this.tState)) {
//         this.uState[key].value = value;
//       }
//     }
//     gate.resolve();
//   });
//   await gate.promise;

//   if (
//     evmVortex.uState.addresses.value
//     && !(evmVortex.uState.addresses.value instanceof Error)
//     && evmVortex.uState.addresses.value.length
//   ) setTimeout(poll, 0)

// };
