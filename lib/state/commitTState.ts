import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
import { batch, Signal } from "@preact/signals-core";
import { DAppState, state, TState } from "../internal.ts";

export async function commitTState(tState: TState) {
  // if tState contains null values, we cannot commit
  if (
    Object.values(tState).reduce((p, c) => c instanceof Error || p, false)
  ) {
    const nullKeys = Object.entries(tState)
      .filter(([_, v]) => v === null)
      .map(([k]) => k);
    // log keys of TState with null values
    console.error(
      new Error(
        `cannot commit TState due to nullKeys: ${JSON.stringify(nullKeys)}`,
      ),
    );
    return;
  }
  // if tState nonce <= ustate nonce, then don't commit
  if (tState.stateNonce <= state.stateNonce) {
    console.log(
      `not committing TState, old stateNonce (T${tState.stateNonce} <= U${state.stateNonce})`,
    );
    return;
  }
  // batch update state signals using tState
  const gate = new Gate<void>();
  batch(() => {
    // pull signals from UState
    const stateSignals = Object.entries(state)
      .filter(([_, v]) => v instanceof Signal) as [
        keyof DAppState,
        Signal,
      ][];
    // update signal values
    for (const [key, signal] of stateSignals) {
      signal.value = tState[key];
    }
    // update stateNonce
    state.stateNonce = tState.stateNonce;
    gate.resolve();
  });
  await gate.promise;
}
