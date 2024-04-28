import { state } from "lib/state.ts";

export function getAccount() {
  state.account.value = state.accounts.value?.at(0);
}
