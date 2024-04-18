import { effect, Signal } from "@preact/signals";
import { btos, stob } from "lib/bridge/mod.ts";
import { JSX } from "preact/jsx-runtime";
import * as slip from "islands/bridge/control/from/Slip.tsx";
import * as percents from "islands/bridge/control/from/Percents.tsx";
import { dzkv } from "lib/dzkv.ts";
import { state } from "lib/bridge/madness/dzkv.ts";

if (!state<bigint>('dzhvBalance'))
  dzkv.set(['state', 'dzhvBalance'], new Signal())

if(!dzkv.get<Signal<number>>(['control', 'from', 'percentValue']))
  dzkv.set(['control', 'from', 'percentValue'], new Signal(0))

if(!dzkv.get<Signal<string>>(['control', 'from', 'numberValue']))
  dzkv.set(['control', 'from', 'numberValue'], new Signal(''))

if(!dzkv.get<Signal<string>>(['control', 'from', 'inputType']))
  dzkv.set(['control', 'from', 'inputType'], new Signal('number'))

const disp = new Signal<null|string>(null)

effect(() => {
  const percent = dzkv.get<Signal<number>>(['control', 'from', 'percentValue'])!.value
  const number = dzkv.get<Signal<string>>(['control', 'from', 'numberValue'])!.value
  const balance = state<bigint>('dzhvBalance')!.value
  const type = dzkv.get<string>(['control', 'from', 'inputType']);
  if (balance === undefined) return
  if (type == 'percent') disp.value = btos(balance * BigInt(percent) / 100n, 18)
  if (type == 'number') disp.value = number
})

function onInput(e: JSX.TargetedEvent<HTMLInputElement>) {
  slip.signal.value = 0
  percents.deactivate()
  const input = stob(e.currentTarget.value, 18)
  dzkv.get<Signal<string>>(['control', 'from', 'inputType'])!.value = 'number';
  disp.value = btos(input, 18)
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
      value={disp.value ?? ''}
      onKeyDown={onKeyDown}
      onInput={onInput}
    />
  );
}
