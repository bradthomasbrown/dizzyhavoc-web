import { Signal, signal, computed } from '@preact/signals'
import { Button } from '../../components/common/Button.tsx'
import { getG1193, wp1193 } from '../../lib/state2/1193.ts'
import { vortex } from '../../lib/faucet/vortex.ts'

export const status = computed(() => {
    const uAddresses = vortex.uState.addresses.value
    const updaters = vortex.updaters.value
    const updater = vortex.data.addresses.updater
    const tAddresses = vortex.tState.addresses
    if (uAddresses && !(uAddresses instanceof Error)) return 'Connected'
    if (updaters.has(updater)) return 'Connecting'
    if ((tAddresses && !(tAddresses instanceof Error))) return 'Loading'
    if (
        (!uAddresses || uAddresses instanceof Error)
        && (!tAddresses || tAddresses instanceof Error)
        && !updaters.has(updater)
    ) return 'Connect'
    return `?${
            !uAddresses ? 0 : uAddresses instanceof Error ? 1 : 2
        }${ !updaters.has(updater) ? 0 : 2
        }${ !tAddresses ? 0 : tAddresses instanceof Error ? 1 : 2}`
})

const disabled = computed(() => status.value != 'Connect')

function connect() {
    const g1193 = getG1193()
    if (!g1193.ethereum) { alert('no eip-1193 provider detected'); return }
    wp1193.onChainChanged(() => vortex.flow('chain'))
    wp1193.onAccountsChanged(() => vortex.flow('account'))
    vortex.flow('init')
}

export function Connector() {
    return (
        <Button disabled={disabled.value} addClass="text-2xl px-2 text-center w-[180px] shadow-xl" onClick={disabled.value ? () => {} : connect}>
            {status}
        </Button>
    );
}