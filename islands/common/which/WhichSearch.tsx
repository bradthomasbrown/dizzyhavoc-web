import { Signal } from "@preact/signals";
import { Input } from "../Input.tsx";

export function WhichSearch(props: { filter: Signal<string> }) {
  return (
    <Input
      clearClick={true}
      onInput={(e) => props.filter.value = e.currentTarget.value}
    />
  );
}
