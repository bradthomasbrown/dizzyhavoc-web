import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

export type SubKey = readonly [...parts: unknown[]];
export type SubState = { parts: unknown[] };
export type State = { subState: SubState; value: number };
export type MaybeState = null | State;
type StateSignal = Signal<MaybeState>;

export function key(subKey: SubKey) {
  return ["chainId", ...subKey];
}

function ensure(subKey: SubKey) {
  return dzkv.ensure<StateSignal>(key(subKey), new Signal(null));
}

export function get(subKey: SubKey) {
  ensure(subKey);
  return dzkv.get<StateSignal>(key(subKey))!;
}

export function set(subKey: SubKey, state: State) {
  get(subKey).value = state;
}
