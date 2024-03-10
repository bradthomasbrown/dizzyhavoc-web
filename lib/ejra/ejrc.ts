import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { rlb } from 'https://deno.land/x/rlb@0.0.0/mod.ts'

export default async function<
    E extends { method:string, params?:P, schema:S },
    P extends readonly unknown[],
    S extends z.ZodTypeAny
>({
    url,
    ejrrq: { method, params, schema },
    rlbBypass,
    signal
}:{
    url:string,
    ejrrq:E,
    rlbBypass?:boolean,
    signal?:AbortSignal
}) {

    // pre-check signal
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    // build init
    const jrrq = { jsonrpc: '2.0', method, params: params ?? [] as const, id: 0 } as const
    const body = JSON.stringify(jrrq, (_, v) => typeof v == 'bigint' ? `0x${v.toString(16)}` : v)
    const headers = { 'Content-Type': 'application/json' } as const
    const init:RequestInit = { body, headers, method: 'POST', signal } as const

    // get response
    const gate = Promise.withResolvers<Response>()
    let response
    if (rlbBypass) response = await fetch(url, init)
    else {
        const promiser = () => fetch(url, init)
            .then(response => gate.resolve(response))
            .catch(reason => gate.reject(reason))
        rlb.push(promiser)
        response = await gate.promise
    }

    // convert response to json
    const json = await response.json()

    // convert response to json rpc api response object
    const { result, error } = await z.object({
        result: z.unknown(),
        error: z.object({ message: z.string() }).optional()
    }).parseAsync(json)
    if (error) throw new Error(error.message, { cause: JSON.stringify(json) })

    // try to parse result from given schema
    return schema.parseAsync(result) as z.infer<E['schema']>

}