import { Chain } from "lib/bridge/madness/query/types/mod.ts";
import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";
import { query } from "lib/bridge/madness/query/query.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { getRpc } from "lib/bridge/madness/getters/getRpc.ts";

dzkv.set(['loading', 'chain'], new Signal('unload-[]'))
dzkv.set(['state', 'chain'], new Signal())
export const getChainController = { value: new AbortController() }
const chainMap = new Map<number,Chain>()

export async function getChain() {

  // get signal, if aborted return
  const { signal } = getChainController.value
  if (signal.aborted) return

  // get requirement from state
  const chainId = state<number>('chainId')!.value!

  let chain:Chain 
  if (!chainMap.has(chainId)) {
    // 🐌
    const snail = query(toad, chainId, signal)
    await snail.born
    loading('chain')!.value = 'loading-[#80ffff2b]'
    chain = await snail.died
    chainMap.set(chainId, chain)
  } else chain = chainMap.get(chainId)!
  if (!signal.aborted) loading('chain')!.value = 'unload-[]'

  // update state, get url
  state<Chain>('chain')!.value = chain
  return getRpc()

}