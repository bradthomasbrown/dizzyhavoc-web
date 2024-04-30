import { Form } from "islands/faucet/Form.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import * as robin from "lib/faucet/madness/robin.ts";
import { state } from "lib/faucet/state.ts";

if (IS_BROWSER) robin.start();

export function ActiveForm() {
  return state.which.value ?? <Form />
}