import { Signal } from "@preact/signals";
import { Input } from "components/common/mod.ts";

export function WhichSearch(props: { filter: Signal<string> }) {
  return (
    <Input
      clearClick={true}
      onClick={() => props.filter.value = ""}
      onInput={(e) => props.filter.value = e.currentTarget.value}
    />
  );
}
