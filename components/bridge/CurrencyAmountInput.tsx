import { Web3Input } from "../../islands/common/Web3Input.tsx";
import { amounts } from "../../lib/bridge/amounts.ts";

export function CurrencyAmountInput(
  { id, disabled }: { id: string; disabled?: boolean },
) {
  return (
    <Web3Input
      maxVal={10n ** 9n * 10n ** 18n}
      decimals={18n}
      {...{ amounts, id, disabled }}
    />
  );
}
