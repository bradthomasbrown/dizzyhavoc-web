import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

export const metamaskProvider = z.object({
    isMetaMask: z.literal(true),
    request: z.function().args(z.object({ method: z.string(), params: z.unknown().array().or(z.object({})) })).returns(z.string().array().promise()),
    on: z.function(),
    selectedAddress: z.string().nullable()
})