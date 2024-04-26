import { dzhv } from "lib/bridge/madness/dzhv.ts";
import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
import { robinController, goNext } from "lib/bridge/madness/robin.ts";
import { TxCallObject } from "lib/bridge/madness/ejra/types/TxCallObject.ts";
import { state } from "lib/state.ts";

export async function getDzhvBalance() {

  // get signal, if aborted return
  const { signal } = robinController.value
  if (signal.aborted) return

  // get requirement from state
  const rpc = state.from.rpc.value
  const account = state.account.value
  const height = state.from.height.value
  const code = state.from.dzhvCode.value
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
  if (signal.aborted) return
  state.loading.from.dzhvBalance.value = 'loading-[#80ffff2b]'
  const balance = await snail.died.then(BigInt).catch((r:Error) => r)
  if (signal.aborted) return
  if (!signal.aborted) state.loading.from.dzhvBalance.value = 'unload-[]'

  // handle result
  if (balance instanceof Error) return goNext()
  state.from.dzhvBalance.value = balance
  return goNext()

}