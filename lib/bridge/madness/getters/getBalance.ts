// import { dzkv } from "lib/mod.ts";
// import { ejra } from "lib/bridge/madness/ejra/ejra.ts";
// import { Signal } from '@preact/signals'
// import { state, loading } from "lib/bridge/madness/dzkv.ts";
// import { robinController, goNext } from "lib/bridge/madness/robin.ts";

// dzkv.set(['loading', 'balance'], new Signal('unload-[]'))
// dzkv.set(['state', 'balance'], new Signal())

// export async function getBalance() {

//   // get signal, if aborted return
//   const { signal } = robinController.value
//   if (signal.aborted) return

//   // get requirement, if missing, go next
//   const rpc = state<string>('rpc')!.value
//   const account = state<string>('account')!.value
//   const height = state<bigint>('height')!.value
//   if (!rpc || !account || height === undefined) return goNext()

//   // 🐌
//   const snail = ejra.balance(rpc, account, height, signal)
//   await snail.born
//   loading('balance')!.value = 'loading-[#80ffff2b]'
//   const balance = await snail.died.catch((r:Error) => r)
//   if (!signal.aborted) loading('balance')!.value = 'unload-[]'

//   // handle result
//   if (signal.aborted) return
//   if (balance instanceof Error) return goNext()
//   state<bigint>('balance')!.value = balance
//   return goNext()

// }
