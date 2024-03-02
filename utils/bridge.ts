import { addresses, amount, destination, recipient, provider, state } from '../utils/mod.ts'

export function bridge() {
    if (!state.value.provider) { alert('provider undefined'); return }
    if (!state.value.addresses || !state.value.addresses.length) { alert('no connected addresses'); return }
    if (!destination.value) { alert('destination undefined'); return }
    if (!recipient.value) { alert('recipient undefined'); return }
    if (!amount.value) { alert('amount undefined'); return }
    const data = `0x9eea5f66${
        destination.value.toString(16).padStart(64, '0')}${
        recipient.value.substring(2).padStart(64, '0')}${
        amount.value.toString(16).padStart(64, '0')}`
    const params = [{ to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe', data, from: state.value.addresses.at(0) }]
    console.log(`bridge params: ${JSON.stringify(params)} (amount: ${amount.value})`)
    state.value.provider.request({ method: 'eth_sendTransaction', params })
}