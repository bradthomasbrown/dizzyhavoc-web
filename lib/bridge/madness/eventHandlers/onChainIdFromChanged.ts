import * as robin from "lib/bridge/madness/robin.ts";
import { getChain } from "lib/bridge/madness/getters/getChain.ts";
import { state } from "lib/state.ts";

export async function onChainIdFromChanged(chainId: number) {
  // if chainId hasn't actually changed, do nothing
  if (state.from.chainId.value === chainId) return;

  // set downstream loading to true
  for (const signal of Object.values(state.loading.from)) {
    signal.value = "loading-[#ffbf0060]";
  }

  robin.abort();

  // set the chainid in state
  state.from.chainId.value = chainId;

  // get the chain object
  await getChain();

  state.from.lastHeight.value = undefined;

  robin.restart();
}
