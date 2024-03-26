// import { signal } from '@preact/signals'
// import { UpdaterOpts } from "../internal.ts"
// import { ejra } from '../faucet/ejra.ts'

// const dzhv = signal<undefined|{ address:string }|null>(undefined)

// async function updateDzhv({ tState, signal }:UpdaterOpts) {
    
//     // pre-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // logic
//     if (tState.dzhv) return
//     if (tState.height instanceof Error) { tState.dzhv = tState.height; return }
//     if (tState.rpc instanceof Error) { tState.dzhv = tState.rpc; return }
//     if (tState.height === undefined || tState.rpc === undefined) return

//     // get
//     const code = await ejra.code(tState.rpc, '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe', tState.height)

//     const dzhv = code instanceof Error
//         ? code
//         : code == '0x'
//             ? new Error('dzhv not on this chain')
//             : { address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }

//     // post-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    
//     // commit
//     tState.dzhv = dzhv

// }

// export { dzhv, updateDzhv }