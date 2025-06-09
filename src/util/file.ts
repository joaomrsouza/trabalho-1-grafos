import * as fs from "fs";
import * as path from "path";

export function readFile(filename: string) {
  const filePath = path.resolve(`./generated/${filename}`);

  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  return fs
    .readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .map((line) => line.trim());
}

export function writeFile(filename: string, content: string) {
  const generatedDir = path.resolve("./generated");
  const svgDir = path.join(generatedDir, "svg");
  const csvDir = path.join(generatedDir, "csv");
  const dotDir = path.join(generatedDir, "dot");

  [generatedDir, svgDir, csvDir, dotDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const filePath = path.resolve(`./generated/${filename}`);

  try {
    fs.writeFileSync(filePath, content);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

export function getPath(filename: string) {
  return path.resolve(`./generated/${filename}`);
}
