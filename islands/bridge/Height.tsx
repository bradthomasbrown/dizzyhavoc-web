import { loading, state } from "lib/bridge/madness/dzkv.ts";

export function Height() {
  return (
    <div
      class={`
        select-none
        absolute bottom-1 right-1
        px-1
        rounded-full border
        text-sm
        font-mono
        ${loading('height')!.value}
      `}
    >
      {state<bigint>('height')!.value}
    </div>
  );
}
