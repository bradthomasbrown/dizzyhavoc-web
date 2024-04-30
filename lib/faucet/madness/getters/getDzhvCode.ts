import { dzhv } from "lib/faucet/madness/dzhv.ts";
import { ejra } from "lib/faucet/madness/ejra/ejra.ts";
import { goNext, robinController } from "lib/faucet/madness/robin.ts";
import { state } from "lib/faucet/state.ts";

export async function getDzhvCode() {
  // get signal, if aborted return
  const { signal } = robinController.value;
  if (signal.aborted) return;

  // if we have code already, go next (make sure to remove loading)
  if (state.codeMap.get(state.chainId.value!)) {
    state.loading.dzhvCode.value = "unload-[]";
    return goNext();
  }

  // get requirement from state
  const rpc = state.rpc.value;
  const height = state.height.value;
  if (!rpc || height === undefined) return goNext();

  // 🐌
  const snail = ejra.code(rpc, dzhv.address, height, signal);
  await snail.born;
  if (signal.aborted) return;
  state.loading.dzhvCode.value = "loading-[#80ffff2b]";
  const code = await snail.died.catch((r: Error) => r);
  if (signal.aborted) return;
  if (!signal.aborted) state.loading.dzhvCode.value = "unload-[]";

  // handle result
  if (code instanceof Error) return goNext();
  if (code && code != "0x") state.codeMap.set(state.chainId.value!, true);
  state.dzhvCode.value = code;
  return goNext();
}
