import { Button } from "../../components/common/Button.tsx";
import { drink } from "../../lib/faucet/drink.ts";
import { Connector, status } from "../common/Connector.tsx";

export function ActionButton() {
  if (status.value == "Connected") {
    return (
      <Button
      addClass="text-[#3d3d3d] dark:text-[#ccb286]"
      disabled={false}
      onClick={() => drink()}
      wiggle={false}
    >
      Get DZHV
    </Button>
    );
  } else return <Connector addClass="order-3" />;
}
