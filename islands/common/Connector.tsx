import { Gate } from "https://cdn.jsdelivr.net/gh/bradbrown-llc/gate@0.0.0/mod.ts";
import { batch, computed, Signal } from "@preact/signals";
import { Button } from "../../components/common/Button.tsx";
import { evmVortex } from "../../lib/faucet/evmVortex/evmVortex.ts";
import { P1193, P6963 } from "../../lib/state2/providers.ts";
import { Which } from './which/Which.tsx'

export const status = computed(() => {
  const uAddresses = evmVortex.uState.addresses.value;
  const updaters = evmVortex.updaters.value;
  const updater = evmVortex.data.addresses.updater;
  const tAddresses = evmVortex.tState.addresses;
  const foo = `?${!uAddresses ? 0 : uAddresses instanceof Error ? 1 : 2}${
    !updaters.has(updater) ? 0 : 2
  }${!tAddresses ? 0 : tAddresses instanceof Error ? 1 : 2}`;
  if (uAddresses && !(uAddresses instanceof Error)) return "Connected";
  if (updaters.has(updater)) return "Connecting";
  if ((tAddresses && !(tAddresses instanceof Error))) return "Loading";
  if (
    (!uAddresses || uAddresses instanceof Error) &&
    (!tAddresses || tAddresses instanceof Error) &&
    !updaters.has(updater)
  ) return "Connect";
  return foo;
});

const disabled = computed(() => status.value != "Connect");

const choices = new Signal<undefined | P6963[]>(undefined);
const choiceGate = new Signal<undefined | Gate<P1193>>(undefined);

export function onChoice(p6963: P6963) {
  batch(() => {
    choices.value = undefined;
    choiceGate.value?.resolve(p6963.provider);
    choiceGate.value = undefined;
  });
}

export const which = new Signal<undefined|ReturnType<typeof Which>>(undefined)

function onConnect() {
  evmVortex.flow("init");
}

export function Connector() {
  return (
    <>
      {/* {choices.value
        ? (
          <div class="lg:text-[1.2rem] unselectable text-[1rem] font-[Poppins] font-medium dark:text-[#d2d2d2] text-[#282828] flex flex-col items-center w-[200px] gap-3">
            Choose a provider
            <div class="flex gap-2 flex-wrap">
              {choices.value.map((choice) => (
                <div
                  class="flex flex-col justify-center items-center h-24 w-24 cursor-pointer grow gap-1"
                  onClick={() => onChoice(choice)}
                >
                  <img
                    draggable={false}
                    class="hover:scale-[102%] active:scale-[98%] min-h-16 min-w-16 max-h-16 max-w-16"
                    src={choice.info.icon}
                  />
                  <div class="select-none font-light text-[0.75rem]">
                    {choice.info.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) */}
        
      <Button
        disabled={disabled.value}
        addClass="text-[#3d3d3d] dark:text-[#d7d7d7]"
        onClick={onConnect}
      >
        {status}
      </Button>
        
    </>
  );
}
