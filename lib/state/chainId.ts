import { signal } from '@preact/signals'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { DAppState } from "../internal.ts";

const chainId = signal<undefined|bigint|null>(undefined)

async function updateChainId(state:DAppState) {
    if (state.chainId !== null && state.chainId !== undefined) return
    // if there's no provider, there's no chainId
    if (state.provider === null) { state.chainId = null; return }
    // if we don't know if there's a provider, we don't know if there's a chainId
    if (state.provider === undefined) return
    // get chainId via provider
    const method = 'eth_chainId'
    const result = await state.provider.request({ method, params: [] }).catch(() => null)
    // verify that the result is a string that can be transformed into a bigint 
    state.chainId = await z.string().transform(BigInt).parseAsync(result).catch(() => null)
}

export { chainId, updateChainId }