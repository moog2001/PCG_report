import { makeProject } from "@motion-canvas/core";
import BSP from "./scenes/BSP?scene";
import * as seedrandom from "seedrandom";
import GRID from "./scenes/GRID?scene";
import INTRO from "./scenes/INTRO?scene";
import OUTRO from "./scenes/OUTRO?scene";

export default makeProject({
  scenes: [INTRO, BSP, GRID, OUTRO],
});
