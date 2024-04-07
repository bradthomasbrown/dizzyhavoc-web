import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

type T = Signal<string[]>;

export function key() {
  return ["addresses"];
}

export function ensure() {
  dzkv.ensure<T>(key(), new Signal([]));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
};

export function set(addresses:string[]) {
  get().value = addresses;
};