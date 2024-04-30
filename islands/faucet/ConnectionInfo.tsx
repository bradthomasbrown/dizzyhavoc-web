import { computed } from "@preact/signals";
import { Blockie } from "lib/Blockie.ts";
import { hexshort } from 'lib/hexshort.ts'
import { state } from 'lib/faucet/state.ts'

const defaultSeed = "0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c";

const seed = computed(() => state.account.value ?? defaultSeed)

const blockieData = computed(() => {
  return new Blockie({ scale: 16, seed: seed.value }).base64();
});

const hexshortSelected = computed(() => hexshort(state.account.value ?? ''))

const hidden = computed(() => {
  return !state.account.value || state.chainId.value === undefined
})

export function ConnectionInfo() {
  return (
    <div
      class={`
        absolute
        top-3 left-3 
        flex flex-row ${hidden.value ? 'hidden' : ''}
      `
    }>
      <img
        class="select-none size-[1.4rem] rounded-sm mr-1"
        src={blockieData}
        title={seed}
        alt="blockie image"
      />
      <div class="font-[14px] mb-2">
        {hexshortSelected}
      </div>
    </div>
  );
}
