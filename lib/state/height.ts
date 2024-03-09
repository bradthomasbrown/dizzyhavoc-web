import { signal } from '@preact/signals'
import { DAppState, e } from "../internal.ts";

const height = signal<undefined|bigint|null>(undefined)

async function updateHeight(state:DAppState) {
    if (state.height !== null && state.height !== undefined) return 
    if (state.rpc === null) { state.height = null; return }
    if (state.rpc === undefined) return
    const url = state.rpc
    state.height = await e.height().call({ url }).catch(() => null)
}

export { height, updateHeight }