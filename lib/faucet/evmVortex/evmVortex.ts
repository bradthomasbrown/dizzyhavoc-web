import { Vortex, VortexData, VortexFlows } from "../../state2/Vortex.ts";
import * as flows from "./flows/mod.ts";
flows satisfies VortexFlows;
import * as data from "./data/mod.ts";
data satisfies VortexData;

export const evmVortex = new Vortex(flows, data);
