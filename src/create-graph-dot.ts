import { writeFile } from "./util/file";

export type GraphConfig = {
  colorMap?: Map<string, string>;
};

const SHOW_LABELS = false;
const DENSITY = SHOW_LABELS ? 2 : 4;

const nodeSize = 0.1 * (SHOW_LABELS ? 2 : 1);

const NODE_CONFIG = {
  shape: "circle",
  fixedsize: true,
  width: nodeSize,
  height: nodeSize,
  style: "filled",
  fillcolor: "lightblue",
  fontname: "Helvetica",
  fontsize: 10,
  fontcolor: "black",
  ...(SHOW_LABELS ? {} : { label: "" }),
};

function createGraphDOT(edges: string[], config: GraphConfig = {}) {
  const nodes = new Set(edges.flatMap((l) => l.split(",")).map(Number));

  const size = Math.ceil(Math.sqrt(Math.max(...nodes) + 1));

  const nodeConfigString = Object.entries(NODE_CONFIG)
    .map(([key, value]) => `${key}="${value}";`)
    .join("\n    ");

  const nodeGroups = Array.from({ length: size }, (_, i) => {
    let groupString = `
  subgraph {
    rank = same;`;

    for (let j = 0; j < size; j++) {
      const nodeId = i * size + j;
      groupString += `\n    ${nodeId};`;
    }

    groupString += `\n  }`;
    return groupString;
  });

  const nodeNumber = size ** 2;
  const higherNodeIndex = size - 1;

  let colCounter = 0;
  let lineCounter = higherNodeIndex;

  const nodesString = Array.from({ length: nodeNumber }, (_, i) => {
    if (i % size === 0 && i !== 0) lineCounter--;

    const color = config.colorMap?.get(String(i)) || NODE_CONFIG.fillcolor;

    const nodeString = `  ${i} [pos="${colCounter / DENSITY},${
      lineCounter / DENSITY
    }!", fillcolor="${color}"${nodes.has(i) ? "" : `, style="invis"`}];`;

    colCounter++;
    if (colCounter > higherNodeIndex) colCounter = 0;

    return nodeString;
  });

  const edgesString = edges.map((edge) => {
    const [source, target] = edge.split(",");
    const color = config.colorMap?.get(edge) || "black";

    return `  ${source} -- ${target} [color="${color}"];`;
  });

  return `
graph {
  rankdir = LR;
  nodesep="${0.5 / DENSITY}";

  node [
    ${nodeConfigString}
  ];

${nodeGroups.join("\n")}

${nodesString.join("\n")}

${edgesString.join("\n")}
}`;
}

function writeDOTToFile(filename: string, content: string) {
  writeFile(`dot/${filename}.dot`, content);
  console.log(`Graph DOT saved to ./generated/dot/${filename}.dot`);
}

export function createGraphDotFile(
  filename: string,
  edges: string[],
  config: GraphConfig = {}
) {
  const content = createGraphDOT(edges, config);

  writeDOTToFile(filename, content);
}
