import { Signal } from "@preact/signals";
import { getStateNonce, state, TState, ttrack } from "../internal.ts";
import { DAppState } from "../internal.ts";

export function createTState(invalidate: string[]) {
  // terminate ttrack if possible
  ttrack.value?.abortController.abort();

  // build tState, using ttrack.tState if applicable
  const stateEntries = Object.entries(state);
  const tStateEntries = stateEntries.map(([k, x]) => {
    // if x not signal (stateNonce), return same
    if (!(x instanceof Signal)) return [k, x];
    // if k is in invalidates, invalidate it
    if (invalidate.includes(k)) return [k, undefined];
    // if value is in TTrack'd TState, use that
    const value = ttrack.value?.tState[k as keyof DAppState];
    if (value) return [k, value];
    // otherwise, use UState value
    return [k, x.value];
  }) as [keyof TState, TState[keyof TState]][];
  const tState = Object.fromEntries(tStateEntries) as TState;
  tState.stateNonce = getStateNonce();

  // create a new abortController
  const abortController = new AbortController();
  // get the current updaters
  const updaters = ttrack.value?.updaters ? [...ttrack.value.updaters] : [];
  // set new ttrack
  ttrack.value = { tState, abortController, updaters };

  // return tState, abortController, and updaters
  return { tState, abortController, updaters };
}
