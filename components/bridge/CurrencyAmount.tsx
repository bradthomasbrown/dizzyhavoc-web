import { CurrencyAmountInput } from "./CurrencyAmountInput.tsx";
import { FhChainPicker } from "../../islands/common/FhChainPicker.tsx";
import { chosenChains } from "../../lib/bridge/chosenChains.ts";
import { pickChain as onClick } from "../../lib/bridge/pickChain.tsx";
import { chainAbrv } from "../../lib/chainAbrv.ts";

export function CurrencyAmount(
  { type: id, label }: { type: string; label?: string },
) {
  const chainId = chosenChains.value[id]?.chainId;
  return (
    <div class="grid grid-rows-[auto,1fr] grid-cols-2">
      <div>{label}</div>
      <div class="text-right">{id}</div>
      <div class="flex col-span-2">
        <CurrencyAmountInput />
        <FhChainPicker {...{ chosenChains, id, onClick }} />
      </div>
      <div>$0.00</div>
      <div class="text-right">{chainAbrv(chainId)}</div>
    </div>
  );
}
