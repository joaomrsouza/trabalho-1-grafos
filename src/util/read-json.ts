import { readFile } from "./file";

// Lê um arquivo JSON e retorna o conteúdo
export function readJsonFile<T>(filename: string): T {
  // Lê o arquivo JSON
  const content = readFile(`json/${filename}.json`);

  // Verifica se o arquivo JSON está vazio ou mal formatado
  if (!content) {
    throw new Error("JSON file is empty or improperly formatted");
  }

  return JSON.parse(content.join("\n"));
}
