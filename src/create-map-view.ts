import { writeFile } from "./util/file";
import { getPositionMap } from "./util/position-map";
import { readCsvFile } from "./util/read-csv";

function createMapView(
  filename: string,
  colorMap?: Map<string, string>,
  articulations?: number,
  bridges?: number
) {
  const { rows } = readCsvFile(filename);

  const edges = rows.map((row) => {
    const [origem, destino] = row.split(",");
    return [Number(origem), Number(destino)];
  });

  const positionMap = getPositionMap(filename);

  return getHTMLContent(
    filename,
    edges,
    positionMap,
    colorMap,
    articulations,
    bridges
  );
}

function writeHTMLToFile(filename: string, content: string) {
  writeFile(`html/${filename}.html`, content);
  console.log(`Graph MAP saved to ./generated/html/${filename}.html`);
}

// Função para criar um arquivo HTML de visualização
export function createMapHTMLFile(
  filename: string,
  colorMap?: Map<string, string>,
  articulations?: number,
  bridges?: number
) {
  const content = createMapView(filename, colorMap, articulations, bridges);

  writeHTMLToFile(filename, content);
}

function getHTMLContent(
  filename: string,
  edges: number[][],
  positionMap: Map<number, [number, number]>,
  colorMap: Map<string, string> = new Map(),
  articulations: number = 0,
  bridges: number = 0
) {
  // Converte os dados para JSON que será embutido no HTML
  const edgesJSON = JSON.stringify(edges);
  const positionsJSON = JSON.stringify(Array.from(positionMap.entries()));
  const colorMapJSON = JSON.stringify(Array.from(colorMap.entries()));

  // Calcula as bordas do mapa
  const [latitudes, longitudes] = Array.from(positionMap.values()).reduce(
    (acc, [lat, long]) => {
      return [
        [...acc[0], lat],
        [...acc[1], long],
      ];
    },
    [[], []] as [number[], number[]]
  );

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLong = Math.min(...longitudes);
  const maxLong = Math.max(...longitudes);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visualização do Grafo - ${filename}</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
      }

      #map {
        height: 100vh;
        width: 100vw;
      }

      .info-panel {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        max-width: 250px;
      }

      .info-panel h3 {
        margin: 0 0 10px 0;
        color: #333;
      }

      .info-panel p {
        margin: 5px 0;
        color: #666;
        font-size: 14px;
      }

      .legend {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }

      .legend-item {
        display: flex;
        align-items: center;
        margin: 5px 0;
      }

      .legend-color {
        width: 20px;
        height: 3px;
        margin-right: 8px;
        border-radius: 2px;
      }

      .node-color {
        background: lightblue;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 2px solid white;
      }

      .node-color.articulation {
        background: blue;
      }

      .node-color.root {
        background: lime;
      }

      .edge-color {
        background: black;
      }

      .edge-color.bridge {
        background: red;
      }

      .controls {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        background: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .controls label {
        display: block;
        margin: 5px 0;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <div class="info-panel">
      <h3>Grafo: ${filename}</h3>
      <p>Vértices: ${positionMap.size}</p>
      <p>Arestas: ${edges.length}</p>
      <p>Articulações: ${articulations}</p>
      <p>Pontes: ${bridges}</p>

      <div class="legend">
        <div class="legend-item">
          <div class="legend-color node-color"></div>
          <span>Vértices (interseções)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color articulation"></div>
          <span>Vértices (articulações)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color node-color root"></div>
          <span>Vértices (raízes)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color edge-color"></div>
          <span>Arestas (vias)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color edge-color bridge"></div>
          <span>Arestas (pontes)</span>
        </div>
      </div>
    </div>

    <div class="controls">
      <label>
        <input type="checkbox" id="show-nodes" checked /> Mostrar Nós
      </label>
      <label>
        <input type="checkbox" id="show-edges" checked /> Mostrar Arestas
      </label>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      // Dados do grafo embutidos
      const edges = ${edgesJSON};
      const positions = new Map(${positionsJSON});
      const colorMap = new Map(${colorMapJSON});

      const bounds = [
        [${minLat}, ${minLong}],
        [${maxLat}, ${maxLong}]
      ];

      // Criar o mapa
      const map = L.map('map').fitBounds(bounds);

      // Adicionar tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Grupos de camadas
      const nodeGroup = L.layerGroup().addTo(map);
      const edgeGroup = L.layerGroup().addTo(map);

      // Adicionar marcadores para os nós
      for (const [nodeId, [lat, long]] of positions) {
        const fillColor = colorMap.get(String(nodeId)) || "lightblue";

        const marker = L.circleMarker([lat, long], {
          radius: 8,
          fillColor,
          color: "black",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8,
        });

        marker.bindPopup(
          \`Vértice: \${nodeId}\${
            fillColor === "blue"
              ? " (articulação)"
              : fillColor === "lime"
              ? " (raiz)"
              : ""
          }<br>Lat: \${lat}<br>Long: \${long}\`
        );
        nodeGroup.addLayer(marker);
      }

      // Adicionar linhas para as arestas
      for (const [origem, destino] of edges) {
        const color = colorMap.get(\`\${origem},\${destino}\`) || "black";

        const coordOrigem = positions.get(origem);
        const coordDestino = positions.get(destino);

        if (coordOrigem && coordDestino) {
          const line = L.polyline([coordOrigem, coordDestino], {
            color,
            weight: 4,
            opacity: 0.5,
          });

          line.bindPopup(
            \`Aresta: \${origem} → \${destino}\${color === "red" ? " (ponte)" : ""}\`
          );
          edgeGroup.addLayer(line);
        }
      }

      // Controles para mostrar/ocultar elementos
      const showNodesCheckbox = document.getElementById("show-nodes");
      const showEdgesCheckbox = document.getElementById("show-edges");

      showNodesCheckbox.addEventListener("change", function () {
        this.checked ? map.addLayer(nodeGroup) : map.removeLayer(nodeGroup);
      });

      showEdgesCheckbox.addEventListener("change", function () {
        this.checked ? map.addLayer(edgeGroup) : map.removeLayer(edgeGroup);
      });
    </script>
  </body>
</html>
`;
}
