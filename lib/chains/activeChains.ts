// import { IS_BROWSER } from "$fresh/runtime.ts";
// import { Chain, query } from "../internal.ts";

// // active chain IDs
// const ids = [
//   // # mainnet
//   // 1n,      // ethereum,
//   // 56n,     // binance smart chain
//   // 8453n,   // base
//   // 42161n,  // arbitrum
//   // 43114n,  // avalanche,
//   11155111, // ethereum sepolia
//   421614, // arbitrum sepolia
//   84532, // base sepolia
//   43113, // avalanche fuji
//   97, // BSC Testnet
// ];

// // an array of activeChains chains constructed from the above list of chain IDs
// export const activeChains = !IS_BROWSER
//   ? []
//   : await Promise.all(ids.map((id) => query({ id }))) as Chain[];
