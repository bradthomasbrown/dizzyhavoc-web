import { signal } from '@preact/signals'
import { query, UpdaterOpts } from '../internal.ts'

const rpc = signal<undefined|string|null>(undefined)

async function updateRpc({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.rpc !== null && tstate.rpc !== undefined) return 
    if (tstate.chainId === null) { tstate.rpc = null; return }
    if (tstate.chainId === undefined) return

    // get and parse
    const rpc = (await query({ id: tstate.chainId }))?.rpc?.[0] ?? null

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.rpc = rpc

}

export { rpc, updateRpc }