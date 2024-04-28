import { state } from "lib/state.ts";
import { hexshort } from "lib/hexshort.ts";
import { computed, effect, Signal } from "@preact/signals";

let disposed = false;
const dispose = effect(() => state.recipient.value = state.account.value);

const blurred = new Signal<boolean>(true);

const uRecipient = computed(() => {
  const recipient = state.recipient.value;
  if (!blurred.value) return recipient;
  else if (!recipient || recipient.length < 11) return "";
  else return hexshort(recipient);
});

const uPlaceholder = computed(() => {
  if (!state.recipient.value) return "recipient";
  else return hexshort(state.recipient.value);
});

export function Recipient() {
  return (
    <>
      <input
        class={`
          ![&::-webkit-calendar-picker-indicator]:hidden
          px-2 py-1 w-full bg-transparent text-center font-mono
        `}
        list="accounts"
        onInput={(e) => {
          if (!disposed) {
            dispose();
            disposed = true;
          }
          state.recipient.value = e.currentTarget.value;
        }}
        placeholder={uPlaceholder}
        onBlur={() => blurred.value = true}
        onFocus={() => blurred.value = false}
        value={uRecipient.value}
      />
      <datalist id="accounts">
        {state.accounts.value.map((a) => <option value={a} />)}
      </datalist>
    </>
  );
}
