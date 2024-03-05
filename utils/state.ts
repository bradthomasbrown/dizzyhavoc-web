import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { signal } from '@preact/signals'
import * as schemas from '../schemas/mod.ts'
const foo = schemas.metamaskProvider.optional()

type DAppState = {
    provider:undefined|z.infer<typeof foo>|null,
    chainId:undefined|bigint|null,
    addresses:undefined|string[]|null,
    height:undefined|bigint|null
    balance:undefined|bigint|null,
    dzhv:undefined|{ address:string }|null,
    dzhvBalance:undefined|bigint|null,
    rpc:undefined|string|null
    nonce:undefined|bigint|null
}

const state = signal<DAppState>({
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

export { state }
export type { DAppState }