import { Signal } from "@preact/signals";
import { dzkv } from "lib/mod.ts";

type T = Signal<null|'percent'|'number'>;

export function key() {
  return ["lastInputType"];
}

export function ensure() {
  dzkv.ensure<T>(key(), new Signal(null));
}

export function get() {
  ensure();
  return dzkv.get<T>(key())!;
};

export function set(type:'percent'|'number') {
  get().value = type;
};