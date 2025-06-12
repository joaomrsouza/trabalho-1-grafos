import type { GraphMode } from "./create-graph";
import { writeFile } from "./util/file";

const PDIAG = 0.1; // Probabilidade de uma aresta diagonal
const PREM = 0.05; // Probabilidade de remover uma aresta não-diagonal

// Cria um grafo quadrado em formato CSV (header: "origem,destino", linhas: "u,v") com arestas aleatórias
function createGraphCSV(size: number, mode: GraphMode) {
  const edges: string[] = [];

  // Função para calcular o índice de um vértice
  function index(i: number, j: number) {
    return i * size + j;
  }

  // Cria as arestas do grafo
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentIndex = index(i, j);

      // Verifica se o modo é PREM ou FULL
      const isPrem = mode === "PREM" || mode === "FULL";

      // Verifica se o modo é PDIAG ou FULL
      const isDiag = mode === "PDIAG" || mode === "FULL";

      // Cria uma aresta horizontal
      if (j + 1 < size) {
        edges.push(`${currentIndex},${index(i, j + 1)}`);

        // Remove a aresta se o modo for PREM e atingir a probabilidade de remoção
        if (isPrem && Math.random() < PREM) edges.pop();
      }

      // Cria uma aresta vertical
      if (i + 1 < size) {
        edges.push(`${currentIndex},${index(i + 1, j)}`);

        // Remove a aresta se o modo for PREM e atingir a probabilidade de remoção
        if (isPrem && Math.random() < PREM) edges.pop();
      }

      // Cria uma aresta diagonal
      if (isDiag) {
        // Cria uma aresta diagonal superior
        if (i + 1 < size && j + 1 < size && Math.random() < PDIAG)
          edges.push(`${currentIndex},${index(i + 1, j + 1)}`);

        // Cria uma aresta diagonal inferior
        if (i + 1 < size && j - 1 >= 0 && Math.random() < PDIAG)
          edges.push(`${currentIndex},${index(i + 1, j - 1)}`);
      }
    }
  }

  return edges;
}

// Escreve um arquivo CSV com o conteúdo
function writeCSVToFile(filename: string, lines: string[]) {
  const content = ["origem,destino", ...lines].join("\n");

  writeFile(`csv/${filename}.csv`, content);
  console.log(`Graph CSV saved to ./generated/csv/${filename}.csv`);
}

// Cria um arquivo CSV com o grafo
export function createGraphCSVFile(size: number, mode: GraphMode) {
  // Cria o grafo
  const lines = createGraphCSV(size, mode);

  // Cria o nome do arquivo
  const filename = `graph-${size}-${mode.toLowerCase()}`;

  // Escreve o arquivo CSV
  writeCSVToFile(filename, lines);

  return filename;
}
