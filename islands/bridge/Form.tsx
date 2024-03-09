import { useSignal, computed, Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import {
    Chain, InjectedProvider,
    addresses, dzhvBalance, provider, dzhv, state,
    bridgeable, 
    hexshort, bridge, 
    Button,
    Balance, Web3Input, ListInput
} from '../../lib/internal.ts'
import { IS_BROWSER } from "$fresh/runtime.ts";

const hexshortSelected = computed(() => {
    const selected = addresses.value?.[0]
    if (!selected) return '0x'
    return hexshort(selected)
})

export function Form() {
    
    const destination = useSignal<undefined|bigint|null>(undefined)
    const recipient = useSignal<undefined|string|null>(undefined)
    const amount = useSignal<undefined|bigint|null>(undefined)

    function onDestinationInput(e:JSX.TargetedEvent<HTMLInputElement>) {
        const chain = bridgeable.find(({ shortName }) => e.currentTarget.value == shortName)
        destination.value = chain ? BigInt(chain.chainId) : null
    }

    function sendBridge() {
        const destChain = bridgeable.find(({ chainId }) => BigInt(chainId) == destination.value)
        // if the destination chain isn't in bridgeable, log that and return
        if (!destChain) { console.error(new Error(`destination chain ${destination.value} not bridgeable (yet)`)); return }
        const details = { destChain, recipient: recipient.value, amount: amount.value,
            address: addresses.value?.[0], provider: provider.value, dzhv: dzhv.value }
        // if any details from the from are missing, log that and return
        if (!details.recipient || !details.amount) {
            const entries = Object.entries(details)
            const missingOrInvalid = entries.filter(([key, value]) => !value).map(([detail]) => detail)
            console.error(new Error(`missing or invalid bridge details: ${JSON.stringify(missingOrInvalid)}`))
            return
        }
        // if any necessary details from the state are missing, log that and return
        if (!details.provider || !details.dzhv) {
            const entries = Object.entries(state).filter(([_, v]) => v instanceof Signal) as [string, Signal][]
            const missingOrInvalid = entries.filter(([_, signal]) => signal.value === null || signal.value === undefined).map(([_, signal]) => signal.value)
            console.error(new Error(`missing or invalid state details: ${JSON.stringify(missingOrInvalid)}`))
            return
        }
        // if there's no selected address, log that and return
        if (!details.address) { console.error(new Error(`no selected address`)); return }
        // bridge
        bridge(details as { recipient:string, amount:bigint,
            address:string, provider:InjectedProvider, dzhv:{ address:string },
            destChain:Chain })
    }

    return (
        <div class="flex flex-col items-center gap-1">
            <Balance/>
            <Web3Input placeholder="amount" maxVal={dzhvBalance.value} decimals={18n} val={amount}/>
            <div class="font-[Poppins] font-medium mb-2">from: {hexshortSelected}</div>
            <div class="font-[Poppins] font-medium mb-4">to:</div>
            <div class="flex gap-2 mb-5">
                <ListInput list="addrs" placeholder="receiving address" onInput={e => recipient.value = e.currentTarget.value}/>
                <div class="font-[Poppins] font-medium my-auto">on</div>
                <ListInput list="chains" placeholder="chain" onInput={onDestinationInput} addClass="w-[4rem]"/>
            </div>
            <Button onClick={sendBridge}>bridge</Button>
            <datalist id="chains">{!IS_BROWSER ? [] : bridgeable.map(chain => <option value={chain?.shortName}/>)}</datalist>
            <datalist id="addrs">{!IS_BROWSER ? [] : addresses?.value?.map(address => (<option value={address}></option>))}</datalist>
        </div>
    )
}