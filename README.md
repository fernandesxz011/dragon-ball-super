# Dragon Ball Super — composição cinematográfica

Projeto conceitual de fã feito com **React, TypeScript e Vite**. A composição atual usa **cinco novas artes autorizadas**: abertura com Goku e Vegeta, Moro, Granolah, Super Hero com Gohan Beast e Black Freeza. Cenários amplos, títulos em HTML e a esfera de quatro estrelas organizam a experiência sobre fundos escuros.

Ao abrir a página, as entradas, a esfera e os efeitos começam automaticamente quando a preferência de movimento permite. A rolagem conduz as cenas; não há botão de ativação, opt-in ou configuração prévia. A preferência `prefers-reduced-motion` apresenta a versão estática automaticamente.

O pacote original, o roteiro e as cinco referências do ZIP continuam preservados em `Dragon_Ball_Super_Codex/`. Os recortes das etapas anteriores foram arquivados como histórico; a interface atual usa as novas artes cinematográficas.

## Abrir no navegador

Execute **`ABRIR-SITE.cmd`** com dois cliques na pasta do projeto. Ele reutiliza o servidor ativo ou inicia o Vite em um processo oculto, aguarda a página responder e abre o navegador. Após reiniciar o Windows, execute o arquivo novamente. Os logs ficam em `.cache/runtime/`.

O endereço local é **http://localhost:5173/**; o inicializador abre **http://127.0.0.1:5173/**, equivalente neste computador.

Para abrir pelo PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\gusta\OneDrive\Área de Trabalho\SITE DRAGON BALL'
npm.cmd run dev
```

Nesse modo, mantenha o terminal aberto; `Ctrl+C` encerra o servidor. Usar `npm.cmd` evita o bloqueio de `npm.ps1` sem alterar a política do sistema. Se precisar reinstalar as dependências, execute `npm.cmd ci` antes de iniciar.

O ambiente usado foi **Node.js 24.15.0**. Node.js 24 reproduz esse ambiente; os requisitos estão em `package.json`. As portas são fixas: se 5173 estiver ocupada por outro serviço, encerre esse serviço ou informe outra porta explicitamente, por exemplo `npm.cmd run dev -- --port 5174`.

## Composição e comportamento atuais

- A abertura apresenta “Além do limite.”, a descrição da jornada e o link “Explorar sagas” sobre a área escura da nova arte. A esfera ocupa um espaço próprio e recebe arcos de energia.
- Moro, Granolah, Super Hero e Black Freeza aparecem nessa ordem, com artes grandes, personagens à direita e conteúdo HTML na área de leitura. No mobile, os frames e a posição das imagens recebem tratamento próprio.
- **Motion 14.2.0** controla entradas dos textos e artes e o deslocamento das cenas conforme a rolagem. Os efeitos são carregados por módulos opcionais; links, headings e imagens ficam disponíveis antes deles.
- **Three.js puro 0.186.1** reúne esfera, órbitas de energia e partículas em um canvas. O módulo aguarda o decode da imagem prioritária e usa a cena predominante medida pelo Motion para suavizar a paleta.
- A configuração usa 200 partículas no desktop com ponteiro fino e 64 no modo compacto, DPR máximo de 1,5/1 e buffer limitado a 4096 px por dimensão. Os limites de renderização de 45/30 são configuração, sem medição ou garantia de FPS.
- Máscaras protegem a leitura e as regiões dos personagens. Aba oculta pausa o renderer; falha de WebGL2, perda de contexto ou preferência reduzida mantém a esfera SVG estática e o conteúdo HTML. Recursos e listeners são liberados na desmontagem.

A rolagem permanece nativa, com âncoras reais, link de pular ao conteúdo e foco visível. Não há captura de wheel/touch para obrigar uma sequência.

## Artes, entrega responsiva e tipografia

Os masters PNG das cinco artes ficam em `art-source/cinematic/`, fora da pasta pública. O conceito da abertura está em `design/cinematic/hero-concept.png`. A aplicação usa **15 JPEGs de qualidade 90**, com larguras 640, 1120 e 1672 px, em `public/assets/cinematic/`.

As imagens usam `srcset`, dimensões declaradas e seleção responsiva. A abertura tem prioridade de carregamento; as quatro sagas usam lazy loading. O pipeline preserva proporções, sem upscale, recorte ou espelhamento nos arquivos. Os frames responsivos da interface são definidos no CSS.

Para reproduzir os JPEGs no Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-cinematic-assets.ps1
```

O script usa `System.Drawing`, confere caminhos e hashes ao arquivar masters e preserva os arquivos de origem. Proveniência, prompts registrados, tamanhos e SHA-256 estão em [docs/art-direction.md](docs/art-direction.md). A reexecução do pipeline manteve os 15 hashes idênticos.

**Bangers**, de Vernon Adams, permanece local em WOFF2 Latin/Latin-ext, peso real 400 e `font-display: swap`. É lettering de quadrinhos, sem se apresentar como a fonte oficial do logo de Dragon Ball. Parágrafos e controles menores usam a fonte de sistema. A licença **SIL Open Font License 1.1** e o metadata acompanham os arquivos em `public/fonts/`; detalhes em [docs/fonts.md](docs/fonts.md).

