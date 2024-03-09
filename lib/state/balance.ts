import { signal } from '@preact/signals'
import { UpdaterOpts, e } from "../internal.ts";

const balance = signal<undefined|bigint|null>(undefined)

async function updateBalance({ tstate, signal }:UpdaterOpts) {
    
    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.balance !== null && tstate.balance !== undefined) return 
    if (tstate.rpc === null || tstate.height === null || tstate.addresses === null) { tstate.balance = null; return }
    if (tstate.rpc === undefined || tstate.height === undefined || tstate.addresses === undefined) return
    if (!tstate.addresses[0]) { tstate.balance = null; return }

    // get
    const balance = await e.balance({
        address: tstate.addresses[0],
        tag: tstate.height
    }).call({ url: tstate.rpc, signal }).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.balance = balance

}

export { balance, updateBalance }