// Arquivo de ponto de entrada para converter um arquivo OSM em um arquivo DOT e SVG

import { createGraphDotFile } from "./create-graph-dot";
import { createMapHTMLFile } from "./create-map-view";
import { processOSMJSON } from "./process-osm-json";
import { tarjanList } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList } from "./util/csv-to-data";
import { readFile } from "./util/file";
import { OSMToJSONFile } from "./util/osm-to-json";
import { getPositionMap } from "./util/position-map";
import { readCsvFile } from "./util/read-csv";

// Obtém os argumentos da linha de comando
const [_, __, filename, ...argRest] = process.argv;

// Se não houver um nome de arquivo, termina o programa
if (!filename) {
  console.error("Please provide a filename as the first argument.");
  process.exit(1);
}

// Lê o arquivo CSV
const lines = readFile(`${filename}.osm`, "data");

// Transforma o OSM em um arquivo JSON
await OSMToJSONFile(filename, lines.join("\n"));

// Processa o arquivo OSM JSON
processOSMJSON(filename);

// Lê o arquivo CSV
const { rows } = readCsvFile(filename);

// Obtém os argumentos restantes
const apply = argRest || [];

// Cria o mapa de cores
let colorMap = new Map<string, string>();
let articulations = 0;
let bridges = 0;

// Obtem o position map gerado pelo processamento do OSM JSON
const positionMap = getPositionMap(filename);

// Se o argumento TARJAN estiver presente, calcula as pontes e vértices de articulação
if (apply.includes("TARJAN")) {
  const tarjanResult = tarjanList(edgesToAdjList(rows));
  colorMap = tarjanResult.colorMap;
  articulations = tarjanResult.articulations;
  bridges = tarjanResult.bridges;
}

// Cria o arquivo DOT
createGraphDotFile(filename, rows, {
  colorMap,
  positionMap,
  density: 0.001 * 2, // Densidade ajustada para escala de latitude e longitude
});

// Se o argumento MAP estiver presente, cria o arquivo HTML do mapa
if (apply.includes("MAP"))
  createMapHTMLFile(filename, colorMap, articulations, bridges);

// Se o argumento SVG estiver presente, converte o arquivo DOT para SVG
// * Nota: Utiliza somente a engine "neato", visto que o intuito é visualizar o grafo em analogia a um mapa
if (apply.includes("SVG")) dotToSVG(filename, "neato");
