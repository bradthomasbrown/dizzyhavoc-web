import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

type T = Signal<null|string>;

export function key() {
  return ["number"];
}

export function ensure() {
  dzkv.ensure<T>(key(), new Signal(null));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
};

export function set(number:string) {
  get().value = number;
};