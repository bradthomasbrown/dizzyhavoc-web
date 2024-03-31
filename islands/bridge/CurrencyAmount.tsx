import { CurrencyAmountInput } from "../../components/bridge/CurrencyAmountInput.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { chosenChains } from "../../lib/bridge/chosenChains.ts";
import { pickChain as onClick } from "../../lib/bridge/pickChain.tsx";
import { chainAbrv } from "../../lib/chainAbrv.ts";

const usdDisplayValue = '$0.01'

export function CurrencyAmount(
  { type: id, label, addClass }: { type: string; label?: string, addClass?:string },
) {
  const chainId = chosenChains.value[id]?.chainId;
  return (
    <div class={`grid grid-rows-[auto,1fr] grid-cols-2 ${addClass}`}>
      <div>{label}</div>
      <div class="text-right">{id}</div>
      <div class="flex col-span-2">
        <CurrencyAmountInput />
        <FhChainPicker {...{ chosenChains, id, onClick }} />
      </div>
      <div>{usdDisplayValue}</div>
      <div class="text-right">{chainAbrv(chainId)}</div>
    </div>
  );
}
