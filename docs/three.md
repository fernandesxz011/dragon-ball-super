# Three.js — Etapa 04

A cena acrescenta uma esfera de quatro estrelas com arcos orbitais e partículas nas bordas e junto ao solo usando **Three.js puro 0.186.1**, integrado por effects do React. **Motion 14.2.0** continua responsável pelas entradas e pelo movimento das artes em HTML. Os personagens permanecem nas imagens, com o conteúdo e a navegação disponíveis antes do carregamento do efeito.

Os efeitos começam automaticamente na abertura e acompanham a rolagem, sem checkbox, opt-in ou tela de ativação. A preferência de movimento reduzido mantém a apresentação estática.

## Dependências e referências oficiais

- `three`: **0.186.1**, dependência de execução com licença **MIT**; [metadata da versão no npm](https://registry.npmjs.org/three/0.186.1) e [licença oficial](https://raw.githubusercontent.com/mrdoob/three.js/r186/LICENSE).
- `@types/three`: **0.186.0**, dependência de desenvolvimento da mesma release 186, com licença **MIT**; [metadata no npm](https://registry.npmjs.org/@types%2fthree/0.186.0). Exige TypeScript 5.6 ou superior, atendido pelo TypeScript 6.0.3 do projeto. Seus pacotes transitivos de tipos/addons pertencem à árvore de desenvolvimento.

As versões estão fixadas no `package.json` e no lockfile. A integração usa o `WebGLRenderer`, que exige **WebGL2**; WebGL1 deixou de ser suportado na release r163. O loop usa `setAnimationLoop()`, e `dispose()` encerra os recursos internos do renderer. Esses contratos estão documentados no [código oficial de WebGLRenderer](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/renderers/WebGLRenderer.js).

## Carregamento e cena

`src/effects/EnergyEffects.tsx` espera a conclusão de `decode()` da imagem prioritária `.hero__image` antes de importar `energy-scene.ts`. Uma falha no decode libera a tentativa do efeito, sem impedir o restante da página. O módulo opcional tem uma promise compartilhada e uma guarda de desmontagem, para impedir a criação tardia de uma cena depois da troca de preferência ou desmontagem.

`src/effects/energy-scene.ts` cria **um canvas ativo**, transparente e fixo sobre a viewport, compartilhado pela esfera e pelo campo de partículas. O contexto WebGL2 solicita `powerPreference: 'low-power'`; antialiasing é habilitado no modo desktop. A saída usa `SRGBColorSpace`. O host e o canvas são decorativos, com `aria-hidden` e sem eventos de ponteiro que interceptem os controles.

A cena usa uma **OrthographicCamera**, com limites ajustados à área CSS do host (`host.clientWidth` e `host.clientHeight`) e posição Z de 1000. Medir o host evita incluir a largura da scrollbar no canvas e nas coordenadas da cena. A projeção preserva o formato circular da esfera mesmo no espaço lateral reservado no layout, mantendo as quatro estrelas frontais. A independência entre escala e distância é descrita no [código oficial de OrthographicCamera](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/cameras/OrthographicCamera.js).

A esfera ocupa o espaço reservado `.hero__sphere-slot`, ao lado da ação de explorar as sagas. Seu tamanho e sua posição seguem esse elemento HTML; ela fica invisível quando o espaço sai da viewport. O componente `DragonBallFallback.tsx` oferece uma versão **SVG local e estática**, com quatro estrelas, desde a primeira renderização. O SVG só é ocultado depois de um frame 3D bem-sucedido e reaparece quando a cena é descartada.

## Esfera e materiais

`src/effects/dragon-ball.ts` constrói a esfera com `SphereGeometry(1, 40, 28)`. Uma geometria de estrela de cinco pontas, feita com `Shape` e `ShapeGeometry`, é compartilhada por **quatro meshes** dispostos em duas linhas, dentro da casca da esfera. A API de triangulação está descrita no [código oficial de ShapeGeometry](https://raw.githubusercontent.com/mrdoob/three.js/r186/src/geometries/ShapeGeometry.js).

O acabamento usa um **`ShaderMaterial` local**, com cor calculada a partir da normal da superfície, núcleo âmbar fora do centro, duas amostras de ruído procedural de baixa amplitude, contorno de Fresnel e reflexo curvo. O gradiente laranja e dourado diferencia o centro, os lados e a borda; o alpha varia de **0.91 a 0.99**. Uma segunda passagem, traseira e aditiva, reutiliza a mesma geometria com escala **1.045** para um halo estreito. Esse material substitui as duas cascas Phong e os dois reflexos geométricos, que produziram um preenchimento uniforme na captura revisada.

As estrelas usam `MeshBasicMaterial` vermelho `#f21e32`, alpha **0.98**, `toneMapped: false` e `renderOrder: 4`, depois das passagens da esfera. Assim, o reflexo não apaga as quatro estrelas. O conjunto usa **seis meshes, duas geometrias e três materiais**, sem recursos de imagem.

É uma aproximação de volume e translucidez, sem refração física, transmission, texturas de ambiente ou bloom. A luz aparente é calculada no shader, sem luzes globais na cena. O shader usa as matrizes fornecidas pelo Three e a conversão de cor de saída; seu contrato é descrito na [documentação oficial de ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html).

A animação aplica flutuação curta e rotação lenta ao grupo interno; a posição externa continua sob controle do espaço reservado no layout. No desktop, movimento de mouse acrescenta uma inclinação pequena e suavizada. No modo compacto, não há resposta ao ponteiro.

## Arcos orbitais locais

`src/effects/orbits.ts` cria três arcos com `TorusGeometry`, raios **1.14, 1.28 e 1.4** e planos de inclinações diferentes. Cada arco combina um miolo fino, um halo de baixa opacidade e um segmento luminoso que percorre o plano. As geometrias e os materiais são compartilhados entre os três planos. `MeshBasicMaterial`, mistura aditiva e alpha por vértice produzem extremidades suaves, sem texturas, bloom ou pós-processamento.

O grupo é filho do grupo externo da esfera. O loop existente chama `update(elapsed)`, sem RAF ou listeners próprios, com rotação contínua lenta e sem pulsação de brilho. `dispose()` é idempotente e libera todas as geometrias e materiais locais; o cleanup da cena também o registra na pilha de liberação.

## Qualidade configurada

Os parâmetros estão centralizados em `src/effects/config.ts`:

| Parâmetro | Desktop, a partir de 901 px com ponteiro fino/hover | Compacto, até 900 px ou sem ponteiro fino/hover |
| --- | ---: | ---: |
| Partículas | 200 | 64 |
| DPR máximo | 1.5 | 1 |
| Intervalo mínimo de renderização | `1000 / 45` ms | `1000 / 30` ms |
| Largura máxima de cada borda com partículas | 180 px | 40 px |
| Antialiasing | Habilitado | Desabilitado |

**45 e 30 são parâmetros do throttle, não FPS medidos ou garantidos.** O resultado real depende do navegador e do dispositivo. Cada dimensão do drawing buffer é limitada a **4096 px**: o DPR efetivo é o menor entre o DPR do dispositivo, o limite do modo, `4096 / largura` e `4096 / altura`, usando as dimensões CSS do host. Em viewports muito grandes, pode ficar abaixo de 1.

O modo compacto também cobre celulares em landscape e dispositivos touch com tela larga. A consulta `(hover: hover) and (pointer: fine)`, combinada ao breakpoint de 901 px, autoriza a qualidade desktop e o listener passivo de mouse. O tamanho da esfera segue o espaço reservado pelo CSS. A configuração é reavaliada na criação da cena e nas mudanças do breakpoint existente.

`src/effects/particles.ts` usa uma única `BufferGeometry`, atributos tipados e um `ShaderMaterial`. A distribuição é determinística e o movimento ocorre no shader. As posições mantêm profundidade Z; o shader atenua XY e tamanho em função dessa profundidade, preservando a variação espacial do campo mesmo com câmera ortográfica. O tamanho dos pontos é limitado a 16 pixels físicos, e o brilho é calculado no próprio fragment shader, sem pós-processamento.

## Scroll compartilhado e cores

`src/motion/scene-motion.ts` registra as cenas usando o `scroll()` do Motion, com os offsets `start end` e `end start`. `src/motion/scene-progress.ts` guarda progresso e medidas em uma ponte mutável, lida pela cena Three. Isso compartilha as medições existentes, sem introduzir um segundo listener de scroll ou atualizar estado React por frame. A API está descrita na [documentação oficial de scroll do Motion](https://motion.dev/docs/scroll).

A cena predominante é escolhida pela maior pontuação de altura visível, com pequena penalização pela distância ao centro da viewport. O efeito não depende somente de qual seção foi cruzada por último. Cor, intensidade e dispersão aproximam-se do tema escolhido por suavização exponencial, evitando uma troca abrupta na passagem entre sagas. Sem cena registrada visível, a intensidade das partículas aproxima-se de zero.

| Cena | Cor principal | Cor secundária | Intensidade | Dispersão |
| --- | --- | --- | ---: | ---: |
| Abertura | `#69adff` | `#af80f3` | 0.82 | 0.3 |
| Moro | `#7abaff` | `#72e3ed` | 0.85 | 0.2 |
| Granolah | `#edb36f` | `#87c29b` | 0.76 | 0.6 |
| Super Hero | `#b29aef` | `#efd18f` | 0.82 | 0.4 |
| Black Freeza | `#9771d1` | `#e2dced` | 0.68 | 0.8 |

Essas cores são parâmetros de direção visual do projeto conceitual. A esfera mantém seu acabamento âmbar; os temas alteram o campo de partículas.

## Proteção do conteúdo

O fragment shader descarta partículas no centro dos **78% superiores da viewport**, mantendo-as nas duas bordas nessa área. A largura efetiva de cada borda é o menor valor entre o limite do modo e **15% da largura da viewport**. Nos **22% inferiores**, o campo também pode atravessar o centro, criando uma faixa de energia junto ao solo.

Até **24 retângulos visíveis** protegem cabeçalho, índice, seção sobre, rodapé, títulos, descrições, ação de explorar e regiões dos personagens. As imagens usam `data-protect-region` com coordenadas normalizadas: **`0.46,0,0.54,0.82`** na abertura e **`0.38,0,0.62,0.84`** nas sagas. A máscara cobre essas regiões de interesse, em vez de bloquear cada imagem inteira; o cálculo considera o recorte alinhado à direita usado no modo compacto.

Os limites são medidos no layout; a posição das máscaras e da esfera usa o valor atual de `window.scrollY` em cada frame renderizado. Isso mantém a proteção alinhada ao documento mesmo entre atualizações das medições do Motion. A seleção de saga, o progresso compartilhado e a paleta continuam sob responsabilidade da ponte Motion. Os retângulos comuns recebem margem de **12 px**; elementos com `data-reveal`, o H1 e os grupos de título recebem **44 px**. As regiões de personagens têm margem horizontal de **12 px** e vertical de **44 px**, abrangendo o deslocamento da arte. `ResizeObserver` no conteúdo, no espaço da esfera e no host, junto ao evento de resize, invalida essas medidas quando o layout muda.

As máscaras atuam no campo de partículas. A esfera e seus arcos são posicionados exclusivamente no espaço decorativo da abertura; sua geometria também precisa de folga no layout, pois não usa essas máscaras. Nenhum personagem foi separado do raster ou convertido em modelo 3D, e os efeitos não criam camadas independentes nas artes.

## Ciclo de vida e fallback

- **Movimento reduzido:** o provider compartilhado observa `prefers-reduced-motion`. No modo `static`, o effect não inicia importação ou canvas; mudanças para esse modo executam cleanup. A esfera SVG continua disponível.
- **Aba oculta:** `visibilitychange` pausa o loop com `setAnimationLoop(null)`. Ao retornar, o relógio de frame é reiniciado e o layout é medido novamente, evitando acumular o tempo em que a aba ficou oculta.
- **Troca de modo ou desmontagem:** o cleanup é idempotente; encerra o loop, remove eventos, desconecta o observer, libera geometrias e materiais dos arcos, da esfera e das partículas, limpa a cena e executa `renderer.dispose()`. As ações de liberação são registradas durante a inicialização e executadas em ordem inversa, com cada falha isolada para permitir as liberações restantes. O canvas é removido e, na destruição normal, o contexto é liberado pela extensão `WEBGL_lose_context` depois do descarte dos recursos.
- **Falha durante a inicialização:** a mesma pilha de liberação faz rollback dos recursos já adquiridos, inclusive se a cena ainda estiver incompleta. A esfera estática é restaurada antes de propagar a falha para o tratamento de fallback no effect.
- **WebGL indisponível ou falha de carregamento/renderização:** o host fica em fallback, com HTML, imagens, links e SVG estático disponíveis. O callback `renderer.debug.onShaderError` encaminha falhas de compilação ou link de shader para a mesma saída com cleanup.
- **Perda de contexto:** `webglcontextlost` descarta a cena e reexibe o SVG. Essa saída não solicita uma nova perda de contexto nem tenta restaurar automaticamente o mesmo canvas.

Não há modelos, texturas ou chamadas de serviço externas em tempo de execução para esses efeitos.

## Revisão técnica da geometria

Uma inspeção Node, sem renderer ou navegador, percorreu os vértices transformados dos nove meshes orbitais em amostras de um segundo entre 0 e 120 segundos. Os limites encontrados foram aproximadamente **X ±1.41457** e **Y ±1.19923** em unidades locais. Com a escala externa atual de `0.4 × tamanho do slot`, isso corresponde a uma extensão lateral de aproximadamente **6.58% do slot** além de cada borda e a limites verticais dentro do slot.

Essa medição ajuda a dimensionar a folga entre arcos e texto. É uma revisão técnica da geometria amostrada, sem medição de FPS, validação de contraste ou confirmação visual da integração no navegador.

Após a troca do acabamento da esfera, um smoke test Node confirmou quatro estrelas, seis meshes, duas geometrias e três materiais. Seis combinações de tempo, ponteiro e movimento, incluindo entradas `NaN` e infinitas, mantiveram os atributos, as matrizes e o uniform de tempo finitos. O descarte duplicado liberou cada um dos cinco recursos uma única vez e removeu o grupo do pai. Esse teste não compila o shader na GPU nem substitui a revisão da captura no navegador.
