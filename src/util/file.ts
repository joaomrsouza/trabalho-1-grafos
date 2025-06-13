import * as fs from "fs";
import * as path from "path";

// Cria os diretórios especificados se não existirem
function createDirs(dirs: string | string[]) {
  [dirs].flat().forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Lê um arquivo e retorna um array de linhas
export function readFile(filename: string, folder = "generated") {
  // Diretório de entrada
  createDirs(path.resolve("./data"));

  // Obtém o caminho do arquivo
  const filePath = path.resolve(`./${folder}/${filename}`);

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
  const subDirs = [
    path.join(generatedDir, "svg"),
    path.join(generatedDir, "csv"),
    path.join(generatedDir, "dot"),
    path.join(generatedDir, "json"),
    path.join(generatedDir, "coords"),
  ];

  // Cria os diretórios se não existirem
  createDirs([generatedDir, ...subDirs]);

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
