import { state } from "lib/state.ts";

export const rpcMap = new Map<string,number>()

export function getRpc() {

  // get requirement from state
  const chain = state.from.chain.value
  if (!chain) throw new Error('missing requirement')

  // get rpc
  const rpc = chain.rpc.at(0)
  state.loading.from.rpc.value = 'unload-[]'

  // throw if no rpc
  if (!rpc) throw new Error('no rpc')
  state.from.rpc.value = rpc

}