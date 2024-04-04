import { batch, Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

type Web3InputPropsBase = {
  decimals: bigint;
  maxVal: undefined | Error | bigint;
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
  if (
    amount_ !== undefined && !(maxVal instanceof Error) &&
    maxVal !== undefined && maxVal !== 0n
  ) {
    initialNumberValue = amount_ > maxVal
      ? String(maxVal / 10n ** decimals)
      : String(amount_ / 10n ** decimals);
  }
  if (amount_ !== undefined && amount_ % 10n ** decimals) {
    initialNumberValue += `.${amount_ % 10n ** decimals}`.replace(/0*$/, "");
  }
  const numberValue = new Signal(initialNumberValue);

  let initialRangeValue = "0";
  if (
    amount_ !== undefined && !(maxVal instanceof Error) &&
    maxVal !== undefined && maxVal !== 0n
  ) {
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
      if (maxVal instanceof Error || maxVal === undefined || maxVal === 0n) {
        return;
      }
      rangeValue.value = String(value * 100n / maxVal);
    });
  }

  function onRangeInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    if (maxVal instanceof Error || maxVal === undefined) return;
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

  function setPercent(value: string) {
    onRangeInput({ currentTarget: { value } });
  }
  const PercentInput = disabled
    ? <></>
    : (
      <div class="flex items-end justify-end w-full mx-auto ml-2 mt-2 gap-[15px] flex-row">
        <div
          class="cursor-pointer active:scale-95 text-[10px] font-medium font-[Poppins] px-1 unselectable dark:text-white text-black border border-t-transparent dark:border-t-transparent border-s-transparent dark:border-s-transparent border-1 dark:border-[#939393] border-[#4c4c4c] rounded-sm"
          onClick={() => {
            setPercent("25");
          }}
        >
          25%
        </div>
        <div
          class="cursor-pointer active:scale-95 text-[10px] font-medium font-[Poppins] px-1 unselectable dark:text-white text-black border border-t-transparent dark:border-t-transparent border-s-transparent dark:border-s-transparent border-1 dark:border-[#939393] border-[#4c4c4c] rounded-sm"
          onClick={() => {
            setPercent("50");
          }}
        >
          50%
        </div>
        <div
          class="cursor-pointer active:scale-95 text-[10px] font-medium font-[Poppins] px-1 unselectable dark:text-white text-black border border-t-transparent dark:border-t-transparent border-s-transparent dark:border-s-transparent border-1 dark:border-[#939393] border-[#4c4c4c] rounded-sm"
          onClick={() => {
            setPercent("75");
          }}
        >
          75%
        </div>
        <div
          class="cursor-pointer active:scale-95 text-[10px] font-medium font-[Poppins] px-1 unselectable dark:text-white text-black border border-t-transparent dark:border-t-transparent border-s-transparent dark:border-s-transparent border-1 dark:border-[#939393] border-[#4c4c4c] rounded-sm"
          onClick={() => {
            setPercent("100");
          }}
        >
          100%
        </div>
      </div>
    );
  const RangeInput = disabled ? <></> : (
    <>
      <input
        draggable={false}
        id="range"
        type="range"
        class="dark:accent-[#EAEAEA] h-1 rounded-lg accent-[#2c2c2c]"
        value={rangeValue.value}
        onInput={onRangeInput}
      />
      {PercentInput}
    </>
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
