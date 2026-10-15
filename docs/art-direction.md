# Direção de arte — artes cinematográficas

Cinco novas artes autorizadas compõem a interface cinematográfica: abertura com Goku e Vegeta, Moro, Granolah, Super Hero com Gohan Beast e Black Freeza. As quatro ilustrações de saga foram geradas em **14 de outubro de 2026** e a abertura e seu conceito foram preservados com a proveniência abaixo. A direção busca cenários maiores e presença cinematográfica, mantendo a identificação dos personagens nas referências fornecidas.

## Origem e preservação

- Ferramenta das quatro sagas: **image_gen nativa**, em quatro chamadas independentes, uma por saga, executadas em paralelo. O asset e o conceito da abertura também vieram da ferramenta nativa e têm seus arquivos de origem registrados nesta página. Não foram usados CLI ou API keys para essa criação.
- Referências visuais das quatro artes de saga: `Dragon_Ball_Super_Codex/referencias/05_Panorama_Continuacao.png` e `03_Layout_Sagas.png`, inspecionadas com `view_image` antes de serem enviadas à ferramenta.
- As referências foram entradas de identidade, atmosfera e estilo; as novas saídas são ilustrações autônomas, sem reproduzir o layout em faixas ou os textos dos arquivos de origem.
- As cinco imagens originais e os derivados anteriores foram preservados. Os resultados selecionados foram copiados para o workspace, mantendo também os originais produzidos pela ferramenta.
- A ferramenta não informou uma identificação de modelo ou versão no retorno. A proveniência abaixo registra o recurso efetivamente usado, os arquivos, seus hashes e os prompts completos, sem atribuir um modelo não confirmado.

São **artes conceituais de fã geradas por IA**, sem apresentação como material promocional oficial. Os cinco assets usados na interface não contêm textos, logos ou UI; títulos, descrições e controles continuam em HTML. O conceito da abertura contém a proposta de interface e serve apenas como referência de implementação.

## Composição

A linguagem comum é anime cinematográfico, com linework nítido, sombras azuladas profundas, energia controlada e ruínas em diferentes planos. Aproximadamente **35% à esquerda** oferecem negativo escuro para o conteúdo HTML; o personagem e os detalhes mais intensos ocupam a direita. A escuridão foi incorporada à cena gerada, sem adicionar uma caixa gráfica sobre o arquivo depois da geração.

Na implementação desktop, um gradiente local reforça a área de leitura sem editar os JPEGs: nas sagas, a cor de fundo da cena tem opacity de 84% até 40% da largura e desaparece em 56%, junto ao fade vertical entre cenas. A abertura recebe seu próprio reforço escuro à esquerda. Até 900 px, a arte antecede o texto e mantém apenas o fade vertical. Esse tratamento preserva os rostos à direita e evita um painel retangular sobre a ilustração.

| Saga | Personagem e ambiente | Paleta predominante |
| --- | --- | --- |
| Abertura | Goku e Vegeta entre ruínas cósmicas e energia, com área escura de leitura à esquerda | Azul, violeta e preto |
| Moro | Forma azul com chifres, cidade alienígena em ruínas e grande planeta | Azul profundo, cobalto e ciano |
| Granolah | Rosto angular, visor/monóculo e roupa verde; ruínas de planeta ao pôr do sol | Âmbar e verde escuro |
| Super Hero | Gohan Beast, cabelo prateado, olhos vermelhos e gi roxo; estruturas destruídas | Violeta com luz dourada pontual |
| Black Freeza | Freeza em primeiro plano e Goku/Vegeta pequenos e distantes no canto inferior direito | Preto, violeta e branco frio |

## Arquivos selecionados

O prompt solicitou **2048 × 1152**, aceitando **1536 × 1024** caso necessário. A ferramenta entregou os tamanhos nativos abaixo, próximos de 16:9. Eles foram preservados, **sem upscale, distorção ou recorte posterior**; não devem ser descritos como arquivos nativos de 2048 px.

| Arte | Arquivo local | Dimensões | Bytes |
| --- | --- | --- | ---: |
| Moro | `art-source/cinematic/moro-cinematic.png` | 1672 × 940 | 2537283 |
| Granolah | `art-source/cinematic/granolah-cinematic.png` | 1672 × 941 | 2210572 |
| Super Hero / Gohan Beast | `art-source/cinematic/super-hero-cinematic.png` | 1672 × 941 | 2704761 |
| Black Freeza | `art-source/cinematic/black-freeza-cinematic.png` | 1672 × 940 | 2646042 |

