import { Form } from "components/bridge/mod.ts";
import { dzkv } from "lib/mod.ts";
import { Signal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

dzkv.set<Signal<null | JSX.Element>>(["which"], new Signal(null));

export function ActiveForm() {
  return dzkv.get<Signal<null | JSX.Element>>(["which"])!.value ??
    <Form />;
}