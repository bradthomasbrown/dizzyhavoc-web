import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { signal } from '@preact/signals'
import { UpdaterOpts, e } from "../internal.ts";

const dzhvBalance = signal<undefined|bigint|null>(undefined)

async function updateDzhvBalance({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.dzhvBalance !== null && tstate.dzhvBalance !== undefined) return
    if (tstate.addresses === null || tstate.dzhv === null || tstate.height === null || tstate.rpc === null) { tstate.dzhvBalance = null; return }
    if (tstate.addresses === undefined || tstate.dzhv === undefined || tstate.height === undefined || tstate.rpc === undefined) return
    const address = tstate.addresses[0]
    if (!address) { tstate.dzhvBalance = null; return }

    // get and parse
    const dzhvBalance = await e.call({
        tx: {
            input: `0x70a08231${address.substring(2).padStart(64, '0')}`,
            to: tstate.dzhv.address
        },
        tag: tstate.height
    }).call({ url: tstate.rpc, signal }).then(z.string().transform(BigInt).parseAsync).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.dzhvBalance = dzhvBalance

}

export { dzhvBalance, updateDzhvBalance }