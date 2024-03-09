import { signal } from '@preact/signals'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { UpdaterOpts } from "../internal.ts";

const chainId = signal<undefined|bigint|null>(undefined)

async function updateChainId({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.chainId !== null && tstate.chainId !== undefined) return
    if (tstate.provider === null) { tstate.chainId = null; return }
    if (tstate.provider === undefined) return
    const chainId = await tstate.provider.request({ method: 'eth_chainId', params: [] })
        .then(z.string().transform(BigInt).parseAsync).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.chainId = chainId
    
}

export { chainId, updateChainId }