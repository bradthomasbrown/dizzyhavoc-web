import { Button } from "components/common/Button.tsx";
import { drink } from "lib/faucet/drink.ts";

export function FaucetButton() {
  return <Button onClick={drink}>Get DZHV</Button>
}