# Tipografia local — Etapa 03

A fonte de títulos é **Bangers**, desenhada por **Vernon Adams**, distribuída pelo Google Fonts. É uma alternativa de lettering de quadrinhos para os títulos em HTML, sem substituir ou deformar os logos incorporados nas imagens. Não é uma fonte oficial de Dragon Ball.

A escolha foi mantida porque a licença e os glifos necessários foram verificados nas fontes oficiais e nos arquivos locais. O desenho tem peso visual forte e inclinação própria; sua face publicada é **Regular, peso 400, estilo normal**. Não usar peso 700/900, itálico sintético, `skew()` ou esticamento para simular outra face.

## Origens e licença

Consulta e download realizados em **14 de outubro de 2026**.

- [Metadata oficial do Google Fonts](https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/METADATA.pb): família, designer, estilo normal, peso 400, subsets Latin/Latin-ext e referência ao projeto original.
- [Licença oficial completa](https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/OFL.txt): **SIL Open Font License 1.1**, copyright `2010 The Bangers Project Authors`.
- [Projeto original](https://github.com/googlefonts/bangers): repositório informado pelo metadata; commit de origem registrado `ca6d2f15db343ee373e9c62a127f3a48cd251228`.
- [CSS oficial usado para localizar os WOFF2](https://fonts.googleapis.com/css2?family=Bangers&display=swap): resposta para navegador moderno, revisão de distribuição Google Fonts **v25**.

A licença permite incorporar e redistribuir a fonte junto com o projeto, mantendo o copyright e a licença; a fonte não pode ser vendida isoladamente. A íntegra recebida da origem permanece em `public/fonts/Bangers-OFL.txt`, e o metadata original em `public/fonts/Bangers-METADATA.pb`. Os arquivos de fonte não foram editados ou convertidos localmente.

## Arquivos e integridade

| Arquivo local | Tamanho | SHA-256 |
| --- | ---: | --- |
| `public/fonts/bangers-latin.woff2` | 23.528 bytes | `04f54ff42ea2b8fc50b4259c29c60b1e05e606b769c2fb541c98624346c9767c` |
| `public/fonts/bangers-latin-ext.woff2` | 17.196 bytes | `2c9576bb1d612cf8750bf749689b5916287940fc99e1be5451b83d9fb6c4c5d9` |
| `public/fonts/Bangers-OFL.txt` | 4.479 bytes | `630dd5a307c0657b094d324e069b390edf90182fe5003639e06c02a0e5769af7` |
| `public/fonts/Bangers-METADATA.pb` | 782 bytes | `7ba1f04a4b76f07c7e40686df10cccdb7627655b34dfe75a628873b7ba42cda3` |

URLs exatas dos binários:

- [Bangers Latin WOFF2](https://fonts.gstatic.com/s/bangers/v25/FeVQS0BTqb0h60ACH55Q2A.woff2).
- [Bangers Latin-ext WOFF2](https://fonts.gstatic.com/s/bangers/v25/FeVQS0BTqb0h60ACH5BQ2Ixi.woff2).

As tabelas internas dos dois WOFF2 registram família `Bangers`, subfamília `Regular` e versão `2.100; ttfautohint (v1.8.4.7-5d5b);gftools[0.9.31]`. O peso da tabela OS/2 é **400**, a grade da fonte tem **1000 unidades por em** e o campo `italicAngle` é **0**. Fontes são vetoriais; não possuem largura/altura fixa em pixels.

## Cobertura e verificação

O subset Latin contém os caracteres portugueses precompostos no intervalo `U+0000–00FF` e o travessão em `U+2014`, dentro do intervalo `U+2000–206F`. Foram lidas diretamente as tabelas `cmap` dos WOFF2 locais após descompressão Brotli com o Node, verificando glifos distintos de `.notdef` para **á, ã, ç, ê, —, Á, Ã, Ç e Ê**. O suporte exigido não depende de uma fonte de fallback.

Latin-ext permanece disponível para caracteres latinos adicionais, com carregamento condicionado por `unicode-range`. Não é necessário baixar o subset Vietnamese para o conteúdo português desta etapa.

## Integração em CSS

Os ranges abaixo reproduzem a resposta oficial do Google Fonts. As URLs são locais, portanto o navegador não consulta Google Fonts durante o uso do site.

```css
@font-face {
  font-family: 'Bangers';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/bangers-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC,
    U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329,
    U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,
    U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F,
    U+A720-A7FF;
}

@font-face {
  font-family: 'Bangers';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/bangers-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304,
    U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

.display-title {
  font-family: 'Bangers', Impact, 'Arial Narrow', sans-serif;
  font-weight: 400;
  font-style: normal;
  font-synthesis: none;
}
```

Priorizar apenas o subset Latin, usado nos títulos iniciais em português. Latin-ext pode carregar sob demanda, evitando transferência antecipada de caracteres ausentes da página:

```html
<link
  rel="preload"
  href="/fonts/bangers-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Manter fonte de texto corrente legível para parágrafos, navegação e controles. Usar Bangers nos títulos em HTML, permitindo seleção de texto, navegação por headings e leitura por tecnologias assistivas. Os assets de imagem existentes permanecem intactos.
