import { Signal } from "@preact/signals-core";
import { dzkv } from "lib/dzkv.ts";
import { state } from "lib/bridge/madness/dzkv.ts";

dzkv.set(['state', 'account'], new Signal())

export function getAccount() {

  // get requirement from state
  const accounts = state<string[]>('accounts')!.value
  if (!accounts?.length) throw new Error('missing requirement')

  // get account
  const account = accounts.at(0)

  // set account
  state<string>('account')!.value = account

}