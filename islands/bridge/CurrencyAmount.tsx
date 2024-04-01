import { CurrencyAmountInput } from "../../components/bridge/CurrencyAmountInput.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { chosenChains } from "../../lib/bridge/chosenChains.ts";
import { pickChain as onClick } from "../../lib/bridge/pickChain.tsx";
import { chainAbrv } from "../../lib/chainAbrv.ts";
import { extVortex } from "../../lib/bridge/extVortex/extVortex.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { computed, Signal } from "@preact/signals";
import { chainToPrice } from "../../lib/bridge/chainToPrice.ts";
import { amounts } from "./CurrencyPair.tsx";

chosenChains.subscribe(() => extVortex.flow("priceCheck"));

export function CurrencyAmount(
  { type: id, label, addClass }: {
    type: string;
    label?: string;
    addClass?: string;
  },
) {
  const usdDisplayValue = computed<undefined | string>(() => {
    if (!IS_BROWSER) return undefined;
    const chain = chosenChains.value[id];
    const dsData = extVortex.uState.dexscreener.value;
    if (!chain || !dsData) return undefined;
    const price = chainToPrice(chain, dsData);
    if (!price) return undefined;
    const amount = amounts.value[id] ?? 0;
    if (amount === undefined) return undefined;
    return (price * amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  });
  const chainId = chosenChains.value[id]?.chainId;
  return (
    <div class={`grid grid-rows-[auto,1fr] grid-cols-2 ${addClass}`}>
      <div>{label}</div>
      <div class="text-right">{id}</div>
      <div class="flex col-span-2">
        <CurrencyAmountInput {...{ id }} />
        <FhChainPicker {...{ chosenChains, id, onClick }} />
      </div>
      <div>{usdDisplayValue.value ?? <>&nbsp;</>}</div>
      <div class="text-right">{chainAbrv(chainId)}</div>
    </div>
  );
}
