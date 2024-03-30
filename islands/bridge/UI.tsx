import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { batch, Signal } from "@preact/signals";
import { activeChains } from "../../lib/chains/activeChains.ts";
import { Chain } from "../../lib/types/Chain.ts";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { Which } from "../common/Which.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { Button } from "../../lib/internal.ts";
import { Connector, status } from '../common/Connector.tsx'
import { hexshort } from "../../lib/internal.ts";
import { JSX } from "preact/jsx-runtime";
import { P6963 } from '../../lib/state2/providers.ts'
import { bridge } from '../../lib/bridge/bridge.ts'


const whichChain = new Signal<undefined | string>(undefined);

const chosenChains = new Signal<Record<string, Chain>>({});

const amount = new Signal<Number>(0);

let eth_price = new Signal<Number>(0);

let arb_price = new Signal<Number>(0);

let bsc_price = new Signal<Number>(0);

let avax_price = new Signal<Number>(0);

let base_price = new Signal<Number>(0);

class quoteSignal<T> extends Signal<T> {
  from: T | undefined;
  to: T | undefined;

  constructor(initialValue: T) {
    super(initialValue);
    this.from = initialValue;
    this.to = initialValue;
  }
}

const Quotes = new quoteSignal<undefined | number>(undefined);

function flipChosen() {
  chosenChains.value = {
    from: chosenChains.value.to,
    to: chosenChains.value.from,
  };
  const temp = Quotes.from;
  Quotes.from = Quotes.to;
  Quotes.to = temp;

}

const chainChoiceGate = new Signal<undefined | Gate<Chain>>(undefined);

function chooseChain(chain: Chain) {
  chainChoiceGate.value?.resolve(chain);
}

function handleInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    amount.value = Number(e.currentTarget.value);
}

async function getPrices(){
  try {
    const response = await fetch(
      "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE"
    );
    const data = response.body ? await response.json() : {};
    for (let i = 0; i < data.pairs.length; i++) {
      const fixedvalue = Number(data.pairs[i].priceUsd).toFixed(5);
      switch (data.pairs[i].url) {
        case "https://dexscreener.com/ethereum/0xb7a71c2e31920019962cb62aeea1dbf502905b81":
          eth_price.value = Number(fixedvalue);
          break;
        case "https://dexscreener.com/arbitrum/0x05c5bdbc7b3c64109ddcce058ce99f4515fe1c83":
          arb_price.value = Number(fixedvalue);
          break;
        case "https://dexscreener.com/bsc/0x642089a5da2512db761d325a868882ece6e387f5":
          bsc_price.value = Number(fixedvalue);
          break;
        case "https://dexscreener.com/base/0xb64dff20dd5c47e6dbb56ead80d23568006dec1e":
          base_price.value = Number(fixedvalue);
          break;
        case "https://dexscreener.com/avalanche/0x523a04633b6c0c4967824471dda0abbce7c5e643":
          avax_price.value = Number(fixedvalue);
          break;
        default:
          break;
      } 
    }
}
catch(error){
  console.log(error)
}
}

async function setQuotes(which: string|undefined) {
 await getPrices()
 if(which="from"){
    switch(chosenChains.value.from ? chosenChains.value.from.shortName : null ){
        case "sep":
          Quotes.from = eth_price.value
          break;
        case "basesep":
          Quotes.from = base_price.value
          break;
        case "arb-sep":
          Quotes.from = arb_price.value
          break;
        case "Fuji":
          Quotes.from = avax_price.value
          break;
        case "bnbt":
          Quotes.from = bsc_price.value
          break;
    } }
    if(which="to"){
    switch(chosenChains.value.to ? chosenChains.value.to.shortName : null){
        case "sep":
          Quotes.to = eth_price.value
          break;
        case "basesep":
          Quotes.to = base_price.value
          break;
        case "arb-sep":
          Quotes.to = arb_price.value
          break;
        case "Fuji":
          Quotes.to = avax_price.value
          break;
        case "bnbt":
          Quotes.to = bsc_price.value
          break;
    }
  }
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
  await setQuotes(which) 
  whichChain.value = undefined;
}


const recipient = new Signal<string>("0x".padEnd(2 + 40, "0"));

const recipientFocused = new Signal<boolean>(false);

status.subscribe(console.log)

