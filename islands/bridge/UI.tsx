// import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { batch, Signal } from "@preact/signals";
import { Chain } from "../../lib/types/Chain.ts";
import { ConnectionInfo } from "../common/ConnectionInfo.tsx";
import { FhChainPicker } from "../common/FhChainPicker.tsx";
import { Button } from "../../lib/internal.ts";
import { Connector, status } from "../common/Connector.tsx";
import { hexshort } from "../../lib/internal.ts";
// import { JSX } from "preact/jsx-runtime";
import { bridge } from "../../lib/bridge/bridge.ts";
import { which as whichProvider } from "../../lib/faucet/evmVortex/data/p1193.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { extVortex }  from '../../lib/bridge/extVortex/extVortex.ts'
import { Which } from "../common/which/Which.tsx";
import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { activeChains } from "../../lib/chains/activeChains.ts";
import { chainSrc } from '../../lib/chainSrc.ts'
import { Flipper } from '../../components/bridge/Flipper.tsx'
import { Input } from '../../components/bridge/Input.tsx'
if (IS_BROWSER) extVortex.flow('init')
const whichChain = new Signal<undefined | ReturnType<typeof Which>>(undefined);
export const chosenChains = new Signal<Record<string, Chain>>({});

// const prices: Record<string, Signal<number>> = {
//   eth: new Signal(0),
//   arb: new Signal(0),
//   bsc: new Signal(0),
//   avax: new Signal(0),
//   base: new Signal(0),
// };

// const quotes: Record<string, Signal<undefined | number>> = {
//   from: new Signal<undefined>(),
//   to: new Signal<undefined>(),
// };
function flipChosen() {
  chosenChains.value = {
    from: chosenChains.value.to,
    to: chosenChains.value.from,
  };
  // const temp = quotes["from"];
  // quotes["from"] = quotes["to"];
  // quotes["to"] = temp;
}
const chainChoiceGate = new Signal<undefined | Gate<Chain>>(undefined);

