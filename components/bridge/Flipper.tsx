// import { batch, Signal } from "@preact/signals";
// import { dzkv } from "../../lib/dzkv.ts";
// import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
// // import { chosenChains } from "../../lib/bridge/chosenChains.ts";

// type Cs = Signal<undefined | Chain>;
// const fck = ["chain", "from"];
// const tck = ["chain", "to"];

// function flip() {
//   const fcs = dzkv.get<Cs>(fck);
//   const tcs = dzkv.get<Cs>(tck);
//   if (fcs && tcs) [fcs.value, tcs.value] = [tcs.value, fcs.value];
// }

// export function Flipper() {
//   return (
//     <div class="flex order-2 h-0 w-full">
//       <div class="grow h-[2px] backdrop-saturate-200 backdrop-brightness-200 backdrop-contrast-200 translate-x-[-8px] blur-xl rounded-full" />
//       <svg
//         onClick={flip}
//         class="hover:scale-[105%] active:scale-[95%] cursor-pointer w-8 h-8 z-10 translate-y-[-50%]"
//         aria-hidden="true"
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         fill="none"
//         viewBox="0 0 24 24"
//       >
//         <path
//           stroke="currentColor"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           stroke-width="2"
//           d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
//         />
//       </svg>
//       <div class="grow h-[2px] backdrop-saturate-200 backdrop-brightness-200 backdrop-contrast-200 translate-x-[8px] blur-xl rounded-full" />
//     </div>
//   );
// }
