import type { GraphList } from "../graph-list";
import type { GraphMatrix } from "../graph-matrix";

export function edgesToAdjList(edges: string[]) {
  const adjList: GraphList = [];

  edges.forEach((edge) => {
    const [source, target] = edge.split(",").map(Number);

    if (!adjList[source!]) {
      adjList[source!] = [];
    }

    adjList[source!]!.push(target!);

    if (!adjList[target!]) {
      adjList[target!] = [];
    }

    adjList[target!]!.push(source!);
  });

  for (let i = 0; i < adjList.length; i++) {
    if (!adjList[i]) {
      adjList[i] = [];
    }
  }

  return adjList;
}

export function edgesToAdjMatrix(edges: string[]) {
  const vertexNumber =
    Math.max(...edges.flatMap((e) => e.split(",").map(Number))) + 1;

  const adjMatrix: GraphMatrix = Array.from({ length: vertexNumber }, () =>
    new Array(vertexNumber).fill(0)
  );

  edges.forEach((edge) => {
    const [source, target] = edge.split(",").map(Number);

    adjMatrix[source!]![target!] = 1;
    adjMatrix[target!]![source!] = 1;
  });

  return adjMatrix;
}
