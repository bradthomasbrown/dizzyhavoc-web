// inspiration from fabianhortiguela's chain selector button

import { Signal, computed } from "@preact/signals";
import { chosenChains } from "../../lib/bridge/chosenChains.ts";
import { JSX } from "preact/jsx-runtime";
import { chainSrc } from "../../lib/chainSrc.ts";
import { Blockie } from "../../lib/blockies/Blockie.ts";
import { pickChain } from '../../lib/bridge/pickChain.tsx'
import { extVortex } from "../../lib/bridge/extVortex/extVortex.ts";
import { RefObject, createRef } from "preact";

export function FhChainPicker(
  props:
    & JSX.DOMAttributes<HTMLDivElement>
    & { id: "from"|"to"; },
) {
  const down = new Signal<boolean>(false)
  const over = new Signal<boolean>(false)
  return (
    <div
      onClick={() => { extVortex.flow('chainsCheck'); pickChain(props.id) }}
      class="sm:w-[calc(4rem*1.02)] sm:h-[calc(4rem*1.02)] w-[calc(2rem*1.02)] h-[calc(2rem*1.02)] rounded-full cursor-pointer"
      onPointerDown={() => down.value = true}
      onPointerOver={() => over.value = true}
      onPointerUp={() => down.value = false}
      onPointerOut={() => down.value = over.value = false}
    >
      <FhChainPickerInternal id={props.id} over={over} down={down}/>
    </div>
  );
}

function FhChainPickerInternal(props:{ id: 'from'|'to', over:Signal<boolean>, down:Signal<boolean> }) {
  const scale = computed(() => {
    if (props.down.value) return 'scale-[98%]'
    if (props.over.value) return 'scale-[102%]'
    return ''
  })
  const chain = chosenChains.get(props.id)!.value
  return(
    <div class={`sm:w-16 sm:h-16 w-8 h-8 border-2 flex justify-center items-center rounded-full ${props.down.value ? 'border-[#ccb286]' : 'border-[#282828] dark:border-[#d2d2d2]'} sm:p-3 p-1 ${scale.value}`}>
      {chain
        ? (
          <picture title={chain.name}>
            <source
              srcset={chainSrc(chain.chainId).dsrc ?? chainSrc(chain.chainId).src ?? Blockie.randB64()}
              media="(prefers-color-scheme: dark)"
            />{" "}
            <img
              draggable={false}
              class="select-none w-full h-full"
              src={chainSrc(chain.chainId).src ?? Blockie.randB64()}
            />
          </picture>
        )
        : (
          <svg
            class="w-full h-full text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>{props.id}</title>
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
            />
          </svg>
        )
      }
    </div>
  )
}