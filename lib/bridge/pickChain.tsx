// import { which } from "./which.ts";
// import { chosenChains } from "./chosenChains.ts";
// import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
// import { chainSrc } from "../chainSrc.ts";
// import { viVortex } from "./viVortex/viVortex.ts";
// import { Which } from "../../islands/common/which/Which.tsx";
// import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/mod.ts";
// import { query } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/mod.ts";
// import { Signal, computed, effect } from "@preact/signals";

// function chainToChoice(chain: Chain): Choice<Chain> {
//   return { id: chain.name, value: chain, ...chainSrc(chain.chainId) };
// }

// const pureActiveChainIds = computed(() => {
//   const activeChains = viVortex.uState.activeChains.value
//   if (activeChains instanceof Error || activeChains === undefined) return []
//   else return activeChains
// })

// const idToChain = new Map<number,Chain>()

// const pureActiveChains:Signal<Chain[]> = new Signal([])
// effect(async () => {
//   const chains:Chain[] = []
//   for (const chainId of pureActiveChainIds.value) {
//     if (idToChain.has(chainId)) chains.push(idToChain.get(chainId)!)
//     else {
//       // we can toad this at some point
//       const result = await query(chainId)
//       if (!(result instanceof Error)) {
//         chains.push(result)
//         idToChain.set(chainId, result)
//       }
//     }
//   }
//   pureActiveChains.value = chains
// })

// const choices:Signal<Choice<Chain>[]> = new Signal([])
// effect(() => { choices.value = pureActiveChains.value.map(chainToChoice) })

// export async function pickChain(key:string) {
//   const gate = new Gate<Chain>();
//   const title = key;
//   const onPick = (choice: Choice<Chain>) => gate.resolve(choice.value);
//   which.value = <Which {...{ title, choices, onPick }} />;
//   const chain = await gate.promise;
//   for (const key2 of chosenChains.keys()) {
//     if (chosenChains.get(key2)!.value === chain)
//       chosenChains.get(key2)!.value = undefined
//   }
//   chosenChains.get(key)!.value = chain
//   which.value = undefined;
// }
