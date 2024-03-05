import Button from '../islands/Button.tsx'
import Web3Input from '../islands/Web3Input.tsx'
import { JSX } from 'preact'
import { bridge, w3LabelConv, destination, state } from '../utils/mod.ts'
import { recipient } from "../utils/mod.ts"

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

export default function Foo(
    props: JSX.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <div>
        
            {state.value.addresses?.at(0) && (<div class="flex flex-col items-center gap-1">
             
                {/* TODO - add "from" field that can be used to prompt switching of chains */}
                <div>{state.value.dzhvBalance ? w3LabelConv({ big: state.value.dzhvBalance, dec: 18, sym: 'DZHV', tarLen: 16, maxExt: Infinity }) : '...'}</div>
                <input onInput={onDestinationInput} list="chains" placeholder={'destination'}></input>
                <input onInput={e => recipient.value = e.currentTarget.value} list="addrs" placeholder={'address'}></input>
                <Web3Input placeholder="amount" maxVal={state.value.dzhvBalance} decimals={18n}></Web3Input>
                <Button onClick={bridge}>bridge</Button>
                
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
            
        </div>
    );
}