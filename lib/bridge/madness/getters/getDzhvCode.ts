import { dzhv } from "lib/bridge/madness/dzhv.ts";
import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import { state } from "lib/state.ts";

export async function getDzhvCode() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // if we have code already, go next (make sure to remove loading)
  if (state.codeMap.get(state.from.chainId.value!)) {
    state.loading.from.dzhvCode.value = 'unload-[]'
    return goNext()
  }

  // get requirement from state
  const rpc = state.from.rpc.value
  const height = state.from.height.value
  if (!rpc || height === undefined) return goNext()

  // 🐌
  const snail = ejra.code(rpc, dzhv.address, height, signal)
  await snail.born
  if (signal.aborted) return
  state.loading.from.dzhvCode.value = 'loading-[#80ffff2b]'
  const code = await snail.died.catch((r:Error) => r)
  if (signal.aborted) return
  if (!signal.aborted) state.loading.from.dzhvCode.value = 'unload-[]'

  // handle result
  if (code instanceof Error) return goNext()
  if (code && code != '0x') state.codeMap.set(state.from.chainId.value!, true)
  state.from.dzhvCode.value = code
  return goNext()

}