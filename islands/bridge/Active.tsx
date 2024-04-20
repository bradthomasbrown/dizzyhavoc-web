import { loading } from "lib/bridge/madness/dzkv.ts";
import "lib/dzkvInit.ts"

export function Active() {
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
            border ${loading('active')!.value}
            rounded-full
          `}
        />
      </div>
    </div>
  )
}
