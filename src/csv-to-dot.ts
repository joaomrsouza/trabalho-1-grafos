import { createGraphDotFile } from "./create-graph-dot";
import { tarjanList } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList } from "./util/csv-to-data";
import { readCsvFile } from "./util/read-csv";

const [_, __, filename, ...argRest] = process.argv;

if (!filename) {
  console.error("Please provide a filename as the first argument.");
  process.exit(1);
}

const { rows } = readCsvFile(filename);

const apply = argRest || [];

let colorMap = new Map<string, string>();

if (apply.includes("TARJAN"))
  colorMap = tarjanList(edgesToAdjList(rows)).colorMap;

createGraphDotFile(filename, rows, { colorMap });

if (apply.includes("SVG")) {
  dotToSVG(filename, "dot");
  dotToSVG(filename, "neato");
}
