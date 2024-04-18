import { Signal } from "@preact/signals-core";
import { dzhv } from "lib/bridge/madness/dzhv.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import { dzkv } from "lib/dzkv.ts";

dzkv.set(['loading', 'dzhvCode'], new Signal('unload-[]'))
dzkv.set(['state', 'dzhvCode'], new Signal())
export const codeMap = new Map<string,boolean>()

export async function getDzhvCode() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // get requirement from state
  const rpc = state<string>('rpc')!.value
  const height = state<bigint>('height')!.value
  if (!rpc || height === undefined) return goNext()

  if (codeMap.get(rpc)) return goNext()

  // 🐌
  const snail = ejra.code(rpc, dzhv.address, height, signal)
  await snail.born
  loading('dzhvCode')!.value = 'loading-[#80ffff2b]'
  const code = await snail.died.catch((r:Error) => r)
  if (!signal.aborted) loading('dzhvCode')!.value = 'unload-[]'

  // handle result
  if (signal.aborted) return
  console.log('code goNext')
  if (code instanceof Error) return goNext()
  if (code && code != '0x') codeMap.set(rpc, true)
  state<string>('dzhvCode')!.value = code
  return goNext()

}