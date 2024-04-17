import { loading, state } from "lib/bridge/madness/dzkv.ts";

export function Balance() {
  return (
    <div
      class={`
        row-start-1 col-start-1 col-span-2 w-48 h-6
        flex items-center
        font-mono
        brightness-75
      `}
    >
      <div
        class={`
        flex items-center
        max-w-48
        px-2
        rounded-full border
        ${loading('dzhvBalance')!.value}
      `}
      >
        <div class="mr-1 text-xs">Balance:</div>
        <div class="overflow-hidden overflow-ellipsis">
          {state<bigint>('dzhvBalance')!.value ?? 0}
        </div>
        <div class="ml-2 select-none text-xs">DZHV</div>
      </div>
    </div>
  );
}