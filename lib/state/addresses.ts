import { signal } from '@preact/signals'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { DAppState } from "../internal.ts";

const addresses = signal<undefined|string[]|null>(undefined)

async function updateAddresses(state:DAppState, { type }:{ type:'req'|'get' }) {
    // if we already updated the state, skip
    if (state.addresses !== null && state.addresses !== undefined) return 
    // if there's no provider, there's no selected addresses
    if (state.provider === null) { state.addresses = null; return }
    // if we don't know if there's a provider, we don't know if there's selected addresses
    if (state.provider ===  undefined) return
    // request accounts via provider
    const method = type == 'get' ? 'eth_accounts' : 'eth_requestAccounts'
    const result = await state.provider.request({ method, params: [] }).catch(() => null)
    // verify that the result is at least an array of strings, then return 
    state.addresses = await z.string().array().parseAsync(result).catch(() => null)
}

export { addresses, updateAddresses }