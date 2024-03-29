import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { batch, Signal } from "@preact/signals";
import { bridgeable } from "../../lib/chains/bridgeable.ts";
import { Chain } from "../../lib/types/Chain.ts";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { WhichChain } from "../common/WhichChain.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { Button } from "../../lib/internal.ts";
import { receipt } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/ejra@0.0.1-toad/schemas/receipt.ts";
import { hexshort } from "../../lib/internal.ts";

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

class quoteSignal<T> extends Signal<T> {
  from: T | undefined;
  to: T | undefined;

  constructor(initialValue: T) {
    super(initialValue);
    this.from = initialValue;
    this.to = initialValue;
  }
}

const Quotes = new quoteSignal<undefined | Number>(undefined);

function flipChosen() {
  chosenChains.value = {
    from: chosenChains.value.to,
    to: chosenChains.value.from,
  };
  getQuotes()
}

const chainChoiceGate = new Signal<undefined | Gate<Chain>>(undefined);

function chooseChain(chain: Chain) {
  chainChoiceGate.value?.resolve(chain);
}

async function getQuotes() {
  try {
    const response = await fetch(
      "https://quick-frog-59.deno.dev/v1/liveprices"
    );
    const data = await response.json();
    switch(chosenChains.value.from.shortName){
        case "sep":
          Quotes.from = data[data.length - 1].eth_price
          break;
        case "basesep":
          Quotes.from = data[data.length - 1].base_price
          break;
        case "arb-sep":
          Quotes.from = data[data.length - 1].arb_price
          break;
        case "Fuji":
          Quotes.from = data[data.length - 1].avax_price
          break;
        case "bnbt":
          Quotes.from = data[data.length - 1].bsc_price
          break;
    } switch(chosenChains.value.to.shortName){
        case "sep":
          Quotes.to = data[data.length - 1].eth_price
          break;
        case "basesep":
          Quotes.to = data[data.length - 1].base_price
          break;
        case "arb-sep":
          Quotes.to = data[data.length - 1].arb_price
          break;
        case "Fuji":
          Quotes.to = data[data.length - 1].avax_price
          break;
        case "bnbt":
          Quotes.to = data[data.length - 1].bsc_price
          break;
    }
  } catch (error) {
    console.error(error);
  }
  console.log("Mainnet from price quote:", Quotes.from, "; to price quote:", Quotes.to)
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
  getQuotes() 
  whichChain.value = undefined;
}

const recipient = new Signal<string>("0x".padEnd(2 + 40, "0"));

const recipientFocused = new Signal<boolean>(false);

recipientFocused.subscribe((x) => console.log(x, hexshort(recipient.value)));

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

            <div class="w-full sm:px-16 px-8 text-[#282828] dark:text-[#d2d2d2]">
              <div class="bg-blur2 shadow-xl w-auto flex flex-col font-[Poppins]">
                <div class="flex">
                  <div class="grow">gas</div>
                  <div>time</div>
                </div>

                <div class="relative">
                  <svg
                    onClick={flipChosen}
                    class="z-10 absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] [hover:scale-[105%] active:scale-[95%] cursor-pointer w-8 h-8"
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

                  <div class="p-2 flex flex-col">
                    <div class="flex text-sm font-semibold">
                      <div class="grow">
                        Burn
                      </div>
                      <div>
                        From
                      </div>
                    </div>
                    <div class="flex">
                      <input
                        class="w-0 grow flex font-mono items-center text-[32px] bg-transparent"
                        placeholder="0"
                      />
                      <FhChainPicker
                        chosen={chosenChains}
                        which={"from"}
                        onClick={pickChain}
                        addClass="translate-x-[calc(50%+8px)]"
                      />
                    </div>
                    <div class="flex">
                      <div class="grow font-extralight text-sm font-mono">
                        $123.00
                      </div>
                      <div class="font-extralight text-sm">
                        {chosenChains.value["from"]?.shortName ?? ""}
                      </div>
                    </div>
                  </div>

                  <div class="flex">
                    <div class="grow border-t border-white" />
                    <div class="w-8" />
                    <div class="grow border-t border-white" />
                  </div>

                  <div class="p-2 flex flex-col">
                    <div class="flex text-sm font-semibold">
                      <div class="grow">
                        Mint
                      </div>
                      <div>
                        To
                      </div>
                    </div>
                    <div class="flex">
                      <input
                        class="w-0 grow flex font-mono items-center text-[32px] bg-transparent"
                        placeholder="0"
                      />
                      <FhChainPicker
                        chosen={chosenChains}
                        which={"to"}
                        onClick={pickChain}
                        addClass="translate-x-[calc(50%+8px)]"
                      />
                    </div>
                    <div class="flex">
                      <div class="grow font-extralight text-sm font-mono">
                        $99.00
                      </div>
                      <div>{chosenChains.value["to"]?.shortName ?? ""}</div>
                    </div>
                  </div>
                </div>
              </div>

              <input
                class="px-2 py-1 w-full bg-transparent text-center font-mono"
                placeholder={hexshort("0x".padEnd(2 + 40, "0"))}
                onInput={(e) => recipient.value = e.currentTarget.value}
                onBlur={(e) => {
                  recipientFocused.value = false;
                  if (
                    recipient.value &&
                    recipient.value !== "0x".padEnd(2 + 40, "0")
                  ) e.currentTarget.value = hexshort(recipient.value);
                }}
                onFocus={(e) => {
                  recipientFocused.value = true;
                  if (
                    recipient.value &&
                    recipient.value !== "0x".padEnd(2 + 40, "0")
                  ) e.currentTarget.value = recipient.value;
                }}
              />

              <Button
                addClass="relative text-[#3d3d3d] dark:text-[#ccb286] z-10"
                disabled={false}
                onClick={false ? () => {} : bridge}
                rounding="rounded-b-lg"
                wiggle={false}
                width="100%"
              >
                Bridge
              </Button>
            </div>

            {/* balance */}
            {/* <Balance/> */}

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
