// inspiration from fabianhortiguela's chain selector button

import { Signal } from "@preact/signals";
import { getIcon } from "../../lib/chains/icons.ts";
import { Chain } from "../../lib/internal.ts";

export function FhChainPicker(
  props: {
    chosen: Signal<Record<string, Chain>>;
    which: string;
    onClick: (which: string) => unknown;
  },
) {
  const { chosen, which, onClick } = props;
  return (
    <div class="flex flex-row items-center">
      <div
        onClick={() => onClick(which)}
        class="w-[80px] h-[80px] border-2 flex justify-center items-center rounded-full border-brand-violet950 p-3 bg-dark-stone950 cursor-pointer hover:border-brand-lime600"
      >
        {chosen.value[which]
          ? (
            <picture title={chosen.value[which].name}>
              <source
                srcset={getIcon(chosen.value[which].chainId).dark}
                media="(prefers-color-scheme: dark)"
              />{" "}
              <img
                class="w-[52px] h-[52px]"
                src={getIcon(chosen.value[which].chainId).light}
              />
            </picture>
          )
          : (
            <svg
              class="w-[52px] h-[52px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>{which}</title>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"
              />
            </svg>
          )}
      </div>
    </div>
  );
}
