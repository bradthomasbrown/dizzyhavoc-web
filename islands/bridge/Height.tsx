import { state } from "lib/state.ts";

export function Height() {
  const height = state.from.height.value;
  return height !== undefined
    ? (
      <div
        class={`
          select-none
          absolute bottom-1 right-1
          px-1
          text-sm
          font-mono
          border ${state.loading.from.height.value}
          rounded-full
        `}
      >
        {height}
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
                border ${state.loading.from.height.value}
                rounded-full
              `}
          />
        </div>
      </div>
    );
}
