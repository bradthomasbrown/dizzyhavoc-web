import { Vortex, VortexData, VortexFlows } from "../../state2/Vortex.ts";
import * as flows from "./flows/mod.ts";
flows satisfies VortexFlows;
import * as data from "./data/mod.ts";
data satisfies VortexData;

// the idea for bundling all external data into a vortex is that,
// otherwise, the user might have too many concurrent requests

export const dsVortex = new Vortex(flows, data);