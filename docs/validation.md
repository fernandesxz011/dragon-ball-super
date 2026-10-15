# Validação da composição cinematográfica

QA funcional e visual de 14 de outubro de 2026, complementada pelo smoke de produção em 15 de outubro. Fluxo: abrir a apresentação, percorrer as quatro sagas pela rolagem, usar as âncoras e manter conteúdo e navegação disponíveis nas preferências e fallbacks previstos.

## Ambiente e verificações

Chrome com Playwright existente no ambiente. O plugin Browser não estava disponível; scripts e capturas de QA ficaram no diretório temporário do Windows, fora da aplicação e do repositório. As capturas foram comparadas com os conceitos em `design/cinematic/`.

| Verificação | Resultado |
| --- | --- |
| Identidade da página, conteúdo e ausência de overlay Vite | Passou |
| 360 × 800, 768 × 1024 e 1440 × 1000 | Passou |
| 30 cliques em âncoras, teclado, skip link e foco | Passou |
| Scroll nos dois sentidos, temas e entradas sem repetição | Passou |
| Imagens proporcionais, carregamento e ausência de overflow | Passou |
| Resize 1440 → 768 → 360 → 1440 | Passou |
| Movimento reduzido inicial e alterado durante a leitura | Passou |
| WebGL bloqueado, perda de contexto e erro de inicialização | Passou |
| Falha dos módulos opcionais Motion e Three | Conteúdo e links preservados |
| Aba oculta e retomada | Loop pausado e retomado |
| Um canvas/contexto ativo; desmontagem React | Recursos liberados e canvas removido |
| DPR 3 e cenário touch 1024 × 600 | Limites de qualidade respeitados |
| axe nas três larguras | Zero violações; contraste sobre imagens exigiu revisão manual |
| Console e rede no uso normal | Zero erros, warnings ou falhas inesperadas |
| Build de produção em `/dragon-ball-super/` | HTML, JS, CSS e WOFF2 servidos idênticos a `dist/`; cinco artes, Motion e Three carregaram |
| Produção com movimento reduzido e falha dos chunks opcionais | Conteúdo, imagens, fontes e CTA preservados; sem exceções JavaScript não tratadas |

Os erros de rede nos cenários de falha de módulo foram provocados pelo harness. A instrumentação de desmontagem observou descarte de buffers/programas e perda do contexto; isso não equivale a uma medição prolongada de memória ou de FPS. A visibilidade da aba foi simulada por evento no navegador automatizado.

As medições complementares sobre pixels reais dos glifos, sem creditar contorno e sombra, confirmaram as correções de contraste desktop. Granolah apresentou mínimo de 11,81:1 no estado final e 6,46:1 no inicial; Super Hero, 8,82:1 e 6,01:1. Os doze grupos revistos passaram os respectivos limites por tamanho de texto. Essa amostragem não substitui uma auditoria completa de acessibilidade.

## Comparação visual e correções

| Referência e achado | Ajuste implementado |
| --- | --- |
| Abertura com arte dominante, chamada à esquerda e personagens à direita | Nova arte sem UI; títulos e CTA em HTML; Bangers local como alternativa licenciada ao lettering raster do conceito |
| Final da arte da abertura deixava uma linha horizontal | Máscara gradual aplicada à própria imagem |
| Esfera inicial tinha preenchimento uniforme e reflexos pouco convincentes | Volume e reflexos procedurais, contorno luminoso e quatro estrelas vermelhas legíveis |
| CTA quebrava em duas linhas no celular | Espaçamento ajustado; conferência adicional em 320 e 360 px |
| H1 tinha palavras unidas no nome acessível | Espaço real entre os dois spans |
| Min-height e aspect-ratio ampliavam a seção em touch landscape | Largura de seção explicitamente limitada a 100% |
| Pontos claros da arte atrás do texto | Sobreposição de contraste localizada na zona de leitura desktop |

A posição da esfera no celular acompanha os blocos sucessivos e difere do conceito desktop. Ela e as partículas são renderizadas por código; não são uma cópia raster do efeito ilustrado no conceito. As imagens continuam achatadas, sem personagens ou cenários animados separadamente.

## Ampliação da energia — 15 de outubro

A revisão ampliou os pontos e rastros de primeiro plano e acrescentou três filamentos luminosos sobre a região inferior das artes. A esfera responde por proximidade do mouse, com limite de inclinação de aproximadamente 17,2°. Conteúdo e arquivos de arte permanecem iguais.

Nova QA em Chrome/Playwright passou nas larguras 360, 768 e 1440 px. As quinze combinações de cena/largura foram inspecionadas no próprio buffer WebGL: as regiões amostradas de texto e rostos protegidos ficaram transparentes, enquanto as áreas livres da arte receberam energia. A comparação de frames confirmou partículas em movimento e a resposta da esfera ao ponteiro nos dois sentidos. Não houve erro de console, warning ou overflow nos cenários normais.

Movimento reduzido inicial/dinâmico, WebGL bloqueado, erro de inicialização, perda de contexto e desmontagem React passaram. A instrumentação da desmontagem observou liberação de 30 buffers, 6 programas e 12 shaders, remoção do canvas e liberação do contexto. Esses números descrevem a execução testada, sem constituir garantia contra todo vazamento ou medição de FPS.

Scripts, capturas e relatórios ficam fora da aplicação em `%TEMP%/dragon-ball-cinematic-qa/energy-v2/`. As preferências de acessibilidade dos visitantes continuam respeitadas; nenhuma etapa de ativação foi adicionada à interface.

O smoke do novo build compilado também passou em 1440 px nos quatro cenários: normal, movimento reduzido inicial, falha do chunk Three e falha do chunk Motion. HTML, JS, CSS e fontes servidos no prefixo são idênticos ao build local. Conteúdo, cinco artes e CTA permaneceram acessíveis, sem erros normais de console/rede; os dois abortos de módulo produziram somente as falhas de rede intencionais.

## Limites da validação

Não foram testados Firefox, Safari ou aparelhos físicos. Acessibilidade básica e axe não representam certificação. Os masters têm 1672 px de largura; telas maiores podem revelar o limite de nitidez. Não existem vídeos, sequências de frames ou camadas independentes de personagens para transformações reais.

Os limites de renderização configurados não são FPS medido. O módulo Three continua acima de 500 kB minificado e é carregado sob demanda; a carga inicial de conteúdo permanece independente dele.