// async function getPrices() {
//   try {
//     const response = await fetch(
//       "https://api.dexscreener.com/latest/dex/tokens/0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE",
//     );
//     const data = response.body ? await response.json() : {};
//     for (let i = 0; i < data.pairs.length; i++) {
//       const fixedvalue = Number(data.pairs[i].priceUsd).toFixed(5);
//       switch (data.pairs[i].url) {
//         case "https://dexscreener.com/ethereum/0xb7a71c2e31920019962cb62aeea1dbf502905b81":
//           prices["eth"].value = Number(fixedvalue);
//           break;
//         case "https://dexscreener.com/arbitrum/0x05c5bdbc7b3c64109ddcce058ce99f4515fe1c83":
//           prices["arb"].value = Number(fixedvalue);
//           break;
//         case "https://dexscreener.com/bsc/0x642089a5da2512db761d325a868882ece6e387f5":
//           prices["bsc"].value = Number(fixedvalue);
//           break;
//         case "https://dexscreener.com/base/0xb64dff20dd5c47e6dbb56ead80d23568006dec1e":
//           prices["base"].value = Number(fixedvalue);
//           break;
//         case "https://dexscreener.com/avalanche/0x523a04633b6c0c4967824471dda0abbce7c5e643":
//           prices["avax"].value = Number(fixedvalue);
//           break;
//         default:
//           break;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
// async function setQuotes(which: string | undefined) {
//   await getPrices();
//   if (which = "from") {
//     if(chosenChains.value.from==undefined||null){
//       quotes["from"].value = 0;
//     }
//     switch (
//       chosenChains.value.from ? chosenChains.value.from.shortName : null
//     ) {
//       case "sep":
//         quotes["from"].value = prices["eth"].value;
//         break;
//       case "basesep":
//         quotes["from"].value = prices["base"].value;
//         break;
//       case "arb-sep":
//         quotes["from"].value = prices["arb"].value;
//         break;
//       case "Fuji":
//         quotes["from"].value = prices["avax"].value;
//         break;
//       case "bnbt":
//         quotes["from"].value = prices["bsc"].value;
//         break;
//     }
//   }
//   if (which = "to") {
//     if(chosenChains.value.to==undefined||null){
//       quotes["to"].value = 0;
//     }
//     switch (
//       chosenChains.value.to ? chosenChains.value.to.shortName : null
//     ) {
//       case "sep":
//         quotes["to"].value = prices["eth"].value;
//         break;
//       case "basesep":
//         quotes["to"].value = prices["base"].value;
//         break;
//       case "arb-sep":
//         quotes["to"].value = prices["arb"].value;
//         break;
//       case "Fuji":
//         quotes["to"].value = prices["avax"].value;
//         break;
//       case "bnbt":
//         quotes["to"].value = prices["bsc"].value;
//         break;
//     }
//   }
// }
async function pickChain(direction: string) {
  const gate = new Gate<Chain>();
  chainChoiceGate.value = gate
  whichChain.value = <Which
    title={direction}
    choices={activeChains.map(chain => ({ id: chain.name, value: chain, ...chainSrc(chain.chainId) }))}
    onPick={(choice:Choice) => gate.resolve(choice.value as Chain)}
  />;
  const chain = await chainChoiceGate.value.promise;
  const [key] =
    Object.entries(chosenChains.value).find(([k, v]) => v === chain) ?? [];
  batch(() => {
    if (key) delete chosenChains.value[key];
    chosenChains.value = { ...chosenChains.value, [direction]: chain };
  });
  // await setQuotes(which);
  whichChain.value = undefined;
}
const recipient = new Signal<string>("0x".padEnd(2 + 40, "0"));
const recipientFocused = new Signal<boolean>(false);
// status.subscribe(console.log);
export function UI() {

  if (whichChain.value) return whichChain.value

  return (
    <>
      {whichProvider.value ? whichProvider.value : (
          <>
            <ConnectionInfo />
            <div class="w-full sm:px-16 px-8 text-[#282828] dark:text-[#d2d2d2]">
              <div class="bg-blur2 shadow-xl w-auto flex flex-col font-[Poppins]">
                <div class="flex">
                  <div class="grow unselectable">gas</div>
                  <div class="unselectable">time</div>
                </div>
                <div class="relative">
                  <Flipper onClick={flipChosen}/>
                  <div class="p-2 flex flex-col">
                    <div class="flex text-sm font-semibold">
                      <div class="grow unselectable">Burn</div>
                      <div class="unselectable">From</div>
                    </div>
                    <div class="flex">
                      <Input/>
                      <FhChainPicker
                        chosen={chosenChains}
                        id={"from"}
                        onClick={pickChain}
                        addClass="translate-x-[calc(50%+8px)]"
                      />
                    </div>
                    {/* <div class="flex">
                      <div
                        title={quotes["from"].value
                          ? `price: $${quotes["from"]}`
                          : "select chain"}
                        class="grow font-extralight text-sm font-mono"
                      >
                        {quotes["from"].value && amount.value
                          ? "$" +
                            (Number(quotes["from"]) * Number(amount.value))
                              .toFixed(2)
                          : "$0"}
                      </div>
                      <div class="font-extralight text-sm">
                        {chosenChains.value["from"]?.shortName ?? "‎ "}
                      </div>
                    </div> */}
                  </div>
                </div>

                <div class="flex">
                  <div class="grow border-t border-white" />
                  <div class="w-8" />
                  <div class="grow border-t border-white" />
                </div>

                <div class="p-2 flex flex-col">
                  <div class="flex text-sm font-semibold">
                    <div class="grow unselectable">Mint</div>
                    <div class="unselectable">To</div>
                  </div>
                  <div class="flex">
                    <Input/>
                    <FhChainPicker
                      chosen={chosenChains}
                      id={"to"}
                      onClick={pickChain}
                      addClass="translate-x-[calc(50%+8px)]"
                    />
                  </div>
                  {/* <div class="flex">
                    <div
                      title={quotes["from"]
                        ? `price: $${quotes["to"]}`
                        : "select chain"}
                      class="grow font-extralight text-sm font-mono"
                    >
                      {quotes["to"] && amount.value
                        ? "$" +
                          (Number(quotes["to"]) * Number(amount.value))
                            .toFixed(2)
                        : "$0"}
                    </div>
                    <div>{chosenChains.value["to"]?.shortName ?? " "}</div>
                  </div> */}
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
                ) {
                  e.currentTarget.value = recipient.value;
                }
              }}
            />
            {status.value == "Connected"
              ? (
                <Button
                  addClass="relative text-[#3d3d3d] dark:text-[#ccb286] z-10"
                  disabled={false}
                  onClick={bridge}
                  rounding="rounded-b-lg"
                  wiggle={false}
                  width="100%"
                >
                  Bridge
                </Button>
              )
              : <Connector />}
          {/* </div> */}
          
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
