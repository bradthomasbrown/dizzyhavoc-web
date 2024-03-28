import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { computed, Signal } from "@preact/signals";
import { status } from "../common/Connector.tsx";
import { Button } from "../../components/common/Button.tsx";
import { getIcon } from "../../lib/chains/icons.ts";
import { bridgeable } from "../../lib/chains/bridgeable.ts";
import { Chain } from "../../lib/types/Chain.ts";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { WhichChain } from "../common/WhichChain.tsx";

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
}

export function UI() {
  // const recipient = useSignal<undefined|string|null>(undefined)
  // const amount = useSignal<undefined|bigint|null>(undefined)

  // at some point, we probably want to move the Connector conditional outside UI and into Form */}

  return (
    <>
      {whichChain.value
        ? (
          <WhichChain
            which={whichChain.value}
            chains={bridgeable}
            onPick={chooseChain}
          />
        )
        : (
          <>
            <ConnectionInfo />

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
                      <picture
                        title={selectedChains.value.from
                          .name}
                      >
                        <source
                          srcset={getIcon(
                            selectedChains.value
                              .from.chainId,
                          )
                            .dark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img
                          class="w-[52px] h-[52px]"
                          src={getIcon(
                            selectedChains.value
                              .from.chainId,
                          ).light}
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
                        <title>Origin chain</title>
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
                      <picture
                        title={selectedChains.value.to
                          .name}
                      >
                        <source
                          srcset={getIcon(
                            selectedChains.value.to
                              .chainId,
                          ).dark}
                          media="(prefers-color-scheme: dark)"
                        />
                        <img
                          class="w-[52px] h-[52px]"
                          src={getIcon(
                            selectedChains.value.to
                              .chainId,
                          ).light}
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
                        <title>Destination chain</title>
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
        )}
    </>
  );
}
