import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import * as schemas from '../schemas/mod.ts'

export type Log = z.infer<typeof schemas.log>