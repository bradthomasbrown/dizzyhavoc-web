import { Signal, effect } from "@preact/signals";
import { data, state } from "lib/bridge/mod.ts";

const loading = new Signal("")

const dispHeight = new Signal("0")

effect(() => {
  const chain = data.chain.get(['from']).value
  if (!chain) return
  const height = data.height.get(chain).f.value
  if (height === null) return
  dispHeight.value = String(height)
})

effect(() => {
  const chain = data.chain.get(['from']).value
  if (!chain) return
  const a = data.height.get(chain)
  loading.value = state.loading(a).value ? 'loading' : ''
})

export function Height() {
  return (
    <div
      class={`
        select-none
        absolute bottom-1 right-1
        border border-transparent
        px-1
        rounded-xl
        text-sm
        font-mono
        ${loading.value}
      `} 
    >
      {dispHeight}
    </div>
  )
}