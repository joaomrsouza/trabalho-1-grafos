// Arquivo de ponto de entrada para criar um grafo em formato CSV, processá-lo e gerar um arquivo DOT e SVG

import { createGraphCSVFile } from "./create-graph-csv";
import { createGraphDotFile } from "./create-graph-dot";
import { tarjanList } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList } from "./util/csv-to-data";
import { readCsvFile } from "./util/read-csv";

// Modos de criação do grafo
export type GraphMode = "FULL" | "PREM" | "PDIAG";

// Obtém os argumentos da linha de comando
const [_, __, argSize, argMode, ...argRest] = process.argv;

// Tamanho do grafo
const size = Number(argSize);

// Verifica se o tamanho é válido
if (isNaN(size) || size <= 0) {
  console.error("Invalid size. Please provide a positive integer.");
  process.exit(1);
}

// Modo de criação do grafo
const mode = argMode || "FULL";

if (!["PREM", "PDIAG", "FULL"].includes(mode)) {
  console.error("Invalid mode. Use 'PREM', 'PDIAG', or 'FULL'.");
  process.exit(1);
}

// Cria o arquivo CSV
const filename = createGraphCSVFile(size, mode as GraphMode);

// Obtém os argumentos restantes
const apply = argRest || [];

// Se não houver argumentos, termina o programa
if (apply.length === 0) process.exit(0);

// Lê o arquivo CSV
const { rows } = readCsvFile(filename);

// Cria o mapa de cores
let colorMap = new Map<string, string>();

// Se o argumento DOT estiver presente, cria o arquivo DOT
if (apply.includes("DOT")) {
  // Se o argumento TARJAN estiver presente, calcula as pontes e vértices de articulação
  if (apply.includes("TARJAN"))
    colorMap = tarjanList(edgesToAdjList(rows)).colorMap;

  // Cria o arquivo DOT
  createGraphDotFile(filename, rows, { colorMap });

  // Se o argumento SVG estiver presente, converte o arquivo DOT para SVG
  if (apply.includes("SVG")) {
    dotToSVG(filename, "dot");
    dotToSVG(filename, "neato");
  }
}
