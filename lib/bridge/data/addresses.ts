import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

export type State = { value: string[] };
export type MaybeState = null | State;
type StateSignal = Signal<MaybeState>;

function key() {
  return ["addresses"];
}

function ensure() {
  return dzkv.ensure<StateSignal>(key(), new Signal(null));
}

export function get() {
  ensure();
  return dzkv.get<StateSignal>(key())!;
}

export function set(state: State) {
  get().value = state;
}
