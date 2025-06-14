import { writeFile } from "./util/file";
import { readJsonFile } from "./util/read-json";

// === Tipos ===

// Dados extras atrelados aos nós
type NodeMetadata = { index?: number };

// Dados dos nós no OSM
type Node = {
  id: string;
  lat: string;
  lon: string;
} & NodeMetadata;

type KeyVal = { k: string; v: string };

// Dados das vias no OSM
type Way = {
  id: string;
  nd: { ref: string }[];
  tag?: KeyVal | KeyVal[];
};

// Formato de dados do OSM JSON
type Data = {
  osm: {
    node: Node[];
    way: Way[];
  };
};

// Obtém um conjunto das chaves das tags da via
function getWayTags(way: Way) {
  return new Set(way.tag ? [way.tag].flat().map(({ k }) => k) : []);
}

// Lê e processa o arquivo OSM JSON
// * Nota: O processamento filtra os nós e vias e gera múltiplos arquivos de saída explicados abaixo
// * .coods => Arquivo com todas as coordenadas (latitude,longitude) de todos os arquivos
// * -position-map.json => JSON com array de entradas associando o index de cada nó a uma posição latitude, longitude
// * .csv => CSV com todas as arestas do grafo (header: "origem,destino", linhas: "u,v")
export function processOSMJSON(filename: string) {
  const { osm } = readJsonFile<Data>(`${filename}-osm`); // Lê o arquivo OSM JSON

  // Mapeia os nós as vias que eles estão
  const nodeInWaysMap = new Map<string, string[]>(); // nodeId -> waysIds[]

  osm.way.forEach((way) => {
    // Filtra fora todas as vias que não possui a tag "highway"
    if (!getWayTags(way).has("highway")) return;

    // Passa por todos os nós da via
    way.nd.forEach((nd) => {
      // Adiciona a via no vértice atual
      nodeInWaysMap.set(nd.ref, [...(nodeInWaysMap.get(nd.ref) ?? []), way.id]);
    });
  });

  // Filtra apenas nós que estão em mais de uma via (junções de via)
  const nodeInWaysFiltered = Array.from(nodeInWaysMap.entries()).filter(
    ([_, waysIds]) => waysIds.length > 1
  );

  // Conjunto de nós para serem mantidos
  const nodesToKeep = new Set(nodeInWaysFiltered.map(([nodeId]) => nodeId));
  // Conjunto de vias para serem mantidas
  const waysToKeep = new Set(
    nodeInWaysFiltered.flatMap(([_, waysIds]) => waysIds)
  );

  // Mapeia os nós a informação contida
  const nodeInfoMap = new Map<string, Node>(); // nodeId -> Node

  let nodeIndex = 0;
  // Passa por todos os nós
  osm.node.forEach((node) => {
    // Filtra fora todos os nós que não serão mantidos
    if (!nodesToKeep.has(node.id)) return;

    // Adiciona o nó e informações ao mapeamento e associa um index
    // * Nota: O index será utilizado no grafo final como nome/identificador do nó/vértice
    nodeInfoMap.set(node.id, {
      ...node,
      index: nodeIndex++,
    });
  });

  // Mapeia as vias a informação contida
  const waysInfoMap = new Map<string, Way>(); // wayId -> Way

  // Passa por todas as vias
  osm.way.forEach((way) => {
    // Filtra fora todas as vias que não serão mantidas
    if (!waysToKeep.has(way.id)) return;

    // Adiciona a via e apenas nós da mesma que devem ser mantidos ao mapeamento
    waysInfoMap.set(way.id, {
      id: way.id,
      nd: way.nd.filter((nd) => nodesToKeep.has(nd.ref)),
    });
  });

  const edges = new Map<string, [Node, Node]>(); // "NodeIndex1,NodeIndex2" -> [Node1, Node2]
  const vertexDegree = new Map<string, number>(); // NodeId -> Degree

  // Cria as arestas entre os vértices de uma via
  Array.from(waysInfoMap.values()).forEach((way) => {
    // Para cada nó da via
    way.nd.forEach((nd, index) => {
      const currNode = nodeInfoMap.get(nd.ref); // Nó atual
      const nextNode = nodeInfoMap.get(way.nd[index + 1]?.ref ?? ""); // Nó seguinte

      // Se ambos os nós existirem
      if (currNode?.index && nextNode?.index) {
        // Conta o grau de cada vértice
        vertexDegree.set(currNode.id, (vertexDegree.get(currNode.id) ?? 0) + 1);
        vertexDegree.set(nextNode.id, (vertexDegree.get(nextNode.id) ?? 0) + 1);

        // Cria a aresta
        edges.set(`${currNode.index},${nextNode.index}`, [currNode, nextNode]);
      }
    });
  });

  // Filtra as arestas para uma visualização mais limpa
  const filteredEdgesMap = new Map(
    Array.from(edges.entries()).filter(([_edge, [node1, node2]]) => {
      const node1Degree = vertexDegree.get(node1.id) ?? 0;
      const node2Degree = vertexDegree.get(node2.id) ?? 0;

      // Pelo menos um vértice da aresta tem grau > 1
      const degreeGreaterThanOne = node1Degree > 1 || node2Degree > 1;

      const notALoop = node1 !== node2; // Não é um laço

      return degreeGreaterThanOne && notALoop;
    })
  );

  // Obtém todas as arestas filtradas
  const filteredEdges = Array.from(filteredEdgesMap.keys());

  // Gera o arquivo de arestas CSV
  writeFile(
    `csv/${filename}.csv`,
    ["origem,destino", ...filteredEdges].join("\n")
  );

  const usedNodesIds = new Set(
    Array.from(filteredEdgesMap.values())
      .flat()
      .map(({ id }) => id)
  );

  // Obtém as coodenadas de todos os nós utilizados
  const coordenadas = Array.from(usedNodesIds)
    .flatMap((nodeId) => {
      const node = nodeInfoMap.get(nodeId);
      return node ? `${node.lat},${node.lon}` : [];
    })
    .join("\n");

  // Gera o arquivo de coordenadas
  writeFile(`coords/${filename}.coords`, coordenadas);

  // Cria o position map dos vértices
  // * Nota: O position map associa o index do vértice com a posição que ele deve ficar
  const positionMap = Array.from(usedNodesIds)
    .flatMap((nodeId) => {
      const node = nodeInfoMap.get(nodeId);
      // O decimal é removido para que a densidade do grafo seja regulada no script de geração do DOT
      return node ? `  [${node.index}, [${node.lat},${node.lon}]]` : [];
    })
    .join(",\n");

  // Gera o arquivo do position map
  writeFile(
    `json/${filename}-position-map.json`,
    `[
${positionMap}
]`
  );
}