## Verificação disponível

| Verificação da composição atual | Estado |
| --- | --- |
| `npm.cmd run lint` | Passou |
| `npm.cmd run typecheck` | Passou |
| `npm.cmd run build` | Passou, com o aviso de tamanho de chunk abaixo |
| QA funcional em Chrome 155 — 360 × 800, 768 × 1024 e 1440 × 1000 | Passou; sem overflow horizontal ou erros inesperados de aplicação/rede |
| Navegação e teclado | Passou; 30 acionamentos de âncoras, skip link e foco visível |
| Axe nas três larguras | Zero violações detectadas; fundos complexos receberam revisão complementar de contraste |
| Movimento reduzido, fallbacks e limpeza | Passou; preferência inicial/dinâmica, falhas dos módulos, WebGL indisponível, perda de contexto e desmontagem |
| Contraste sobre as artes | Passou nos textos e controles amostrados em 360 e 1440 px, incluindo os estados inicial e final |
| Smoke do build de produção | Passou com o prefixo `/dragon-ball-super/`, Motion, Three.js e fallbacks |

O Vite mantém o aviso de **chunk acima de 500 kB** para o módulo Three. O carregamento desse módulo é lazy e ocorre após o decode da arte prioritária; isso não elimina seu peso de transferência.

| Saída do build atual | kB | gzip, kB |
| --- | ---: | ---: |
| CSS | 14,24 | 3,82 |
| Entrada `index` | 232,60 | 72,90 |
| `scene-motion` | 18,73 | 7,32 |
| `scene-progress` | 0,56 | 0,33 |
| `energy-scene` | 567,33 | 144,09 |

A QA da composição cinematográfica foi executada em Chrome 155 com Playwright; o plugin Browser não estava disponível. A rodada funcional passou nos três tamanhos acima. O contraste foi conferido separadamente sobre pixels reais dos fundos, incluindo a opacity inicial de 0,72 dos textos e 0,85 do CTA. Na revisão final desktop, os menores contrastes dos títulos e parágrafos de Granolah foram **11,81:1 no estado final e 6,46:1 no inicial**; em Super Hero, **8,82:1 e 6,01:1**. O método conservador e seus limites estão em [docs/art-direction.md](docs/art-direction.md).

Essas verificações cobrem os cenários locais registrados e não equivalem a certificação completa de acessibilidade ou medição de desempenho em dispositivos reais. O smoke de produção confirmou os arquivos servidos idênticos ao build, fontes e cinco artes carregadas, efeitos automáticos, preferência reduzida e recuperação da falha dos módulos opcionais. Veja [o relatório de validação](docs/validation.md). Resultados das etapas anteriores permanecem históricos.

Para repetir as verificações e abrir o build:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview
```

O build fica em `dist/` e o preview em **http://127.0.0.1:4173/**. Abrir `dist/index.html` diretamente não substitui o servidor HTTP.

## Organização

| Caminho | Responsabilidade |
| --- | --- |
| `src/components/` | Estrutura, navegação, abertura e cenas das sagas |
| `src/data/sagas.ts` | Conteúdo, âncoras e dimensões das novas artes |
| `src/motion/` | Preferências, entradas, rolagem e ponte de progresso |
| `src/effects/` | Cena Three, esfera, órbitas, partículas e fallback |
| `src/styles.css` | Tipografia, composição, frames responsivos e foco |
| `public/assets/cinematic/` | JPEGs responsivos usados pela interface atual |
| `art-source/cinematic/` | Masters PNG preservados |
| `design/cinematic/` | Conceitos visuais e registros de direção |
| `public/fonts/` | Bangers local, licença e metadata |
| `scripts/prepare-cinematic-assets.ps1` | Reprodução dos JPEGs atuais |
| `scripts/open-site.ps1` | Inicializador local usado pelo `ABRIR-SITE.cmd` |
| `docs/art-direction.md` | Arte atual, proveniência, prompts e derivados |
| `docs/assets.md` | Histórico dos recortes originais preservados |
| `docs/fonts.md` | Origem, licença e cobertura da fonte |
| `docs/motion.md`, `docs/three.md` | Documentação técnica das integrações |
| `Dragon_Ball_Super_Codex/` | Pacote original preservado |

## Conteúdo e limites

Este é um projeto de fã com textos editoriais conceituais, sem anunciar produção oficial, datas ou adaptações como confirmadas. As ilustrações são rasters achatados: o movimento desloca a arte completa, sem transformar os personagens em modelos ou camadas independentes.

A experiência inicia automaticamente. Não inclui áudio, modelos 3D de personagens ou integração com APIs de conteúdo.

Código-fonte: [fernandesxz011/dragon-ball-super](https://github.com/fernandesxz011/dragon-ball-super).

GitHub Pages: [abrir a apresentação](https://fernandesxz011.github.io/dragon-ball-super/). O workflow publica automaticamente após os checks de cada envio para `main`; [acompanhe as execuções](https://github.com/fernandesxz011/dragon-ball-super/actions). Configuração e reprodução do prefixo estão em [docs/deployment.md](docs/deployment.md).
