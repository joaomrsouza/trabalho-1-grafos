import { graphDFSLoList, type GraphList } from "./graph-list";
import { graphDFSLoMatrix, type GraphMatrix } from "./graph-matrix";

export function tarjanArticulationsList(graph: GraphList) {
  const { pre, pa, lo } = graphDFSLoList(graph);

  const colorMap = new Map<string, string>();

  let count = 0;

  for (let v = 0; v < graph.length; v++) {
    let childCount = 0;

    // Conta quantos filhos v tem
    graph[v]?.forEach((w) => {
      // Se o pai de w é v, então w é filho de v
      if (pa[w] === v) {
        childCount++;
        // O menor alcançado pelo seu filho é maior ou igual a ele mesmo => Não é abraçado => Articulação
        if (lo[w]! >= pre[v]!) {
          colorMap.set(String(v), "blue");
          count++;
        }
      }
    });

    // Se pai de v é ele mesmo => v é raiz
    if (pa[v] === v) {
      // Se raiz tem mais de um filho => articulação
      if (childCount > 1) {
        colorMap.set(String(v), "blue");
        count++;
      } else {
        count--;
        colorMap.set(String(v), "lime");
        // colorMap.delete(String(v));
      }
    }
  }

  return { count, colorMap };
}

export function tarjanArticulationsMatrix(graph: GraphMatrix) {
  const { pre, pa, lo } = graphDFSLoMatrix(graph);

  const colorMap = new Map<string, string>();

  let count = 0;

  for (let v = 0; v < graph.length; v++) {
    let childCount = 0;

    // Conta quantos filhos v tem
    graph[v]?.forEach((isAdjacent, w) => {
      if (!isAdjacent) return;
      // Se o pai de w é v, então w é filho de v
      if (pa[w] === v) {
        childCount++;
        // O menor alcançado pelo seu filho é maior ou igual a ele mesmo => Não é abraçado => Articulação
        if (lo[w]! >= pre[v]!) {
          colorMap.set(String(v), "blue");
          count++;
        }
      }
    });

    // Se pai de v é ele mesmo => v é raiz
    if (pa[v] === v) {
      // Se raiz tem mais de um filho => articulação
      if (childCount > 1) {
        colorMap.set(String(v), "blue");
        count++;
      } else {
        count--;
        colorMap.set(String(v), "lime");
        // colorMap.delete(String(v));
      }
    }
  }

  return { count, colorMap };
}
