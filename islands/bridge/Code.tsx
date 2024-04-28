import { state } from "lib/state.ts";

export function Code() {
  return (
    <div
      class={`
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
            border ${state.loading.from.dzhvCode.value}
            rounded-full
          `}
        />
      </div>
    </div>
  );
}
