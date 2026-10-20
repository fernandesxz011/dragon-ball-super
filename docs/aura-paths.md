# Guias de silhueta para aura

`src/effects/character-aura-paths.ts` fornece contornos vetoriais autorados à mão sobre os cinco masters em `art-source/cinematic/`. Os arquivos foram abertos com `view_image`; a revisão usou overlays SVG magenta translúcidos sobre os próprios masters. Nenhum master ou JPEG foi alterado. São guias aproximados para controlar um glow externo, sem representar segmentação pixel a pixel, recorte de imagem, camada independente de personagem ou modelo 3D.

## Contrato

```ts
export const characterAuraShapes: Record<string, {
  width: number
  height: number
  paths: readonly string[]
  faces: readonly [number, number, number, number][]
  occlusions?: readonly string[]
}>
```

As coordenadas são **pixels nativos**, com origem no canto superior esquerdo, X para a direita e Y para baixo. Cada string de `paths` é um `d` SVG aceito por `Path2D`. O consumidor usa preenchimento **evenodd**. O contorno de Moro também contém um subpath de sentido inverso para preservar o vão visível dentro do chifre esquerdo no preenchimento nonzero.

| ID | Origem em `art-source/cinematic/` | Dimensões | Caminhos | Retângulos faciais |
| --- | --- | --- | ---: | ---: |
| `intro` | `hero-cinematic.png` | 1672 × 941 | 2: Goku e Vegeta | 8 |
| `moro` | `moro-cinematic.png` | 1672 × 940 | 1 principal | 1 |
| `granolah` | `granolah-cinematic.png` | 1672 × 941 | 1 principal | 3 |
| `super-hero` | `super-hero-cinematic.png` | 1672 × 941 | 1 principal | 4 |
| `black-freeza` | `black-freeza-cinematic.png` | 1672 × 940 | 1 principal | 3 |

`faces` usa **`[x, y, largura, altura]`**, sem normalização. A quantidade não corresponde à de personagens: olhos/bochecha, mandíbula, testa e orelha podem usar retângulos menores separados. Isso reduz a inclusão de cabelo em um único bounding box grande. Granolah inclui seu visor na proteção facial; cabelo, chifres e a aura desenhada ficam fora dessa seleção. Como são retângulos sobre faces irregulares, pequenos cantos podem alcançar contornos adjacentes; não são máscaras anatômicas exatas.

O consumidor deve rasterizar os paths nas dimensões proporcionais ao master e usar o mesmo mapeamento de imagem da interface (`contain`/`cover`, posição, escala e transform). O interior preenchido serve para impedir aura dentro do corpo; blur/rim exterior é um controle derivado em runtime. Esses vetores não autorizam separar ou mover pixels do personagem. Paleta, intensidade, profundidade e ciclo de vida pertencem ao renderer consumidor.

`occlusions`, quando presente, contém paths de **supressão local do efeito**, nas mesmas coordenadas nativas. Eles devem entrar somente no canal de proteção junto às faces, com suavização na borda; não alteram o preenchimento do corpo nem geram glow ao redor da área protegida. São exclusões conservadoras em limites estreitos ou ambíguos, sem completar personagens, capa ou cenário oculto.

| Saga | Supressão local | Motivo |
| --- | --- | --- |
| Moro | Ponta inferior do chifre direito e encontro com a pelagem, aproximadamente X 1343–1582 / Y 214–401 | Impedir uma faixa clara sobre o chifre onde o guia simplificado cruza sua ponta. O arco superior continua recebendo aura. |
| Granolah | Capa difusa inferior esquerda, X 0–750 / Y 565–941 | Evitar que o fechamento aproximado da máscara forme um triângulo luminoso no fundo escuro. Cabelo, cabeça e ombro superior mantêm o efeito. |
| Super Hero | Vão entre faixa da cintura e antebraço, aproximadamente X 1235–1524 / Y 748–941 | Preservar o cenário visível no vão e suprimir uma placa poligonal clara. Cabelo, ombros e borda externa do braço continuam livres. |

