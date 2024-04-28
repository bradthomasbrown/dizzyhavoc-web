import * as robin from "lib/bridge/madness/robin.ts";
import { state } from "lib/state.ts";

export function onChainIdToChanged(chainId: number) {
  // if chainId hasn't actually changed, do nothing
  if (state.to.chainId.value === chainId) return;

  // set downstream loading to true
  for (const signal of Object.values(state.loading.to)) {
    signal.value = "loading-[#ffbf0060]";
  }
  state.loading.econConf.value = "loading-[#ffbf0060]";

  robin.abort();

  // set the chainid in state
  state.to.chainId.value = chainId;

  robin.restart();
}
