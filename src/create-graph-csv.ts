import type { GraphMode } from "./create-graph";
import { writeFile } from "./util/file";

const PDIAG = 0.1;
const PREM = 0.05;

function createGraphCSV(size: number, mode: GraphMode) {
  const edges: string[] = [];

  function index(i: number, j: number) {
    return i * size + j;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentIndex = index(i, j);

      const isPrem = mode === "PREM" || mode === "FULL";
      const isDiag = mode === "PDIAG" || mode === "FULL";

      if (j + 1 < size) {
        edges.push(`${currentIndex},${index(i, j + 1)}`);

        if (isPrem && Math.random() < PREM) edges.pop();
      }

      if (i + 1 < size) {
        edges.push(`${currentIndex},${index(i + 1, j)}`);

        if (isPrem && Math.random() < PREM) edges.pop();
      }

      if (isDiag) {
        if (i + 1 < size && j + 1 < size && Math.random() < PDIAG)
          edges.push(`${currentIndex},${index(i + 1, j + 1)}`);

        if (i + 1 < size && j - 1 >= 0 && Math.random() < PDIAG)
          edges.push(`${currentIndex},${index(i + 1, j - 1)}`);
      }
    }
  }

  return edges;
}

function writeCSVToFile(filename: string, lines: string[]) {
  const content = ["origem,destino", ...lines].join("\n");

  writeFile(`csv/${filename}.csv`, content);
  console.log(`Graph CSV saved to ./generated/csv/${filename}.csv`);
}

export function createGraphCSVFile(size: number, mode: GraphMode) {
  const lines = createGraphCSV(size, mode);

  const filename = `graph-${size}-${mode.toLowerCase()}`;

  writeCSVToFile(filename, lines);
  return filename;
}
