import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { rlb } from '../../../../llc/rlb/mod.ts'

export default async function <
    E extends { method:string, params?:P, schema:S },
    P extends readonly unknown[],
    S extends z.ZodTypeAny
>({ url, ejrrq: { method, params, schema }, rlbBypass }:{ url:string, ejrrq:E, rlbBypass?:boolean }) {
    const jrrq = { jsonrpc: '2.0', method, params: params ?? [] as const, id: 0 } as const
    const body = JSON.stringify(jrrq, (_, v) => typeof v == 'bigint' ? `0x${v.toString(16)}` : v)
    const headers = { 'Content-Type': 'application/json' } as const
    const init = { body, headers, method: 'POST' } as const
    const gate = Promise.withResolvers<Response>()
    let response
    if (rlbBypass) response = await fetch(url, init)
    else { rlb.push(() => fetch(url, init).then(response => gate.resolve(response))); response = await gate.promise }
    const json = await response.json()
    const { result, error } = await z.object({
        result: z.unknown(),
        error: z.object({ message: z.string() }).optional()
    }).parseAsync(json)
    if (error) throw new Error(error.message, { cause: JSON.stringify(json) })
    return schema.parseAsync(result) as z.infer<E['schema']>
}