// import { which as bridgeWhich } from "../../lib/bridge/which.ts"; // maybe add a pick chain button and prompt to switch here as well?
import { which as providerWhich } from "../common/Connector.tsx";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { FaucetForm } from "../../components/faucet/FaucetForm.tsx";

/**
 * For the bridge, this is either the provider picker, chain picker, or bridge form
 */
export function ActiveForm() {
  return providerWhich.value ??
    (
      <>
        <ConnectionInfo />
        <FaucetForm />
      </>
    );
}