export function UI() {
  // const recipient = useSignal<undefined|string|null>(undefined)
  // const amount = useSignal<undefined|bigint|null>(undefined)

  // at some point, we probably want to move the Connector conditional outside UI and into Form */}

  return (
    <>
      { whichChain.value
        ? (
          <Which
            which={whichChain.value}
            choices={activeChains}
            onPick={(choice:Chain) => chooseChain(choice)}
            compareFn={(a:Chain, b:Chain) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1}
          />
        )
        : (
          <>
            <ConnectionInfo />

            <div class="w-full sm:px-16 px-8 text-[#282828] dark:text-[#d2d2d2]">
              <div class="bg-blur2 shadow-xl w-auto flex flex-col font-[Poppins]">
                <div class="flex">
                  <div class="grow unselectable">gas</div>
                  <div class="unselectable">time</div>
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
                      <div class="grow unselectable">
                        Burn
                      </div>
                      <div class="unselectable">
                        From
                      </div>
                    </div>
                    <div class="flex">
                    <input
                      autocomplete="off"
                      id="from"
                      type="text"
                      class="w-0 grow flex font-mono items-center text-[32px] bg-transparent"
                      placeholder="0"
                      oninput={(e) => {
                        const value = e.currentTarget.value;
                        if (value == ('.')) {
                          e.currentTarget.value = value.replace('.', '0.');
                        }
                        handleInput(e);
                      }}
                      value={amount.value}
                      onkeypress={(e) => {
                        const charCode = e.which ? e.which : e.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
                          e.preventDefault();
                        }
                      }}
                      ondrop={(e) => {
                        e.preventDefault();
                        const text = e.dataTransfer.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent dropping non-numeric characters
                          e.preventDefault();
                        } else {
                          e.currentTarget.value = text;
                          handleInput(e);
                        }
                      }}
                      onpaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent pasting non-numeric characters
                          e.preventDefault();
                        } else {
                          e.currentTarget.value = text;
                          handleInput(e);
                        }
                      }}
                      ondragover={(e) => {
                        e.preventDefault();
                        const text = e.dataTransfer.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent dragging non-numeric characters over
                          e.preventDefault();
                        }
                      }}
                    />
                      <FhChainPicker
                        chosen={chosenChains}
                        which={"from"}
                        onClick={pickChain}
                        addClass="translate-x-[calc(50%+8px)]"
                      />
                    </div>
                    <div class="flex">
                      <div title={Quotes.from? `price: $${Quotes.from}` : "select chain"} class="grow font-extralight text-sm font-mono">
                      {Quotes.from&&amount.value ? "$"+ (Number(Quotes.from)*Number(amount.value)).toFixed(2) : "$0"}
                      </div>
                      <div class="font-extralight text-sm">
                        {chosenChains.value["from"]?.shortName ?? "‎ "}
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
                      <div class="grow unselectable">
                        Mint
                      </div>
                      <div class="unselectable">
                        To
                      </div>
                    </div>
                    <div class="flex">
                    <input
                      autocomplete="off"
                      id="to"
                      type="text"
                      class="w-0 grow flex font-mono items-center text-[32px] bg-transparent"
                      placeholder="0"
                      oninput={(e) => {
                        const value = e.currentTarget.value;
                        if (value == ('.')) {
                          e.currentTarget.value = value.replace('.', '0.');
                        }
                        handleInput(e);
                      }}
                      value={amount.value}
                      onkeypress={(e) => {
                        const charCode = e.which ? e.which : e.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
                          e.preventDefault();
                        }
                      }}
                      ondrop={(e) => {
                        e.preventDefault();
                        const text = e.dataTransfer.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent dropping non-numeric characters
                          e.preventDefault();
                        } else {
                          e.currentTarget.value = text;
                          handleInput(e);
                        }
                      }}
                      onpaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent pasting non-numeric characters
                          e.preventDefault();
                        } else {
                          e.currentTarget.value = text;
                          handleInput(e);
                        }
                      }}
                      ondragover={(e) => {
                        e.preventDefault();
                        const text = e.dataTransfer.getData('text/plain');
                        if (!/^\d*\.?\d*$/.test(text)) {
                          // Prevent dragging non-numeric characters over
                          e.preventDefault();
                        }
                      }}
                    />

                      <FhChainPicker
                        chosen={chosenChains}
                        which={"to"}
                        onClick={pickChain}
                        addClass="translate-x-[calc(50%+8px)]"
                      />
                    </div>
                    <div class="flex">
                      <div title={Quotes.to? `price: $${Quotes.to}` : "select chain"} class="grow font-extralight text-sm font-mono">
                      {Quotes.to&&amount.value ? "$"+ (Number(Quotes.to)*Number(amount.value)).toFixed(2) : "$0"}
                      </div>
                      <div>{chosenChains.value["to"]?.shortName ?? "‎ "}
                      </div>
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

              { status.value == 'Connected'
                ? <Button
                    addClass="relative text-[#3d3d3d] dark:text-[#ccb286] z-10"
                    disabled={false}
                    onClick={bridge}
                    rounding="rounded-b-lg"
                    wiggle={false}
                    width="100%"
                  >
                    Bridge
                  </Button>
                : <Connector/> }

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
