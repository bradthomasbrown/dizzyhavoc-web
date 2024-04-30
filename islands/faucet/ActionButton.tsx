import { Connector } from "islands/faucet/Connector.tsx";
import { state } from "lib/faucet/state.ts";
import { FaucetButton } from "islands/faucet/FaucetButton.tsx";

export function ActionButton() {
  if (!state.account.value) return <Connector />;
  else return <FaucetButton />;
}
