import { Signal, computed } from "@preact/signals";
import { Choice } from "./Choice.tsx";

export function WhichChoices<T extends unknown>(
  { filter, choices, onPick, compareFn }: {
    filter: Signal<string>
    choices: Choice<T>[]
    onPick: (choice: Choice<T>) => unknown
    compareFn?: Parameters<Choice<T>[]["sort"]>[0];
  },
) {
  const fsChoices = computed(() => {
    console.log(filter.value.toLocaleLowerCase())
    return [...choices].filter((choice) =>
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
        <Choice onPick={() => onPick(choice)} {...choice} />
      ))}
    </div>
  );
}
