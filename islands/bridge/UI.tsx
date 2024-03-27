import { JSX } from 'preact'
import { computed } from '@preact/signals'
import { Blockie } from '../../lib/blockies/Blockie.ts'
import { Connector, status } from '../common/Connector.tsx'
import { vortex } from '../../lib/faucet/vortex.ts'
// import { IS_BROWSER } from '$fresh/runtime.ts'
// import { useEffect } from 'preact/hooks'
// import { useState } from 'preact/hooks'
import { useSignal } from "@preact/signals"

import { Web3Input, 
        bridgeable, 
        ListInput, 
        Balance, 
        hexshort, 
        Button, 
        dzhvBalance } from "../../lib/internal.ts"

// import { ejra } from '../../lib/faucet/ejra.ts'


const disabled = computed(() => status.value != 'Connected')

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

export function UI() {
    const destination = useSignal<undefined|bigint|null>(undefined)
    const recipient = useSignal<undefined|string|null>(undefined)
    const amount = useSignal<undefined|bigint|null>(undefined)
    function onDestinationInput(e:JSX.TargetedEvent<HTMLInputElement>) {
        const chain = bridgeable.find(({ shortName }) => e.currentTarget.value == shortName)
        destination.value = chain ? BigInt(chain.chainId) : null
    }

    const defaultSeed = '0xa9C5db3e478D8F2E229254ef1d7e3a8ddBf2737c'
    const seed = computed(() => {
        const addresses = vortex.uState.addresses.value
        return !addresses || addresses instanceof Error
            ? defaultSeed
            : addresses[0]
    })
    const blockieData = computed(() => {
        return new Blockie({ scale: 16, seed: seed.value }).base64()
    })

    const hexshortSelected = computed(() => {
        const addresses = vortex.uState.addresses.value
        const zeroAddress = '0x'.padEnd(42, '0')
        return hexshort(
            !addresses || addresses instanceof Error
                ? zeroAddress
                : addresses[0])
    })
    
    return(
        <>{status.value != 'Connected'
                ? <Connector/>
                : <>

                    {/* blockie */}
                    <img class="size-[2.2rem] rounded-sm mb-1" src={blockieData} title={seed} alt="blockie image"/>

                    {/* hexshort */}
                    <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-sm mb-2">{hexshortSelected}</div>

                    {/* balance */}
                    <Balance/>
                    
                    { /* amount */}
                    <Web3Input placeholder="amount" maxVal={dzhvBalance.value} decimals={18n} val={amount}/>

                   { /* recipient */}
                    <div class="flex gap-2 mb-5">
                    <ListInput list="addrs" placeholder="receiving address" onInput={e => recipient.value = e.currentTarget.value}/>

                    { /* destination chain */}
                    <div class="font-[Poppins] text-[#2c2c2c] dark:text-[#EAEAEA] font-medium my-auto">on</div>
                    <ListInput list="chains" placeholder="chain" onInput={onDestinationInput} addClass="w-[4rem]"/>
                    </div>

                    { /* datalist */}
                    <datalist id="chains">{bridgeable.map(chain => <option value={chain?.shortName}/>)}</datalist>
                    
                    {/* bridge button */}
                    <Button
                        addClass="text-[#3d3d3d] dark:text-[#ccb286]"
                        disabled={disabled.value}
                        onClick={disabled.value ? () => {} : bridge}
                    >
                        Bridge
                    </Button>
                    <a class="absolute dark:text-[#d2d2d2] text-[#282828] bottom-0 left-0 ml-1 text-md font-[Poppins] hover:scale-[102%]" target="_blank" href="/faucet">💧testnet faucet</a>
                </>
        }</>
    )
}