Os PNGs são masters selecionados, arquivados fora da pasta pública em `art-source/cinematic/`. A interface atual usa JPEGs proporcionais de qualidade 90, nas três larguras registradas abaixo, com `srcset` e dimensões explícitas. A abertura recebe prioridade de carregamento; as quatro sagas usam lazy loading. Os frames e os enquadramentos mobile são definidos no CSS, preservando os arquivos derivados.

| Arquivo | SHA-256 do master copiado |
| --- | --- |
| `moro-cinematic.png` | `00b12d7918bb917bc1002d2b81a315234906972568c23bde55df508a39ab230c` |
| `granolah-cinematic.png` | `2df1a086eaae9c42779c9c80bed6098c2dc4557d8cc16e438f6763d4972a5f35` |
| `super-hero-cinematic.png` | `f797e34e54a753ad32be8f553304f35d4e54fbf8b3a46ad8a119bdc5e763fc97` |
| `black-freeza-cinematic.png` | `65f58b7338e24dd19c1f031a3afdcdb8314e295d86a82d388d4010edced4a867` |

Diretório de origem das quatro saídas nativas:

```text
C:\Users\gusta\.codex\generated_images\01a137b4-161d-7751-ad9a-2be201bdabb3
```

| Arte | Arquivo da ferramenta |
| --- | --- |
| Moro | `exec-396dfb1d-e520-43f0-b810-2782c2f4bd1c.png` |
| Granolah | `exec-87a6e771-b844-42bc-aaa5-03e39e055932.png` |
| Super Hero / Gohan Beast | `exec-97d8e7d2-284a-45b4-b629-f493de80c32a.png` |
| Black Freeza | `exec-9965e5b6-35b4-4251-a1ce-ac50a50e034d.png` |

## Abertura: asset e conceito

O asset da abertura e o conceito visual foram copiados da ferramenta para o workspace, com conferência de SHA-256. O conceito contém a composição de interface e serve de referência visual; a aplicação usa o asset sem UI e reconstrói textos e controles em HTML.

O asset foi inspecionado visualmente: Goku e Vegeta ocupam a direita, com energia azul/violeta e ruínas, enquanto a esquerda reserva contraste para o H1 “Além do limite.” e o CTA. Os arquivos locais do hero e do conceito não incluem registro textual do prompt exato; os PNGs de origem também não contêm chunks de texto `tEXt`, `iTXt` ou `zTXt`. Por isso a descrição visual não é apresentada como um prompt original recuperado. Os prompts exatos registrados ao final deste documento são os das quatro sagas.

| Arquivo local | Dimensões nativas | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `art-source/cinematic/hero-cinematic.png` | 1672 × 941 | 2600958 | `6f90132d2c38b6eb228f6bd0d3781ff3de7032ef1bd9ef0103be5fce7ef71b26` |
| `design/cinematic/hero-concept.png` | 1536 × 1024 | 2774031 | `be41101e27ff6c3388ae44caedb0cb56c36f1388a07244a0ad23addc912b611d` |

Origens preservadas:

```text
C:\Users\gusta\.codex\generated_images\01a137b1-32ca-7f61-a72d-e20f3638d87d\exec-b2408c69-6cfc-4d44-a412-3849f270fb39.png
C:\Users\gusta\.codex\generated_images\01a137b1-32ca-7f61-a72d-e20f3638d87d\exec-6743032d-41e2-4a16-9be9-6126d3c52256.png
```

## Pipeline de entrega

`scripts/prepare-cinematic-assets.ps1` usa somente o `System.Drawing` do Windows, com **JPEG de qualidade 90**. Cada imagem gera larguras **640, 1120 e 1672 px**, sem upscale, crop ou espelhamento. A altura é calculada por `Round(alturaNativa × larguraSaída / larguraNativa)`; por isso a maior versão mantém 940 ou 941 px conforme seu master, e as menores resultam em 640 × 360 e 1120 × 630.

Na primeira execução, os quatro PNGs de saga são arquivados em `art-source/cinematic/`: o script resolve e valida os caminhos de origem e destino dentro do workspace, copia, compara SHA-256 e só então remove a cópia da pasta pública. Os arquivos originais da ferramenta e as referências fornecidas não são removidos. Uma divergência de hash interrompe a operação e preserva os arquivos.

