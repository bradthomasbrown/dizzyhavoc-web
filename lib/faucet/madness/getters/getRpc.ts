import { state } from "lib/faucet/state.ts";

export const rpcMap = new Map<string, number>();

export function getRpc() {
  // get requirement from state
  const chain = state.chain.value;
  if (!chain) throw new Error("missing requirement");

  // get rpc
  const rpc = chain.rpc.at(0);
  state.loading.rpc.value = "unload-[]";

  // throw if no rpc
  if (!rpc) throw new Error("no rpc");
  state.rpc.value = rpc;
}
