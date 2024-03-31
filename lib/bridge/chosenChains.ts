import { Signal } from "@preact/signals";
import { Chain } from "../internal.ts";

export const chosenChains = new Signal<Record<string, Chain>>({});