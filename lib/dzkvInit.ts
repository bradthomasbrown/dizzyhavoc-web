import { Signal } from "@preact/signals";
import { dzkv } from "lib/dzkv.ts";

dzkv.set(['state', 'active'], new Signal())
dzkv.set(['loading', 'active'], new Signal('unload-[]'))