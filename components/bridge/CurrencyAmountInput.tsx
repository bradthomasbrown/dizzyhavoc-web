import { Web3Input } from "../../islands/common/Web3Input.tsx";
import { amounts } from "./CurrencyPair.tsx";

export function CurrencyAmountInput({ id, disabled }: { id: string, disabled?: boolean }) {
  return (
    <Web3Input
      maxVal={10n ** 9n * 10n ** 18n}
      decimals={18n}
      {...{ amounts, id, disabled }}
      // amounts={amounts}
      // id={props.id}
      // decimals={18n}
      // disabled={props.id == "to" ? true : false}
      // autoComplete="off"
      // type="number" // this handles most validation for us
      // placeholder="0"
      // class={`
      //   [&::-webkit-outer-spin-button]:appearance-none
      //   [&::-webkit-inner-spin-button]:appearance-none
      //   w-100
      //   font-mono
      //   text-[32px]
      //   bg-transparent
      //   px-2
      //   mr-2
      //   max-w-[200px]`}
    />
  );
}
