import Button from '../islands/Button.tsx'
import Web3Input from '../islands/Web3Input.tsx'
import { JSX } from 'preact'
import { connected } from '../utils/connected.ts'
import { addrs } from '../utils/addrs.ts'

export default function Foo(
    props: JSX.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <div>
        
            {connected.value && (<div class="flex flex-col items-center gap-1">
             
                {/* TODO - add "from" field that can be used to prompt switching of chains */}
                <input list="chains" placeholder={'destination'}></input>
                <input list="addrs" placeholder={'address'}></input>
                <Web3Input placeholder="amount" maxVal={1000000000000000000000000n} decimals={18n}></Web3Input>
                <Button>bridge</Button>
                
                <datalist id="chains">
                <option value="ETH"></option>
                <option value="AVAX"></option>
                <option value="BASE"></option>
                <option value="ARB"></option>
                <option value="BSC"></option>
                </datalist>
                
                <datalist id="addrs">
                {addrs.value.map(addr => (<option value={addr}></option>))}
                </datalist>
                
            </div>)}
            
        </div>
    );
}