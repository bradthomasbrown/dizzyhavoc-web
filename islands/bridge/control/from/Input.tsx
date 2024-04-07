import { Signal, effect } from "@preact/signals";
import { data, btos } from 'lib/bridge/mod.ts'
import { JSX } from "preact/jsx-runtime";

const control = data.control.from

const disp = new Signal<null|bigint>(null)

effect(() => {
  const addresses = data.addresses.get().value
  const address = addresses.at(0)
  const chain = data.chain.get(['from']).value
  if (!address || !chain) return
  const balance = data.balance.get(chain, address, ['dzhv']).f.value
  if (balance === null) return
  if (!(control.type.get().value == 'percent')) return
  disp.value = balance * BigInt(control.percent.get().value) / 100n
})

function onInput(e:JSX.TargetedEvent<HTMLInputElement>) {
  control.type.set('number')
  control.input.set(e.currentTarget.value)
}

// https://i.kym-cdn.com/entries/icons/facebook/000/026/008/Screen_Shot_2018-04-25_at_12.24.22_PM.jpg
function onKeyDown(e:JSX.TargetedKeyboardEvent<HTMLInputElement>) {
  if (e.code == 'KeyE') e.preventDefault()
}

export function Input() {
  return (
    <input
      type="number"
      class={`
        row-start-2 col-start-1 col-span-1
        w-48 h-12
        px-2
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        text-3xl
        font-mono
        bg-transparent
      `}
      placeholder="0"
      value={disp.value ? btos(disp.value, 18) : ''}
      onKeyDown={onKeyDown}
      onInput={onInput}
    />
  )
}