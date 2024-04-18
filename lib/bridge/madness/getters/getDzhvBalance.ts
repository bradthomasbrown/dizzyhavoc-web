import { dzhv } from "lib/bridge/madness/dzhv.ts";
import { state, loading } from "lib/bridge/madness/dzkv.ts";
import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import { TxCallObject } from "lib/bridge/madness/ejra/types/TxCallObject.ts";
import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";

dzkv.set(['loading', 'dzhvBalance'], new Signal('unload-[]'))
dzkv.set(['state', 'dzhvBalance'], new Signal())

export async function getDzhvBalance() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // get requirement from state
  const rpc = state<string>('rpc')!.value
  const account = state<string>('account')!.value
  const height = state<bigint>('height')!.value
  const code = state<string>('dzhvCode')!.value
  if (
    !rpc
    || !account
    || height === undefined
    || !code || code == '0x'
  ) return goNext()

  // 🐌
  const to = dzhv.address
  const input = `0x70a08231${account.slice(2).padStart(64, '0')}`
  const txCallObject:TxCallObject = { to, input }
  const snail = ejra.call(rpc, txCallObject, height, signal)
  await snail.born
  loading('dzhvBalance')!.value = 'loading-[#80ffff2b]'
  const balance = await snail.died.then(BigInt).catch((r:Error) => r)
  if (!signal.aborted) loading('dzhvBalance')!.value = 'unload-[]'

  // handle result
  if (signal.aborted) return
  if (balance instanceof Error) return goNext()
  state<bigint>('dzhvBalance')!.value = balance
  return goNext()

}