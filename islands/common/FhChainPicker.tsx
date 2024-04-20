// // inspiration from fabianhortiguela's chain selector button

import { Signal, computed, signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { chainSrc } from "lib/chainSrc.ts";
import { Blockie } from "lib/Blockie.ts";
import { Chain } from "lib/bridge/madness/query/types/Chain.ts";
import { dzkv } from "lib/dzkv.ts";
import { Which } from "islands/common/mod.ts";
import { Choice } from "lib/Choice.ts";
import { onChainIdChanged } from "lib/bridge/madness/eventHandlers/onChainIdChange.ts";
import { robinController, robinFns, robinIndex } from "lib/bridge/madness/robin.ts";
import { state } from "lib/bridge/madness/dzkv.ts";
import { chainMap } from "lib/bridge/madness/getters/getChain.ts";
import { query } from "lib/bridge/madness/query/query.ts";
import { chain } from "lib/bridge/madness/query/schema/chain.ts";
import { toad } from "lib/mod.ts";

const controller = { value: new AbortController() }

async function getActiveChains () {

  // get signal
  const { signal } = controller.value

  // get active from state, if none, return
  const active = state<number[]>('active')!.value
  if (!active) return

  // add chains in chainMap to activeChains
  for (const chain of chainMap.values()) {
    if (activeChains.value.has(chain)) continue
    activeChains.value = new Set([...activeChains.value, chain])
  }

  // iterate through chainIds
  for (const chainId of active) {
    // if chain not in chainMap, populate it 🐌
    if (!chainMap.has(chainId)) {
      const snail = query(toad, chainId, signal)
      await snail.born
      const chain = await snail.died.catch((e:Error) => e)
      if (chain instanceof Error) {
        if (signal.aborted) return; else continue
      }
      // set then add to activeChains
      chainMap.set(chainId, chain)
      activeChains.value = new Set([...activeChains.value, chain])
    }
  }

}

const activeChains:Signal<Set<Chain>> = new Signal(new Set())

function onPick(c:Chain) {
  onChainIdChanged(c.chainId)
  dzkv.get<Signal<null | JSX.Element>>(["which"])!.value = null;
}

function onCancel() {
  if (!state('chain')?.value) return
  robinController.value = new AbortController()
  robinIndex.value = 0
  setTimeout(robinFns[robinIndex.value])
}

function chainToChoice(c:Chain):Choice<Chain> {
  return { id: c.name, ...chainSrc(c.chainId), value: c }
}

function onClick(title:string) {
  robinController.value.abort()
  controller.value.abort()
  controller.value = new AbortController()
  getActiveChains()
  const choices = computed(() => [...activeChains.value].map(chainToChoice))
  console.log(choices)
  const which = <Which {...{ title, choices, onPick, onCancel }} />
  dzkv.get<Signal<null | JSX.Element>>(["which"])!.value = which;
}

export function FhChainPicker(
  props:
    & JSX.DOMAttributes<HTMLDivElement>
    & { dzkvKey: unknown[], title:string },
) {
  const down = new Signal<boolean>(false)
  const over = new Signal<boolean>(false)
  return (
    <div
      onClick={() => onClick(props.title)}
      class="p-1 w-[calc(100%*1.02)] h-[calc(100%*1.02)] rounded-full cursor-pointer"
      onPointerDown={() => down.value = true}
      onPointerOver={() => over.value = true}
      onPointerUp={() => down.value = false}
      onPointerOut={() => down.value = over.value = false}
    >
      <FhChainPickerInternal dzkvKey={props.dzkvKey} title={props.title} over={over} down={down}/>
    </div>
  );
}

function FhChainPickerInternal(props:{ dzkvKey: unknown[], title:string, over:Signal<boolean>, down:Signal<boolean> }) {
  const scale = computed(() => {
    if (props.down.value) return 'scale-[98%]'
    if (props.over.value) return 'scale-[102%]'
    return ''
  })
  if (!dzkv.get(props.dzkvKey)) dzkv.set(props.dzkvKey, new Signal())
  const chain = dzkv.get<Signal<undefined|Chain>>(props.dzkvKey)!.value
  return(
    <div class={`border flex justify-center items-center rounded-full ${/*props.down.value ? 'border-[#ccb286]' : */'border-[#282828] dark:border-[#EAEAEA80]'} ${scale.value} p-2`}>
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
