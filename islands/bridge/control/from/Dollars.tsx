import { data } from "lib/bridge/mod.ts";

export function Dollars() {
  return (
    <div
      class={`
      row-start-3 col-start-1 col-span-1
      w-32 h-6
      flex items-center
      font-mono
      brightness-75
      text-sm
      
    `}
    >
      <div
        class={`
          rounded-full border border-transparent
          ${data.dollars.get("from").l}
        `}
      >
        {data.dollars.get("from").f}
      </div>
    </div>
  );
}
