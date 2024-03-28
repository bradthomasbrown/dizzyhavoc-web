import { signal } from "@preact/signals";
import { DAppState, e } from "../internal.ts";

const stateNonce = signal<bigint>(0n);
