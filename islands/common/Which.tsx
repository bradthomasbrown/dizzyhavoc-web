import { computed, Signal } from "@preact/signals";
import { getIcon } from "../../lib/chains/icons.ts";
import { Input } from "./Input.tsx";

const filter = new Signal<string>("");

export function Which<C extends { name:string }>(
  props: { which: string; choices: C[]; onPick: (choice: C) => unknown, compareFn:Parameters<C[]['sort']>[0] },
) {
  const fsChoices = computed(() => {
    return [...props.choices]
      .filter((choice) =>
        JSON.stringify(choice).toLowerCase().match(filter.value.toLowerCase())
      )
      .sort(props.compareFn);
  });

  return (
    <div class="w-full h-full max-h-full flex flex-col grow">
      <div class="font-[Poppins] text-center pt-4 text-[#2c2c2c] dark:text-[#EAEAEA]">
        {props.which.slice(0, 1).toUpperCase()
          .concat(
            props.which.slice(1),
          )}
      </div>

      {/* search */}
      <Input
        clearClick={true}
        onInput={(e) => filter.value = e.currentTarget.value}
      />

      {/* choices */}
      <div class="grid place-items-center grid-flow-row grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2 max-w-full overflow-auto">
        {fsChoices.value.map((choice) => (
          <div class="min-w-24 min-h-24 max-w-24 max-h-24">
            <div
              class="hover:scale-[102%] active:scale-[98%] cursor-pointer flex flex-col items-center gap-1"
              onClick={() => props.onPick(choice)}
            >
              <picture>
                <source
                  srcset={getIcon(choice).dark}
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  draggable={false}
                  class="w-12 h-12"
                  src={getIcon(choice).light}
                />
              </picture>

              <div class="select-none text-center lg:text-sm text-xs text-[#2c2c2c] dark:text-[#EAEAEA]">
                {choice.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
