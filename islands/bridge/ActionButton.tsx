import { Connector } from "islands/common/mod.ts";
import { data } from "lib/bridge/mod.ts";

export function ActionButton() {
  if (!data.addresses.get().value?.value.length) return <Connector />;
  else return <></>;
}
