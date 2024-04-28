import { Connector } from "islands/common/mod.ts";
import { state } from "lib/state.ts";
import { BridgeButton } from "islands/bridge/BridgeButton.tsx";

export function ActionButton() {
  if (!state.account.value) return <Connector />;
  else return <BridgeButton />;
}
