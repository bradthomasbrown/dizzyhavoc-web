import { signal } from '@preact/signals'
import { InjectedProvider, UpdaterOpts } from '../internal.ts'

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum?: InjectedProvider
}, gwe = globalWithEthereum

const provider = signal<undefined|InjectedProvider|null>(undefined)

async function updateProvider({ tstate, signal }:UpdaterOpts) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    if (tstate.provider) return
    tstate.provider = gwe.ethereum ?? null
    await Promise.resolve()
}

export { provider, updateProvider }