import { signal } from '@preact/signals'
import { query, DAppState } from '../internal.ts'

const rpc = signal<undefined|string|null>(undefined)

async function updateRpc(state:DAppState) {
    if (state.rpc !== null && state.rpc !== undefined) return 
    if (state.chainId === null) { state.rpc = null; return }
    if (state.chainId === undefined) return
    const chain = await query({ id: state.chainId }).catch(() => null)
    if (!chain) { state.rpc = null; return }
    const rpc = chain.rpc.filter(url => !url.match(/wss/i))?.[0]
    if (!rpc) { state.rpc = null; return }
    state.rpc = rpc
}

export { rpc, updateRpc }