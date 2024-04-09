import { effect, Signal } from "@preact/signals";
import { btos, data, stob } from "lib/bridge/mod.ts";
import { JSX } from "preact/jsx-runtime";
import * as slip from "islands/bridge/control/from/Slip.tsx";
import * as percents from "islands/bridge/control/from/Percents.tsx";

// const control = data.control.from

// const disp = new Signal<null|bigint>(null)

// effect(() => {
//   const addresses = data.addresses.get().value
//   const address = addresses.at(0)
//   const chain = data.chain.get(['from']).value
//   if (!address || !chain) return
//   const balance = data.balance.get(chain, address, ['dzhv']).f.value
//   if (balance === null) return
//   if (control.type.get().value == 'percent') {
//     const input = balance * BigInt(control.percent.get().value) / 100n
//     disp.value = input
//     control.input.set(input)
//   }
//   if (control.type.get().value == 'input') {
//     const input = control.input.get().value
//     if (input === null) return
//     disp.value = input
//   }
// })

function onInput(e: JSX.TargetedEvent<HTMLInputElement>) {
  // slip.signal.value = 0
  // percents.deactivate()
  // const input = stob(e.currentTarget.value, 18)
  // control.input.set(input)
  // disp.value = input
}

// https://i.kym-cdn.com/entries/icons/facebook/000/026/008/Screen_Shot_2018-04-25_at_12.24.22_PM.jpg
function onKeyDown(e: JSX.TargetedKeyboardEvent<HTMLInputElement>) {
  if (e.code == "KeyE") e.preventDefault();
}

const display = new Signal("");
export const Input = Object.assign(
  function () {
    return (
      <input
        type="number"
        class={`
          row-start-2 col-start-1 col-span-1
          w-32 h-10
          px-2
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          text-xl
          font-mono
          bg-transparent
        `}
        placeholder="0"
        value={display}
        onKeyDown={onKeyDown}
        onInput={onInput}
      />
    );
  },
);
