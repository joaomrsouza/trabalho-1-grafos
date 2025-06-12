import { graphDFSLoList, type GraphList } from "./graph-list";
import { graphDFSLoMatrix, type GraphMatrix } from "./graph-matrix";

// Calcula os vértices de articulação para um grafo em formato de lista de adjacência
export function tarjanArticulationsList(graph: GraphList) {
  const { pre, pa, lo } = graphDFSLoList(graph);

  const colorMap = new Map<string, string>(); // Mapa de cores para os vértices

  let count = 0; // Contador de vértices de articulação

  // Para cada vértice
  for (let v = 0; v < graph.length; v++) {
    let childCount = 0; // Contador de filhos de v

    // Para cada vértice adjacente
    graph[v]?.forEach((w) => {
      // Se o pai de w é v, então w é filho de v
      if (pa[w] === v) {
        childCount++; // Incrementa o contador de filhos de v

        // Se o menor alcançado pelo seu filho é maior ou igual a ele mesmo => não é abraçado => articulação
        if (lo[w]! >= pre[v]!) {
          colorMap.set(String(v), "blue"); // Define a cor do vértice como azul
          count++; // Incrementa o contador de vértices de articulação
        }
      }
    });

    // Se pai de v é ele mesmo => v é raiz
    if (pa[v] === v) {
      // Se raiz tem mais de um filho => articulação
      if (childCount > 1) {
        colorMap.set(String(v), "blue"); // Define a cor do vértice como azul
        count++; // Incrementa o contador de vértices de articulação
      } else {
        // Raiz que não é articulação => não é considerada
        count--; // Decrementa o contador de vértices de articulação
        colorMap.set(String(v), "lime"); // Define a cor do vértice como lime
      }
    }
  }

  return { count, colorMap };
}

// Calcula os vértices de articulação para um grafo em formato de matriz de adjacência
export function tarjanArticulationsMatrix(graph: GraphMatrix) {
  const { pre, pa, lo } = graphDFSLoMatrix(graph);

  const colorMap = new Map<string, string>(); // Mapa de cores para os vértices

  let count = 0; // Contador de vértices de articulação

  for (let v = 0; v < graph.length; v++) {
    let childCount = 0; // Contador de filhos de v

    // Para cada vértice adjacente
    graph[v]?.forEach((isAdjacent, w) => {
      if (!isAdjacent) return; // Se o vértice não for adjacente, retorna (não faz nada)

      // Se o pai de w é v, então w é filho de v
      if (pa[w] === v) {
        childCount++; // Incrementa o contador de filhos de v
        // Se o menor alcançado pelo seu filho é maior ou igual a ele mesmo => não é abraçado => articulação
        if (lo[w]! >= pre[v]!) {
          colorMap.set(String(v), "blue"); // Define a cor do vértice como azul
          count++; // Incrementa o contador de vértices de articulação
        }
      }
    });

    // Se pai de v é ele mesmo => v é raiz
    if (pa[v] === v) {
      // Se raiz tem mais de um filho => articulação
      if (childCount > 1) {
        colorMap.set(String(v), "blue"); // Define a cor do vértice como azul
        count++; // Incrementa o contador de vértices de articulação
      } else {
        // Raiz que não é articulação => não é considerada
        count--; // Decrementa o contador de vértices de articulação
        colorMap.set(String(v), "lime"); // Define a cor do vértice como lime
      }
    }
  }

  return { count, colorMap };
}
