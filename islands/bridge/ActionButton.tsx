import { Signal } from "@preact/signals";
import { Connector } from "islands/common/mod.ts";
import { dzkv } from "lib/mod.ts";

export function ActionButton() {
  const key = ["p6963", "addresses"];
  if (!dzkv.get<Signal<string[]>>(key)?.value?.length) return <Connector />;
  else return <></>;
}
