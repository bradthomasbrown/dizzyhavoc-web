import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { signal } from '@preact/signals'
import { schemas, DAppState } from '../internal.ts'

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum: z.infer<typeof schemas.metamaskProvider> | undefined
}, gwe = globalWithEthereum

const provider = signal<undefined|z.infer<typeof schemas.metamaskProvider>|null>(undefined)

function updateProvider(state:DAppState) {
    // only assign once
    if (state.provider) return
    // if ethereum is not part of the globalThis, there's no injected provider
    state.provider = gwe.ethereum ?? null
}

export { provider, updateProvider }