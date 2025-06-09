# Trabalho 1 — Algoritmos em Grafos

Este projeto implementa a geração, análise e visualização de grafos para a disciplina de Algoritmos em Grafos (UFC, 2025.1). O sistema permite criar grafos em diferentes modos, exportar para CSV/DOT, identificar pontes e articulações (Tarjan), e converter para SVG usando Graphviz.

## Funcionalidades
- **Geração de grafos**: Criação de grafos quadrados NxN nos modos FULL, PREM e PDIAG.
- **Exportação**: Salva grafos em CSV e DOT.
- **Análise de componentes**: Identificação de pontes e articulações usando o algoritmo de Tarjan.
- **Visualização**: Conversão de arquivos DOT para SVG usando Graphviz (`dot` e `neato`).

## Estrutura dos Arquivos
- `generated/csv/`: Grafos em formato CSV.
- `generated/dot/`: Grafos em formato DOT.
- `generated/svg/`: Visualizações SVG dos grafos.

## Instalação
1. Instale o [Bun](https://bun.sh/) e o [Graphviz](https://graphviz.gitlab.io/download/).
2. Instale as dependências:
```pwsh
bun install
```

## Como Rodar
### Gerar um grafo
```pwsh
bun run src/create-graph.ts <N> <MODO> [DOT] [TARJAN] [SVG]
```
- `<N>`: Tamanho do grafo (ex: 5)
- `<MODO>`: FULL, PREM ou PDIAG
- `DOT`: (opcional) gera arquivo DOT
- `TARJAN`: (opcional) colore pontes/articulações
- `SVG`: (Opcional) Gera imagens SVG usando o Graphviz.

Exemplo:
```pwsh
bun run src/create-graph.ts 5 FULL DOT TARJAN SVG
```

### Converter CSV para DOT/SVG
```pwsh
bun run src/csv-to-dot.ts <arquivo_csv> [TARJAN] [SVG]
```
Exemplo:
```pwsh
bun run src/csv-to-dot.ts graph-5-full TARJAN SVG
```

## Algoritmos Implementados
- **DFS**: Busca em profundidade para análise de conectividade.
- **Tarjan**: Identificação de pontes e articulações.

## Observações
- Os arquivos gerados ficam em `generated/`.
- O projeto usa TypeScript e Bun.
- Para visualizar SVG, utilize qualquer navegador.
