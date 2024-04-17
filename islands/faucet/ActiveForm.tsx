// import { computed } from "@preact/signals";
// import { hexshort } from "../../lib/hexshort.ts";
// import { ActionButton } from "./ActionButton.tsx";
// import { Balance } from "../common/Balance.tsx";
// import { Blockie } from "../../lib/blockies/Blockie.ts";
// import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";
// import { chainSrc } from "../../lib/chainSrc.ts";
// import { which as faucetWhich } from "../../lib/bridge/which.ts";
// import { which as providerWhich } from "../common/Connector.tsx";

// export function ActiveForm() {
//   const defaultSeed = "0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c";
//   const seed = computed(() => {
//     const addresses = evmVortex.uState.addresses.value;
//     return !addresses || addresses instanceof Error
//       ? defaultSeed
//       : addresses[0];
//   });
//   const blockieData = computed(() => {
//     return new Blockie({ scale: 16, seed: seed.value }).base64();
//   });

//   const hexshortSelected = computed(() => {
//     const addresses = evmVortex.uState.addresses.value;
//     const zeroAddress = "0x".padEnd(42, "0");
//     return hexshort(
//       !addresses || addresses instanceof Error ? zeroAddress : addresses[0],
//     );
//   });
//   evmVortex.uState.chain.subscribe(console.log)
//   return providerWhich.value ??
//     faucetWhich.value ??
//     (
//       <>
//         {/* chain icon */}
//         {evmVortex.uState.chain.value
//           ? (
//             <div class="absolute top-2 left-2">
//               <picture class="w-7 h-7" title={evmVortex.uState.chain.value}>
//                 <source
//                   srcset={chainSrc(Number(evmVortex.uState.chain.value)).dsrc ?? chainSrc(Number(evmVortex.uState.chain.value)).src ?? Blockie.randB64()}
//                   media="(prefers-color-scheme: dark)"
//                 />{" "}
//                 <img
//                   draggable={false}
//                   class="select-none w-7 h-7"
//                   src={chainSrc(Number(evmVortex.uState.chain.value)).src ?? Blockie.randB64()}
//                 />
//               </picture>
//             </div>
//           )
//           : <></>}

//         {/* blockie */}
//         <img
//           class="size-[2.2rem] rounded-sm mb-1"
//           src={blockieData}
//           title={seed}
//           alt="blockie image"
//         />

//         {/* hexshort */}
//         <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-sm mb-2">
//           {hexshortSelected}
//         </div>

//         {/* balance */}
//         <Balance />

//         {/* faucet button */}
//         <ActionButton />
//       </>
//     );
// }