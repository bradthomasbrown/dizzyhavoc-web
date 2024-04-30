import { state } from "lib/faucet/state.ts";

export function getAccount() {
  state.account.value = state.accounts.value?.at(0);
}
