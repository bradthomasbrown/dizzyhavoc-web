import { Button } from "../../components/common/Button.tsx";
import { bridge } from "../../lib/bridge/bridge.ts";
import { Connector, status } from "../common/Connector.tsx";

export function ActionButton() {
  if (status.value == "Connected") {
    return (
      <Button
        addClass="text-[#3d3d3d] dark:text-[#ccb286] order-3"
        disabled={false}
        onClick={() => bridge()}
        rounding="rounded-lg"
        wiggle={false}
      >
        Bridge
      </Button>
    );
  } else return <Connector addClass="order-3" />;
}
