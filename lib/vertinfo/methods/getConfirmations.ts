import * as jra from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/jra@0.0.6/mod.ts'
import { EconConf } from "lib/vertinfo/types/mod.ts";
import { kv } from "lib/vertinfo/kv.ts";
import * as error from "lib/vertinfo/errors/mod.ts";
import * as schemas from "../schema/mod.ts";

export async function getConfirmations(
  { id, params }: Pick<jra.types.RequestO, "id" | "params">,
) {
  const paramsParseResult = await schemas.api.chainIdOnlyParam.parseAsync(
    params,
  )
    .catch((_) => new Error());
  if (paramsParseResult instanceof Error) return error.invalidParams(id);
  const { chainId } = paramsParseResult;

  const kvem = await kv.get<EconConf>(["confirmations", chainId]);
  return jra.respond({ result: kvem.value, id });
}
