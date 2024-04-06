// // import { batch, Signal } from "@preact/signals";
// // import { JSX } from "preact/jsx-runtime";

// // type Web3InputPropsBase = {
// //   decimals: bigint;
// //   maxVal: undefined| Error | bigint;
// //   disabled?: boolean;
// // };

// // type Web3InputPropsWithAmount = Web3InputPropsBase & {
// //   amount: Signal<undefined | bigint>;
// //   amounts?: never;
// //   id?: never;
// // };

// // type Web3InputPropsWithAmounts = Web3InputPropsBase & {
// //   amounts: Map<string, Signal<undefined | bigint>>;
// //   id: string;
// //   amount?: never;
// // };

// // type Web3InputProps = Web3InputPropsWithAmount | Web3InputPropsWithAmounts;

// // export function Web3Input(
// //   { maxVal, decimals, amount, amounts, id, disabled }: Web3InputProps,
// // ) {
// //   const amount_ = amount?.value ?? amounts?.get(id)?.value;

// //   let initialNumberValue = "";
// //   if (amount_ !== undefined && !(maxVal instanceof Error) && maxVal !== undefined && maxVal !== 0n) {
// //     initialNumberValue = amount_ > maxVal
// //       ? String(maxVal / 10n ** decimals)
// //       : String(amount_ / 10n ** decimals);
// //   }
// //   console.log({ amount_, initialNumberValue })
// //   if (amount_ !== undefined) initialNumberValue = String(amount_ / 10n ** decimals)
// //   console.log({ amount_, initialNumberValue })
// //   if (amount_ !== undefined && amount_ % 10n ** decimals) {
// //     initialNumberValue += `.${String(amount_ % 10n ** decimals).padStart(Number(decimals), '0')}`.replace(/0*$/, "");
// //   }
// //   console.log({ amount_, initialNumberValue })
// //   if (amount_) console.log({ d: amount_ / 10n ** decimals })
// //   const numberValue = new Signal(initialNumberValue);
// //   numberValue.subscribe(console.log)

// //   let initialRangeValue = "0";
// //   if (amount_ !== undefined && !(maxVal instanceof Error) && maxVal !== undefined && maxVal !== 0n) {
// //     initialRangeValue = String(amount_ * 100n / maxVal);
// //   }
// //   const rangeValue = new Signal(initialRangeValue);

// //   function onNumberInput(e: JSX.TargetedEvent<HTMLInputElement>) {
// //     let tmp = String(Number(e.currentTarget.value));
// //     if (!tmp.match(/^\d*\.?\d*$/)) return;
// //     const index = tmp.match(/\./)?.index ?? tmp.length - 1;
// //     const fracs = tmp.length - 1 - index;
// //     const zeros = Array(Math.max(Number(decimals) - fracs, 0)).fill("0").join(
// //       "",
// //     );
// //     if (fracs > decimals) tmp = tmp.slice(0, Number(decimals) - fracs);
// //     tmp = tmp.replace(/\./, "");
// //     const value = BigInt(`${tmp}${zeros}`);
// //     batch(() => {
// //       numberValue.value = e.currentTarget.value
// //       if (amount) amount.value = value;
// //       if (amounts) amounts.get(id)!.value = value;
// //       if (maxVal instanceof Error || maxVal === undefined || maxVal === 0n) return
// //       rangeValue.value = String(value * 100n / maxVal);
// //     });
// //   }

// //   function onRangeInput(e: JSX.TargetedEvent<HTMLInputElement>) {
// //     if (maxVal instanceof Error || maxVal === undefined) return;
// //     let tmp = String(amount_ ?? 0n).padStart(Number(decimals), "0");
// //     if (tmp.length == Number(decimals)) tmp = `0.${tmp}`;
// //     else {tmp = `${tmp.slice(0, tmp.length - Number(decimals))}.${
// //         tmp.slice(tmp.length - Number(decimals))
// //       }`;}
// //     tmp = tmp.replace(/\.?0*$/, "");
// //     const value = BigInt(e.currentTarget.value) * maxVal / 100n;
// //     batch(() => {
// //       if (amount) amount.value = value;
// //       if (amounts) amounts.get(id)!.value = value;
// //       numberValue.value = tmp;
// //     });
// //   }

// //   const RangeInput = disabled ? <></> : (
// //     <input
// //       type="range"
// //       class="dark:accent-[#EAEAEA] accent-[#2c2c2c]"
// //       value={rangeValue.value}
// //       onInput={onRangeInput}
// //     />
// //   );
// //   return (
// //     <div class="flex flex-col mr-4">
// //       <input
// //         type="number"
// //         class="max-w-[200px] px-2 text-[32px] font-[monospace] bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
// //         {...{ disabled }}
// //         value={numberValue}
// //         onInput={e => { console.log(e); onNumberInput(e) }}
// //         placeholder="0"
// //       />
// //       {RangeInput}
// //     </div>
// //   );
// // }
// import { Signal } from "@preact/signals";
// import { RangeSlider } from "./RangeSlider.tsx";
// import { dzkv } from '../../../lib/bridge/dzkv.ts'
// import { NumberInput } from "./NumberInput.tsx";

// type Web3InputProps = {
//   decimals: bigint;
//   maxVal: Signal<Error|undefined|bigint>;
//   disabled?: boolean;
//   amounts: Map<string, Signal<undefined | bigint>>;
//   id: 'from'|'to';
// };

// type Rvs = Signal<undefined|string>
// type Lits = Signal<undefined|'range'|'number'>

// export function Web3Input(
//   { maxVal, decimals, amounts, id, disabled }:Web3InputProps,
// ) {
//   let rs
//   if (disabled) rs = <></>
//   else {
//     const rvk = ['input', id, 'rv']
//     const litk = ['input', id, 'lit']
//     if (!dzkv.get(rvk)) dzkv.set<Rvs>(rvk, new Signal(undefined))
//     if (!dzkv.get(litk)) dzkv.set<Lits>(litk, new Signal(undefined))
//     const rvs = dzkv.get<Rvs>(rvk)!
//     const lits = dzkv.get<Lits>(litk)!
//     rvs.subscribe(x => console.log(rvk, x))
//     lits.subscribe(x => console.log(litk, x))
//     rs = <RangeSlider {...{ rvs, lits, id }}/>
//   }
//   return (
//     <div class="flex flex-col mr-4">
//       <NumberInput {...{ lits, disabled }}/>
//       {rs}
//     </div>
//   )
// }
