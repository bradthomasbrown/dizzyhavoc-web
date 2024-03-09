import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { signal } from '@preact/signals'
import { DAppState, e } from "../internal.ts";

const dzhvBalance = signal<undefined|bigint|null>(undefined)

async function updateDzhvBalance(state:DAppState) {
    if (state.dzhvBalance !== null && state.dzhvBalance !== undefined) return
    if (state.addresses === null || state.dzhv === null || state.height === null || state.rpc === null) { state.dzhvBalance = null; return }
    if (state.addresses === undefined || state.dzhv === undefined || state.height === undefined || state.rpc === undefined) return
    const address = state.addresses[0]
    if (!address) { state.dzhvBalance = null; return }
    const input = `0x70a08231${address.substring(2).padStart(64, '0')}`
    const to = state.dzhv.address
    const tx = { input, to }
    const tag = state.height
    const url = state.rpc
    const maybeBalanceStr = await e.call({ tx, tag }).call({ url }).catch(() => null)
    if (maybeBalanceStr === null) { state.dzhvBalance = null; return }
    state.dzhvBalance = await z.string().transform(BigInt).parseAsync(maybeBalanceStr).catch(() => null)
}

export { dzhvBalance, updateDzhvBalance }