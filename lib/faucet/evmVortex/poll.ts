import { ejra } from "../ejra.ts";
import { evmVortex } from "./evmVortex.ts";
export async function poll() {
  const { controller: { value: controller } } = evmVortex;
  const { rpc, height } = evmVortex.tState;
  if (!rpc || rpc instanceof Error) return;
  const newHeight = await ejra.height(rpc);
  if (newHeight instanceof Error) return;
  if (height === undefined || height instanceof Error || newHeight <= height) {
    return;
  }
  if (controller.signal.aborted) return;
  controller.abort();
  evmVortex.tState.height = newHeight;
  await evmVortex.flow("block");
}