import { Chain } from "lib/bridge/madness/query/types/mod.ts";
import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";
import { query } from "lib/bridge/madness/query/query.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { toad } from "lib/bridge/madness/ejra/ejra.ts";
import { getRpc } from "lib/bridge/madness/getters/getRpc.ts";

if (!dzkv.get(['control', 'from', 'chain']))
  dzkv.set(['control', 'from', 'chain'], new Signal())

dzkv.set(['loading', 'chain'], new Signal('unload-[]'))
dzkv.set(['state', 'chain'], new Signal())
export const chainMap = new Map<number,Chain>()

export async function getChain() {

  // get requirement from state
  const chainId = state<number>('chainId')!.value!

  let chain:Chain 
  if (!chainMap.has(chainId)) {
    // 🐌
    const snail = query(toad, chainId)
    await snail.born
    loading('chain')!.value = 'loading-[#80ffff2b]'
    chain = await snail.died
    chainMap.set(chainId, chain)
  } else chain = chainMap.get(chainId)!

  // update state, get url
  state<Chain>('chain')!.value = chain
  dzkv.get<Signal<undefined|Chain>>(['control', 'from', 'chain'])!.value = chain
  return getRpc()

}