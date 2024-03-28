import { computed, Signal, useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { useEffect } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import {
  Balance,
  bridge,
  /*addresses, dzhvBalance, provider, dzhv, state,*/
  bridgeable,
  Button,
  Chain,
  Connector,
  hexshort,
  InjectedProvider,
  ListInput,
  Web3Input,
} from "../../lib/internal.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
// import makeBlockie from 'ethereum-blockies-base64';
import { status } from "../common/Connector.tsx";
import { Blockie } from "../../lib/blockies/Blockie.ts";

export function Form() {
  // const [adrs, setAdrs] = useState(addresses.value?.[0] ?? ""); // Initialize with the first address value or an empty string
  const destination = useSignal<undefined | bigint | null>(undefined);
  const recipient = useSignal<undefined | string | null>(undefined);
  const amount = useSignal<undefined | bigint | null>(undefined);
  function onDestinationInput(e: JSX.TargetedEvent<HTMLInputElement>) {
    const chain = bridgeable.find(({ shortName }) =>
      e.currentTarget.value == shortName
    );
    destination.value = chain ? BigInt(chain.chainId) : null;
  }

  function sendBridge() {
    // const destChain = bridgeable.find(({ chainId }) => BigInt(chainId) == destination.value)
    // // if the destination chain isn't in bridgeable, log that and return
    // if (!destChain) { console.error(new Error(`destination chain ${destination.value} not bridgeable (yet)`)); return }
    // // const details = { destChain, recipient: recipient.value, amount: amount.value,
    //     // address: addresses.value?.[0], provider: provider.value, dzhv: dzhv.value }
    // // if any details from the from are missing, log that and return
    // // if (!details.recipient || !details.amount) {
    // //     const entries = Object.entries(details)
    // //     const missingOrInvalid = entries.filter(([key, value]) => !value).map(([detail]) => detail)
    // //     console.error(new Error(`missing or invalid bridge details: ${JSON.stringify(missingOrInvalid)}`))
    // //     return
    // // }
    // // if any necessary details from the state are missing, log that and return
    // if (!details.provider || !details.dzhv) {
    //     const entries = Object.entries(state).filter(([_, v]) => v instanceof Signal) as [string, Signal][]
    //     const missingOrInvalid = entries.filter(([_, signal]) => signal.value === null || signal.value === undefined).map(([_, signal]) => signal.value)
    //     console.error(new Error(`missing or invalid state details: ${JSON.stringify(missingOrInvalid)}`))
    //     return
    // }
    // // if there's no selected address, log that and return
    // if (!details.address) { console.error(new Error(`no selected address`)); return }
    // // bridge
    // bridge(details as { recipient:string, amount:bigint,
    //     address:string, provider:InjectedProvider, dzhv:{ address:string },
    //     destChain:Chain })
  }
  const hexshortSelected = computed(() => {
    // const selected = addresses.value?.[0]
    // if (!selected) return '0x000...000'
    // return hexshort(selected)
  });
  // useEffect(() => {
  //     const selectedAddress = addresses.value?.[0];
  //     setAdrs(selectedAddress ?? "0x000...000"); // Update the state with the first address value or an empty string
  //   }, [addresses.value]);
  // const blockieSrc = adrs ? new Blockie({ scale: 16, seed: adrs }).base64() : undefined
  //   const blockieSrc = adrs ? makeBlockie(adrs as string) : undefined; // Generate the blockie image source based on the adrs state variable

  return (
    <div class="relative sm:w-[500px] w-[360px] h-full items-center flex">
      <div class="flex absolute flex-col top-0 left-0 items-start">
        {/* {<img class="size-[2.2rem] rounded-sm mt-6 ml-6" src={blockieSrc} title={adrs} alt="blockie image"></img>} */}
        <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-sm ml-6">
          {hexshortSelected}
        </div>
      </div>
      <div class="flex flex-col text-[#2c2c2c] dark:text-[#EAEAEA] font-[Poppins]">
        <div class="flex sm:w-[500px] w-[360px] mx-auto flex-col items-center">
          <Balance />
          {/* <Web3Input placeholder="amount" maxVal={dzhvBalance.value} decimals={18n} val={amount}/> */}
          <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-medium mb-4">
            to
          </div>
          <div class="flex gap-2 mb-5">
            <ListInput
              list="addrs"
              placeholder="receiving address"
              onInput={(e) => recipient.value = e.currentTarget.value}
            />
            <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-medium my-auto">
              on
            </div>
            <ListInput
              list="chains"
              placeholder="chain"
              onInput={onDestinationInput}
              addClass="w-[4rem]"
            />
          </div>
          {status.value == "Connect" || status.value == "Loading" ||
              status.value == "Connecting"
            ? <Connector />
            : (
              <Button
                addClass="text-[#3d3d3d] dark:text-[#ccb286]"
                onClick={sendBridge}
              >
                Bridge
              </Button>
            )}
          <datalist id="chains">
            {!IS_BROWSER
              ? []
              : bridgeable.map((chain) => <option value={chain?.shortName} />)}
          </datalist>
          {/* <datalist id="addrs">{!IS_BROWSER ? [] : addresses?.value?.map(address => (<option value={address}></option>))}</datalist> */}
        </div>
        <a
          class="absolute bottom-0 left-0 ml-1 text-md font-[Poppins] hover:scale-[102%]"
          target="_blank"
          href="/faucet"
        >
          💧testnet faucet
        </a>
      </div>
    </div>
  );
}
