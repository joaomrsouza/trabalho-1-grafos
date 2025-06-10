import type { GraphList } from "./graph-list";
import type { GraphMatrix } from "./graph-matrix";
import {
  tarjanArticulationsList,
  tarjanArticulationsMatrix,
} from "./tarjan-articulations";
import { tarjanBridgesList, tarjanBridgesMatrix } from "./tarjan-bridges";

export function tarjanList(graph: GraphList) {
  const bridges = tarjanBridgesList(graph);
  const articulations = tarjanArticulationsList(graph);

  return {
    articulations: articulations.count,
    bridges: bridges.count,
    colorMap: new Map([
      ...bridges.colorMap.entries(),
      ...articulations.colorMap.entries(),
    ]),
  };
}

export function tarjanMatrix(graph: GraphMatrix) {
  const bridges = tarjanBridgesMatrix(graph);
  const articulations = tarjanArticulationsMatrix(graph);

  return {
    articulations: articulations.count,
    bridges: bridges.count,
    colorMap: new Map([
      ...bridges.colorMap.entries(),
      ...articulations.colorMap.entries(),
    ]),
  };
}
