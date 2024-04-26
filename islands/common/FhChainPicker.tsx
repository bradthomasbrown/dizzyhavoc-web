// inspiration from fabianhortiguela's chain selector button
import { Signal, computed } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { chainSrc } from "lib/chainSrc.ts";
import { Blockie } from "lib/Blockie.ts";
import { Which } from "islands/common/mod.ts";
import { Choice } from "lib/Choice.ts";
import {
  onChainIdFromChanged,
  onChainIdToChanged
} from "lib/bridge/madness/eventHandlers/mod.ts";
import { state } from "lib/state.ts";
import { chainAbrv } from "lib/chainAbrv.ts";

function onPick(chainIdSignal:Signal<undefined|number>, chainId:number) {
  if (chainIdSignal === state.from.chainId) onChainIdFromChanged(chainId)
  else onChainIdToChanged(chainId)
  state.which.value = null
}

function chainIdToChoice(chainId:number):Choice<number> {
  const id = chainAbrv(chainId)
  const value = chainId
  const space = JSON.stringify({ id, value })
  return { id, ...chainSrc(chainId), value, space }
}

function onClick(title:string, chainIdSignal:Signal<undefined|number>) {
  const active = state.active.value
  const choices = computed(() => active.map(chainIdToChoice))
  state.which.value = <Which {...{ title, choices }} onPick={c => onPick(chainIdSignal, c)} />
}

export function FhChainPicker(
  props:
    & JSX.DOMAttributes<HTMLDivElement>
    & { chainIdSignal: Signal<undefined|number>, title:string },
) {
  const down = new Signal<boolean>(false)
  const over = new Signal<boolean>(false)
  return (
    <div
      onClick={() => onClick(props.title, props.chainIdSignal)}
      class="p-1 w-[calc(100%*1.02)] h-[calc(100%*1.02)] rounded-full cursor-pointer"
      onPointerDown={() => down.value = true}
      onPointerOver={() => over.value = true}
      onPointerUp={() => down.value = false}
      onPointerOut={() => down.value = over.value = false}
    >
      <FhChainPickerInternal chainIdSignal={props.chainIdSignal} title={props.title} over={over} down={down}/>
    </div>
  );
}

function FhChainPickerInternal(props:{ chainIdSignal: Signal<undefined|number>, title:string, over:Signal<boolean>, down:Signal<boolean> }) {
  const scale = computed(() => {
    if (props.down.value) return 'scale-[98%]'
    if (props.over.value) return 'scale-[102%]'
    return ''
  })
  return(
    <div class={`w-full h-full border flex justify-center items-center rounded-full ${/*props.down.value ? 'border-[#ccb286]' : */'border-[#282828] dark:border-[#EAEAEA80]'} ${scale.value} p-2`}>
      {props.chainIdSignal.value
        ? (
          <picture class="w-full h-full" title={chainAbrv(props.chainIdSignal.value)}>
            <source
              srcset={chainSrc(props.chainIdSignal.value).dsrc ?? chainSrc(props.chainIdSignal.value).src ?? Blockie.randB64()}
              media="(prefers-color-scheme: dark)"
            />{" "}
            <img
              draggable={false}
              class="select-none w-full h-full"
              src={chainSrc(props.chainIdSignal.value).src ?? Blockie.randB64()}
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
            <title>{props.title}</title>
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
