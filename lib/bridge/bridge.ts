// // import z from "https://deno.land/x/zod@v3.22.4/index.ts";
// // import * as e from '../ejra/mod.ts'
// // import { amount, destination, recipient, state, statuses, createToast } from './mod.ts'
// // import { rlb } from 'https://deno.land/x/rlb@0.0.0/mod.ts'
// // import { Signal } from "@preact/signals";
// // const bar = e.receipt({ hash: '' }).ejrrq.schema

// // export async function bridge() {
// // if (!state.value.provider) { alert('provider undefined'); return }
// // if (!state.value.addresses || !state.value.addresses.length) { alert('no connected addresses'); return }
// // if (!destination.value) { alert('destination undefined'); return }
// // if (!recipient.value) { alert('recipient undefined'); return }
// // if (!amount.value) { alert('amount undefined'); return }
// // if (!state.value.rpc) { alert('rpc undefined'); return }
// // const { rpc } = state.value
// // const data = `0x9eea5f66${
// //     destination.value.toString(16).padStart(64, '0')}${
// //     recipient.value.substring(2).padStart(64, '0')}${
// //     amount.value.toString(16).padStart(64, '0')}`
// // const input = data
// // const from = state.value.addresses.at(0)
// // const to = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
// // const call = { to, data, input, from }
// // console.log(`bridge params: ${JSON.stringify(call)} (amount: ${amount.value})`)
// // state.value.provider.request({ method: 'eth_sendTransaction', params: [{ ...call, input: undefined, data: input }] })
// // .then(z.string().parseAsync)
// // .then(async hash => {
// //     const status:Signal<"0x1"|"0x0"|null> = new Signal(null)
// //     statuses.set(hash, status)
// //     createToast({ hash, explorer: { name: 'Fooscan', url: 'https://fooscan.com/' }, status })
// // })
// // }

// // export function bridge(
//   /*{
//   // recipient,
//   // amount,
//   // address,
//   // provider,
//   // dzhv,
//   // destChain,
// // }: {
//   // recipient: string;
//   // amount: bigint;
//   // address: string;
//   // provider: InjectedProvider;
//   // dzhv: { address: string };
//   // destChain: Chain;
// }){*/
//   // const data = `0x9eea5f66${destChain.chainId.toString(16).padStart(64, "0")}${
//   //   recipient.substring(2).padStart(64, "0")
//   // }${amount.toString(16).padStart(64, "0")}`;
//   // const from = address;
//   // const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
//   // const tx = { from, to, data };
//   // console.log(`bridge params: ${JSON.stringify(tx)} (amount: ${amount})`);
//   // provider.request({ method: "eth_sendTransaction", params: [{ ...tx }] })
//   //   .then(z.string().parseAsync)
//   //   .then(async (hash) => {
//   //     const status: Signal<"0x1" | "0x0" | null> = new Signal(null);
//   //     statuses.set(hash, status);
//   //   });
// // }

// import { evmVortex } from "../faucet/evmVortex/evmVortex.ts";
// import { chosenChains } from './chosenChains.ts'
// import { recipient } from '../../islands/bridge/RecipientInput.tsx'
// import { amounts } from './amounts.ts'

// export async function bridge() {

//   const p1193 = evmVortex.uState.p1193.value
//   if (p1193 instanceof Error || p1193 === undefined) return

//   const chain = chosenChains.get('from')!.value
//   if (chain === undefined) return
//   const { chainId } = chain

//   const destChain = chosenChains.get('to')!.value
//   if (destChain === undefined) return
//   const eDestChainId = destChain.chainId.toString(16).padStart(64, '0')

//   const amount = amounts.get('from')!.value
//   if (amount === undefined) return
//   const eAmount = amount.toString(16).padStart(64, '0')

//   if (recipient.value.length !== 42) return
//   const eRecipient = recipient.value.slice(2).padStart(64, '0')

//   const addresses = evmVortex.uState.addresses.value
//   if (addresses instanceof Error || addresses === undefined) return
//   const [from] = addresses
//   if (from === undefined) return

//   const to = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
//   const data = `0x9eea5f66${eDestChainId}${eRecipient}${eAmount}`
//   const tx = { from, to, data }

//   await p1193.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${chainId.toString(16)}` }] })

//   p1193.request({ method: "eth_sendTransaction", params: [{ ...tx }] })

// }
