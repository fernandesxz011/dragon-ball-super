# Motion — comportamento atual

## Integração

Motion **14.2.0**, fixado no lockfile, anima os elementos HTML por refs e effects do React. A animação inicia automaticamente quando a preferência do sistema permite movimento; não existe botão de ativação. Three.js cuida da esfera e das partículas e recebe o progresso compartilhado de `scene-progress.ts`; veja [three.md](three.md).

A integração usa `inView()` para entradas e `scroll()` para progresso. `animate()` de `motion/mini` altera somente `opacity` e o `transform` completo. `src/motion/scene-motion.ts` é importado como módulo opcional depois da primeira renderização, sem bloquear o HTML ou os links.

No build atual da composição cinematográfica, o chunk `scene-motion` tem **18,73 kB / 7,32 kB gzip** e a entrada `index` tem **232,60 kB / 72,90 kB gzip**. O CSS tem **14,24 kB / 3,82 kB gzip**. O chunk opcional `energy-scene`, com **567,33 kB / 144,09 kB gzip**, mantém o aviso do Vite de tamanho acima de 500 kB; sua importação lazy não elimina o peso de transferência.

- [Documentação oficial de animate](https://motion.dev/docs/animate).
- [Documentação oficial de inView](https://motion.dev/docs/inview).
- [Documentação oficial de scroll](https://motion.dev/docs/scroll).
- [Instalação e integração com React/Vite](https://motion.dev/docs/react-installation).

## Entradas e rolagem

| Elemento | Entrada | Comportamento durante a leitura |
| --- | --- | --- |
| Arte da abertura | Imediata, sem animação Motion | Estática |
| Título, descrição e identificação de fã da abertura | Opacity 0,72 → 1; translateY 32 → 0 px | Texto permanece estável após a entrada |
| Link Explorar sagas | Opacity 0,85 → 1; translateY 12 → 0 px | Controle permanece disponível; foco conclui a entrada |
| Número, título e descrição das sagas | Opacity 0,72 → 1; translateY 32 → 0 px | Entrada única, sem novo fade ao voltar |
| Imagem das sagas | Opacity 0,8 → 1; scale 1,025 → 1, em 0,95 s | Entrada própria, independente do título |
| Picture das sagas no desktop | Sem entrada adicional | Parallax +36 → −36 px, somente acima de 900 px |
| Picture das sagas até 900 px | Sem parallax | Transform de rolagem zerado por CSS |
| Borda decorativa no desktop | Gradiente entre os fundos das cenas | Opacity 0,55 → 0,8 → 0,65, acompanhando o scroll |

As entradas de texto duram **0,72 s**, com atraso de **0,1 s por elemento**, usando a curva `[0.22, 1, 0.36, 1]`. O atraso é calculado pela ordem dos elementos `[data-reveal]` de cada cena. Títulos são blocos inteiros, sem animação por letra.

O texto dispara quando 35% da legenda da abertura ou do cabeçalho da saga entra na tela. A arte tem um `inView()` separado sobre o próprio `img`, com `amount: 0.08`: ela faz sua entrada ao aparecer, sem esperar o cabeçalho que vem depois da imagem no celular. A opacity inicial de 0,8 mantém a arte legível durante essa pequena entrada; a imagem não recebe um novo fade quando o título aparece.

Os marcadores `data-revealed` e `data-art-revealed` registram separadamente o primeiro disparo do texto e da imagem. Os observers deixam de acompanhar a respectiva entrada após o disparo; os marcadores evitam repetições ao voltar à seção ou mudar de breakpoint. A escala de entrada atua no `img`; o parallax atua no `picture` que o contém.

O progresso usa `offset: ['start end', 'end start']`, considerando o percurso completo da cena pela janela. Até 900 px, o modo `reveal` mantém as entradas de texto e imagem, com deslocamento de rolagem da arte igual a zero. Acima desse breakpoint, o modo `full` acrescenta parallax e variação da borda.

## Acessibilidade e recuperação

O HTML começa visível. O CSS base de `[data-reveal]` usa `opacity: 1; transform: none`; imagens também não dependem de estilos iniciais ocultos. Motion aplica os estados de entrada somente ao disparar a animação. Se o módulo opcional não carregar ou falhar na inicialização, o conteúdo continua disponível e os estilos aplicados são restaurados.

`MotionProvider` usa `matchMedia` e `useSyncExternalStore` para acompanhar `prefers-reduced-motion` e o breakpoint de 901 px. Movimento reduzido inicial seleciona o modo `static` e evita importar o módulo Motion. Mudanças durante a navegação desmontam os efeitos e restauram texto, imagem, picture e borda. O CSS reduzido reforça `opacity: 1`, `transform: none` e a remoção de animações/transições nos elementos envolvidos.

Foco dentro de uma cena conclui tanto a entrada do texto quanto a da arte e interrompe seus dois observers. `[data-reveal]:focus-within` também força opacity 1 e transform none. Cada operação `complete`, `cancel` ou de parada é isolada para que uma timeline nativa já removida não impeça a limpeza das demais; a restauração dos estilos ocorre em `finally`.

Links permanecem âncoras nativas. O CSS usa `scroll-behavior: smooth` normalmente e `auto` com movimento reduzido. Os destinos principais e as sagas usam `scroll-margin-top: 24px`. O cabeçalho está posicionado na abertura e acompanha a rolagem do documento. Não há interceptação de wheel/touch, scroll hijacking ou bloqueio da posição de leitura.

## Artes e desempenho

As artes cinematográficas atuais substituem as bandas estreitas da Etapa 02. No desktop, a composição da saga ocupa o fundo da seção, com `object-fit: contain` e texto HTML sobre o espaço negativo. No tablet/celular, a arte antecede o conteúdo e usa `object-fit: cover; object-position: right center`, dentro da proporção definida no CSS. O contêiner da arte usa `overflow: clip`; isso também limita a escala transitória e o parallax ao quadro da cena.

Personagens, paisagem e energia continuam em uma ilustração achatada. Motion desloca essa imagem como um todo; não existem animações independentes de rosto ou personagem. Fontes, títulos, descrições e controles permanecem elementos HTML.

O progresso de scroll é conectado diretamente às animações pelo Motion, usando `ScrollTimeline` quando suportado. O bridge compartilhado evita outro sistema de medição para o Three.js. Não há atualização de estado React por pixel, animação de width/height, filtros pesados ou `will-change` permanente. Observers de texto/arte, listeners, timelines e registro de progresso são liberados na desmontagem ou mudança de preferência.

## Verificações da composição atual

Lint, typecheck e build passaram. A QA funcional em **Chrome 155.0.8059.40** com Playwright passou em **360 × 800, 768 × 1024 e 1440 × 1000**. O plugin Browser não estava disponível. Foram conferidos 30 acionamentos de âncoras, teclado/skip link/foco visível, entrada da arte independente da entrada do texto, leitura e retorno às cenas, progresso e paletas, ausência de overflow horizontal e os limites responsivos da configuração.

A rodada também cobriu movimento reduzido inicial e dinâmico, desmontagem e retomada dos efeitos, pausa em aba oculta, WebGL indisponível, perda de contexto, falha dos imports opcionais de Motion/Three, falha na inicialização do observer e desmontagem React. O relatório registra liberação de recursos e preservação do HTML/fallback nos cenários correspondentes, sem erros inesperados de aplicação ou rede. O axe detectou **zero violações** nas três larguras; contraste sobre fundos complexos recebeu revisão complementar.

O contraste foi conferido em 360 e 1440 px, incluindo os keyframes iniciais de opacity **0,72** dos textos e **0,85** do CTA, com seus deslocamentos de **32/12 px**. A última retestagem desktop dos títulos e parágrafos de Granolah e Super Hero passou: mínimos iniciais de **6,46:1** e **6,01:1**, respectivamente. Método, critérios e limites estão em [art-direction.md](art-direction.md#contraste-sobre-a-composição).

As evidências locais ficam em `%TEMP%/dragon-ball-cinematic-qa/`, nos relatórios `cinematic-qa-results.json`, `contrast-foundation-results.json` e `contrast-glyph-foundation-results.json`. O smoke de produção também passou no prefixo `/dragon-ball-super/`, com Motion/Three compilados, movimento reduzido inicial e falha simulada dos dois módulos. Esses resultados cobrem os cenários registrados e não constituem certificação completa de acessibilidade ou medição de desempenho em dispositivos reais. A publicação usa o workflow documentado em [deployment.md](deployment.md).
