import { readFile } from "./file";

// Lê um arquivo CSV e retorna os headers e as linhas
export function readCsvFile(filename: string) {
  // Lê o arquivo CSV e separa a primeira linha como headers e as demais como linhas
  const [headers, ...rows] = readFile(`csv/${filename}.csv`);

  // Verifica se o arquivo CSV está vazio ou mal formatado
  if (!headers?.length || !rows?.length) {
    throw new Error("CSV file is empty or improperly formatted");
  }

  return { headers, rows };
}
