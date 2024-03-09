import { IS_BROWSER } from "$fresh/runtime.ts";
import { Chain, query } from '../internal.ts'

// active chain IDs
const ids = [
    1n,     // ethereum,
    56n,    // binance smart chain
    8453n,  // base
    42161n, // arbitrum
    43114n, // avalanche,
    8546n,  // local testnet 8546
]

// an array of bridgeable chains constructed from the above list of chain IDs
export const bridgeable = !IS_BROWSER ? [] : await Promise.all(ids.map(id => query({ id }))) as Chain[]