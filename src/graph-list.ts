export type GraphList = number[][];

// Realiza uma busca em profundidade no grafo
function graphDFS(graph: GraphList) {
  const pre: number[] = Array(graph.length).fill(-1); // Pre ordem
  const post: number[] = Array(graph.length).fill(-1); // Pos ordem
  const pa: number[] = []; // Pai do vértice

  // Contadores para as ordens
  let preCount = 0;
  let postCount = 0;

  // Função recursiva para a busca em profundidade
  function dfsR(v: number) {
    pre[v] = preCount++; // Atualiza a pre ordem

    // Para cada vértice adjacente
    graph[v]?.forEach((w) => {
      // Se o vértice não foi visitado
      if (pre[w] === -1) {
        pa[w] = v; // Atualiza o pai do vértice
        dfsR(w); // Chama a função recursiva para o vértice adjacente
      }
    });

    post[v] = postCount++; // Atualiza a pos ordem
  }

  // Para cada vértice
  for (let v = 0; v < graph.length; v++) {
    // Se o vértice não foi visitado
    if (pre[v] === -1) {
      pa[v] = v; // Atualiza o pai do vértice
      dfsR(v); // Chama a função recursiva para o vértice
    }
  }

  return { pre, post, pa };
}

// Calcula a lista de low para cada vértice
export function graphDFSLoList(graph: GraphList) {
  const { pre, post, pa } = graphDFS(graph);

  const vv: number[] = []; // Vértice em pos ordem
  const lo: number[] = []; // Low para cada vértice

  // Gera a lista de vértices em pos ordem
  for (let v = 0; v < graph.length; v++) {
    vv[post[v]!] = v;
  }

  // Para cada vértice
  for (let i = 0; i < graph.length; i++) {
    const v = vv[i]!;

    // Atualiza o low do vértice
    lo[v] = pre[v]!;

    // Para cada vértice adjacente w de v
    graph[v]?.forEach((w) => {
      // Se w for descendente de v
      if (pre[w]! < pre[v]!) {
        // Se w não for o pai de v
        if (w != pa[v]) lo[v] = Math.min(lo[v]!, pre[w]!); // Atualiza o low de v
      } else {
        // Se w for descendente de v
        if (pa[w] === v) lo[v] = Math.min(lo[v]!, lo[w]!); // Atualiza o low de v
      }
    });
  }

  return { pre, post, pa, lo };
}
