import { signal } from '@preact/signals'
import { query, UpdaterOpts } from '../internal.ts'

const rpc = signal<undefined|string|null>(undefined)

async function updateRpc({ tState, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tState.rpc !== null && tState.rpc !== undefined) return 
    if (tState.chainId instanceof Error) { tState.rpc = tState.chainId; return }
    if (tState.chainId === undefined) return

    // get and parse
    const rpc = (await query({ id: tState.chainId }))?.rpc?.[0] ?? new Error('no rpc found for this chainId')

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tState.rpc = rpc

}

export { rpc, updateRpc }