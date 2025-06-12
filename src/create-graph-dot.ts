import { writeFile } from "./util/file";

export type GraphConfig = {
  colorMap?: Map<string, string>; // Mapa de cores para vértices e arestas
};

// Configurações de visualização do grafo

const SHOW_LABELS = false; // Se deve mostrar os rótulos dos vértices
const DENSITY = SHOW_LABELS ? 2 : 4; // Densidade dos vértices

// Tamanho dos vértices
const nodeSize = 0.1 * (SHOW_LABELS ? 2 : 1);

// Configurações dos vértices
const NODE_CONFIG = {
  shape: "circle",
  fixedsize: true,
  width: nodeSize,
  height: nodeSize,
  style: "filled",
  fillcolor: "lightblue",
  fontname: "Helvetica",
  fontsize: 10,
  fontcolor: "black",
  ...(SHOW_LABELS ? {} : { label: "" }),
};

// Converte um array de arestas ("u,v") em um grafo em formato DOT
// * Nota: A função assume que os vértices são números inteiros contínuos de 0 a n-1
function createGraphDOT(edges: string[], config: GraphConfig = {}) {
  // Cria um conjunto de vértices
  const nodes = new Set(edges.flatMap((l) => l.split(",")).map(Number));

  // Calcula o tamanho do grafo considerando o maior vértice
  const size = Math.ceil(Math.sqrt(Math.max(...nodes) + 1));

  // Converte as configurações dos vértices em uma string para o DOT
  const nodeConfigString = Object.entries(NODE_CONFIG)
    .map(([key, value]) => `${key}="${value}";`)
    .join("\n    ");

  // Cria grupos de vértices para o DOT
  // * Nota: Ajudam a organizar os vértices para a engine "dot", útil para grafos pequenos quaisquer
  const nodeGroups = Array.from({ length: size }, (_, i) => {
    let groupString = `
  subgraph {
    rank = same;`;

    for (let j = 0; j < size; j++) {
      const nodeId = i * size + j;
      groupString += `\n    ${nodeId};`;
    }

    groupString += `\n  }`;
    return groupString;
  });

  const nodeNumber = size ** 2; // Calcula o número de vértices
  const higherNodeIndex = size - 1; // Calcula o índice do último vértice

  // Contadores para a posição dos vértices
  let colCounter = 0;
  let lineCounter = higherNodeIndex;

  // Cria uma string para cada vértice (posição e cor, e invisível se não estiver na lista de vértices)
  // * Nota: Gera e especifica a posição dos vértices para a engine "neato", permitindo que o grafo seja visualizado em uma grade
  const nodesString = Array.from({ length: nodeNumber }, (_, i) => {
    // Atualiza o contador de linhas se o vértice estiver na borda
    if (i % size === 0 && i !== 0) lineCounter--; // Contador decrescente para os vertices começarem no topo da grade

    // Obtém a cor do vértice (se não for especificada, usa a cor padrão)
    const color = config.colorMap?.get(String(i)) || NODE_CONFIG.fillcolor;

    // Cria a string do vértice
    const nodeString = `  ${i} [pos="${colCounter / DENSITY},${
      lineCounter / DENSITY
    }!", fillcolor="${color}"${nodes.has(i) ? "" : `, style="invis"`}];`;

    colCounter++; // Atualiza o contador de colunas
    if (colCounter > higherNodeIndex) colCounter = 0; // Volta para a primeira coluna se chegar no final da grade

    return nodeString;
  });

  // Cria uma string para cada aresta
  const edgesString = edges.map((edge) => {
    const [source, target] = edge.split(",");

    // Obtém a cor da aresta (se não for especificada, usa a cor padrão)
    const color = config.colorMap?.get(edge) || "black";

    // Cria a string da aresta
    return `  ${source} -- ${target} [color="${color}"];`;
  });

  // Cria a string do DOT
  return `
graph {
  rankdir = LR;
  nodesep="${0.5 / DENSITY}";

  node [
    ${nodeConfigString}
  ];

${nodeGroups.join("\n")}

${nodesString.join("\n")}

${edgesString.join("\n")}
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
