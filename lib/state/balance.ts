import { signal } from '@preact/signals'
import { DAppState, e } from "../internal.ts";

const balance = signal<undefined|bigint|null>(undefined)

async function updateBalance(state:DAppState) {
    // if we already updated the state, skip
    if (state.balance !== null && state.balance !== undefined) return 
    // require an rpc, height, and the connected address list to derive balance
    if (state.rpc === null || state.height === null || state.addresses === null) { state.balance = null; return }
    // if we don't know the deriving requirements, we don't know the balance
    if (state.rpc === undefined || state.height === undefined || state.addresses === undefined) return
    // if we have the address list, but it's empty, we can't derive balance
    if (!state.addresses[0]) { state.balance = null; return }
    const address = state.addresses[0]
    const tag = state.height
    const url = state.rpc
    state.balance = await e.balance({ address, tag }).call({ url }).catch(() => null)
}

export { balance, updateBalance }