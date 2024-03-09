import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

export const injectedProvider = z.object({
    isMetaMask: z.literal(true).optional(),
    request: z.function().args(z.object({ method: z.string(), params: z.unknown().array().or(z.object({})) })).returns(z.unknown().promise()),
    on: z.function(),
    selectedAddress: z.string().nullable()
})