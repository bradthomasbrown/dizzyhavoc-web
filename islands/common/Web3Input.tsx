// import { IS_BROWSER } from "$fresh/runtime.ts";
import { batch, Signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime";
import { number } from "https://deno.land/x/zod@v3.22.4/types.ts";

type Web3InputPropsBase = {
  decimals: bigint;
  maxVal: Error | bigint;
  disabled?: boolean;
};

type Web3InputPropsWithAmount = Web3InputPropsBase & {
  amount: Signal<undefined | bigint>;
  amounts?: never;
  id?: never;
};

type Web3InputPropsWithAmounts = Web3InputPropsBase & {
  amounts: Map<string, Signal<undefined | bigint>>;
  id: string;
  amount?: never;
};

type Web3InputProps = Web3InputPropsWithAmount | Web3InputPropsWithAmounts;

export function Web3Input(
  { maxVal, decimals, amount, amounts, id, disabled }: Web3InputProps,
) {
  const amount_ = amount?.value ?? amounts?.get(id)?.value;

  let initialNumberValue = "";
  if (amount_ !== undefined) {
    initialNumberValue = String(amount_ / 10n ** decimals);
  }
  if (amount_ !== undefined && amount_ % 10n ** decimals) {
    initialNumberValue += `.${amount_ % 10n ** decimals}`.replace(/0*$/, "");
  }
  const numberValue = new Signal(initialNumberValue);

  let initialRangeValue = "0";
  if (amount_ !== undefined && !(maxVal instanceof Error)) {
    initialRangeValue = String(amount_ * 100n / maxVal);
  }
  const rangeValue = new Signal(initialRangeValue);

  function onNumberInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    let tmp = String(Number(e.currentTarget.value));
    if (!tmp.match(/^\d*\.?\d*$/)) return;
    const index = tmp.match(/\./)?.index ?? tmp.length - 1;
    const fracs = tmp.length - 1 - index;
    const zeros = Array(Math.max(Number(decimals) - fracs, 0)).fill("0").join(
      "",
    );
    if (fracs > decimals) tmp = tmp.slice(0, Number(decimals) - fracs);
    tmp = tmp.replace(/\./, "");
    const value = BigInt(`${tmp}${zeros}`);
    batch(() => {
      if (amount) amount.value = value;
      if (amounts) amounts.get(id)!.value = value;
      if (!(maxVal instanceof Error)) {
        rangeValue.value = String(value * 100n / maxVal);
      }
    });
  }

  function onRangeInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    if (maxVal instanceof Error) return;
    let tmp = String(amount_ ?? 0n).padStart(Number(decimals), "0");
    if (tmp.length == Number(decimals)) tmp = `0.${tmp}`;
    else {tmp = `${tmp.slice(0, tmp.length - Number(decimals))}.${
        tmp.slice(tmp.length - Number(decimals))
      }`;}
    tmp = tmp.replace(/\.?0*$/, "");
    const value = BigInt(e.currentTarget.value) * maxVal / 100n;
    batch(() => {
      if (amount) amount.value = value;
      if (amounts) amounts.get(id)!.value = value;
      numberValue.value = tmp;
    });
  }

  const RangeInput = disabled ? <></> : (
    <input
      type="range"
      class="dark:accent-[#EAEAEA] accent-[#2c2c2c]"
      value={rangeValue.value}
      onInput={onRangeInput}
    />
  );
  return (
    <div class="flex flex-col mr-4">
      <input
        type="number"
        class="max-w-[200px] px-2 text-[32px] font-[monospace] bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        {...{ disabled }}
        value={numberValue}
        onInput={onNumberInput}
        placeholder="0"
      />
      {RangeInput}
    </div>
  );
}
