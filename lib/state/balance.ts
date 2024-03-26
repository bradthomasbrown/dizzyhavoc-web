// import { signal } from '@preact/signals'
// import { UpdaterOpts } from '../internal.ts'
// import { ejra } from '../faucet/ejra.ts'

// const balance = signal<undefined|bigint|null>(undefined)

// async function updateBalance({ tState, signal }:UpdaterOpts) {
    
//     // pre-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // logic
//     if (tState.balance !== undefined) return
//     if (tState.rpc instanceof Error) { tState.balance = tState.rpc; return }
//     if (tState.height instanceof Error) { tState.balance = tState.height; return }
//     if (tState.addresses instanceof Error) { tState.balance = tState.addresses; return }
//     if (tState.rpc === undefined || tState.height === undefined || tState.addresses === undefined) return
//     if (!tState.addresses[0]) { tState.balance = new Error('tState.addresses empty'); return }

//     // get
//     const balance = await ejra.balance(tState.rpc, tState.addresses[0], tState.height)
    
//     // post-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // commit
//     tState.balance = balance

// }

// export { balance, updateBalance }