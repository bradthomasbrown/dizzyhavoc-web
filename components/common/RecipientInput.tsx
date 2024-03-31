import { Signal } from "@preact/signals";
import { hexshort } from "../../lib/utils/hexshort.ts";

export const recipient = new Signal<string>("0x".padEnd(2 + 40, "0"));
const recipientFocused = new Signal<boolean>(false);

export function RecipientInput() {
  return (
    <input
      class="px-2 py-1 w-full bg-transparent text-center font-mono"
      placeholder={hexshort("0x".padEnd(2 + 40, "0"))}
      onInput={(e) => recipient.value = e.currentTarget.value}
      onBlur={(e) => {
        recipientFocused.value = false;
        if (
          recipient.value &&
          recipient.value !== "0x".padEnd(2 + 40, "0")
        ) e.currentTarget.value = hexshort(recipient.value);
      }}
      onFocus={(e) => {
        recipientFocused.value = true;
        if (
          recipient.value &&
          recipient.value !== "0x".padEnd(2 + 40, "0")
        ) {
          e.currentTarget.value = recipient.value;
        }
      }}
    />
  )
}