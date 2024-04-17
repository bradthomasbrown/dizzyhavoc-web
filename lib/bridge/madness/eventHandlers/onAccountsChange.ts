import { dzkv } from "lib/mod.ts";
import { Signal } from '@preact/signals-core'
import { state, loading } from "lib/bridge/madness/dzkv.ts"
import { robinController, robinIndex, robinFns } from "lib/bridge/madness/robin.ts"
import { getAccount } from "lib/bridge/madness/getters/getAccount.ts"

dzkv.set(['state', 'accounts'], new Signal())

export function onAccountsChanged(accounts:string[]) {

  // if accounts haven't actually changed, do nothing
  if (String(state<string[]>('accounts')!.value) === String(accounts)) return
  
  // cause downstream to amberload if applicable
  if (
    state<string>('rpc')!.value
    && state<bigint>('height')!.value !== undefined
  )
    loading('balance')!.value = 'loading-[#ffbf0060]'

  // abort the robin controller
  try { robinController.value.abort() } catch (_) {0}

  // set the accounts in state
  state<string[]>('accounts')!.value = accounts

  // try to get the account
  getAccount()
  
  // if robin already started, don't start again
  if (!robinController.value.signal.aborted) return

  // if success, refresh robinController, reset robin, start robin
  robinController.value = new AbortController()
  robinFns[robinIndex.value = 0]()

}