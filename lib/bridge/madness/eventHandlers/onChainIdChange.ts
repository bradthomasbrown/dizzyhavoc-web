import { dzkv } from "lib/mod.ts";
import { Signal } from '@preact/signals-core'
import { state, loading } from "lib/bridge/madness/dzkv.ts"
import { robinController, robinIndex, robinFns } from "lib/bridge/madness/robin.ts"
import { getChainController, getChain } from "lib/bridge/madness/getters/getChain.ts"

dzkv.set(['state', 'chainId'], new Signal())

export async function onChainIdChanged(chainId:number) {

  // if chainId hasn't actually changed, do nothing
  if (state<number>('chainId')!.value === chainId) return

  // cause downstreams to amberload if applicable
  loading('chain')!.value = 'loading-[#ffbf0060]'
  loading('rpc')!.value = 'loading-[#ffbf0060]'
  loading('height')!.value = 'loading-[#ffbf0060]'
  loading('dzhvCode')!.value = 'loading-[#ffbf0060]'
  if (state<string>('account')!.value) {
    loading('dzhvBalance')!.value = 'loading-[#ffbf0060]'
  }

  // abort the robin controller
  try { robinController.value.abort() } catch (_) {0}
  try { getChainController.value.abort() } catch (_) {0}
  getChainController.value = new AbortController()

  // set the chainid in state
  state('chainId')!.value = chainId

  // try to get the chain
  const err = await getChain().catch(r => r)
  
  // if fail, log error
  if (err) return console.error(err)

  // if robin already started, don't start again
  if (!robinController.value.signal.aborted) return

  // if success, refresh robinController, reset robin, start robin
  robinController.value = new AbortController()
  robinFns[robinIndex.value = 0]()

}