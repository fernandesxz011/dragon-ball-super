# Three.js — Etapa 04

A cena acrescenta uma esfera de quatro estrelas com arcos orbitais, partículas de primeiro plano, três filamentos luminosos e auras que acompanham as silhuetas dos personagens, usando **Three.js puro 0.186.1**, integrado por effects do React. **Motion 14.2.0** continua responsável pelas entradas e pelo parallax das artes em HTML. O relevo 2,5D compartilha uma matriz entre a composição HTML e a aura no canvas. Os personagens permanecem nas imagens, com o conteúdo e a navegação disponíveis antes do carregamento do efeito.

Os efeitos começam automaticamente na abertura e acompanham a rolagem, sem checkbox, opt-in ou tela de ativação. A preferência de movimento reduzido de cada visitante mantém a apresentação estática. O aplicativo consulta essa preferência; o diagnóstico das configurações de animação no computador de desenvolvimento não é uma funcionalidade do site.

## Dependências e referências oficiais

- `three`: **0.186.1**, dependência de execução com licença **MIT**; [metadata da versão no npm](https://registry.npmjs.org/three/0.186.1) e [licença oficial](https://raw.githubusercontent.com/mrdoob/three.js/r186/LICENSE).
- `@types/three`: **0.186.0**, dependência de desenvolvimento da mesma release 186, com licença **MIT**; [metadata no npm](https://registry.npmjs.org/@types%2fthree/0.186.0). Exige TypeScript 5.6 ou superior, atendido pelo TypeScript 6.0.3 do projeto. Seus pacotes transitivos de tipos/addons pertencem à árvore de desenvolvimento.

As versões estão fixadas no `package.json` e no lockfile. A integração usa o `WebGLRenderer`, que exige **WebGL2**; WebGL1 deixou de ser suportado na release r163. O loop usa `setAnimationLoop()`, e `dispose()` encerra os recursos internos do renderer. Esses contratos estão documentados no [código oficial de WebGLRenderer](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/renderers/WebGLRenderer.js).

## Carregamento e cena

`src/effects/EnergyEffects.tsx` espera a conclusão de `decode()` da imagem prioritária `.hero__image` antes de importar `energy-scene.ts`. Uma falha no decode libera a tentativa do efeito, sem impedir o restante da página. O módulo opcional tem uma promise compartilhada e uma guarda de desmontagem, para impedir a criação tardia de uma cena depois da troca de preferência ou desmontagem.

`src/effects/energy-scene.ts` cria **um canvas WebGL ativo**, transparente e fixo sobre a viewport, compartilhado pela esfera, órbitas, partículas, filamentos e aura. Pequenos canvases 2D temporários produzem as máscaras da aura e são liberados depois da leitura dos canais. O contexto WebGL2 solicita `powerPreference: 'low-power'`; antialiasing é habilitado no modo desktop. A saída usa `SRGBColorSpace`. O host e o canvas são decorativos, com `aria-hidden` e sem eventos de ponteiro que interceptem os controles.

A cena usa uma **OrthographicCamera**, com limites ajustados à área CSS do host (`host.clientWidth` e `host.clientHeight`) e posição Z de 1000. Medir o host evita incluir a largura da scrollbar no canvas e nas coordenadas da cena. A projeção preserva o formato circular da esfera mesmo no espaço lateral reservado no layout, mantendo as quatro estrelas frontais. A independência entre escala e distância é descrita no [código oficial de OrthographicCamera](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/cameras/OrthographicCamera.js).

A esfera ocupa o espaço reservado `.hero__sphere-slot`, ao lado da ação de explorar as sagas. Seu tamanho e sua posição seguem esse elemento HTML; ela fica invisível quando o espaço sai da viewport. O componente `DragonBallFallback.tsx` oferece uma versão **SVG local e estática**, com quatro estrelas, desde a primeira renderização. O SVG só é ocultado depois de um frame 3D bem-sucedido e reaparece quando a cena é descartada.

## Esfera e materiais

`src/effects/dragon-ball.ts` constrói a esfera com `SphereGeometry(1, 40, 28)`. Uma geometria de estrela de cinco pontas, feita com `Shape` e `ShapeGeometry`, é compartilhada por **quatro meshes** dispostos em duas linhas, dentro da casca da esfera. A API de triangulação está descrita no [código oficial de ShapeGeometry](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/geometries/ShapeGeometry.js).

O acabamento usa um **`ShaderMaterial` local**, com cor calculada a partir da normal da superfície, núcleo âmbar fora do centro, duas amostras de ruído procedural de baixa amplitude, contorno de Fresnel e reflexo curvo. O gradiente laranja e dourado diferencia o centro, os lados e a borda; o alpha varia de **0.91 a 0.99**. Uma segunda passagem, traseira e aditiva, reutiliza a mesma geometria com escala **1.045** para um halo estreito. Esse material substitui as duas cascas Phong e os dois reflexos geométricos, que produziram um preenchimento uniforme na captura revisada.

As estrelas usam `MeshBasicMaterial` vermelho `#f21e32`, alpha **0.98**, `toneMapped: false` e `renderOrder: 4`, depois das passagens da esfera. Assim, o reflexo não apaga as quatro estrelas. O conjunto usa **seis meshes, duas geometrias e três materiais**, sem recursos de imagem.

É uma aproximação de volume e translucidez, sem refração física, transmission, texturas de ambiente ou bloom. A luz aparente é calculada no shader, sem luzes globais na cena. O shader usa as matrizes fornecidas pelo Three e a conversão de cor de saída; seu contrato é descrito na [documentação oficial de ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html).

A animação aplica flutuação curta e rotação lenta ao grupo interno; a posição externa continua sob controle do espaço reservado no layout. No desktop, o mouse é normalizado em relação ao centro e ao tamanho do slot. A resposta perde força fora da proximidade da esfera e volta suavemente ao repouso quando o ponteiro se afasta ou sai da janela. O fator de ponteiro é **0.27 rad**, aproximadamente 15,5°, com inclinação total limitada a **±0.3 rad**, aproximadamente 17,2°, e suavização exponencial de fator 6. A flutuação permanece em 0.045 unidade local. No modo compacto, não há resposta ao ponteiro.

## Arcos orbitais locais

`src/effects/orbits.ts` cria três arcos com `TorusGeometry`, raios **1.14, 1.28 e 1.4** e planos de inclinações diferentes. Cada arco combina um miolo fino, um halo de baixa opacidade e um segmento luminoso que percorre o plano. As geometrias e os materiais são compartilhados entre os três planos. `MeshBasicMaterial`, mistura aditiva e alpha por vértice produzem extremidades suaves, sem texturas, bloom ou pós-processamento.

O grupo é filho do grupo externo da esfera. O loop existente chama `update(elapsed)`, sem RAF ou listeners próprios, com rotação contínua lenta e sem pulsação de brilho. `dispose()` é idempotente e libera todas as geometrias e materiais locais; o cleanup da cena também o registra na pilha de liberação.

## Qualidade configurada

Os parâmetros estão centralizados em `src/effects/config.ts`:

| Parâmetro | Desktop, a partir de 901 px com ponteiro fino/hover | Compacto, até 900 px ou sem ponteiro fino/hover |
| --- | ---: | ---: |
| Partículas | 200 | 64 |
| Tamanho-base das partículas em px CSS | 6–18 | 4–10 |
| Seleção configurada de rastros alongados | 20% | 20% |
| Miolo / halo dos filamentos em px CSS | 1.65 / 12 | 1.35 / 9 |
| DPR máximo | 1.5 | 1 |
| Intervalo mínimo de renderização | `1000 / 45` ms | `1000 / 30` ms |
| Antialiasing | Habilitado | Desabilitado |

**45 e 30 são parâmetros do throttle, não FPS medidos ou garantidos.** O resultado real depende do navegador e do dispositivo. Cada dimensão do drawing buffer é limitada a **4096 px**: o DPR efetivo é o menor entre o DPR do dispositivo, o limite do modo, `4096 / largura` e `4096 / altura`, usando as dimensões CSS do host. Em viewports muito grandes, pode ficar abaixo de 1.

O modo compacto também cobre celulares em landscape e dispositivos touch com tela larga. A consulta `(hover: hover) and (pointer: fine)`, combinada ao breakpoint de 901 px, autoriza a qualidade desktop e o listener passivo de mouse. O tamanho da esfera segue o espaço reservado pelo CSS. A configuração é reavaliada na criação da cena e nas mudanças do breakpoint existente.

`src/effects/particles.ts` usa uma única `BufferGeometry`, atributos tipados e um `ShaderMaterial` aditivo. A distribuição determinística cobre o quadro, sem bloqueio fixo do centro. O movimento ocorre no shader, com profundidade Z distribuída em 360 unidades e atenuação de XY/tamanho por distância, mesmo com câmera ortográfica. Os tamanhos-base CSS são multiplicados pelo DPR efetivo; a profundidade e o alongamento dos rastros também alteram o tamanho final. O teto de cada sprite é **64 pixels físicos**.

Cerca de **20%** das sementes recebem um rastro com fator de comprimento **2.3** e perfil estreito inclinado; as demais usam brilho radial. O fragment shader descarta a área externa do sprite antes de consultar as máscaras, e calcula miolo e halo sem textura, bloom ou pós-processamento. O campo usa `renderOrder: -1`.

## Filamentos de primeiro plano

`src/effects/energy-ribbons.ts` acrescenta **um mesh**, com `PlaneGeometry` e um `ShaderMaterial` aditivo. Três curvas sinusoidais formam filamentos de miolo claro e halo colorido, concentrados na região inferior da arte. O quad é limitado à **metade inferior da área real de imagem** da cena predominante, depois do cálculo de `contain`/`cover`; não ocupa a viewport inteira. O retângulo de referência vem do layout de repouso, sem herdar um ponto arbitrário do parallax.

O shader descarta pixels fora do envelope luminoso antes do loop de até 24 máscaras. Filamentos e partículas compartilham os **mesmos objetos de uniforms** de tempo, DPR, viewport, paleta, intensidade, dispersão e retângulos protegidos. O tempo é atualizado pelo loop existente; não há RAF, renderer, listener de scroll ou cópia de medições independente. O shader dos filamentos não usa ruído procedural. O mesh usa `renderOrder: -2`, atrás das partículas e das passagens da esfera/órbitas.

## Scroll compartilhado e cores

### Aura e relevo 2,5D

`character-aura-paths.ts` define silhuetas em coordenadas nativas, retângulos faciais menores e exclusões locais de aura; [a origem e os limites](aura-paths.md) estão registrados separadamente. `character-aura.ts` rasteriza esses vetores em canvases 2D temporários somente na primeira visita a cada arte. O mapa RGBA guarda corpo, halo largo, contorno estreito e proteção facial/oclusões. Os bytes são enviados como `DataTexture` com `NoColorSpace`, filtro linear e sem mipmaps. Usar canais brutos impede a premultiplicação do alpha facial de apagar os demais controles. A API está na [documentação oficial de DataTexture](https://threejs.org/docs/pages/DataTexture.html).

O mapa tem lado maior limitado a **1024 px no desktop / 640 px no compacto**, preservando a proporção do master. O blur largo é **18/14 px de textura**, e o estreito **2,2/2 px**. São cálculos únicos de preparação, sem blur de tela ou pós-processamento por frame. Até cinco mapas ficam em cache durante a visita; todos são descartados com a cena. Uma falha na preparação de um mapa oculta apenas sua aura, mantendo o restante dos efeitos.

Um quad compartilhado mostra a aura da arte predominante. O fragment shader usa duas amostras do controle e fluxo sinusoidal de baixa amplitude, preservando o interior do corpo e as regiões faciais. Cabelo, chifres e ombros recebem o brilho pelo lado externo. Três supressões locais evitam placas luminosas na ponta do chifre de Moro, na borda difusa da capa de Granolah e no vão entre cintura e antebraço de Gohan. São regiões sem aura, sem classificá-las como corpo. O controle de oclusão recebe blur de 5 px de textura e fade no shader; o branco do contorno é limitado para preservar a cor. O fechamento inferior dissolve entre UV Y **0,59–0,76** na abertura e **0,78–0,96** em Black Freeza; nos demais, **0,86–1**. Bordas nativas também recebem fade. Isso evita iluminar como contorno físico as linhas de fechamento usadas na névoa ou no limite do arquivo.

`art-depth.ts` calcula uma matriz `perspective × rotateX × rotateY × scale`, aplicada ao contêiner HTML `[data-depth-surface]` e copiada para o vertex shader da aura. A mesma origem e a coordenada homogênea W mantêm a projeção e os UVs alinhados. A implementação segue [Matrix4](https://threejs.org/docs/pages/Matrix4.html) e [CSS matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d). Inclinação máxima de **±1,2°**, escala de **1,012** e perspectiva de `max(1100 px, largura × 1,2)` acrescentam relevo discreto. A composição inteira se move, incluindo o cenário; não há camada independente nem malha 3D de personagem.

O loop existente calcula a resposta suave ao ponteiro no desktop e uma inclinação automática lenta. Até 900 px a matriz permanece identidade, reforçada por CSS. As medições iniciais e de resize neutralizam temporariamente essa transformação antes de guardar o layout; não são feitas leituras geométricas por frame. O parallax Motion é incluído na projeção da aura. `artEnteredAt`, na ponte compartilhada, aguarda **1000 ms** após a entrada da imagem e acrescenta **350 ms** de fade da aura; a abertura já está pronta. Textos permanecem estáveis.

A aura compartilha tempo, viewport e paleta com o campo existente, mas usa máscaras HTML separadas: as antigas regiões amplas de cabelo/rosto continuam protegendo partículas e filamentos e não suprimem a aura do cabelo. O controle de corpo/faces protege a ilustração. Cleanup restaura os estilos de profundidade e libera quad, material e texturas, além dos recursos anteriores. Movimento reduzido e fallback dispensam o canvas e preservam a apresentação estática.

`src/motion/scene-motion.ts` registra as cenas usando o `scroll()` do Motion, com os offsets `start end` e `end start`. `src/motion/scene-progress.ts` guarda progresso e medidas em uma ponte mutável, lida pela cena Three. Isso compartilha as medições existentes, sem introduzir um segundo listener de scroll ou atualizar estado React por frame. A API está descrita na [documentação oficial de scroll do Motion](https://motion.dev/docs/scroll).

A cena predominante é escolhida pela maior pontuação de altura visível, com pequena penalização pela distância ao centro da viewport. O efeito não depende somente de qual seção foi cruzada por último. Cor, intensidade e dispersão aproximam-se do tema escolhido por suavização exponencial, evitando uma troca abrupta na passagem entre sagas. Sem cena registrada visível, a intensidade das partículas aproxima-se de zero.

| Cena | Cor principal | Cor secundária | Intensidade | Dispersão |
| --- | --- | --- | ---: | ---: |
| Abertura | `#69adff` | `#af80f3` | 0.82 | 0.3 |
| Moro | `#7abaff` | `#72e3ed` | 0.85 | 0.2 |
| Granolah | `#edb36f` | `#87c29b` | 0.76 | 0.6 |
| Super Hero | `#b29aef` | `#efd18f` | 0.82 | 0.4 |
| Black Freeza | `#9771d1` | `#e2dced` | 0.68 | 0.8 |

Essas cores são parâmetros de direção visual do projeto conceitual. A esfera mantém seu acabamento âmbar; os temas alteram partículas e filamentos em conjunto.

## Proteção do conteúdo

Até **24 retângulos visíveis** protegem cabeçalho, índice, seção sobre, rodapé, títulos, descrições, ação de explorar e regiões específicas dos personagens. As coordenadas em `data-protect-region` são normalizadas no formato `x,y,largura,altura`; múltiplas regiões são separadas por `;`. Valores inválidos usam a imagem inteira como proteção conservadora.

| Arte | Região normalizada atual | Área protegida |
| --- | --- | --- |
| Abertura | `0.48,0,0.49,0.46` | Rostos e parte superior de Goku e Vegeta |
| Moro | `0.54,0,0.44,0.65` | Rosto, chifres e parte superior |
| Granolah | `0.47,0.08,0.44,0.66` | Rosto, cabelo e visor |
| Super Hero | `0.55,0,0.43,0.6` | Rosto e cabelo de Gohan Beast |
| Black Freeza | `0.55,0.02,0.35,0.5` | Rosto e parte superior de Freeza |
| Black Freeza, fundo | `0.88,0.72,0.1,0.22` | Goku e Vegeta pequenos ao fundo |

`imageLayoutBounds()` neutraliza o translate do `picture` e o scale centrado do `img` usando `DOMMatrixReadOnly`; o contêiner externo de profundidade é neutralizado durante a medição. O cache representa o repouso, evitando que um snapshot em +36 px fique 72 px distante do extremo −36 px do parallax. `imagePlacement()` prioriza a proporção declarada do master, estável antes/depois do decode, evitando o arredondamento inteiro de `naturalWidth`/`naturalHeight` nos srcsets. A proporção natural é fallback. O cálculo considera `object-fit: contain`/`cover` e `object-position`, incluindo centro no desktop e alinhamento à direita no compacto. As regiões são limitadas à caixa visível da imagem. Derivados JPEG podem arredondar a altura em um pixel; essa diferença pequena permanece no mapeamento.

Os retângulos comuns recebem margem de **12 px**; elementos com `data-reveal`, H1 e grupos de título recebem **44 px**. As regiões de personagens recebem margens horizontal/vertical de **12/44 px**, mais **1.3%** da largura/altura da caixa para cobrir o scale de entrada 1.025. O shader compartilhado mantém **alpha zero no interior** dos retângulos e aplica um fade de **12 px somente pelo lado externo**, usando a menor visibilidade entre regiões sobrepostas.

A posição das máscaras e da esfera usa o valor atual de `window.scrollY` em cada frame renderizado. A seleção de saga, o progresso compartilhado e a paleta continuam sob responsabilidade da ponte Motion. `ResizeObserver` no conteúdo, no espaço da esfera e no host, junto ao evento de resize, invalida o cache quando o layout muda. Essa medição não é refeita por frame.

As máscaras atuam em partículas e filamentos. A esfera e seus arcos ficam exclusivamente no espaço decorativo da abertura e precisam de folga no layout. Nenhum personagem foi separado do raster ou convertido em modelo 3D; o primeiro plano luminoso é geometria decorativa independente sobre a ilustração.

## Ciclo de vida e fallback

- **Movimento reduzido:** o provider compartilhado observa `prefers-reduced-motion`. No modo `static`, o effect não inicia importação ou canvas; mudanças para esse modo executam cleanup. A esfera SVG continua disponível.
- **Aba oculta:** `visibilitychange` pausa o loop com `setAnimationLoop(null)`. Ao retornar, o relógio de frame é reiniciado e o layout é medido novamente, evitando acumular o tempo em que a aba ficou oculta.
- **Troca de modo ou desmontagem:** o cleanup é idempotente; encerra o loop, remove eventos, desconecta o observer, libera geometrias e materiais dos arcos, esfera, partículas e filamentos, limpa os caches e a cena e executa `renderer.dispose()`. As ações de liberação são registradas durante a inicialização e executadas em ordem inversa, com cada falha isolada para permitir as liberações restantes. O canvas é removido e, na destruição normal, o contexto é liberado pela extensão `WEBGL_lose_context` depois do descarte dos recursos.
- **Falha durante a inicialização:** a mesma pilha de liberação faz rollback dos recursos já adquiridos, inclusive se a cena ainda estiver incompleta. A esfera estática é restaurada antes de propagar a falha para o tratamento de fallback no effect.
- **WebGL indisponível ou falha de carregamento/renderização:** o host fica em fallback, com HTML, imagens, links e SVG estático disponíveis. O callback `renderer.debug.onShaderError` encaminha falhas de compilação ou link de shader para a mesma saída com cleanup.
- **Perda de contexto:** `webglcontextlost` descarta a cena e reexibe o SVG. Essa saída não solicita uma nova perda de contexto nem tenta restaurar automaticamente o mesmo canvas.

Não há modelos, texturas baixadas ou chamadas de serviço externas em tempo de execução para esses efeitos. Os mapas de controle da aura são gerados localmente por código.

## Estado da revisão de energia

A revisão de **aura e relevo de 20 de outubro de 2026** passou por lint, TypeScript, build e QA nas quinze combinações de cena/largura. O build final tem `energy-scene` em **590,89 kB / 152,48 kB gzip**, `index` em **232,94 kB / 72,98 kB gzip** e CSS em **14,61 kB / 3,88 kB gzip**. O aviso acima de 500 kB permanece. Máscaras, alinhamento, movimento, resize, teclado, preferência reduzida e cleanup foram conferidos; o smoke de produção passou nos modos normal, reduzido e sem WebGL. A revisão visual eliminou três placas de brilho usando supressões locais e suavização do contorno. Detalhes em [validation.md](validation.md).

Os números e resultados abaixo registram a revisão anterior de partículas e filamentos, de 15 de outubro.

Lint, typecheck e o build final desta revisão, após o congelamento do código, passaram. O build tem `energy-scene` em **573,77 kB / 145,99 kB gzip**, `index` em **232,77 kB / 72,96 kB gzip** e CSS em **14,24 kB / 3,82 kB gzip**. O aviso de chunk acima de 500 kB permanece.

A nova QA do campo e dos filamentos passou em 360, 768 e 1440 px. As quinze combinações de cena/largura tiveram verificação no buffer WebGL: transparência nas regiões amostradas de texto/rostos e energia na arte livre. Pares de frames confirmaram a resposta da esfera ao ponteiro. Movimento reduzido, WebGL bloqueado, rollback, perda de contexto e desmontagem também passaram; a execução de cleanup liberou 30 buffers, 6 programas e 12 shaders. O smoke compilado passou nos cenários normal, reduzido e de falha dos módulos Three/Motion. Detalhes e limites estão em [validation.md](validation.md); a publicação usa [GitHub Pages](https://fernandesxz011.github.io/dragon-ball-super/).

O helper de layout foi conferido em Node para seis combinações de scale 1/1.025 e translate −36/0/+36, retornando o mesmo retângulo de repouso, além dos casos `contain` centrado, `cover` à direita e dimensões declaradas antes do decode. Isso verifica os cálculos sem compilar shaders na GPU ou substituir a revisão em navegador.

## Medições anteriores da geometria

Uma inspeção Node, sem renderer ou navegador, percorreu os vértices transformados dos nove meshes orbitais em amostras de um segundo entre 0 e 120 segundos. Os limites encontrados foram aproximadamente **X ±1.41457** e **Y ±1.19923** em unidades locais. Com a escala externa atual de `0.4 × tamanho do slot`, isso corresponde a uma extensão lateral de aproximadamente **6.58% do slot** além de cada borda e a limites verticais dentro do slot.

Essa medição ajuda a dimensionar a folga entre arcos e texto. É uma revisão técnica da geometria amostrada, sem medição de FPS, validação de contraste ou confirmação visual da integração no navegador.

Após a troca anterior do acabamento da esfera, um smoke test Node confirmou quatro estrelas, seis meshes, duas geometrias e três materiais. Seis combinações de tempo, ponteiro e movimento, incluindo entradas `NaN` e infinitas, mantiveram os atributos, as matrizes e o uniform de tempo finitos. O descarte duplicado liberou cada um dos cinco recursos uma única vez e removeu o grupo do pai. Esse teste antecede a ampliação do campo e da inclinação do ponteiro, não compila shaders na GPU e não substitui a nova revisão em navegador.
