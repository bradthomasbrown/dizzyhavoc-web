import * as robin from "lib/faucet/madness/robin.ts";
import { getChain } from "lib/faucet/madness/getters/getChain.ts";
import { state } from "lib/faucet/state.ts";

export async function onChainIdChanged(chainId: number) {
  // if chainId hasn't actually changed, do nothing
  if (state.chainId.value === chainId) return;

  // set downstream loading to true
  for (const signal of Object.values(state.loading)) {
    signal.value = "loading-[#ffbf0060]";
  }

  robin.abort();

  // set the chainid in state
  state.chainId.value = chainId;

  // get the chain object
  await getChain();

  state.lastHeight.value = undefined;

  robin.restart();
}
