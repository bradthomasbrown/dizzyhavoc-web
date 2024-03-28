import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import { getIcon } from "../../lib/chains/icons.ts";
import { Chain } from "../../lib/internal.ts";
import { Input } from "./Input.tsx";

export function WhichChain(
  props: { which: string; chains: Chain[]; onPick: (chain: Chain) => unknown },
) {
  const sortedChains = new Signal<Chain[]>(
    props.chains.sort((a, b) =>
      a.name < b.name ? -1 : a.name == b.name ? 0 : 1
    ),
  );

  function onFilterChange(e: JSX.TargetedEvent<HTMLInputElement>) {
    if (e.currentTarget.value) {
      sortedChains.value = props.chains
        .filter((chain) =>
          JSON.stringify(chain).toLowerCase().match(
            e.currentTarget.value.toLowerCase(),
          )
        )
        .sort((a, b) => a.name < b.name ? -1 : a.name == b.name ? 0 : 1);
    }
  }

  return (
    <div class="w-full h-full max-h-full flex flex-col grow">
      <div class="font-[Poppins] text-center pt-4 text-[#2c2c2c] dark:text-[#EAEAEA]">
        {props.which.slice(0, 1).toUpperCase()
          .concat(
            props.which.slice(1),
          )}
      </div>

      {/* search */}
      <Input clearClick={true} onInput={onFilterChange} />

      {/* choices */}
      <div class="grid place-items-center grid-flow-row grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 max-w-full overflow-auto">
        {sortedChains.value.map((chain) => (
          <div class="min-w-24 min-h-24 max-w-24 max-h-24">
            <div
              class="hover:scale-[102%] active:scale-[98%] cursor-pointer flex flex-col items-center gap-1"
              onClick={() => props.onPick(chain)}
            >
              <picture>
                <source
                  srcset={getIcon(
                    chain.chainId,
                  ).dark}
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  draggable={false}
                  class="w-12 h-12"
                  src={getIcon(chain.chainId)
                    .light}
                />
              </picture>

              <div class="select-none text-center lg:text-sm text-xs text-[#2c2c2c] dark:text-[#EAEAEA]">
                {chain.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
