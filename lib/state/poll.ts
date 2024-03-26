// import {
//     createTState, updateTState, commitTState,
//     updateBalance, updateDzhvBalance, ttrack
// } from '../internal.ts'
// import { ejra } from '../faucet/ejra.ts'

// export async function poll() {
//     while (true) {
//         console.log('POLL')
//         const { tState, abortController, updaters } = createTState(['balance',
//             'dzhvBalance'])
//         if (!tState.rpc) { ejra.err.push(new Error('poll: cannot poll, tState.rpc undefined')); return }
//         if (tState.rpc instanceof Error) { ejra.err.push(tState.rpc); return }
//         const height = await ejra.height(tState.rpc)
//         if (abortController.signal.aborted) break
//         if (height instanceof Error) { ejra.err.push(height); continue }
//         if (!tState.height || tState.height instanceof Error || height <= tState.height) continue
//         await updateTState({
//             tState,
//             updaters: [updateBalance, updateDzhvBalance, ...updaters],
//             abortController
//         })
//         if (abortController.signal.aborted) break
//         await commitTState(tState)
//     }
// }