import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

type T = Signal<number>;

export function key() {
  return ["percent"];
}

export function ensure() {
  dzkv.ensure<T>(key(), new Signal(0));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
}

export function set(percent: number) {
  get().value = percent;
}
