import { graphDFSLoList, type GraphList } from "./graph-list";
import { graphDFSLoMatrix, type GraphMatrix } from "./graph-matrix";

export function tarjanBridgesList(graph: GraphList) {
  const { pre, pa, lo } = graphDFSLoList(graph);

  const colorMap = new Map<string, string>();

  let count = 0;

  for (let v = 0; v < graph.length; v++) {
    // O menor alcançado é ele mesmo && não é raiz => pa[v] -- v é uma ponte
    if (lo[v] === pre[v] && pa[v] !== v) {
      colorMap.set(`${pa[v]},${v}`, "red");
      colorMap.set(`${v},${pa[v]}`, "red");
      count++;
    }
  }

  return { count, colorMap };
}

export function tarjanBridgesMatrix(graph: GraphMatrix) {
  const { pre, pa, lo } = graphDFSLoMatrix(graph);

  const colorMap = new Map<string, string>();

  let count = 0;

  for (let v = 0; v < graph.length; v++) {
    // O menor alcançado é ele mesmo && não é raiz => pa[v] -- v é uma ponte
    if (lo[v] === pre[v] && pa[v] !== v) {
      colorMap.set(`${pa[v]},${v}`, "red");
      colorMap.set(`${v},${pa[v]}`, "red");
      count++;
    }
  }

  return { count, colorMap };
}
