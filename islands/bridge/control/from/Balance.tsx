import { state } from "lib/state.ts";
import { btos } from "lib/bridge/btos.ts";

export function Balance() {
  return (
    <div
      class={`
        row-start-1 col-start-1 col-span-2 h-6
        flex items-center
        font-mono
        brightness-75
      `}
    >
      <div
        class={`
          max-w-full
          flex items-center
          px-2
          rounded-full border
          ${state.loading.from.dzhvBalance.value}
        `}
      >
        <div class="mr-1 text-xs">Balance:</div>
        <div class="overflow-hidden overflow-ellipsis">
          {btos(state.from.dzhvBalance.value ?? 0n, 18)}
        </div>
        <div class="ml-2 select-none text-xs">DZHV</div>
      </div>
    </div>
  );
}
