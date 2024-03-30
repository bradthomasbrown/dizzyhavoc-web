import { computed } from "@preact/signals";
import { Blockie } from "../../lib/blockies/Blockie.ts";
import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";
import { hexshort } from "../../lib/internal.ts";

const defaultSeed = "0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c";
const seed = computed(() => {
  const addresses = evmVortex.uState.addresses.value;
  return !addresses || addresses instanceof Error ? defaultSeed : addresses[0];
});
const blockieData = computed(() => {
  return new Blockie({ scale: 16, seed: seed.value }).base64();
});

const hexshortSelected = computed(() => {
  const addresses = evmVortex.uState.addresses.value;
  const zeroAddress = "0x".padEnd(42, "0");
  return hexshort(
    !addresses || addresses instanceof Error ? zeroAddress : addresses[0],
  );
});

export function ConnectionInfo() {
  return (
    <div class="absolute top-3 left-3 flex flex-row">
      <img
        class="size-[1.4rem] rounded-sm mr-1"
        src={blockieData}
        title={seed}
        alt="blockie image"
      />
      <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-[14px] mb-2">
        {hexshortSelected}
      </div>
    </div>
  );
}
