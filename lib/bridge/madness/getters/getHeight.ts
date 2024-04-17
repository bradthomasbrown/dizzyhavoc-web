import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext, repeat } from "lib/bridge/madness/robin.ts";

dzkv.set(['loading', 'height'], new Signal('unload-[]'))
dzkv.set(['state', 'height'], new Signal())
export const heightMap = new Map<string,bigint>()

export async function getHeight() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // get requirement, if missing, go next
  const rpc = state<string>('rpc')!.value
  if (!rpc) return goNext()

  // 🐌
  const snail = ejra.height(rpc, signal)
  await snail.born
  loading('height')!.value = 'loading-[#80ffff2b]'
  const height = await snail.died.catch((r:Error) => r)
  loading('height')!.value = signal.aborted
    ? 'loading-[#ffbf0060]'
    : 'unload-[]'
  
  // handle result
  if (signal.aborted) return
  if (height instanceof Error) return repeat()

  // if known block, repeat, unless a height-dependent is loading
  if (
    (heightMap.get(rpc) ?? -Infinity) >= height
    && !(
      loading('balance')!.value != 'unload-[]'
      || loading('dzhvCode')!.value != 'unload-[]'
    )
  ) return repeat()

  heightMap.set(rpc, height)

  loading('dzhvCode')!.value = 'loading-[#ffbf0060]'
  if (state<string>('account')!.value)
    loading('balance')!.value = 'loading-[#ffbf0060]'

  state<bigint>('height')!.value = height
  return goNext()

}