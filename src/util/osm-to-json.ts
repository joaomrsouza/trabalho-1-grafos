import { parseStringPromise } from "xml2js";
import { writeFile } from "./file";

// Converte XML para JSON usando a biblioteca xml2js
async function XMLToJSON(content: string) {
  const json = await parseStringPromise(content, {
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: true,
    normalize: true,
    normalizeTags: true,
    trim: true,
  });

  return JSON.stringify(json, null, 2);
}

// Escreve o conteúdo em um arquivo JSON
function writeJSONToFile(filename: string, content: string) {
  writeFile(`json/${filename}.json`, content);
  console.log(`OSM JSON saved to ./generated/json/${filename}.json`);
}

// Transforma um arquivo OSM em um arquivo JSON
export async function OSMToJSONFile(filename: string, content: string) {
  const json = await XMLToJSON(content);

  writeJSONToFile(`${filename}-osm`, json);
}
