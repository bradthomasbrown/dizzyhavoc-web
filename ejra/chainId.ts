import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import ejrc from './ejrc.ts'

export default function () {
    const schema = z.string().transform(str => BigInt(str))
    const method = 'eth_chainId' as const
    const ejrrq = { method, schema }
    return { ejrrq, call: ({ url, rlbBypass }:{ url:string, rlbBypass?:boolean }) => ejrc({ url, ejrrq, rlbBypass }) }
}