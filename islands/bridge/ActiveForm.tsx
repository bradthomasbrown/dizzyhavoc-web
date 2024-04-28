import { Form } from "components/bridge/mod.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import * as robin from "lib/bridge/madness/robin.ts";
import { state } from "lib/state.ts";

if (IS_BROWSER) robin.start();

export function ActiveForm() {
  return state.which.value ?? <Form />;
}
