import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { computed, Signal } from "@preact/signals";
import { Blockie } from "../../lib/blockies/Blockie.ts";
import { Connector, status } from "../common/Connector.tsx";
import { vortex } from "../../lib/faucet/vortex.ts";
import { Button } from "../../components/common/Button.tsx";
import { hexshort } from "../../lib/utils/hexshort.ts";
import { getIcon } from "../../lib/chains/icons.ts";
import { bridgeable } from "../../lib/chains/bridgeable.ts";
import { Chain } from "../../lib/types/Chain.ts";
import { JSX } from "preact/jsx-runtime";
// import { IS_BROWSER } from '$fresh/runtime.ts'
// import { useEffect } from 'preact/hooks'
// import { useState } from 'preact/hooks'
// import { useSignal } from "@preact/signals"

// import { ejra } from '../../lib/faucet/ejra.ts'

const disabled = computed(() => status.value != "Connected");

async function bridge() {
  //     const addresses = vortex.uState.addresses.value
  //     const rpc = vortex.uState.rpc.value
  //     const p1193 = vortex.uState.p1193.value
  //     const chain = vortex.uState.chain.value

  //     if (!addresses || addresses instanceof Error) { alert('no selected address'); return }
  //     if (!rpc || rpc instanceof Error) { alert('no rpc'); return }
  //     if (!p1193 || p1193 instanceof Error) { alert('no provider'); return }

  //     const result = await ejra.call(rpc, {
  //         to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe',
  //         input: '0x762ebebc'
  //     }, 'latest')
  //     if (result instanceof Error) { alert(result); return }
  //     const [divider, fee] = result.slice(2).match(/.{64}/g)?.map(s => BigInt(`0x${s}`)) ?? []
  //     if (!divider || !fee) { alert(`could not find faucet on chain ${chain}, make sure you are connected to a valid testnet (Sepolia ETH/BASE/ARB, tBSC, AVAX Fuji)`); return }

  //     const from = addresses[0]
  //     const to = '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe'
  //     const value = `0x${fee.toString(16)}`
  //     const data = '0x1a9bbe59'

  //     const tx = { from, to, value, data }

  //     await p1193.request({ method: 'eth_sendTransaction', params: [tx] })
}

const defaultSeed = "0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c";
const seed = computed(() => {
  const addresses = vortex.uState.addresses.value;
  return !addresses || addresses instanceof Error ? defaultSeed : addresses[0];
});
const blockieData = computed(() => {
  return new Blockie({ scale: 16, seed: seed.value }).base64();
});

