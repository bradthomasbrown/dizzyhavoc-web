import { JSX } from "preact/jsx-runtime";
import { destination } from "../lib/utils/destination.ts";
import { recipient } from "../lib/utils/recipient.ts";
import { state } from "../lib/utils/state.ts";
import { w3LabelConv } from "../lib/utils/w3LabelConv.ts";
import { bridge } from "../lib/utils/mod.ts";
import Toaster from "./Toaster.tsx";
import Web3Input from "./Web3Input.tsx";

function truncate(adrs: string) {
      const firstadrs = adrs.substring(0, 6);
      const lastadrs = adrs.substring(40, 42);
      const message = firstadrs.concat("...", lastadrs);
      return(message);
  }

function onDestinationInput(e:JSX.TargetedEvent<HTMLInputElement>) {
    const name = e.currentTarget.value
    let chainId
    switch (name) {
        case 'ETH': chainId = 1n; break;
        case 'AVAX': chainId = 43114n; break;
        case 'BASE': chainId = 8453n; break;
        case 'ARB': chainId = 42161n; break;
        case 'BSC': chainId = 56n; break;
        default: alert('invalid chain'); return
    }
    destination.value = chainId
}

export default function BridgeUI(
    props: JSX.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <div>
            <Toaster/>
            {state.value.addresses?.at(0) && ( 
                <div class="flex flex-col items-center gap-1">
                {/* TODO - add "from" field that can be used to prompt switching of chains */}
                <div class="text-xl font-[Poppins] mb-4">{state.value.dzhvBalance ? 'Balance: ' + w3LabelConv({ big: state.value.dzhvBalance, dec: 18, sym: 'DZHV', tarLen: 16, maxExt: Infinity }) : 'No balance'}</div>
                <Web3Input placeholder="amount" maxVal={state.value.dzhvBalance} decimals={18n}></Web3Input>
                <div class="font-[Poppins] font-medium mb-2">from: {truncate(state.value.addresses[0])}</div>
                <div class="font-[Poppins] font-medium mb-4">to:</div>
                <div class="flex gap-2 mb-5">
                    <input class="py-2 rounded-lg text-center" onInput={e => recipient.value = e.currentTarget.value} list="addrs" placeholder={'receiving address'}></input>
                    <div class="font-[Poppins] font-medium my-auto">on</div>
                    <input class="py-2 text-center w-[4rem] rounded-lg" onInput={onDestinationInput} list="chains" placeholder={'chain'}></input>
                </div>
                <div className="text-xl text-[#3d3d3d] shadow-lg font-[Poppins] rounded-lg py-1 px-4 hover:scale-[105%] border border-[#e9e9e9] cursor-pointer bg-[#f1f1f1]" onClick={bridge}>bridge</div>
                <datalist id="chains">
                    <option value="ETH"></option>
                    <option value="AVAX"></option>
                    <option value="BASE"></option>
                    <option value="ARB"></option>
                    <option value="BSC"></option>
                </datalist>
                <datalist id="addrs">
                    {state.value.addresses.map(address => (<option value={address}></option>))}
                </datalist>
            </div>)}

            {state.value.addresses?.at(0)==null &&(  /* renders placeholder when no wallet connected */
                <div class="flex flex-col items-center gap-1">
                {/* TODO - add "from" field that can be used to prompt switching of chains, add placeholder here too */}
                <div class="text-xl font-[Poppins] animate-pulse mb-4">Please connect</div>
                <Web3Input style={{ opacity: 0.7, pointerEvents: 'none' }} maxVal={0n} decimals={18n} placeholder="amount"></Web3Input>
                <div class="font-[Poppins] font-medium mb-2">from: 0x0000...00</div>
                <div class="font-[Poppins] font-medium mb-4">to:</div>
                <div class="flex gap-2 mb-5">
                    <input style={{ opacity: 0.5, pointerEvents: 'none' }} class="py-2 rounded-lg text-center" list="addrs" placeholder={'receiving address'}></input>
                    <div class="font-[Poppins] font-medium my-auto">on</div>
                    <input style={{ opacity: 0.5, pointerEvents: 'none' }} class="py-2 text-center w-[4rem] rounded-lg" list="chains" placeholder={'chain'}></input>
                </div>
                <div style={{ opacity: 0.5, pointerEvents: 'none' }} className="text-xl text-[#3d3d3d] shadow-lg font-[Poppins] rounded-lg py-1 px-4 hover:scale-[105%] border border-[#e9e9e9] cursor-pointer bg-[#f1f1f1]" onClick={bridge}>bridge</div>
                <datalist id="chains">
                    <option value="ETH"></option>
                    <option value="AVAX"></option>
                    <option value="BASE"></option>
                    <option value="ARB"></option>
                    <option value="BSC"></option>
                </datalist>
                <datalist id="addrs">
                    <option>null</option>
                </datalist>
            </div>)}
        </div>
    );
}
