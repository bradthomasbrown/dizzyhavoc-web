import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { Chain } from "lib/bridge/madness/query/types/Chain.ts";
import { heightMap } from "lib/bridge/madness/getters/getHeight.ts"

dzkv.set(['loading', 'rpc'], new Signal('unload-[]'))
dzkv.set(['state', 'rpc'], new Signal())

export function getRpc() {

  // reset height in height map of rpc we are leaving
  if (state<string>('rpc')!.value)
    heightMap.delete(state<string>('rpc')!.value!)

  // get requirement from state
  const chain = state<Chain>('chain')!.value
  if (!chain) throw new Error('missing requirement')

  // get rpc
  const rpc = chain.rpc.at(0)
  loading('rpc')!.value = 'unload-[]'

  // throw if no rpc
  if (!rpc) throw new Error('no rpc')
  state<string>('rpc')!.value = rpc

}