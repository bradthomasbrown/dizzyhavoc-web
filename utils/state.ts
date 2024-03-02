import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { signal } from '@preact/signals'
import * as schemas from '../schemas/mod.ts'
const foo = schemas.metamaskProvider.optional()

export const state = signal<{
    provider?:z.infer<typeof foo>,
    chainId?:bigint,
    addresses?:string[],
    height?:bigint
    balance?:bigint,
    dzhv?:{ address:string },
    dzhvBalance?:bigint
    nonce:bigint
}>({ nonce: 0n })