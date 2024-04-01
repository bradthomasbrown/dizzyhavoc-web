import { CurrencyAmountInput } from "../../components/bridge/CurrencyAmountInput.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { chosenChains } from "../../lib/bridge/chosenChains.ts";
import { pickChain as onClick } from "../../lib/bridge/pickChain.tsx";
import { chainAbrv } from "../../lib/chainAbrv.ts";
import { extVortex } from "../../lib/bridge/extVortex/extVortex.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { computed, Signal } from "@preact/signals";
import { chainToPrice } from "../../lib/bridge/chainToPrice.ts";
import { amounts } from "../../components/bridge/CurrencyPair.tsx";

chosenChains.subscribe(() => extVortex.flow("priceCheck"));

export function CurrencyAmount(
  { id, label, disabled, order }: {
    id: string;
    label?: string;
    order?: string;
    disabled?: boolean
  },
) {

  const usdDisplayValue = computed<undefined | string>(() => {
    if (!IS_BROWSER) return undefined;
    const chain = chosenChains.value[id];
    const dsData = extVortex.uState.dexscreener.value;
    if (!chain || !dsData) return undefined;
    const price = chainToPrice(chain, dsData);
    if (!price) return undefined;
    const amount = amounts.value.get(id) ?? 0n;
    if (amount === undefined) return undefined;
    return (price * parseFloat(String(amount)) / 1e18).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  });

  const chainId = chosenChains.value[id]?.chainId;

  return (
    <div class={`grid grid-rows-[auto,1fr] grid-cols-2 ${order}`}>
      <div class="brightness-90">{label}</div>
      <div class="text-right brightness-90">{id}</div>
      <div class="flex col-span-2">
        <CurrencyAmountInput {...{ id, disabled }} />
        <FhChainPicker {...{ chosenChains, id, onClick }} />
      </div>
      <div class="font-mono text-sm font-thin brightness-75">{usdDisplayValue.value ?? <>&nbsp;</>}</div>
      <div class="text-right font-mono text-sm font-thin brightness-75">{chainAbrv(chainId)}</div>
    </div>
  );

}
