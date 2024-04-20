import { loading, state } from "lib/bridge/madness/dzkv.ts";

export function Height() {
  return state<bigint>('height')?.value !== undefined
    ? (
      <div
        class={`
          select-none
          absolute bottom-1 right-1
          px-1
          text-sm
          font-mono
          border ${loading('height')!.value}
          rounded-full
        `}
      >
        {state<bigint>('height')!.value}
      </div>
    )
    : (
        <div
          class={`
            absolute bottom-1 right-1
            text-sm font-mono
            flex
            w-full
            border border-transparent
          `}
        >
          ​
          <div class="w-full flex flex-row-reverse">
            <img 
              src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAA"
              class={`
                aspect-square h-full
                border ${loading('height')!.value}
                rounded-full
              `}
            />
          </div>
        </div>
    );
}
