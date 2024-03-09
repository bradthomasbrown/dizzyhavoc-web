import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { schemas } from "../internal.ts";

type InjectedProvider = z.infer<typeof schemas.injectedProvider>

export type { InjectedProvider }