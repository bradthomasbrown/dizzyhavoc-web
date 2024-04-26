import { effect } from "@preact/signals";
import { getPrice } from "lib/bridge/madness/getters/getDexscreener.ts";
import { state } from "lib/state.ts";

effect(() => {
  const chainId = state.to.chainId.value
  const amount = state.to.input.string.value
  if (!chainId || amount === undefined) return
  const dollars = (getPrice(chainId) * Number(amount))
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  state.to.dollars.value = dollars
})

export function Dollars() {
  return (
    <div
      class={`
      row-start-2 col-start-1 row-span-1
      px-2
      flex items-center
      font-mono
      brightness-75
      text-sm
    `}
    >
      <div
        class={`
          border ${state.loading.dexscreener.value}
          px-1
          rounded-full
        `}
      >
        {state.to.dollars.value ?? '$0.00'}
      </div>
    </div>
  );
}
