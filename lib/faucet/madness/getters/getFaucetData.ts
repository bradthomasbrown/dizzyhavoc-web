import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { dzhv } from "lib/faucet/madness/dzhv.ts";
import { ejra } from "lib/faucet/madness/ejra/ejra.ts";
import { goNext, robinController } from "lib/faucet/madness/robin.ts";
import { TxCallObject } from "lib/faucet/madness/ejra/types/TxCallObject.ts";
import { state } from "lib/faucet/state.ts";

const faucetDataSchema = z.string()
  .length(2 + 64 * 2)
  .transform(s => s.slice(2).match(/.{64}/g)!.map(w => BigInt(`0x${w}`)))
  .transform(x => z.tuple([z.bigint(), z.bigint()]).parse(x))

export type FaucetData = z.infer<typeof faucetDataSchema>

export async function getFaucetData() {
  // get signal, if aborted return
  const { signal } = robinController.value;
  if (signal.aborted) return;

  // get requirement from state
  const rpc = state.rpc.value;
  const account = state.account.value;
  const height = state.height.value;
  const code = state.dzhvCode.value;
  if (
    !rpc ||
    !account ||
    height === undefined ||
    !code || code == "0x"
  ) return goNext();

  // 🐌
  const to = dzhv.address;
  const input = `0x762ebebc`;
  const txCallObject: TxCallObject = { to, input };
  const snail = ejra.call(rpc, txCallObject, height, signal);
  await snail.born;
  if (signal.aborted) return;
  state.loading.faucetData.value = "loading-[#80ffff2b]";
  const faucetData = await snail.died.then(faucetDataSchema.parse).catch((r: Error) => r);
  if (signal.aborted) return;
  if (!signal.aborted) state.loading.faucetData.value = "unload-[]";

  // handle result
  if (faucetData instanceof Error) return goNext();
  state.faucetData.value = faucetData;
  return goNext();
}
