import { uGraphLo, type Graph } from "./util/dfs";

function tarjanBridges(graph: Graph) {
  const { pre, pa, lo } = uGraphLo(graph);

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

function tarjanArticulations(graph: Graph) {
  const { pre, pa, lo } = uGraphLo(graph);

  const colorMap = new Map<string, string>();

  let count = 0;

  for (let v = 0; v < graph.length; v++) {
    let childCount = 0;

    // Conta quantos filhos v tem
    for (const w of graph[v]!) {
      // Se o pai de w é v, então w é filho de v
      if (pa[w] === v) {
        childCount++;
        // O menor alcançado pelo seu filho é maior ou igual a ele mesmo => Não é abraçado => Articulação
        if (lo[w]! >= pre[v]!) {
          colorMap.set(String(v), "red");
          count++;
        }
      }
    }

    // Se pai de v é ele mesmo => v é raiz
    if (pa[v] === v) {
      // Se raiz tem mais de um filho => articulação
      if (childCount > 1) {
        colorMap.set(String(v), "red");
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

export function tarjan(graph: Graph) {
  const bridges = tarjanBridges(graph);
  const articulations = tarjanArticulations(graph);

  return {
    articulations: articulations.count,
    bridges: bridges.count,
    colorMap: new Map([
      ...bridges.colorMap.entries(),
      ...articulations.colorMap.entries(),
    ]),
  };
}
