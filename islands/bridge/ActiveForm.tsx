import { which as bridgeWhich } from "../../lib/bridge/which.ts";
import { which as providerWhich } from '../common/Connector.tsx'
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { BridgeForm } from "../../components/bridge/BridgeForm.tsx";

/**
 * For the bridge, this is either the provider picker, chain picker, or bridge form
 */
export function ActiveForm() {
  return providerWhich.value
    ?? bridgeWhich.value
    ?? (
      <>
        <ConnectionInfo />
        <BridgeForm />
      </>
    )
}
