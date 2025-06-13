import { readJsonFile } from "./read-json.ts";

type MapEntries = [number, [number, number]][];

// Obtem o position map do arquivo JSON
// * Nota: O position map é um arquivo que associa o vértice a uma posição específica
export function getPositionMap(filename: string) {
  // Lê o arquivo JSON
  const positionMap = readJsonFile<MapEntries>(`${filename}-position-map`);

  // Instancia um Map
  return new Map<number, [number, number]>(positionMap);
}
