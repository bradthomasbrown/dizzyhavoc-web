import { signal } from '@preact/signals'
import { DAppState, e } from "../internal.ts";

const dzhv = signal<undefined|{ address:string }|null>(undefined)

async function updateDzhv(state:DAppState) {
    if (state.dzhv) return
    if (state.height === null || state.rpc === null) { state.dzhv = null; return }
    if (state.height === undefined || state.rpc === undefined) return
    const address = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
    const tag = state.height
    const url = state.rpc
    const code = await e.code({ address, tag }).call({ url }).catch(() => null)
    if (code === null || code == '0x') { state.dzhv = null; return }
    state.dzhv = { address }
}

export { dzhv, updateDzhv }