const filteredActive = new Signal<Chain[]>(
  bridgeable.sort((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1),
);

function onFilterChange(e: JSX.TargetedEvent<HTMLInputElement>) {
  filteredActive.value = e.currentTarget.value
    ? bridgeable
      .filter((chain) =>
        JSON.stringify(chain).toLowerCase().match(
          e.currentTarget.value.toLowerCase(),
        )
      )
      .sort((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1)
    : bridgeable;
}

const hexshortSelected = computed(() => {
  const addresses = vortex.uState.addresses.value;
  const zeroAddress = "0x".padEnd(42, "0");
  return hexshort(
    !addresses || addresses instanceof Error ? zeroAddress : addresses[0],
  );
});

const whichChain = new Signal<undefined | string>(undefined);
const selectedChains = new Signal<
  { from: undefined | Chain; to: undefined | Chain }
>({ from: undefined, to: undefined });
const chainChoiceGate = new Signal<undefined | Gate<Chain>>(undefined);
function chooseChain(chain: Chain) {
  chainChoiceGate.value?.resolve(chain);
}
async function chainChoices(which: string) {
  chainChoiceGate.value = new Gate<Chain>();
  whichChain.value = which;
  selectedChains.value = {
    ...selectedChains.value,
    [which]: await chainChoiceGate.value.promise,
  };
  whichChain.value = undefined;
  filteredActive.value = bridgeable.sort((a, b) =>
    a.name < b.name ? -1 : a.name == b.name ? 0 : 1
  );
}

export function UI() {
  // const destination = useSignal<undefined|bigint|null>(undefined)
  // const recipient = useSignal<undefined|string|null>(undefined)
  // const amount = useSignal<undefined|bigint|null>(undefined)
  // function onDestinationInput(e:JSX.TargetedEvent<HTMLInputElement>) {
  //     const chain = bridgeable.find(({ shortName }) => e.currentTarget.value == shortName)
  //     destination.value = chain ? BigInt(chain.chainId) : null
  // }

  // function onDestinationInput(e:JSX.TargetedEvent<HTMLInputElement>) {
  //     const chain = bridgeable.find(({ shortName }) => e.currentTarget.value == shortName)
  //     destination.value = chain ? BigInt(chain.chainId) : null
  // }

  return (
    <>
      {whichChain.value
        ? (
          <>
            <div class="w-full h-full max-h-full flex flex-col grow">
              <div class="font-[Poppins] text-center pt-4 text-[#2c2c2c] dark:text-[#EAEAEA]">
                {whichChain.value.slice(0, 1).toUpperCase().concat(
                  whichChain.value.slice(1),
                )}
              </div>

              {/* search */}
              <div class="flex">
                <input
                  class={`
                            grow
                            bg-[#f2f2f2]
                            dark:bg-[#1e1e1e]
                            rounded-lg
                            m-4
                            px-2
                            lg:text-lg
                            text-[#2c2c2c]
                            dark:text-[#EAEAEA]
                            border
                            dark:border-1
                            border-1
                            border-[#2c2c2c2a]
                            dark:border-[#eaeaea2a]
                            font-mono
                        `}
                  onClick={(e) => e.currentTarget.value = ""}
                  onInput={onFilterChange}
                />
              </div>

              {/* choices */}
              <div class="grid place-items-center sm:grid-cols-4 grid-cols-3 grid-flow-row gap-2 max-w-full overflow-auto">
                {filteredActive.value.map((chain) => (
                  <div class="min-w-24 min-h-24 max-w-24 max-h-24">
                    <div
                      class="hover:scale-[102%] active:scale-[98%] cursor-pointer flex flex-col items-center gap-1"
                      onClick={() => chooseChain(chain)}
                    >
                      <picture>
                        <source
                          srcset={getIcon(chain.chainId).dark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img
                          draggable={false}
                          class="w-12 h-12"
                          src={getIcon(chain.chainId).light}
                        />
                      </picture>

                      <div class="select-none text-center lg:text-sm text-xs text-[#2c2c2c] dark:text-[#EAEAEA]">
                        {chain.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
        : <></>}

      {/* at some point, we probably want to move the Connector conditional outside UI and into Form */}
      {/* { !whichChain.value && status.value != 'Connected' ? <Connector/> : <></> } */}

      {!whichChain.value
        ? (
          <>
            {/* blockie + hexshort */}
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

            {/* balance */}
            {/* <Balance/> */}

            {/* amount */}
            {/* <Web3Input placeholder="amount" maxVal={dzhvBalance.value} decimals={18n} val={amount}/> */}

            {/* recipient */}
            {/* <div class="flex gap-2 mb-5"> */}
            {/* <ListInput list="addrs" placeholder="receiving address" onInput={e => recipient.value = e.currentTarget.value}/> */}

            {/* 'from -> to' row */}
            <div class="flex flex-row gap-x-4">

              {/* fabianhortiguela from selector button */}
              <div class="flex flex-row items-center">
                <div
                  onClick={() => chainChoices("from")}
                  class="w-[80px] h-[80px] border-2 flex justify-center items-center rounded-full border-brand-violet950 p-3 bg-dark-stone950 cursor-pointer hover:border-brand-lime600"
                >
                  {selectedChains.value.from
                    ? (
                        <picture title={selectedChains.value.from.name}>
                        <source
                          srcset={getIcon(selectedChains.value.from.chainId)
                            .dark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img
                          class="w-[52px] h-[52px]"
                          src={getIcon(selectedChains.value.from.chainId).light}
                        />
                      </picture>
                    )
                    : (
                      <svg
                        class="w-[52px] h-[52px] text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
                        />
                      </svg>
                    )}
                </div>
              </div>

              {/* arrow/separator */}
              <div class="w-full h-full scale-[200%] invert flex justify-center items-center rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19.99"
                  height="18"
                >
                  <path d="M10.029 5H0v7.967h10.029V18l9.961-9.048L10.029 0v5z" />
                </svg>
              </div>

              {/* fabianhortiguela to selector button */}
              <div class="flex flex-row items-center">
                <div
                  onClick={() => chainChoices("to")}
                  class="w-[80px] h-[80px] border-2 flex justify-center items-center rounded-full border-brand-violet950 p-3 bg-dark-stone950 cursor-pointer hover:border-brand-lime600"
                >
                  {selectedChains.value.to
                    ? (
                      <picture title={selectedChains.value.to.name}>
                        <source
                          srcset={getIcon(selectedChains.value.to.chainId).dark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img
                          class="w-[52px] h-[52px]"
                          src={getIcon(selectedChains.value.to.chainId).light}
                        />
                      </picture>
                    )
                    : (
                      <svg
                        class="w-[52px] h-[52px] text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
                        />
                      </svg>
                    )}
                </div>
              </div>
            </div>
            {
              /* <ListInput list="chains" placeholder="chain" onInput={() => {}} addClass="w-[4rem]"/>
            <datalist id="chains">{bridgeable.map(chain => <option value={chain?.shortName}/>)}</datalist> */
            }

            {/* bridge button */}
            <Button
              addClass="text-[#3d3d3d] dark:text-[#ccb286]"
              disabled={disabled.value}
              onClick={disabled.value ? () => {} : bridge}
            >
              Bridge
            </Button>
            <a
              class="absolute dark:text-[#d2d2d2] bg-blur4 rounded-xl pr-1 text-[#282828] bottom-0 right-2 text-md font-[Poppins] hover:scale-[102%]"
              target="_blank"
              href="/faucet"
            >
              💧faucet
            </a>
          </>
        )
        : <></>}
    </>
  );
}
