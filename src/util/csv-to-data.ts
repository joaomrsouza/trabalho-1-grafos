export function edgesToAdjList(edges: string[]) {
  const adjList: number[][] = [];

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
