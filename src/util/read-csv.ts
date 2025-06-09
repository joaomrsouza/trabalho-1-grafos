import { readFile } from "./file";

export function readCsvFile(filename: string) {
  const [headers, ...rows] = readFile(`csv/${filename}.csv`);

  if (!headers?.length || !rows?.length) {
    throw new Error("CSV file is empty or improperly formatted");
  }

  return { headers, rows };
}
