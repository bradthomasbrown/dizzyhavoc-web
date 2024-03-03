import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { signal } from '@preact/signals'
import * as schemas from '../schemas/mod.ts'
const foo = schemas.metamaskProvider.optional()

export const state = signal<DAppState>({
    provider: undefined,
    chainId: undefined,
    addresses: undefined,
    height: undefined,
    balance: undefined,
    dzhv: undefined,
    dzhvBalance: undefined,
    rpc: undefined,
    nonce: undefined
})