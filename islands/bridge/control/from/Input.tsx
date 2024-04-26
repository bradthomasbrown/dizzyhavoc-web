import { effect, Signal } from "@preact/signals";
import { btos, stob } from "lib/bridge/mod.ts";
import { JSX } from "preact/jsx-runtime";
import { state } from "lib/state.ts"

effect(() => {
  const type = state.from.input.type.value
  if (type == 'number' || !type) return
  const balance = state.from.dzhvBalance.value
  const percent = state.from.input.percent.value
  if (balance === undefined || percent === undefined) return
  const amount = balance * BigInt(percent) / 100n
  state.from.input.bigint.value = amount
  state.from.input.string.value = btos(amount, 18)
})

function onInput(e: JSX.TargetedEvent<HTMLInputElement>) {
  state.from.input.slip.value = false
  state.from.input.type.value = 'number'
  state.from.input.string.value = e.currentTarget.value
  state.from.input.bigint.value = stob(e.currentTarget.value, 18)
}

// https://i.kym-cdn.com/entries/icons/facebook/000/026/008/Screen_Shot_2018-04-25_at_12.24.22_PM.jpg
function onKeyDown(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) {
  if (e.code == "KeyE") e.preventDefault();
}


export function Input() {
  return (
    <input
      type="number"
      class={`
        row-start-2 col-start-1 col-span-2
        px-2
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        text-3xl
        font-mono
        bg-transparent
        overflow-hidden overflow-ellipsis
      `}
      placeholder="0"
      value={state.from.input.string.value}
      onKeyDown={onKeyDown}
      onInput={onInput}
    />
  );
}
