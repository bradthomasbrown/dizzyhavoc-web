import * as robin from "lib/bridge/madness/robin.ts";
import { getAccount } from "lib/bridge/madness/getters/getAccount.ts";
import { state } from "lib/state.ts";
import { Connector, ConnectorState } from "islands/common/Connector.tsx";

export function onAccountsChanged(accounts: string[]) {
  // if accounts haven't actually changed, do nothing
  if (String(state.accounts.value) === String(accounts)) return;

  // cause downstream to amberload if applicable
  if (
    state.from.rpc.value &&
    state.from.height.value !== undefined
  ) {
    state.loading.from.dzhvBalance.value = "loading-[#ffbf0060]";
  }

  // abort the robin controller
  robin.abort();

  // set the accounts in state
  state.accounts.value = accounts;

  // try to get the account
  getAccount();

  Connector.set(ConnectorState.READY);

  robin.restart();
}
