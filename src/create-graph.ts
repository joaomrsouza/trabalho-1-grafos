import { createGraphCSVFile } from "./create-graph-csv";
import { createGraphDotFile } from "./create-graph-dot";
import { tarjan } from "./tarjan";
import { dotToSVG } from "./util/cli";
import { edgesToAdjList } from "./util/csv-to-data";
import { readCsvFile } from "./util/read-csv";

export type GraphMode = "FULL" | "PREM" | "PDIAG";

const [_, __, argSize, argMode, ...argRest] = process.argv;

const size = Number(argSize);

if (isNaN(size) || size <= 0) {
  console.error("Invalid size. Please provide a positive integer.");
  process.exit(1);
}

const mode = argMode || "FULL";

if (!["PREM", "PDIAG", "FULL"].includes(mode)) {
  console.error("Invalid mode. Use 'PREM', 'PDIAG', or 'FULL'.");
  process.exit(1);
}

const filename = createGraphCSVFile(size, mode as GraphMode);

const apply = argRest || [];

if (apply.length === 0) process.exit(0);

const { rows } = readCsvFile(filename);

let colorMap = new Map<string, string>();

if (apply.includes("DOT")) {
  if (apply.includes("TARJAN"))
    colorMap = tarjan(edgesToAdjList(rows)).colorMap;

  createGraphDotFile(filename, rows, { colorMap });

  if (apply.includes("SVG")) {
    dotToSVG(filename, "dot");
    dotToSVG(filename, "neato");
  }
}
