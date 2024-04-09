import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

type T = Signal<null | bigint>;

export function key() {
  return ["input"];
}

export function ensure() {
  dzkv.ensure<T>(key(), new Signal(null));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
}

export function set(value: bigint) {
  get().value = value;
}
