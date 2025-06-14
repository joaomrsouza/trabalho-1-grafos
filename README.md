# Trabalho 1 — Algoritmos em Grafos

Este projeto implementa a geração, análise e visualização de grafos para a disciplina de Algoritmos em Grafos (UFC, 2025.1). O sistema oferece múltiplas funcionalidades para trabalhar com grafos sintéticos e dados reais do OpenStreetMap (OSM), incluindo análises de conectividade e visualizações interativas.

## Funcionalidades Principais

### 1. Geração de Grafos Sintéticos
- **Criação de grafos quadrados NxN** nos modos:
  - **FULL**: Grafo completo com todas as conexões possíveis
  - **PREM**: Grafo com remoção aleatória de arestas (probabilidade ajustável)
  - **PDIAG**: Grafo com adição de arestas diagonais (probabilidade ajustável)

### 2. Processamento de Dados OpenStreetMap
- **Leitura e processamento de arquivos OSM**: Conversão de dados geográficos reais em grafos
- **Filtragem**: Mantém apenas interseções de vias
- **Geração de coordenadas**: Preserva informações geográficas para visualização em mapas

### 3. Análises de Grafos
- **Algoritmo de Tarjan**: Identificação de pontes e articulações
- **Múltiplas representações**: Suporte para lista de adjacência e matriz de adjacência
- **Coloração visual**: Destaque de componentes críticos na visualização

### 4. Visualizações
- **Exportação CSV/DOT**: Formatos padrão para intercâmbio de dados
- **Geração SVG**: Visualizações estáticas usando Graphviz (engines `dot` e `neato`)
- **Mapas interativos HTML**: Visualizações dinâmicas com Leaflet.js para dados OSM

## Estrutura dos Arquivos de Saída
- `generated/csv/`: Grafos em formato CSV
- `generated/dot/`: Grafos em formato DOT
- `generated/svg/`: Visualizações SVG dos grafos
- `generated/html/`: Visualizações interativas HTML (mapas)
- `generated/coords/`: Arquivos de coordenadas geográficas
- `generated/json/`: Mapas de posicionamento para visualização

## Instalação
1. Instale o [Bun](https://bun.sh/) e o [Graphviz](https://graphviz.gitlab.io/download/)
2. Instale as dependências:
```pwsh
bun install
```

## Como Usar

### 1. Gerar Grafos Sintéticos
```pwsh
bun run src/create-graph.ts <N> <MODO> [DOT] [TARJAN] [SVG]
```
- `<N>`: Tamanho do grafo (ex: 5)
- `<MODO>`: FULL, PREM ou PDIAG
- `DOT`: (opcional) gera arquivo DOT
- `TARJAN`: (opcional) aplica análise de Tarjan e colore pontes/articulações
- `SVG`: (opcional) gera imagens SVG usando Graphviz

**Exemplo:**
```pwsh
bun run src/create-graph.ts 5 FULL DOT TARJAN SVG
```

### 2. Converter CSV Existente para DOT/SVG
```pwsh
bun run src/csv-to-dot.ts <arquivo_csv> [TARJAN] [SVG]
```
- `<arquivo_csv>`: Nome do arquivo CSV (sem extensão, deve estar em `generated/csv/`)
- `TARJAN`: (opcional) aplica análise de Tarjan
- `SVG`: (opcional) gera visualização SVG com layout geográfico

**Exemplo:**
```pwsh
bun run src/csv-to-dot.ts graph-5-full TARJAN SVG
```

### 3. Processar Dados OpenStreetMap
```pwsh
bun run src/osm-to-dot.ts <nome_arquivo> [TARJAN] [MAP] [SVG]
```

- `<nome_arquivo>`: Nome do arquivo OSM (sem extensão, deve estar em `data/`)
- `TARJAN`: (opcional) aplica análise de Tarjan
- `MAP`: (opcional) gera visualização HTML interativa
- `SVG`: (opcional) gera visualização SVG com layout geográfico

**Exemplo:**
```pwsh
bun run src/osm-to-dot.ts sobral TARJAN MAP SVG
```

## Algoritmos Implementados
- **DFS (Busca em Profundidade)**: Base para análises de conectividade
- **Tarjan para Pontes**: Identificação de arestas críticas
- **Tarjan para Articulações**: Identificação de vértices críticos
- **Processamento OSM**: Extração e filtragem de grafos de dados geográficos

## Representações de Grafos
- **Lista de Adjacência**: Implementação eficiente para grafos esparsos
- **Matriz de Adjacência**: Implementação para análises densas
- **Conversões automáticas**: Entre diferentes formatos conforme necessário

## Visualizações Disponíveis

### Grafos Sintéticos
- **SVG estático**: Layouts automáticos (`dot`) e físicos (`neato`)
- **Coloração de componentes**: Pontes em vermelho, articulações em azul, raízes em verde

### Dados OSM
- **Mapas HTML interativos**: Visualização sobre tiles do OpenStreetMap
- **Controles de camadas**: Toggle para nós e arestas
- **Informações estatísticas**: Contadores de vértices, arestas, pontes e articulações
- **Legenda visual**: Identificação de diferentes tipos de elementos

## Benchmark (Planejado)
O arquivo `benchmark.ts` contém estrutura para análise de performance comparando:
- Algoritmos de Tarjan em lista vs. matriz de adjacência
- Tempos de execução para pontes vs. articulações
- Análise estatística com múltiplas execuções

## Build e Distribuição

### Scripts de Build Disponíveis
1. **build:create-graph**: Compila `create-graph.ts` em `out/create-graph.exe`
2. **build:csv-to-dot**: Compila `csv-to-dot.ts` em `out/csv-to-dot.exe`
3. **build:osm-to-dot**: Compila `osm-to-dot.ts` em `out/osm-to-dot.exe`
4. **build:copy-instructions**: Copia instruções de uso para `out/README.txt`
5. **build**: Executa todos os scripts acima em sequência

### Como Fazer Build
Para compilar o projeto completo:
```pwsh
bun run build
```

Para compilar apenas um executável específico:
```pwsh
# Compilar apenas create-graph
bun run build:create-graph

# Compilar apenas csv-to-dot
bun run build:csv-to-dot

# Compilar apenas osm-to-dot
bun run build:osm-to-dot
```

### Saída da Build
Os arquivos compilados são gerados no diretório `out/`:
- `create-graph.exe`: Executável para gerar grafos sintéticos
- `csv-to-dot.exe`: Executável para converter CSV para DOT/SVG
- `osm-to-dot.exe`: Executável para converter OSM para DOT/SVG/MAP
- `README.txt`: Instruções de uso dos executáveis

### Distribuição
Os executáveis gerados são standalone e podem ser distribuídos sem necessidade de instalar o Bun ou Node.js no sistema de destino. Eles incluem todo o runtime necessário para execução.

## Observações
- Os arquivos gerados ficam organizados em `generated/` por tipo
- O projeto utiliza TypeScript e Bun
- Para visualizar arquivos SVG e HTML, utilize qualquer navegador moderno
- Dados OSM devem estar no formato XML padrão no diretório `data/` e podem ser baixados em https://www.openstreetmap.org/
