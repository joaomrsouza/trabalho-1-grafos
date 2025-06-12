import { graphDFSLoList, type GraphList } from "./graph-list";
import { graphDFSLoMatrix, type GraphMatrix } from "./graph-matrix";

// Calcula as pontes para um grafo em formato de lista de adjacência
export function tarjanBridgesList(graph: GraphList) {
  const { pre, pa, lo } = graphDFSLoList(graph);

  const colorMap = new Map<string, string>(); // Mapa de cores para os vértices

  let count = 0; // Contador de pontes

  for (let v = 0; v < graph.length; v++) {
    // Se o menor alcançado é ele mesmo e não é raiz => pa[v] -- v é uma ponte
    if (lo[v] === pre[v] && pa[v] !== v) {
      // * Nota: Como não estamos usando digrafos, a cor é atribuída em ambas as direções da aresta para garantir a coloração independente do sentido da aresta (v -- pa[v] ou pa[v] -- v)
      colorMap.set(`${pa[v]},${v}`, "red"); // Define a cor da aresta pa[v] -- v como vermelho
      colorMap.set(`${v},${pa[v]}`, "red"); // Define a cor da aresta v -- pa[v] como vermelho
      count++; // Incrementa o contador de pontes
    }
  }

  return { count, colorMap };
}

// Calcula as pontes para um grafo em formato de matriz de adjacência
export function tarjanBridgesMatrix(graph: GraphMatrix) {
  const { pre, pa, lo } = graphDFSLoMatrix(graph);

  const colorMap = new Map<string, string>(); // Mapa de cores para os vértices

  let count = 0; // Contador de pontes

  for (let v = 0; v < graph.length; v++) {
    // Se o menor alcançado é ele mesmo e não é raiz => pa[v] -- v é uma ponte
    if (lo[v] === pre[v] && pa[v] !== v) {
      // * Nota: Como não estamos usando digrafos, a cor é atribuída em ambas as direções da aresta para garantir a coloração independente do sentido da aresta (v -- pa[v] ou pa[v] -- v)
      colorMap.set(`${pa[v]},${v}`, "red"); // Define a cor da aresta pa[v] -- v como vermelho
      colorMap.set(`${v},${pa[v]}`, "red"); // Define a cor da aresta v -- pa[v] como vermelho
      count++; // Incrementa o contador de pontes
    }
  }

  return { count, colorMap };
}
