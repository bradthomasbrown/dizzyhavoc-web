import { computed, Signal } from "@preact/signals";
import { WhichChoice } from "./WhichChoice.tsx";
import { Choice } from 'lib'

export function WhichChoices<T extends unknown>(
  { filter, choices, onPick, compareFn }: {
    filter: Signal<string>;
    choices: Signal<Choice<T>[]>;
    onPick: (value:T) => unknown;
    compareFn?: Parameters<Choice<T>[]["sort"]>[0];
  },
) {
  const fsChoices = computed(() => {
    return [...choices.value].filter((choice) =>
      JSON.stringify(choice.space ?? choice.value).toLowerCase().match(
        filter.value.toLowerCase(),
      )
    ).sort(compareFn);
  });
  return (
    <div
      class={`
        grid
        place-items-center
        grid-flow-row
        grid-cols-[repeat(auto-fill,minmax(96px,1fr))]
        gap-2
        max-w-full
        overflow-auto`}
    >
      {fsChoices.value.map((choice) => (
        <WhichChoice onPick={() => onPick(choice.value)} {...choice} />
      ))}
    </div>
  );
}
