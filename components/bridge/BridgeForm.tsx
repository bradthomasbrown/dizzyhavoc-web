import { CurrencyPair } from './CurrencyPair.tsx'

export function BridgeForm() {
  return (
    <div class="grid grid-cols-2 grid-rows-8">
      {/* <Details/> */}
      <CurrencyPair/>
    </div>
    // <div class="w-full sm:px-16 px-8 text-[#282828] dark:text-[#d2d2d2]">
    //   <div class="bg-blur2 shadow-xl w-auto flex flex-col font-[Poppins]">
    //     <div class="flex">
    //       <div class="grow unselectable">gas</div>
    //       <div class="unselectable">time</div>
    //     </div>
    //     <div class="relative">
    //       <div class="p-2 flex flex-col">
    //         <div class="flex text-sm font-semibold">
    //           <div class="grow unselectable">Burn</div>
    //           <div class="unselectable">From</div>
    //         </div>
    //         <div class="flex">
    //           <Input/>
    //           <FhChainPicker
    //             chosen={chosenChains}
    //             id={"from"}
    //             onClick={pickChain}
    //             addClass="translate-x-[calc(50%+8px)]"
    //           />
    //         </div>
    //         <div class="flex">
    //           <div
    //             title={quotes["from"].value
    //               ? `price: $${quotes["from"]}`
    //               : "select chain"}
    //             class="grow font-extralight text-sm font-mono"
    //           >
    //             {quotes["from"].value && amount.value
    //               ? "$" +
    //                 (Number(quotes["from"]) * Number(amount.value))
    //                   .toFixed(2)
    //               : "$0"}
    //           </div>
    //           <div class="font-extralight text-sm">
    //             {chosenChains.value["from"]?.shortName ?? "‎ "}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <Divider/>

    //     <div class="p-2 flex flex-col">
    //       <div class="flex text-sm font-semibold">
    //         <div class="grow unselectable">Mint</div>
    //         <div class="unselectable">To</div>
    //       </div>
    //       <div class="flex">
    //         <Input/>
    //         <FhChainPicker
    //           chosen={chosenChains}
    //           id={"to"}
    //           onClick={pickChain}
    //           addClass="translate-x-[calc(50%+8px)]"
    //         />
    //       </div>
    //       <div class="flex">
    //         <div
    //           title={quotes["from"]
    //             ? `price: $${quotes["to"]}`
    //             : "select chain"}
    //           class="grow font-extralight text-sm font-mono"
    //         >
    //           {quotes["to"] && amount.value
    //             ? "$" +
    //               (Number(quotes["to"]) * Number(amount.value))
    //                 .toFixed(2)
    //             : "$0"}
    //         </div>
    //         <div>{chosenChains.value["to"]?.shortName ?? " "}</div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}