import { Signal, computed, effect } from "@preact/signals";
import { evmVortex } from '../../lib/faucet/evmVortex/evmVortex.ts'
import { hexshort } from "../../lib/hexshort.ts";

export const recipient = new Signal<string>("");

const pureAddresses = computed(() => {
  const addresses = evmVortex.uState.addresses.value
  if (addresses instanceof Error || addresses === undefined) return []
  return addresses
})

let disposed = false
const dispose = effect(() => {
  recipient.value = pureAddresses.value[0] ?? ""
})

const blurred = new Signal<boolean>(true)
const uRecipient = computed(() => {
  if (!blurred.value) return recipient.value
  else if (!recipient.value || recipient.value.length < 11) return ""
  else return hexshort(recipient.value)
})

const uPlaceholder = computed(() => {
  if (!recipient.value) return "recipient"
  else return hexshort(recipient.value) 
})

export function RecipientInput() {
  return (
    <>
      <input
        class="px-2 py-1 w-full bg-transparent text-center font-mono order-3"
        list="addresses"
        onInput={e => {
          if (!disposed) { dispose(); disposed = true }
          recipient.value = e.currentTarget.value
        }}
        placeholder={uPlaceholder}
        onBlur={() => blurred.value = true}
        onFocus={() => blurred.value = false}
        value={uRecipient.value}
      />
      <datalist id="addresses">
        {pureAddresses.value.slice(1).map(address => <option value={address}></option>)}
      </datalist>
    </>
  )
}