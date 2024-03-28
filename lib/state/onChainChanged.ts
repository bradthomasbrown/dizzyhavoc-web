import {
  commitTState,
  createTState,
  poll,
  updateBalance,
  updateChainId,
  updateDzhv,
  updateDzhvBalance,
  updateHeight,
  updateRpc,
  updateTState,
} from "../internal.ts";

export async function onChainChanged() {
  console.log("CHAIN");
  const { tState, abortController, updaters } = createTState([
    "balance",
    "chainId",
    "dzhv",
    "dzhvBalance",
    "height",
    "rpc",
  ]);
  await updateTState({
    tState,
    updaters: [
      updateBalance,
      updateChainId,
      updateDzhv,
      updateDzhvBalance,
      updateHeight,
      updateRpc,
      ...updaters,
    ],
    abortController,
  }).catch((reason) => {
    console.error(reason);
    return;
  });
  if (abortController.signal.aborted) return;
  await commitTState(tState);
  poll();
}
