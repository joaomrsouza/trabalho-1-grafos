import type { GraphList } from "../graph-list";
import type { GraphMatrix } from "../graph-matrix";

// Converte um array de arestas ("u,v") em uma lista de adjacência
export function edgesToAdjList(edges: string[]) {
  const adjList: GraphList = [];

  edges.forEach((edge) => {
    // Separa a aresta em dois vértices
    const [source, target] = edge.split(",").map(Number);

    // Adiciona o vértice fonte na lista se não existir
    if (!adjList[source!]) {
      adjList[source!] = [];
    }

    // Adiciona o vértice alvo na lista de adjacência do vértice fonte
    adjList[source!]!.push(target!);

    // Adiciona o vértice alvo na lista se não existir
    if (!adjList[target!]) {
      adjList[target!] = [];
    }

    // Adiciona o vértice na lista de adjacência do vértice alvo
    adjList[target!]!.push(source!);
  });

  // Adiciona vértices que não possuem arestas com lista vazia
  for (let i = 0; i < adjList.length; i++) {
    if (!adjList[i]) {
      adjList[i] = [];
    }
  }

  return adjList;
}

// Converte um array de arestas ("u,v") em uma matriz de adjacência
export function edgesToAdjMatrix(edges: string[]) {
  // Encontra o número de vértices
  const vertexNumber =
    Math.max(...edges.flatMap((e) => e.split(",").map(Number))) + 1;

  // Cria uma matriz de adjacência com o número de vértices
  const adjMatrix: GraphMatrix = Array.from({ length: vertexNumber }, () =>
    new Array(vertexNumber).fill(0)
  );

  edges.forEach((edge) => {
    // Separa a aresta em dois vértices
    const [source, target] = edge.split(",").map(Number);

    // Adiciona a aresta na matriz de adjacência
    adjMatrix[source!]![target!] = 1;
    adjMatrix[target!]![source!] = 1;
  });

  return adjMatrix;
}
