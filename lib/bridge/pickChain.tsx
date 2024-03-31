import { which } from "./which.ts";
import { chosenChains } from "./chosenChains.ts";
import { Gate } from "https://deno.land/x/gate@0.0.0/mod.ts";
import { chainSrc } from "../chainSrc.ts";
import { activeChains, Chain } from "../internal.ts";
import { Which } from "../../islands/common/which/Which.tsx";

function chainToChoice(chain: Chain): Choice<Chain> {
  return { id: chain.name, value: chain, ...chainSrc(chain.chainId) };
}

export async function pickChain(key: string) {
  const gate = new Gate<Chain>();
  const title = key;
  const choices = activeChains.map(chainToChoice);
  const onPick = (choice: Choice<Chain>) => gate.resolve(choice.value);
  which.value = <Which {...{ title, choices, onPick }} />;
  const chain = await gate.promise;
  for (const key2 of Object.keys(chosenChains.value)) {
    if (chosenChains.value[key2] === chain) delete chosenChains.value[key2];
  }
  chosenChains.value = { ...chosenChains.value, [key]: chain };
  which.value = undefined;
}
