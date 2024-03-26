// import { signal } from '@preact/signals'
// import { UpdaterOpts } from "../internal.ts";
// import { ejra } from '../faucet/ejra.ts'

// const height = signal<undefined|bigint|null>(undefined)

// async function updateHeight({ tState, signal }:UpdaterOpts) {

//     // pre-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // logic
//     if (tState.height !== null && tState.height !== undefined) return 
//     if (tState.rpc instanceof Error) { tState.height = tState.rpc; return }
//     if (tState.rpc === undefined) return

//     // get and parse
//     const height = await ejra.height(tState.rpc)

//     // post-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // commit
//     tState.height = height

// }

// export { height, updateHeight }