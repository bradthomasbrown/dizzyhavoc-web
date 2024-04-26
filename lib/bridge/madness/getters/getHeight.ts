import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext, restart } from "lib/bridge/madness/robin.ts";
import { state } from "lib/state.ts";

export async function getHeight() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // get requirement, if missing, go next
  const rpc = state.from.rpc.value
  if (!rpc) return goNext()

  // 🐌
  const snail = ejra.height(rpc, signal)
  await snail.born
  if (signal.aborted) return
  state.loading.from.height.value = 'loading-[#80ffff2b]'
  const height = await snail.died.catch((r:Error) => r)
  if (signal.aborted) return
  if (!signal.aborted) state.loading.from.height.value = 'unload-[]'
  
  // handle result
  if (height instanceof Error) return restart()

  if ((state.from.lastHeight.value ?? -Infinity) > height) return restart()

  // if known block, restart, unless a height-dependent is loading
  if (
    (state.from.lastHeight.value ?? -Infinity) >= height
    && state.loading.from.dzhvBalance.value == 'unload-[]'
    && state.loading.from.dzhvCode.value == 'unload-[]'
  ) return restart()

  // set height in heightMap so we can know if height is new
  state.from.lastHeight.value = height

  // if we don't have code, amberload code
  if (!state.codeMap.get(state.from.chainId.value!))
    state.loading.from.dzhvCode.value = 'loading-[#ffbf0060]'

  // if we have an account, amberload dzhv balance
  if (state.account.value)
    state.loading.from.dzhvBalance.value = 'loading-[#ffbf0060]'

  // update state and goNext
  state.from.height.value = height
  return goNext()

}