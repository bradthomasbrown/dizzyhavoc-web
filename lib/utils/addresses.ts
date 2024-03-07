import { signal } from '@preact/signals'
const addresses = signal<string[]>([])
export { addresses }