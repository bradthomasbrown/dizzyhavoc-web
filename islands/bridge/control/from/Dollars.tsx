import { effect } from "@preact/signals";
import { state } from "lib/state.ts"
import { getPrice } from "lib/bridge/madness/getters/getDexscreener.ts";

effect(() => {
  const chainId = state.from.chainId.value
  const amount = state.from.input.string.value
  if (!chainId || amount === undefined) return
  const dollars = (getPrice(chainId) * Number(amount))
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  state.from.dollars.value = dollars
})

export function Dollars() {
  return (
    <div
      class={`
      row-start-3 col-start-1 col-span-1
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
        {state.from.dollars.value ?? '$0.00'}
      </div>
    </div>
  );
}
