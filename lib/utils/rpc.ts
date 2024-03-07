import { signal } from '@preact/signals'
const rpc = signal<string|undefined>(undefined)
export { rpc }