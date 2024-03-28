// import { signal } from '@preact/signals'
// import z from "https://deno.land/x/zod@v3.22.4/index.ts";
// import { UpdaterOpts } from "../internal.ts"
// import { ejra } from '../faucet/ejra.ts'

// const chainId = signal<undefined|bigint|null>(undefined)

// async function updateChainId({ tState, signal }:UpdaterOpts) {

//     // pre-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // logic
//     if (tState.chainId !== undefined) return
//     if (tState.provider instanceof Error) { tState.chainId = tState.provider; return }
//     if (tState.provider === undefined) return

//     const chainId = await tState.provider.request({ method: 'eth_chainId', params: [] })
//         .then(z.string().transform(BigInt).parseAsync).catch(e => new Error(e))

//     // post-check
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

//     // commit
//     tState.chainId = chainId

// }

// export { chainId, updateChainId }
