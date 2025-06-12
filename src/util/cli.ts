import { spawn, type SpawnOptions } from "child_process";
import { getPath } from "./file";

// Transforma em promise o spawn para executar comandos do sistema
function spawnPromise(
  command: string,
  args: string[] = [],
  options: SpawnOptions = {}
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      resolve({ stdout, stderr, code });
    });
  });
}

// Converte um arquivo dot para svg usando o dot ou neato (requer instalar o graphviz e ter o dot ou neato no PATH)
export function dotToSVG(filename: string, engine: "dot" | "neato") {
  // Obtém os caminhos dos arquivos
  const filePath = getPath(`dot/${filename}.dot`);
  const outPath = getPath(`svg/${filename}-${engine}.svg`);

  // Executa o comando para converter o arquivo dot para svg
  spawnPromise(engine, ["-Tsvg", filePath, "-o", outPath], {
    stdio: ["pipe", "pipe", "inherit"],
  })
    .then(() => {
      console.log(
        `Graph SVG saved to ./generated/svg/${filename}-${engine}.svg`
      );
    })
    .catch((error) => {
      console.error(error);
    });
}
