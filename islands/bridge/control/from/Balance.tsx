import { effect, Signal } from "@preact/signals";
import { data, state, btos } from "lib/bridge/mod.ts";

const loading = new Signal("");

const dispBalance = new Signal(btos(0n, 18))

effect(() => {
  const addresses = data.addresses.get().value
  const address = addresses?.at(0)
  const chain = data.chain.get(['from']).value
  if (!chain || !address) return
  const balance = data.balance.get(chain, address, ['dzhv']).f.value
  if (balance === null) return
  dispBalance.value = btos(balance, 18)
})

effect(() => {
  const addresses = data.addresses.get().value
  const address = addresses?.at(0)
  const chain = data.chain.get(['from']).value
  if (!chain || !address) return
  const a = data.balance.get(chain, address, ['dzhv'])
  loading.value = state.loading(a).value ? 'loading' : ''
})

export function Balance() {

  return (
    <div class={`
      row-start-1 col-start-1 col-span-2 w-64 h-8
      p-2
      flex items-center
      font-mono
      brightness-75
      rounded-full border border-transparent
      ${loading.value}
    `}>
      <div class="inline-block mr-1 text-xs">Balance:</div>
      <div class="inline-block overflow-hidden overflow-ellipsis">{dispBalance}</div>
      <div class="inline-block ml-2 select-none text-xs">DZHV</div>
    </div>
  );
}
