// import { Signal, effect } from "@preact/signals";
// import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";

// /** string signal */
// type Ss = Signal<undefined|string>
// /** last input type signal */
// type Lits = Signal<undefined|'range'|'number'>

// /** bigint to string, given decimals */
// function btos(b:bigint, decimals:bigint) {
//   // padleft with zeros up to decimals length
//   const tmp = String(b).padStart(Number(decimals), '0')
//   // array from tmp
//   const tmpa = Array.from(tmp)
//   // new tmp, decimal and last {decimal} digits
//   let tmp2 = `.${tmpa.splice(-18).join('')}`
//   // add the rest of the digits
//   tmp2 = `${tmpa.join('')}${tmp2}`
//   // remove trailing zeros
//   tmp2 = tmp2.replace(/0*$/, '')
//   // remove decimal if it's the last char
//   tmp2 = tmp2.replace(/\.$/, '')
//   return tmp2
// }

// const { uState } = evmVortex

// export function NumberInput({ nvs, rvs, lits, decimals }:{ nvs: Ss, rvs:Ss, lits:Lits, decimals:bigint }) {
//   effect(() => {
//     if (lits.value !== 'range' || rvs.value === undefined || rvs.value === '0') return
//     if (uState.dzhvBalance.value instanceof Error || uState.dzhvBalance.value === undefined) return
//     const rvb = BigInt(rvs.value)
//     nvs.value = btos(uState.dzhvBalance.value * rvb / 100n, decimals)
//   })
//   return (
//     <input
//       type="number"
//       class="max-w-[200px] px-2 text-[32px] font-[monospace] bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//       onInput={e => {
//         lits.value = 'number'
//         nvs.value = e.currentTarget.value
//       }}
//       value={nvs}
//       placeholder="0"
//     />
//   )
// }
