import { Button } from "../../components/common/Button.tsx";
import { bridge } from "../../lib/utils/bridge.ts";
import { Connector, status } from "../common/Connector.tsx";

export function ActionButton() {

  if (status.value == 'Connected') {
    return <Button
      addClass="relative text-[#3d3d3d] dark:text-[#ccb286] z-10"
      disabled={false}
      onClick={() => bridge()}
      rounding="rounded-b-lg"
      wiggle={false}
    >
      Bridge
    </Button>
  }

  return <Connector/>
  
}