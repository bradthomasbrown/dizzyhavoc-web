import { Signal } from "@preact/signals";
import { DAppState } from "../internal.ts";

type TTrack = Signal<
  {
    tState: DAppState;
    updaters: ((
      { tState, abortController }: {
        tState: DAppState;
        abortController: AbortController;
      },
    ) => Promise<void>)[];
    abortController: AbortController;
  } | undefined
>;

export const ttrack: TTrack = new Signal(undefined);
