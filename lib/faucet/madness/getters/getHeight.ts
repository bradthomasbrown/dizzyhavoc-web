import { ejra } from "lib/faucet/madness/ejra/ejra.ts";
import { goNext, restart, robinController } from "lib/faucet/madness/robin.ts";
import { state } from "lib/faucet/state.ts";

export async function getHeight() {
  // get signal, if aborted return
  const { signal } = robinController.value;
  if (signal.aborted) return;

  // get requirement, if missing, go next
  const rpc = state.rpc.value;
  if (!rpc) return goNext();

  // 🐌
  const snail = ejra.height(rpc, signal);
  await snail.born;
  if (signal.aborted) return;
  state.loading.height.value = "loading-[#80ffff2b]";
  const height = await snail.died.catch((r: Error) => r);
  if (signal.aborted) return;
  if (!signal.aborted) state.loading.height.value = "unload-[]";

  // handle result
  if (height instanceof Error) return restart();

  if ((state.lastHeight.value ?? -Infinity) > height) return restart();

  // if known block, restart, unless a height-dependent is loading
  if (
    (state.lastHeight.value ?? -Infinity) >= height &&
    state.loading.dzhvBalance.value == "unload-[]" &&
    state.loading.dzhvCode.value == "unload-[]"
  ) return restart();

  // set height in heightMap so we can know if height is new
  state.lastHeight.value = height;

  // if we don't have code, amberload code
  if (!state.codeMap.get(state.chainId.value!)) {
    state.loading.dzhvCode.value = "loading-[#ffbf0060]";
  }

  // if we have an account, amberload dzhv balance
  if (state.account.value) {
    state.loading.dzhvBalance.value = "loading-[#ffbf0060]";
  }

  // update state and goNext
  state.height.value = height;
  return goNext();
}
