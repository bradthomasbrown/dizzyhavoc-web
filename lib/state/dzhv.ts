import { signal } from '@preact/signals'
import { UpdaterOpts, e } from "../internal.ts";

const dzhv = signal<undefined|{ address:string }|null>(undefined)

async function updateDzhv({ tstate, signal }:UpdaterOpts) {
    
    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.dzhv) return
    if (tstate.height === null || tstate.rpc === null) { tstate.dzhv = null; return }
    if (tstate.height === undefined || tstate.rpc === undefined) return

    // get and parse
    const code = await e.code({
        address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe',
        tag: tstate.height
    }).call({ url: tstate.rpc, signal }).catch(() => null)
    const dzhv = code === null || code == '0x'
        ? null
        : { address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe' }

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    
    // commit
    tstate.dzhv = dzhv

}

export { dzhv, updateDzhv }