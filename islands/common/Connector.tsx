import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, signal } from "@preact/signals";
import {
    init, poll, onChainChanged, onAccountsChanged,
    Button, InjectedProvider
} from "../../lib/internal.ts";

const status:Signal<'Connect'|'Loading'|'Connected'> = signal('Connect')

const globalWithEthereum = globalThis as typeof globalThis & {
    ethereum?: InjectedProvider
}, gwe = globalWithEthereum

function connect() {
    if (status.value == 'Connected') return
    console.log('CONNECT')
    const { ethereum } = gwe
    if (IS_BROWSER && ethereum) {
        ethereum.on('chainChanged', onChainChanged)
        ethereum.on('accountsChanged', onAccountsChanged)
        status.value = 'Loading'
        init().then(() => { status.value = 'Connected' })
    }
}

export function Connector() {
    return (
        <Button addClass="text-[#3d3d3d] dark:text-[#d7d7d7]" onClick={connect}>
            {status}
        </Button>
    );
}