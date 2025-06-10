export type GraphMatrix = number[][];

function graphDFS(graph: GraphMatrix) {
  const pre: number[] = Array(graph.length).fill(-1);
  const post: number[] = Array(graph.length).fill(-1);
  const pa: number[] = [];

  let preCount = 0;
  let postCount = 0;

  function dfsR(v: number) {
    pre[v] = preCount++;

    graph[v]?.forEach((isAdjacent, w) => {
      if (!isAdjacent) return;
      if (pre[w] === -1) {
        pa[w] = v;
        dfsR(w);
      }
    });

    post[v] = postCount++;
  }

  for (let v = 0; v < graph.length; v++) {
    if (pre[v] === -1) {
      pa[v] = v;
      dfsR(v);
    }
  }

  return { pre, post, pa };
}

export function graphDFSLoMatrix(graph: GraphMatrix) {
  const { pre, post, pa } = graphDFS(graph);

  const vv: number[] = [];
  const lo: number[] = [];

  for (let v = 0; v < graph.length; v++) {
    vv[post[v]!] = v;
  }

  for (let i = 0; i < graph.length; i++) {
    const v = vv[i]!;
    lo[v] = pre[v]!;

    graph[v]?.forEach((isAdjacent, w) => {
      if (!isAdjacent) return;
      if (pre[w]! < pre[v]!) {
        if (w != pa[v]) lo[v] = Math.min(lo[v]!, pre[w]!);
      } else {
        if (pa[w] === v) lo[v] = Math.min(lo[v]!, lo[w]!);
      }
    });
  }

  return { pre, post, pa, lo };
}
