import { signal } from '@preact/signals'
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { UpdaterOpts } from "../internal.ts";

const addresses = signal<undefined|string[]|null>(undefined)

async function updateAddresses({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.addresses !== null && tstate.addresses !== undefined) return 
    if (tstate.provider === null) { tstate.addresses = null; return }
    if (tstate.provider ===  undefined) return

    // get and parse
    const addresses = await tstate.provider.request({ method: 'eth_accounts', params: [] })
        .then(z.string().array().parseAsync).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // commit
    tstate.addresses = addresses

}

async function requestAddresses({ tstate, signal }:UpdaterOpts) {

    // pre-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // logic
    if (tstate.addresses !== null && tstate.addresses !== undefined) return 
    if (tstate.provider === null) { tstate.addresses = null; return }
    if (tstate.provider ===  undefined) return

    // get and parse
    const addresses = await tstate.provider.request({ method: 'eth_requestAccounts', params: [] })
        .then(z.string().array().parseAsync).catch(() => null)

    // post-check
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    
    // commit
    tstate.addresses = addresses
}

export { addresses, updateAddresses, requestAddresses }