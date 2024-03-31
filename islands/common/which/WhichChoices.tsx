import { Choice } from "./Choice.tsx";

export function WhichChoices<T extends unknown>(
  props: { choices: Choice<T>[]; onPick: (choice: Choice<T>) => unknown },
) {
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
      {props.choices.map((choice) => (
        <Choice onPick={() => props.onPick(choice)} {...choice} />
      ))}
    </div>
  );
}