O hero e o conceito são copiados dos caminhos de origem somente quando as cópias locais ainda não existem. Depois desse preparo, o pipeline pode ser reexecutado usando os masters arquivados, sem depender dos arquivos no CODEX_HOME. Caminhos alternativos de importação podem ser passados pelos parâmetros `-HeroMasterPath` e `-HeroConceptPath`.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-cinematic-assets.ps1
```

A geração foi reexecutada após o arquivamento: os **15 SHA-256 dos JPEGs permaneceram idênticos**, confirmando a reprodução dos derivados locais. Essa conferência é do pipeline de assets; a revisão da interface no navegador pertence à integração.

## JPEGs públicos

Diretório: `public/assets/cinematic/`. As dimensões e os tamanhos abaixo foram lidos dos arquivos gerados. Os masters PNG ficam fora da pasta pública.

| Arquivo | Dimensões | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `black-freeza-1120.jpg` | 1120 × 630 | 221571 | `25e3b09a2d107b9cbc59ca2bc716101bce71d1176844d8ca51f34535285af9fc` |
| `black-freeza-1672.jpg` | 1672 × 940 | 433968 | `18e7a47ad6949b705f53195ccd2404b80b5efa74d15ec27e263b53547b29aaf8` |
| `black-freeza-640.jpg` | 640 × 360 | 83491 | `c60aa3c05b8246d17fc8ac9a243ceb91350551eaac17d52a4a64a94273359e6f` |
| `granolah-1120.jpg` | 1120 × 630 | 169129 | `69b1c33da248caad456dba0170c093c2351aef658eae56922b030034b9f3d941` |
| `granolah-1672.jpg` | 1672 × 941 | 325178 | `81eaff86ea35010605126d6d984cf6aae67327e1c7ebce9a4da1dca85157e9a7` |
| `granolah-640.jpg` | 640 × 360 | 65763 | `6c2c709466c387a9963cbc7af21204bacaa9dd1acafdc99e569144d1f0c328ad` |
| `hero-1120.jpg` | 1120 × 630 | 219161 | `509861e11591a9705328a605b5cd40108f0e169c4669c897ed1f686260fb32da` |
| `hero-1672.jpg` | 1672 × 941 | 427363 | `f58d597057957d0e5c2d4accdca435b10863f54074f243ece3b6943f2cba282f` |
| `hero-640.jpg` | 640 × 360 | 82738 | `415bb84e62a9bd132b76b45975b663ff7997b58d0031309f5902c8582ecf870b` |
| `moro-1120.jpg` | 1120 × 630 | 206456 | `f9e4b87509563a5919cbeb4c8427a5b42d3332c4ca5d1b0bdb91df3f73fd8fb3` |
| `moro-1672.jpg` | 1672 × 940 | 408072 | `a5796fbbfaad8a2f65cb31897f7aacb653b2ed7205bc86c710839ade85f46707` |
| `moro-640.jpg` | 640 × 360 | 77447 | `d29189df6f02a996b90ef091c845d34f13bd601b70d834ceee9b1081dab9f1b8` |
| `super-hero-1120.jpg` | 1120 × 630 | 229430 | `6d1b060024fda7d8c8ec215b4b08cacd732fc8544d839f5644c1ca08968323f2` |
| `super-hero-1672.jpg` | 1672 × 941 | 450368 | `f780e10b07ed8b825189c320a1c5171ca1b8e9a50badf068c71181387776f5f5` |
| `super-hero-640.jpg` | 640 × 360 | 85776 | `884f7133a1097e5705c516287818f678a3e26f6953f7347711d8886ae435b284` |

## Experiência atual e estado da revisão

A composição atual é automática ao abrir e rolar a página, sem opt-in ou botão para ativar os efeitos. Motion coordena as entradas de texto, arte e progresso; Three acrescenta a esfera, órbitas de energia e partículas. A preferência de movimento reduzido e os fallbacks preservam a apresentação estática. Bangers continua local com licença OFL, e os cinco arquivos de referência originais permanecem preservados.

Lint, typecheck e build atuais passaram. O build mantém aviso de chunk Three acima de 500 kB, com `energy-scene` de **567,33 kB / 144,09 kB gzip**; o módulo é carregado de forma lazy após o decode da arte prioritária. O CSS ficou em **14,24 kB / 3,82 kB gzip** e a entrada `index` em **232,60 kB / 72,90 kB gzip**. O carregamento opcional não elimina o peso de transferência do Three.

A QA funcional da composição cinematográfica passou em **Chrome 155.0.8059.40**, com Playwright porque o plugin Browser não estava disponível, em **360 × 800, 768 × 1024 e 1440 × 1000**. O relatório registra 30 acionamentos de âncoras, teclado/skip link/foco, imagens e fontes locais, troca de tema por cena, ausência de overflow horizontal, movimento reduzido inicial e dinâmico, pausa em aba oculta, retomada, fallbacks e liberação de recursos na desmontagem. O axe detectou zero violações nas três larguras; seus casos de contraste inconclusivo sobre sombras/pseudo-elementos foram tratados pela revisão complementar abaixo.

O smoke do build de produção passou no prefixo `/dragon-ball-super/`, incluindo fontes, cinco artes, Motion/Three compilados e fallbacks. A publicação autorizada no GitHub/Pages para `fernandesxz011/dragon-ball-super` segue o workflow em [deployment.md](deployment.md). Os testes locais não representam certificação completa de acessibilidade nem medição de FPS ou Core Web Vitals em dispositivos reais.

## Contraste sobre a composição

A revisão complementar usou pixels reais das capturas em 360 e 1440 px para H1, títulos, descrições, identificação de fã, CTA e navegação, tanto no estado final quanto no início da entrada. O estado inicial foi reproduzido com os valores do Motion: opacity **0,72** e translateY **32 px** nos textos; **0,85** e **12 px** no CTA. O frame WebGL foi pausado durante cada conjunto de capturas para manter o fundo comparável.

Para os títulos sobre a arte desktop, a seleção foi refinada à parte interna dos glifos com cobertura de pelo menos 72%, medida pela diferença entre renderizações temporárias em preto e branco. Isso evita contabilizar áreas vazias dos retângulos das letras. O cálculo combina a cor computada do texto com sua opacity e o fundo amostrado; ignora o benefício de contorno e sombra. Os critérios usados foram **3:1 para texto grande** e **4,5:1 para os demais textos**. São amostras conservadoras dos estados e posições registrados, sem afirmar uma garantia para cada frame da animação ou para todos os navegadores.

A última retestagem de Granolah e Super Hero, após o reforço escuro local, concluiu em **14/10/2026 às 19:37:38** e foi conferida novamente em 15/10, sem repetir a execução. Todos os 12 grupos de título/parágrafos passaram, sem erros JavaScript. Os menores valores por cena foram:

| Cena desktop | Estado final | Estado inicial | Menor valor localizado |
| --- | ---: | ---: | --- |
| Granolah | 11,81:1 | 6,46:1 | Parágrafo de 16 px; mínimo inicial no viewport em (279, 703) |
| Super Hero | 8,82:1 | 6,01:1 | Parágrafo de 16 px; mínimo inicial no viewport em (444, 788) |

Os H3 de Granolah (122,4 px) e Super Hero (151,2 px) também passaram o critério de 3:1 nos dois estados. Em 360 px, os textos e controles amostrados passaram antes desse ajuste restrito ao desktop. Os relatórios de trabalho estão em `%TEMP%/dragon-ball-cinematic-qa/cinematic-qa-results.json`, `contrast-foundation-results.json` e `contrast-glyph-foundation-results.json`; são evidências locais, sem inclusão no pacote público.

## Revisão visual dos assets

As quatro cópias locais foram abertas novamente com `view_image`. A revisão cobriu identidade e legibilidade dos rostos, proporções, personagem à direita, negativo à esquerda, paleta, profundidade dos cenários e ausência de texto/logo/UI. Moro mantém ambos os chifres visíveis; Granolah mantém o visor e a identidade da referência; Gohan Beast não recebeu robôs inventados; Freeza mantém os dois guerreiros pequenos ao fundo.

Dois limites do resultado devem orientar a integração: a resolução nativa difere da solicitada; no busto de Gohan Beast, o cabelo alto alcança e ultrapassa a borda superior, embora o rosto permaneça inteiro. Evitar recorte adicional sobre o rosto ou sobre a área de leitura. Estas observações dizem respeito aos arquivos, sem substituir a revisão posterior da implementação em desktop e mobile.

## Prompts exatos das quatro sagas

Cada prompt enviado foi a concatenação literal do **brief comum**, um espaço e o **trecho específico** correspondente. As duas referências acima foram incluídas por caminho local, com `transparent_background: false`.

### Brief comum

```text
Use case: stylized-concept. Create one premium cinematic anime illustration derived from the supplied reference artwork. The two inputs are character/style reference sheets only: extract the identity and mood of the named saga, and recompose it as ONE new standalone wide scene; do not reproduce the sheets, their horizontal panels, their text, or any interface. Requested final canvas: landscape 2048x1152, cinematic 16:9 (1536x1024 landscape is acceptable if native tool output requires it). Refined sharp anime linework, rich controlled cel shading, monumental atmosphere, intricate but disciplined environmental depth. Clear visual hierarchy, readable character silhouette, correct anatomy, coherent face and eyes, no extra limbs or fingers. The leftmost 35% of the entire canvas must remain naturally very dark blue-black, low detail, quiet negative space for later HTML headings; do not draw any heading there. All bright energy, principal character, and sharp detail belong in the rightmost 55%, with the character face centered around 73% from the left and 42% from the top. Use natural environmental shadow to create the left negative space, not a visible rectangle or graphic overlay. No text, letters, numbers, logos, watermark, signatures, UI, border, panel divisions or collage. No fake branding or official promotional claims. Preserve the recognizable character design from the supplied references while extending the environment. This is fan-concept artwork.
```

### Moro

```text
Subject: Moro in his recognizable ancient blue-furred goat-like form, long curved ram horns, pointed ears, sharp red eyes, white beard and dark fur mantle, based on the Moro band in reference 05. One large and imposing three-quarter bust/upper body on the RIGHT, fully readable face and both horns comfortably inside the frame; restrained threatening expression, looking slightly toward the viewer and leftward into the scene. Scene: a vast ruined alien city with fragmented stone towers and a huge planet hanging over the horizon, very deep dark blue shadows, cold cobalt and cyan energy rim-light, sparse floating rubble and fine dust around the right silhouette. The environment is spacious and cinematic rather than a flat portrait background. Keep the left 35% quiet, almost black navy, with only faint distant ruined silhouettes. Do not add other characters.
```

### Granolah

```text
Subject: Granolah, recognizable from the Granolah band in reference 05: angular face, long swept-back hair, his distinctive technological monocle/goggle eyepiece and green outer clothing/scarf. One large clean three-quarter bust/upper body on the RIGHT, correct eyepiece shape and natural proportions, determined but composed expression; preserve the reference identity instead of inventing a generic armored hero. Scene: the ruins of an alien planet at a low amber sunset, broken stone columns and suspended rock fragments, a distant planet against atmospheric haze; warm amber rim light balanced by restrained deep green accents and green-dark shadows. Keep the left 35% naturally black navy/olive with very faint ruined forms, no bright sun or distracting object in that text-safe zone. No additional people.
```

### Super Hero / Gohan Beast

```text
Subject: adult Gohan in his recognizable BEAST transformation, with large upward silver-white spiked hair, red irises, angular anime facial structure, and a purple martial-arts gi with red waist sash. One large heroic three-quarter upper body on the RIGHT, face and full high hair silhouette readable and not cut off; calm fierce expression rather than an open shouting mouth. Extend the Super Hero saga mood of the supplied reference; this is a concept variant with Beast hair. Scene: large damaged concrete structures and ruins of the Red Ribbon base, without any readable RR logos or lettering, under a dark dramatic sky. Violet energy and limited warm golden rim light illuminate the right character and rubble. The left 35% remains spacious blue-black shadow with subtle distant architecture for later HTML copy. No robots, androids, new bot designs, extra characters, text, or logos.
```

### Black Freeza

```text
Subject: Black Freeza/Black Frieza in recognizable final-form proportions and face from the lowest band of reference 05: sleek black and dark violet bio-armor, smooth dark violet head dome, pale face plates, sharp red eyes and controlled sinister smile. One imposing large three-quarter upper body on the RIGHT, both eyes readable, elegant clean anatomy and a clear silhouette. Scene: an immense ruined alien landscape beneath a black-violet cosmic sky, faint planets and floating rubble, violet-white rim energy confined to the right. Include Goku and Vegeta only as TWO SMALL distant back-facing figures on a stone ledge in the far lower-right background, Goku in orange gi and Vegeta in blue clothing, with no competing giant faces; they must remain subordinate to Freeza. Keep the left 35% naturally deep navy-black and visually quiet for HTML. Do not add more characters or invent an official plot claim.
```