Essas três exclusões foram escolhidas após comparar capturas da aura com a apresentação anterior e com os masters. A arte original permanece visível em todos os casos; somente a luz acrescentada é bloqueada nessas regiões.

## Contorno e limites visuais

- **Abertura:** dois contornos seguem pontas de cabelo, rosto, ombros, roupa e luva visíveis. O cabelo de Goku encontra a borda superior. A parte inferior de ambos desaparece em névoa/energia e elementos do cenário; a linha que fecha o path nessa zona é uma construção de máscara, sem afirmar um limite físico do corpo. O efeito deve suprimir o rim desse fechamento inferior.
- **Moro:** o contorno segue os dois chifres, orelha, cabeça e a borda irregular da pelagem. O corpo encontra as bordas inferior e direita; o vão interno do chifre esquerdo é preservado pelo subpath inverso. Detalhes finos de pelo foram simplificados.
- **Granolah:** o contorno segue o cabelo, mecha frontal, rosto, cachecol e capa visíveis. As áreas escuras à esquerda da capa têm limite difuso e foram aproximadas visualmente. A capa fecha nas bordas inferior e direita; não foram prolongados membros ocultos.
- **Super Hero:** cabelo e roupa rasgada recebem segmentos específicos; o cabelo que já sai do quadro fecha pela borda superior, sem reconstruir pontas invisíveis. Braços e roupa encontram a borda inferior.
- **Black Freeza:** o contorno inclui cabeça, ombros, mão em perspectiva e cauda visível à esquerda. O limite inferior acompanha aproximadamente a oclusão por ruínas/névoa, sem completar o corpo atrás do cenário. O rim nesse fechamento precisa ser atenuado. Os dois guerreiros pequenos ao fundo continuam fora deste contorno principal e conservam suas proteções próprias no campo de partículas.

O brilho exterior deve seguir cabelo, chifres e ombros, com os fechamentos artificiais suprimidos onde houver névoa ou oclusão. A qualidade do alinhamento também depende do transform, da resolução da textura de controle e da largura do blur usados pelo consumidor. Os paths não descrevem profundidade real da foto.

## Conferência local

Os cinco overlays foram renderizados em Chrome sobre os masters e inspecionados visualmente. Os paths foram aceitos pelo parser SVG e produziram comprimentos/bounds finitos dentro das dimensões das imagens. Retângulos faciais receberam capturas ampliadas. A integração final passou por QA nas cinco cenas em 360/768/1440 px, incluindo proteção do conteúdo, projeção, movimento e revisão dos três trechos corrigidos. Método e limites em [validation.md](validation.md).

Previews de trabalho, fora da aplicação:

```text
%TEMP%/dragon-ball-cinematic-qa/aura-paths/intro.svg
%TEMP%/dragon-ball-cinematic-qa/aura-paths/moro.svg
%TEMP%/dragon-ball-cinematic-qa/aura-paths/granolah.svg
%TEMP%/dragon-ball-cinematic-qa/aura-paths/super-hero.svg
%TEMP%/dragon-ball-cinematic-qa/aura-paths/black-freeza.svg
```

Cada SVG tem uma captura PNG com o mesmo nome e uma ampliação `*-faces.png`. Esses arquivos temporários embutem o master apenas para revisão e não são assets públicos. Proveniência das artes originais em [art-direction.md](art-direction.md).

As três supressões locais também têm overlays em `%TEMP%/dragon-ball-cinematic-qa/aura-v3/occlusion-{moro,granolah,super-hero}.{svg,png}`. Neles, magenta identifica o guia de corpo existente e ciano identifica somente a região que bloqueia o efeito. Os paths foram aceitos pelo parser SVG do Chrome, apresentaram comprimentos finitos e foram inspecionados sobre os masters; a conferência final do feather pertence à integração do shader.
