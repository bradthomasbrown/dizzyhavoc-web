import { effect } from "@preact/signals";
import { state } from "lib/state.ts";
import { btos } from "lib/bridge/btos.ts";

effect(() => {
  const econConf = state.econConf.value;
  const fromVal = state.from.input.bigint.value;
  if (!econConf || fromVal === undefined) return undefined;
  let toVal = fromVal - econConf.baseFee;
  if (toVal < 0n) toVal = 0n;
  state.to.input.bigint.value = toVal;
  state.to.input.string.value = btos(toVal, 18);
});

export function Input() {
  return (
    <div
      class={`
        row-start-1 col-start-1 row-span-1
        overflow-hidden overflow-ellipsis
        flex
      `}
      value={state.to.input.string.value}
    >
      <div
        class={`
          brightness-75
          contrast-75
          px-2
          bg-transparent
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          border
          ${state.loading.econConf}
          rounded-full
          text-3xl
          font-mono
        `}
      >
        {state.to.input.string.value ?? "0"}
      </div>
    </div>
  );
}
