import { Chain } from "lib/bridge/madness/query/types/mod.ts";
import { query } from "lib/bridge/madness/query/query.ts";
import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { getRpc } from "lib/bridge/madness/getters/getRpc.ts";
import { state } from "lib/state.ts";

export async function getChain() {

  // get requirement from state, assume it exists
  const chainId = state.from.chainId.value!

  let chain:Chain 
  if (!state.chainMap.has(chainId)) {
    // 🐌
    const snail = query(toad, chainId)
    await snail.born
    state.loading.from.chain.value = 'loading-[#80ffff2b]'
    chain = await snail.died
    state.chainMap.set(chainId, chain)
  } else chain = state.chainMap.get(chainId)!
  state.loading.from.chain.value = 'unload-[]'

  // update state, get url
  state.from.chain.value = chain
  return getRpc()

}