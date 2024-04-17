import { Connector } from "islands/common/mod.ts";
import { state } from "lib/bridge/madness/dzkv.ts";

export function ActionButton() {
  if (!state<string>('account')!.value) return <Connector />;
  else return <></>;
}
