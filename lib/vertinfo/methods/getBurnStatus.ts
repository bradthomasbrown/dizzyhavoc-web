import * as jsonRpc from "../jsonRpc/mod.ts";
import { EconConf, JsonRpcRequest } from "../types/mod.ts";
import { kv } from "../kv.ts";
import * as error from "../errors/mod.ts";
import * as schemas from "../schemas/mod.ts";

export async function getBurnStatus(
  { id, params }: Pick<JsonRpcRequest, "id" | "params">,
) {
  const paramsParseResult = await schemas.api.getBurnStatusParam.parseAsync(
    params,
  ).catch((_) => new Error());
  if (paramsParseResult instanceof Error) return error.invalidParams(id);
  const { hash } = paramsParseResult;

  const kvem = await kv.get<EconConf>(["status", hash]);
  return jsonRpc.response({ result: kvem.value, id });
}
