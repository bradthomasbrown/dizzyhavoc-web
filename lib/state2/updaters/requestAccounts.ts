import { Flow } from '../vortex.ts'
import { wp1193 } from '../1193.ts'

export async function requestAccounts(this:Flow) {
    return await wp1193.requestAddresses()
}