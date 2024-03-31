import { Signal } from "@preact/signals";
import { Which } from "../../islands/common/which/Which.tsx";

/**
 * A signal to a Which.
 * For the bridge. this will be the provider picker or a chain picker
 */
export const which = new Signal<undefined | ReturnType<typeof Which>>(
  undefined,
);
