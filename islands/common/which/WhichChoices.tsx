import { Choice } from "./Choice.tsx";

export function WhichChoices(
  props: { choices: Choice[]; onPick: (choice: Choice) => unknown },
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
