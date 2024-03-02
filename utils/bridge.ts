import { addresses, amount, destination, recipient, provider } from '../utils/mod.ts'

export function bridge() {
    if (!provider.value) { alert('provider undefined'); return }
    if (!destination.value) { alert('destination undefined'); return }
    if (!recipient.value) { alert('recipient undefined'); return }
    if (!amount.value) { alert('amount undefined'); return }
    const data = `0x9eea5f66${
        destination.value.toString(16).padStart(64, '0')}${
        recipient.value.substring(2).padStart(64, '0')}${
        amount.value.toString(16).padStart(64, '0')}`
    const params = { from: addresses.value.at(0), to: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe', data }
    console.log(params)
    provider.value.request({ method: 'eth_sendTransaction', params })
}