import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.1/mod.ts";
import { batch } from "@preact/signals";
import { TStateOperator, VortexFlow } from "../../../state2/Vortex.ts";
import { dsVortex } from "../dsVortex.ts";
import { chosenChains } from "../../chosenChains.ts";

export const priceCheck: VortexFlow = async function () {
  // trigger and refresh the abort controller
  const controller = this.controller.reset();

  if (!chosenChains.get('from')!.value && !chosenChains.get('to')!.value) {
    controller.abort();
    this.updaters.value.clear();
    return;
  }

  // invalidate values in tState as specified by this flow
  for (const key of this.invalidate) this.tState[key] = undefined;

  // while there are updaters that need to complete, run all updaters
  while (this.updaters.value.size) {
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

  if (
    !controller.signal.aborted &&
    (chosenChains.get('from')!.value || chosenChains.get('to')!.value)
  ) {
    setTimeout(() => dsVortex.flow("priceCheck"), 0);
  }
};
