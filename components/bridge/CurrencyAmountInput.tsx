import { amounts } from '../../islands/bridge/CurrencyPair.tsx'
import { JSX } from "preact/jsx-runtime";

export function CurrencyAmountInput(props:{ id:string }) {

  function onInput(e:JSX.TargetedEvent<HTMLInputElement>) {
    amounts.value = { ...amounts.value, [props.id]: Number(e.currentTarget.value) }
  }

  return (
    <input
      disabled={props.id == 'to' ? true : false}
      value={amounts.value[props.id]}
      onInput={onInput}
      autoComplete="off"
      type="number" // this handles most validation for us
      placeholder="0"
      class={`
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        w-100
        font-mono
        text-[32px]
        bg-transparent
        px-2
        mr-2
        max-w-[200px]
      `}
    />
  );
}
