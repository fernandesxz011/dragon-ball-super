# Referências e derivados — Etapa 02

> Histórico preservado: os recortes e limites registrados neste documento pertencem às composições anteriores. A interface atual usa cinco novas artes cinematográficas autorizadas, documentadas em [art-direction.md](art-direction.md).

Na Etapa 03, estes arquivos e coordenadas foram preservados. Após o ajuste de percepção, Motion desloca a `picture` inteira até ±20 px no desktop, dentro dos espaços reservados ao redor da arte; não cria camadas, não acrescenta zoom e não modifica os recortes ou os originais.

As cinco imagens originais foram extraídas do ZIP sem alterações e permanecem em `Dragon_Ball_Super_Codex/referencias/`. O README e o prompt originais também foram preservados nessa pasta.

## Direção visual

- **01 — Poster Apresentação:** identidade, cores, escala dos personagens e hierarquia; não usado como interface.
- **02 — Poster Cinematográfico:** única arte da abertura, exibida inteira e proporcionalmente. Seu logo/texto incorporado permanece intacto; o título HTML fica abaixo, em fundo sólido.
- **03 — Layout Sagas:** organização em faixas, numeração, títulos e navegação reconstruídos em HTML.
- **04 — Panorama Sagas:** referência alternativa de composição; não repetida na página.
- **05 — Panorama Continuação:** fonte dos recortes de sagas, com versões completas, foco para desktop/tablet e foco para mobile.

## Coordenadas dos recortes

Origem: `05_Panorama_Continuacao.png`, **1983 × 793 px**. Coordenadas em pixels, medidas a partir do canto superior esquerdo. As caixas são `(x, y, largura, altura)` e o limite final é exclusivo.

As divisões escuras foram verificadas visualmente: linhas 169–170, 334–335, 488–490 e 630–631. As quatro faixas têm alturas diferentes; não são quintos iguais. A primeira faixa é a abertura do panorama e não foi repetida como saga. Cada recorte mantém integralmente a altura da sua faixa, sem misturar sagas vizinhas.

| Saga / nome-base | Completo, preservado da Etapa 01 | Foco desktop/tablet | Mobile |
| --- | --- | --- | --- |
| Moro / `moro` | `(0, 172, 1983, 161)` | `(120, 172, 1300, 161)` | `(160, 172, 720, 161)` |
| Granolah / `granolah` | `(0, 337, 1983, 150)` | `(0, 337, 1400, 150)` | `(80, 337, 640, 150)` |
| Super Hero / `super-hero` | `(0, 492, 1983, 137)` | `(0, 492, 1450, 137)` | `(100, 492, 640, 137)` |
| Black Freeza / `black-freeza` | `(0, 632, 1983, 161)` | `(100, 632, 1650, 161)` | `(220, 632, 720, 161)` |

Todos os recortes estão em `public/assets/derived/`. Os arquivos completos continuam como `<nome-base>.jpg`; os novos arquivos para desktop/tablet são `<nome-base>-focus.jpg`; os arquivos `<nome-base>-mobile.jpg` mantêm seus nomes e receberam enquadramentos mais próximos dos protagonistas. Os oito recortes de foco foram revisados visualmente após a geração, inclusive os rostos no mobile.

As saídas de saga têm as mesmas dimensões dos respectivos recortes. A aplicação deve limitar cada arte à sua largura intrínseca, preservar a proporção e permitir redução para caber no espaço disponível. A altura não deve ser aumentada para compensar a largura reduzida. Evitar `object-fit: cover` ou uma altura fixa que corte novamente os rostos.

## Otimização e reprodução

A abertura mantém as versões JPEG de **640, 1120 e 1672 px** de largura, usadas por `srcset`, com os mesmos nomes da Etapa 01. Todas mostram a imagem original inteira. JPEG com qualidade **92** reduz o peso em relação aos PNG originais; a compressão é com perdas. Nenhuma arte nova foi gerada e nenhuma saída aumenta a resolução do seu recorte.

O script `scripts/prepare-assets.ps1` reproduz todos os derivados com o `System.Drawing` do Windows. Ele só lê os originais e grava em `public/assets/`. Valida os limites dos recortes e rejeita largura de saída superior à largura da origem, preservando a proporção ao reduzir. Os derivados já acompanham a aplicação; o script não é necessário para abrir ou compilar o site.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-assets.ps1
```

## Limites e materiais futuros

As faixas originais têm apenas **137 a 161 px de altura**. Recortes horizontais aproximam os personagens, mas essa altura limita o tamanho em que a arte pode ser mostrada com nitidez. A resolução não deve ser aumentada nem a imagem esticada para preencher um espaço maior. Para apresentar artes maiores, recomenda-se obter arquivos de maior altura e resolução; para telas pequenas, artes verticais nativas permitem enquadramentos mais generosos.

As referências atuais são rasters achatados. Personagens, cenários, auras, logos e textos incorporados não são camadas separadas. Não há camadas disponíveis, modelos 3D, sprites ou material para parallax independente. Camadas separadas poderão ser solicitadas para uma etapa futura que necessite esse movimento; os recortes atuais não criam essa separação.

Textos pequenos e eventuais imperfeições já presentes nas imagens não foram transcritos para o conteúdo HTML. Os textos da página são os editoriais provisórios do roteiro; não são sinopses oficiais.
