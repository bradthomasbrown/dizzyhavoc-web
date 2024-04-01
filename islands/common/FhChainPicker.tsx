// inspiration from fabianhortiguela's chain selector button

import { Signal } from "@preact/signals";
import { Chain } from "../../lib/internal.ts";
import { JSX } from "preact/jsx-runtime";
import { chainSrc } from "../../lib/chainSrc.ts";
import { Blockie } from "../../lib/blockies/Blockie.ts";

export function FhChainPicker(
  props:
    & Omit<JSX.DOMAttributes<HTMLDivElement>, "onClick">
    & {
      chosenChains: Signal<Record<string, Chain>>;
      id: string;
      onClick: (id: string) => unknown;
      addClass?: string;
    },
) {
  const { chosenChains, id, onClick } = props;
  const { src, dsrc } = chainSrc(chosenChains.value[id]?.chainId);
  return (
    <div class={`flex flex-row items-center ${props.addClass}`}>
      <div
        onClick={() => onClick(id)}
        class="hover:scale-[102%] active:scale-[98%] sm:w-16 sm:h-16 w-8 h-8 border-2 flex justify-center items-center rounded-full border-[#282828] dark:border-[#d2d2d2] sm:p-3 p-1 cursor-pointer "
      >
        {chosenChains.value[id]
          ? (
            <picture title={chosenChains.value[id].name}>
              <source
                srcset={dsrc ?? src ?? Blockie.randB64()}
                media="(prefers-color-scheme: dark)"
              />{" "}
              <img
                draggable={false}
                class="select-none w-full h-full"
                src={src ?? Blockie.randB64()}
              />
            </picture>
          )
          : (
            <svg
              class="w-full h-full text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>{id}</title>
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
