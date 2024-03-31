import { which } from '../../lib/bridge/which.ts'
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { BridgeForm } from '../../components/bridge/BridgeForm.tsx'

/**
 * For the bridge, this is either the provider picker, chain picker, or bridge form
 */
export function ActiveForm() {
  if (which.value) return which
  return (
    <>
      <ConnectionInfo/>
      <BridgeForm/>
    </>
  )
}