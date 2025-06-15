import { performance } from "perf_hooks";

import { createGraphCSVFile } from "./create-graph-csv";
import { processOSMJSON } from "./process-osm-json";
import {
  tarjanArticulationsList,
  tarjanArticulationsMatrix,
} from "./tarjan-articulations";
import { tarjanBridgesList, tarjanBridgesMatrix } from "./tarjan-bridges";
import { edgesToAdjList, edgesToAdjMatrix } from "./util/csv-to-data";
import { readFile } from "./util/file";
import { OSMToJSONFile } from "./util/osm-to-json";
import { readCsvFile } from "./util/read-csv";

function benchmark<T>(fn: () => T, repetitions = 5) {
  let total = 0;

  for (let i = 0; i < repetitions; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    total += end - start;
  }

  const result = fn();
  return { avg: total / repetitions, result };
}

function runBenchmarks(rows: string[], label: string) {
  const adjList = edgesToAdjList(rows);
  const adjMatrix = edgesToAdjMatrix(rows);

  console.log(`\nArquivo: ${label}`);

  const bridgesList = benchmark(() => tarjanBridgesList(adjList));
  console.log(
    `Pontes (List): ${bridgesList.result.count} - ${bridgesList.avg.toFixed(
      3
    )} ms`
  );

  const bridgesMatrix = benchmark(() => tarjanBridgesMatrix(adjMatrix));
  console.log(
    `Pontes (Matrix): ${
      bridgesMatrix.result.count
    } - ${bridgesMatrix.avg.toFixed(3)} ms`
  );

  const articulationsList = benchmark(() => tarjanArticulationsList(adjList));
  console.log(
    `Pontos (List): ${
      articulationsList.result.count
    } - ${articulationsList.avg.toFixed(3)} ms`
  );

  const articulationsMatrix = benchmark(() =>
    tarjanArticulationsMatrix(adjMatrix)
  );
  console.log(
    `Pontos (Matrix): ${
      articulationsMatrix.result.count
    } - ${articulationsMatrix.avg.toFixed(3)} ms`
  );
}

function runBenchmarksFromCSV(filename: string) {
  const { rows } = readCsvFile(filename);
  runBenchmarks(rows, filename);
}

const graph1 = createGraphCSVFile(30, "FULL");
const graph2 = createGraphCSVFile(50, "FULL");

runBenchmarksFromCSV(graph1);
runBenchmarksFromCSV(graph2);

const osmFile1 = "sobral";
const lines1 = readFile(`${osmFile1}.osm`, "data");
await OSMToJSONFile(osmFile1, lines1.join("\n"));
processOSMJSON(osmFile1);
runBenchmarksFromCSV(osmFile1);

const osmFile2 = "parquearaxa";
const lines2 = readFile(`${osmFile2}.osm`, "data");
await OSMToJSONFile(osmFile2, lines2.join("\n"));
processOSMJSON(osmFile2);
runBenchmarksFromCSV(osmFile2);
