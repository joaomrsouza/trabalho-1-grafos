// Arquivo de ponto de entrada para converter um arquivo CSV (header: "origem,destino", linhas: "u,v") em um arquivo DOT e SVG

import { createGraphDotFile } from "./create-graph-dot";
import { tarjanList } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList } from "./util/csv-to-data";
import { readCsvFile } from "./util/read-csv";

// Obtém os argumentos da linha de comando
const [_, __, filename, ...argRest] = process.argv;

// Se não houver um nome de arquivo, termina o programa
if (!filename) {
  console.error("Please provide a filename as the first argument.");
  process.exit(1);
}

// Lê o arquivo CSV
const { rows } = readCsvFile(filename);

// Obtém os argumentos restantes
const apply = argRest || [];

// Cria o mapa de cores
let colorMap = new Map<string, string>();

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
