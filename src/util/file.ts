import * as fs from "fs";
import * as path from "path";

// Lê um arquivo e retorna um array de linhas
export function readFile(filename: string) {
  // Obtém o caminho do arquivo
  const filePath = path.resolve(`./generated/${filename}`);

  // Verifica se o arquivo existe
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  // Lê o arquivo e retorna um array de linhas
  return fs
    .readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .map((line) => line.trim());
}

// Escreve um arquivo com o conteúdo
export function writeFile(filename: string, content: string) {
  // Diretórios de saída
  const generatedDir = path.resolve("./generated");
  const svgDir = path.join(generatedDir, "svg");
  const csvDir = path.join(generatedDir, "csv");
  const dotDir = path.join(generatedDir, "dot");

  // Cria os diretórios se não existirem
  [generatedDir, svgDir, csvDir, dotDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Obtém o caminho do arquivo
  const filePath = path.resolve(`./generated/${filename}`);

  // Escreve o arquivo
  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

// Obtém o caminho do arquivo
export function getPath(filename: string) {
  return path.resolve(`./generated/${filename}`);
}
