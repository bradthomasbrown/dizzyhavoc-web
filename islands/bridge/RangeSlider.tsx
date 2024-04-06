// import { Signal, effect } from "@preact/signals";
// import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";

// // https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
// function toPlainString(num:number) {
//   return (''+ +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
//     function(a,b,c,d,e) {
//       return e < 0
//         ? b + '0.' + Array(1-e-c.length).join('0') + c + d
//         : b + c + d + Array(e-d.length+1).join('0');
//     });
// }

// /** string signal */
// type Ss = Signal<undefined|string>
// /** last input type signal */
// type Lits = Signal<undefined|'range'|'number'>

// /** string to bigint, given decimals */
// function stob(s:string, decimals:bigint) {
//   // coerce some scientific notation to more manageable numbers
//   let tmp = toPlainString(Number(s))
//   // get the index of the the decimal if it exists, or len - 1 if it doesn't
//   const index = tmp.match(/\./)?.index ?? tmp.length - 1
//   // get the number of fraction digits
//   const fracs = tmp.length - 1 - index
//   // remove decimal
//   tmp = tmp.replace(/\./, '')
//   // add zeroes if needed
//   if (fracs < decimals) tmp = tmp.padEnd(tmp.length + Number(decimals) - fracs, '0')
//   // truncate if needed
//   if (fracs > decimals) tmp = tmp.slice(0, -1 * (fracs - Number(decimals)))
//   return BigInt(tmp)
// }

// const { uState } = evmVortex

// export function RangeSlider({ rvs, nvs, lits, decimals }:{
//   rvs:Ss, nvs:Ss, lits:Lits, decimals:bigint
// }) {
//   effect(() => {
//     if (lits.value !== 'number' || nvs.value === undefined) return
//     if (uState.dzhvBalance.value instanceof Error || uState.dzhvBalance.value === undefined) return
//     const nvb = stob(nvs.value, decimals)
//     rvs.value = String(nvb * 100n / uState.dzhvBalance.value)
//   })
//   return (
//     <input
//       type="range"
//       class="dark:accent-[#EAEAEA] accent-[#2c2c2c]"
//       onInput={e => {
//         lits.value = 'range'
//         rvs.value = e.currentTarget.value
//       }}
//       value={rvs}
//     />
//   )
// }
