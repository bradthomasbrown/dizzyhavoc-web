import { signal } from '@preact/signals'
import { UpdaterOpts, e } from "../internal.ts";

const height = signal<undefined|bigint|null>(undefined)

async function updateHeight({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.height !== null && tstate.height !== undefined) return 
    if (tstate.rpc === null) { tstate.height = null; return }
    if (tstate.rpc === undefined) return

    // get and parse
    const height = await e.height().call({ url: tstate.rpc }).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.height = height

}

export { height, updateHeight }