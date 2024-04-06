// import { Signal } from "@preact/signals";
// import { dzkv } from "../../lib/bridge/dzkv.ts";
// import { NumberInput } from '../../islands/bridge/NumberInput.tsx'
// import { RangeSlider } from '../../islands/bridge/RangeSlider.tsx'
// import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";

// type Web3InputProps = {
//   decimals: bigint;
//   maxVal: Signal<Error|undefined|bigint>;
//   disabled?: boolean;
//   amounts: Map<string, Signal<undefined | bigint>>;
//   id: 'from'|'to';
// };

// /** string signal */
// type Ss = Signal<undefined|string>
// /** last input type signal */
// type Lits = Signal<undefined|'range'|'number'>

// export function FromInput(
//   { decimals, id }:Web3InputProps,
// ) {
//   const rvk = ['input', id, 'rv']
//   const nvk = ['input', id, 'nv']
//   const litk = ['input', id, 'lit']
//   if (!dzkv.get(rvk)) dzkv.set<Ss>(rvk, new Signal(undefined))
//   if (!dzkv.get(nvk)) dzkv.set<Ss>(nvk, new Signal(undefined))
//   if (!dzkv.get(litk)) dzkv.set<Lits>(litk, new Signal(undefined))
//   const rvs = dzkv.get<Ss>(rvk)!
//   const nvs = dzkv.get<Ss>(nvk)!
//   const lits = dzkv.get<Lits>(litk)!
//   rvs.subscribe(x => console.log(rvk, x))
//   nvs.subscribe(x => console.log(nvk, x))
//   lits.subscribe(x => console.log(litk, x))
//   return (
//     <div class="flex flex-col mr-4">
//       <NumberInput {...{ nvs, rvs, lits, decimals }}/>
//       <RangeSlider {...{ nvs, rvs, lits, decimals }}/>
//     </div>
//   )

// }

import { Balance /*, Input, Dollars, Abrv, ChainPicker*/ } from "islands.bridge";
import {/*Slip, Percents*/} from "components.bridge";

export function FromInput() {
  return (
    <div class="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr]">
      <div class="row-start-1 col-start-1 col-span-2 w-64 h-8">
        <Balance />
      </div>
      {
        /* <div class="row-start-2 col-start-1 col-span-1 w-48 h-12">
        <Input/>
      </div>
      <div class="row-start-2 col-start-2 col-span-1 w-16 h-12">
        <Slip/>
      </div>
      <div class="row-start-3 col-start-1 col-span-2 w-64 h-8">
        <Percents/>
      </div>
      <div class="row-start-4 col-start-1 col-span-2 w-64 h-8">
        <Dollars/>
      </div>
      <div class="row-start-1 col-start-3 col-span-1 w-16 h-8">
        "From"
      </div>
      <div class="row-start-2 col-start-3 col-span-1 w-16 h-12">
        <Abrv/>
      </div>
      <div class="row-start-3 col-start-3 row-span-2 w-16 h-16">
        <ChainPicker/>
      </div> */
      }
    </div>
  );
}
