import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect } from "preact/hooks";
import { useState } from "preact/hooks";
import { computed, Signal } from "@preact/signals";
import {
  Connector, /*addresses, , rpc, provider*/
  hexshort,
} from "../../lib/internal.ts";
import { Button } from "../../components/common/Button.tsx";
import { Balance } from "../../islands/common/Balance.tsx";
import { Blockie } from "../../lib/blockies/Blockie.ts";
import { ejra } from "../../lib/faucet/ejra.ts";
import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";
import { status } from "../../islands/common/Connector.tsx";
import { getIcon } from "../../lib/chains/icons.ts";
import { chain } from "../../lib/schemas/chain.ts";

const disabled = computed(() => status.value != "Connected");

async function drink() {
  const addresses = evmVortex.uState.addresses.value;
  const rpc = evmVortex.uState.rpc.value;
  const p1193 = evmVortex.uState.p1193.value;
  const chain = evmVortex.uState.chain.value;

  if (!addresses || addresses instanceof Error) {
    alert("no selected address");
    return;
  }
  if (!rpc || rpc instanceof Error) {
    alert("no rpc");
    return;
  }
  if (!p1193 || p1193 instanceof Error) {
    alert("no provider");
    return;
  }

  const result = await ejra.call(rpc, {
    to: "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe",
    input: "0x762ebebc",
  }, "latest");
  if (result instanceof Error) {
    alert(result);
    return;
  }
  const [divider, fee] =
    result.slice(2).match(/.{64}/g)?.map((s) => BigInt(`0x${s}`)) ?? [];
  if (!divider || !fee) {
    alert(
      `could not find faucet on chain ${chain}, make sure you are connected to a valid testnet (Sepolia ETH/BASE/ARB, tBSC, AVAX Fuji)`,
    );
    return;
  }

  const from = addresses[0];
  const to = "0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe";
  const value = `0x${fee.toString(16)}`;
  const data = "0x1a9bbe59";

  const tx = { from, to, value, data };

  await p1193.request({ method: "eth_sendTransaction", params: [tx] });
}

export function FaucetForm() {
  const defaultSeed = "0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c";
  const seed = computed(() => {
    const addresses = evmVortex.uState.addresses.value;
    return !addresses || addresses instanceof Error
      ? defaultSeed
      : addresses[0];
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

  return (
    <>
      {status.value != "Connected" ? <Connector /> : (
        <>
          {/* chain icon */}
          <div class="absolute top-2 left-2">
            <picture>
              <source
                srcset={getIcon(
                  Number(evmVortex.uState.chain.value),
                ).dark}
                media="(prefers-color-scheme: dark)"
              />
              <img
                title={"chain id: " +
                  String(evmVortex.uState.chain.value)}
                draggable={false}
                class="w-7 h-7"
                src={getIcon(Number(evmVortex.uState.chain.value))
                  .light}
              />
            </picture>
          </div>

          {/* blockie */}
          <img
            class="size-[2.2rem] rounded-sm mb-1"
            src={blockieData}
            title={seed}
            alt="blockie image"
          />

          {/* hexshort */}
          <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-sm mb-2">
            {hexshortSelected}
          </div>

          {/* balance */}
          <Balance />

          {/* faucet button */}
          <Button
            addClass="text-[#3d3d3d] dark:text-[#ccb286]"
            disabled={disabled.value}
            onClick={disabled.value ? () => {} : drink}
          >
            Get DZHV
          </Button>
        </>
      )}
    </>
  );
}
