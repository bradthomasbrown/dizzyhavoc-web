import { signal } from '@preact/signals'
import { InjectedProvider, DAppState } from '../internal.ts'

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum?: InjectedProvider
}, gwe = globalWithEthereum

const provider = signal<undefined|InjectedProvider|null>(undefined)

async function updateProvider(state:DAppState) {
    // only assign once
    if (state.provider) return
    // if ethereum is not part of the globalThis
    // there's no injected provider
    await Promise.resolve(state.provider = gwe.ethereum ?? null)
}

export { provider, updateProvider }