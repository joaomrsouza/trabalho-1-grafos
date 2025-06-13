import { writeFile } from "./util/file";

export type GraphConfig = {
  colorMap?: Map<string, string>; // Mapa de cores para vértices e arestas
  positionMap?: Map<number, [number, number]>; // Mapa de posições para vértices
  density?: number; // Densidade de vértices do grafo
  showLabels?: boolean; // Define se as labels serão exibas
  digraph?: boolean; // Renderiza um grafo direcionado
};

// Transforma um objeto qualquer em string com a sintaxe do DOT
function toDOTConfig(obj: Record<string, unknown>) {
  return Object.entries(obj)
    .map(([key, value]) => `${key}="${value}";`)
    .join("\n    ");
}

// Converte um array de arestas ("u,v") em um grafo em formato DOT
// * Nota: Sem fornecer um positionMap a função assume que os vértices são números inteiros contínuos de 0 a n-1 e usa isso para posicionar os vértices em grid
function createGraphDOT(edges: string[], config: GraphConfig = {}) {
  // Configurações de visualização do grafo

  const showLabels = config.showLabels ?? false; // Se deve mostrar os rótulos dos vértices
  const density = config.density ?? (showLabels ? 2 : 4); // Densidade dos vértices
  const digraph = config.digraph ?? false;

  const { colorMap, positionMap } = config;

  // Tamanho dos vértices
  const nodeSize = 0.1 * (showLabels ? 2 : 1);

  // Configurações dos vértices
  const nodeConfig = {
    shape: "circle",
    fixedsize: true,
    width: nodeSize,
    height: nodeSize,
    style: "filled",
    fillcolor: "lightblue",
    fontname: "Helvetica",
    fontsize: 10,
    fontcolor: "black",
    ...(showLabels ? {} : { label: "" }),
  };

  // Configurações das arestas
  const edgeConfig = {
    arrowsize: 0.3,
    color: "black",
  };

  // Cria um conjunto de vértices
  const nodes = new Set(edges.flatMap((l) => l.split(",")).map(Number));

  // Calcula o tamanho do grafo considerando o maior vértice
  const size = Math.ceil(Math.sqrt(Math.max(...nodes) + 1));

  // Converte as configurações dos vértices em uma string para o DOT
  const nodeConfigString = toDOTConfig(nodeConfig);
  const edgeConfigString = toDOTConfig(edgeConfig);

  // Cria grupos de vértices para o DOT
  // * Nota: Ajudam a organizar os vértices para a engine "dot", útil para grafos pequenos quaisquer
  const nodeGroups = Array.from({ length: size }, (_, i) => {
    const groupNodes: string[] = [];

    for (let j = 0; j < size; j++) {
      const nodeId = i * size + j;
      if (nodes.has(nodeId)) groupNodes.push(`    ${nodeId}`);
    }

    if (groupNodes.length === 0) return "";

    return `
  subgraph {
    rank = same;
${groupNodes.join(";\n")}
  }`;
  }) // Filtra fora os grupos vazios
    .filter(Boolean)
    .join("\n");

  const nodeNumber = size ** 2; // Calcula o número de vértices
  const higherNodeIndex = size - 1; // Calcula o índice do último vértice

  // Contadores para a posição dos vértices
  let colCounter = 0;
  let lineCounter = higherNodeIndex;

  // Cria uma string para cada vértice (posição e cor, e invisível se não estiver na lista de vértices)
  // * Nota: Gera (se não houver um positionMap) e especifica a posição dos vértices para a engine "neato", permitindo que o grafo seja visualizado em uma grade
  const nodesString = Array.from({ length: nodeNumber }, (_, i) => {
    // Atualiza o contador de linhas se o vértice estiver na borda
    if (i % size === 0 && i !== 0) lineCounter--; // Contador decrescente para os vertices começarem no topo da grade

    // Obtém a cor do vértice
    const color = colorMap?.get(String(i));

    // Obtem a posição do vértice
    const [positionX, positionY] = positionMap?.get(i) ?? [
      lineCounter,
      colCounter,
    ];

    // Cria a string do vértice
    const nodeString = `  ${i} [pos="${positionY / density},${
      positionX / density
    }!"${color ? `, fillcolor="${color}"` : ""}];`;

    colCounter++; // Atualiza o contador de colunas
    if (colCounter > higherNodeIndex) colCounter = 0; // Volta para a primeira coluna se chegar no final da grade

    // Ignora o vértice se ele não existir em nenhuma aresta
    return nodes.has(i) ? nodeString : "";
  }) // Filtra fora os vértices que não fazem parte do grafo
    .filter(Boolean)
    .join("\n");

  // Cria uma string para cada aresta
  const edgesString = edges
    .map((edge) => {
      const [source, target] = edge.split(",");

      // Obtém a cor da aresta
      const color = colorMap?.get(edge);

      // Cria a string da aresta
      return `  ${source} -${digraph ? ">" : "-"} ${target}${
        color ? ` [color="${color}"]` : ""
      };`;
    })
    .join("\n");

  // Cria a string do DOT
  // * Nota: Se for fornecido um positionMap os nodeGroups não são usados, visto que o intuito é que grafo deve ser renderizado com a engine "neato"
  return `
${digraph ? "di" : ""}graph {
  rankdir = LR;
  nodesep="${0.5 / density}";

  node [
    ${nodeConfigString}
  ];

  edge [
    ${edgeConfigString}
  ];

${positionMap ? "" : nodeGroups}

${nodesString}

${edgesString}
}`;
}

// Escreve um arquivo DOT com o conteúdo
function writeDOTToFile(filename: string, content: string) {
  writeFile(`dot/${filename}.dot`, content);
  console.log(`Graph DOT saved to ./generated/dot/${filename}.dot`);
}

// Cria um arquivo DOT com o grafo
export function createGraphDotFile(
  filename: string,
  edges: string[],
  config: GraphConfig = {}
) {
  const content = createGraphDOT(edges, config);

  writeDOTToFile(filename, content);
}
