import { performance } from "perf_hooks";

import { createGraphCSVFile } from "./create-graph-csv";
import { tarjanList } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList, edgesToAdjMatrix } from "./util/csv-to-data";
import { readCsvFile } from "./util/read-csv";
import { tarjanArticulationsList, tarjanArticulationsMatrix } from "./tarjan-articulations";
import { tarjanBridgesList, tarjanBridgesMatrix } from "./tarjan-bridges";
import { createGraphDotFile } from "./create-graph-dot";
import { readFile } from "./util/file";
import { OSMToJSONFile } from "./util/osm-to-json";
import { processOSMJSON } from "./process-osm-json";

export type GraphMode = "FULL" | "PREM" | "PDIAG";

interface GenerateGraphOptions {
  size: number;
  mode?: GraphMode;
  apply?: ("DOT" | "SVG" | "TARJAN")[];
}

function benchmark(fn: () => any, repetitions = 5): { avg: number; result: any } {
  let total = 0;
  let result: any;

  for (let i = 0; i < repetitions; i++) {
    const start = performance.now();
    result = fn();
    const end = performance.now();
    total += end - start;
  }

  return { avg: (total / repetitions), result };
}

function runBenchmarks(rows: any[], label: string): void {
  const adjList = edgesToAdjList(rows);
  const adjMatrix = edgesToAdjMatrix(rows);

  console.log(`\nArquivo: ${label}`);

  const bridgesList = benchmark(() => tarjanBridgesList(adjList));
  console.log(`Pontes (List): ${bridgesList.result.count} - ${bridgesList.avg.toFixed(3)} ms`);

  const bridgesMatrix = benchmark(() => tarjanBridgesMatrix(adjMatrix));
  console.log(`Pontes (Matrix): ${bridgesMatrix.result.count} - ${bridgesMatrix.avg.toFixed(3)} ms`);

  const articulationsList = benchmark(() => tarjanArticulationsList(adjList));
  console.log(`Pontos (List): ${articulationsList.result.count} - ${articulationsList.avg.toFixed(3)} ms`);

  const articulationsMatrix = benchmark(() => tarjanArticulationsMatrix(adjMatrix));
  console.log(`Pontos (Matrix): ${articulationsMatrix.result.count} - ${articulationsMatrix.avg.toFixed(3)} ms`);
}

function generateGraph(options: GenerateGraphOptions): string {
  const { size, mode = "FULL", apply = [] } = options;

  if (isNaN(size) || size <= 0) throw new Error("Tamanho inválido. Forneça um inteiro positivo.");
  if (!["PREM", "PDIAG", "FULL"].includes(mode)) throw new Error("Modo inválido. Use 'PREM', 'PDIAG' ou 'FULL'.");

  const filename = createGraphCSVFile(size, mode);
  const { rows } = readCsvFile(filename);

  let colorMap = new Map<string, string>();

  if (apply.includes("DOT")) {
    if (apply.includes("TARJAN")) {
      colorMap = tarjanList(edgesToAdjList(rows)).colorMap;
    }

    createGraphDotFile(filename, rows, { colorMap });

    if (apply.includes("SVG")) {
      dotToSVG(filename, "dot");
      dotToSVG(filename, "neato");
    }
  }

  return filename;
}

function runBenchmarksFromCSV(filename: string): void {
  const { rows } = readCsvFile(filename);
  runBenchmarks(rows, filename);
}

(async () => {
  const graph1 = generateGraph({ size: 30, mode: "FULL", apply: ["TARJAN"] });
  const graph2 = generateGraph({ size: 50, mode: "FULL", apply: ["TARJAN"] });

  runBenchmarksFromCSV(graph1);
  runBenchmarksFromCSV(graph2);

  const osmFile1 = "sobral"
  const lines1 = readFile(`${osmFile1}.osm`, "data");
  await OSMToJSONFile(osmFile1, lines1.join("\n"));
  processOSMJSON(osmFile1);
  runBenchmarksFromCSV(osmFile1);

  const osmFile2 = "parquearaxa"
  const lines2 = readFile(`${osmFile2}.osm`, "data");
  await OSMToJSONFile(osmFile2, lines2.join("\n"));
  processOSMJSON(osmFile2);
  runBenchmarksFromCSV(osmFile2);

})();
