import { Gate } from "https://deno.land/x/gate@0.0.0/mod.ts";
import { batch } from "@preact/signals";
import { TStateOperator, VortexFlow } from "../../../state2/Vortex.ts";
import { poll } from "../poll.ts";

export const block: VortexFlow = async function () {
  // trigger and refresh the abort controller
  const controller = this.controller.reset();

  // invalidate values in tState as specified by this flow
  for (const key of this.invalidate) this.tState[key] = undefined;

  // while there are updaters that need to complete, run all updaters
  while (this.updaters.value.size) {
    const { signal } = controller;

    await Promise.all([...this.updaters.value].map((updater) => {
      const { tState, updaters, flow } = this;
      const key = this.dataKey.get(updater) as string;
      const dependencies = this.dependencies.get(updater) as string[];
      const operator = new TStateOperator({
        tState,
        key,
        controller,
        updater,
        updaters,
      });
      const datumUpdaterContext = { operator, dependencies, flow };
      return updater.bind(datumUpdaterContext)();
    }));
  }

  const gate = new Gate<void>();
  batch(() => {
    if (!controller.signal.aborted) {
      for (const [key, value] of Object.entries(this.tState)) {
        this.uState[key].value = value;
      }
    }
    gate.resolve();
  });
  await gate.promise;

  while (!controller.signal.aborted) await poll();
};
