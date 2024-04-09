import { Signal } from "@preact/signals";
import { Chain } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/types/chain.ts";
import { dzkv, toad } from "lib/mod.ts";
import { data } from "lib/bridge/mod.ts";
import { query } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/chainlist@0.0.5/lib/query.ts";
import { Lazy } from "https://deno.land/x/lazy_promise@0.0.1/mod.ts";
import { Snail } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.3/mod.ts";

type SubKey = readonly [...parts: unknown[]];
type SubState = { parts: unknown[] };
export type State = { subState: SubState; value: Chain };
export type MaybeState = null | State;
type StateSignal = Signal<MaybeState>;

function key(subKey: SubKey) {
  return ["chain", ...subKey];
}

function ensure(subKey: SubKey) {
  return dzkv.ensure<StateSignal>(key(subKey), new Signal(null));
}

export function get(subKey: SubKey) {
  ensure(subKey);
  return dzkv.get<StateSignal>(key(subKey))!;
}

function set(subKey: SubKey, state: State) {
  get(subKey).value = state;
}

type Nullable<T> = { [k in keyof T]: null | T[k] };
type GetValueArgs = {
  chainId: number;
  controller: AbortController;
};
const getValueArgs: Nullable<GetValueArgs> & { controller: AbortController } = {
  chainId: null,
  controller: new AbortController(),
};
export const chainMap = new Map<number, Chain>();

async function getValue(args: GetValueArgs) {
  const { chainId, controller } = args;
  const parts = ["from"];
  const subKey: SubKey = [...parts];
  const subState: SubState = { parts };

  if (controller.signal.aborted) return;

  if (!chainMap.has(chainId)) {
    const lazy: Lazy<Error | Chain> = async () => await query(chainId);
    const snail = new Snail({ lazy, signal: controller.signal });
    const chain = await toad.feed(snail);
    if (chain instanceof Error) return;
    chainMap.set(chainId, chain);
  }
  const value = chainMap.get(chainId)!;

  const state: State = { subState, value };
  set(subKey, state);
}

function onChainIdChange(state: data.chainId.MaybeState) {
  getValueArgs.controller.abort();
  getValueArgs.controller = new AbortController();
  getValueArgs.chainId = null;
  if (!state) return;
  const chainId = state.value;
  getValueArgs.chainId = chainId;
  if (Object.values(getValueArgs).includes(null)) return;
  getValue(getValueArgs as NonNullable<GetValueArgs>);
}

data.chainId.get(["from"]).subscribe(onChainIdChange);
