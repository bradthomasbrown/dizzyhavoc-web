import { Button } from "components/common/Button.tsx";
import { computed } from '@preact/signals'
import { state } from "lib/state.ts";

const disabled = computed(() => {
  if (!state.to.input.bigint.value) return true
  return false
})

export function BridgeButton() {
  return <Button disabled={disabled}>Bridge</Button>
}