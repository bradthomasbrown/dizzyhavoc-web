import { Signal, effect } from '@preact/signals'
import { state } from "lib/state.ts";
import { JSX } from "preact/jsx-runtime";

export const hidden = new Signal(true)

effect(() => {
  const slippage = state.slippage.value
  const percent = slippage / 100
  let big = BigInt(Math.floor((2 ** 64 - 1) * percent))
  if (big > 2n ** 64n - 1n) big = 2n ** 64n - 1n
  state.slippage64.value = big
})

function onInput(e: JSX.TargetedEvent<HTMLInputElement>) {
  if (Number(e.currentTarget.value) > 100) e.currentTarget.value = '100'
  if (Number(e.currentTarget.value) < 0) e.currentTarget.value = '0'
  state.slippage.value = Number(e.currentTarget.value)
}

function onKeyDown(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) {
  if (e.code == "KeyE") e.preventDefault();
}

export function SettingsMenu() {
  return (
    <div
      class={`
        ${hidden.value ? 'hidden' : ''}
        absolute
        top-full right-0
        flex gap-1
        bg-[#ededed] dark:bg-[#191919]
        shadow-xl rounded-xl
        p-2
      `}
    >
      <div class="text-sm">Slippage</div>
      <input
        type="number"
        class={`
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          bg-transparent
          font-mono
          text-sm
          px-1
          w-12
        `}
        onInput={onInput}
        onKeyDown={onKeyDown}
        value={state.slippage.value}
      />
      <div>%</div>
    </div>
  )
}