import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import * as schemas from '../schema/mod.ts'

export type Chain = z.infer<typeof schemas['chain']>