import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { batch, Signal } from "@preact/signals";
import { bridgeable } from "../../lib/chains/bridgeable.ts";
import { Chain } from "../../lib/types/Chain.ts";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { WhichChain } from "../common/WhichChain.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";

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

const chosenChains = new Signal<Record<string, Chain>>({});

function flipChosen() {
  chosenChains.value = {
    from: chosenChains.value.to,
    to: chosenChains.value.from,
  };
}

const chainChoiceGate = new Signal<undefined | Gate<Chain>>(undefined);

function chooseChain(chain: Chain) {
  chainChoiceGate.value?.resolve(chain);
}

async function pickChain(which: string) {
  chainChoiceGate.value = new Gate<Chain>();
  whichChain.value = which;
  const chain = await chainChoiceGate.value.promise;
  const [key] =
    Object.entries(chosenChains.value).find(([k, v]) => v === chain) ?? [];
  batch(() => {
    if (key) delete chosenChains.value[key];
    chosenChains.value = {
      ...chosenChains.value,
      [which]: chain,
    };
  });
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

            <svg
              onClick={flipChosen}
              class="z-10 absolute x-[50%] y-[50%] [hover:scale-[105%] active:scale-[95%] cursor-pointer w-8 h-8 text-[#282828] dark:text-[#d2d2d2]"
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
                d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
              />
            </svg>

            <div class="bg-blur2 shadow-xl w-auto flex flex-col">
              <div class="flex">
                <div class="grow">gas</div>
                <div>time</div>
              </div>

              <div class="flex flex-col">
                <div class="flex">
                  <div class="grow">burn</div>
                  <div class="font-[Poppins] text-[#282828] dark:text-[#d2d2d2] text-sm">
                    From
                  </div>
                </div>
                <div class="flex">
                  <div class="grow">amount1</div>
                  <FhChainPicker
                    chosen={chosenChains}
                    which={"from"}
                    onClick={pickChain}
                    addClass="translate-x-[50%]"
                  />
                </div>
                <div class="flex">
                  <div class="grow">amount2</div>
                  <div class="font-[Poppins] text-[#282828] dark:text-[#d2d2d2] font-extralight text-sm">
                    {chosenChains.value["from"]?.name ?? ""}
                  </div>
                </div>
              </div>

              <div class="flex">
                <div class="grow border-t border-white" />
                <div class="w-8" />
                <div class="grow border-t border-white" />
              </div>

              <div class="flex flex-col">
                <div class="flex">
                  <div class="grow">mint</div>
                  <div>to</div>
                </div>
                <div class="flex">
                  <div class="grow">amount1</div>
                  <FhChainPicker
                    chosen={chosenChains}
                    which={"to"}
                    onClick={pickChain}
                    addClass="translate-x-[50%]"
                  />
                </div>
                <div class="flex">
                  <div class="grow">amount2</div>
                  <div>{chosenChains.value["to"]?.name ?? ""}</div>
                </div>
              </div>

              <div class="flex justify-center">bridge</div>
            </div>

            {/* balance */}
            {/* <Balance/> */}

            {/* amount */}
            {/* <Web3Input placeholder="amount" maxVal={dzhvBalance.value} decimals={18n} val={amount}/> */}

            {/* recipient */}
            {/* <div class="flex gap-2 mb-5"> */}
            {/* <ListInput list="addrs" placeholder="receiving address" onInput={e => recipient.value = e.currentTarget.value}/> */}

            {/* 'from -> to' row */}
            {
              /* <div class="flex flex-row gap-x-4">
              <FhChainPicker
                chosen={chosenChains}
                which={"from"}
                onClick={pickChain}
              />

              <svg onClick={flipChosen} class="hover:scale-[102%] active:scale-[98%] cursor-pointer w-8 h-8 text-[#282828] dark:text-[#d2d2d2]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/>
              </svg>

              <FhChainPicker
                chosen={chosenChains}
                which={"to"}
                onClick={pickChain}
              />
            </div> */
            }

            {/* bridge button */}
            {
              /* <Button
              addClass="text-[#3d3d3d] dark:text-[#ccb286]"
              disabled={disabled.value}
              onClick={disabled.value ? () => {} : bridge}
            >
              Bridge
            </Button> */
            }

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
