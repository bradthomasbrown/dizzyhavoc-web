import { Chain } from "lib/faucet/madness/query/types/mod.ts";
import { query } from "lib/faucet/madness/query/query.ts";
import { toad } from "lib/faucet/madness/ejra/ejra.ts";
import { getRpc } from "lib/faucet/madness/getters/getRpc.ts";
import { state } from "lib/faucet/state.ts";

export async function getChain() {
  // get requirement from state, assume it exists
  const chainId = state.chainId.value!;

  let chain: Chain;
  if (!state.chainMap.has(chainId)) {
    // 🐌
    const snail = query(toad, chainId);
    await snail.born;
    state.loading.chain.value = "loading-[#80ffff2b]";
    chain = await snail.died;
    state.chainMap.set(chainId, chain);
  } else chain = state.chainMap.get(chainId)!;
  state.loading.chain.value = "unload-[]";

  // update state, get url
  state.chain.value = chain;
  return getRpc();
}
