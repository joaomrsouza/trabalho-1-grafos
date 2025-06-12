import type { GraphList } from "./graph-list";
import type { GraphMatrix } from "./graph-matrix";
import {
  tarjanArticulationsList,
  tarjanArticulationsMatrix,
} from "./tarjan-articulations";
import { tarjanBridgesList, tarjanBridgesMatrix } from "./tarjan-bridges";

// Calcula as pontes e vértices de articulação para um grafo em formato de lista de adjacência
export function tarjanList(graph: GraphList) {
  const bridges = tarjanBridgesList(graph); // Calcula as pontes
  const articulations = tarjanArticulationsList(graph); // Calcula os vértices de articulação

  return {
    articulations: articulations.count,
    bridges: bridges.count,
    // Junta os mapas de cores das pontes e vértices de articulação
    colorMap: new Map([
      ...bridges.colorMap.entries(),
      ...articulations.colorMap.entries(),
    ]),
  };
}

// Calcula as pontes e vértices de articulação para um grafo em formato de matriz de adjacência
export function tarjanMatrix(graph: GraphMatrix) {
  const bridges = tarjanBridgesMatrix(graph);
  const articulations = tarjanArticulationsMatrix(graph);

  return {
    articulations: articulations.count,
    bridges: bridges.count,
    // Junta os mapas de cores das pontes e vértices de articulação
    colorMap: new Map([
      ...bridges.colorMap.entries(),
      ...articulations.colorMap.entries(),
    ]),
  };
}
