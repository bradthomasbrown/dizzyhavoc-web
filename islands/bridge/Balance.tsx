
import { Signal, computed, effect } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { dzkv, ejra } from "lib";
import "lib.bridge"

const loading = new Signal('')

// effect(() => {
  
//   if (!dzkv.get(['p6963', 'addresses']))
//     dzkv.set(['p6963', 'addresses'], new Signal([]))
//   if (!dzkv.get(['chains', 'from']))
//     dzkv.set(['chains', 'from'], new Signal({ rpc: [] }))

//   dzkv.get<Signal>(['p6963', 'addresses'])?.value
//   dzkv.get<Signal>(['chains', 'from'])?.value
//   loading.value = 'loading'

// })

/** bigint to string, given decimals */
function btos(b:bigint, decimals:number) {
  // padleft with zeros up to decimals length
  const tmp = String(b).padStart(Number(decimals), '0')
  // array from tmp
  const tmpa = Array.from(tmp)
  // new tmp, decimal and last {decimal} digits
  let tmp2 = `.${tmpa.splice(-18).join('')}`
  // add the rest of the digits
  tmp2 = `${tmpa.join('')}${tmp2}`
  // remove trailing zeros
  tmp2 = tmp2.replace(/0*$/, '')
  // remove decimal if it's the last char
  tmp2 = tmp2.replace(/\.$/, '')
  // if there's nothing left, return a '0'
  return tmp2 ? tmp2 : '0'
}

const dispBalance = new Signal('0')

// effect(async () => {
//   const b = await balance.value
//   console.log('dispBalance effect', b)
//   loading.value = ''
//   if (b === undefined) return
//   dispBalance.value = btos(b, 18)
// })

export function Balance() {
  return (
    <div class="h-full p-2 flex items-center font-mono brightness-75">
      <div class={`flex border-2 border-transparent rounded-full px-2 ${loading.value}`}>
        <div class="max-w-44 overflow-hidden overflow-ellipsis">
          {dispBalance}
        </div>
        <div class="ml-2 max-w-8 select-none">DZHV</div>
      </div>
    </div>
  );
}
