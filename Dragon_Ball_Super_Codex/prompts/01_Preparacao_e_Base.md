# ETAPA 01 — Preparação e base visual

Você vai implementar SOMENTE a etapa 01 de um site conceitual de fã de Dragon Ball Super. O objetivo final é apresentar remake e continuação pelas sagas, com Motion e Three.js. Nesta etapa prepare o projeto e entregue uma base estática navegável. Não implemente ainda animações de rolagem, partículas, áudio, shaders ou cenas 3D.

## 1. Inspecione antes de modificar
- Leia o README deste pacote, as instruções locais AGENTS.md e todas as cinco imagens em `referencias/`.
- Identifique a estrutura atual. Se houver um projeto existente, aproveite sua stack e preserve o trabalho já feito. Não apague arquivos nem reinicialize o repositório.
- Se a pasta estiver vazia de código de aplicação, use React + TypeScript + Vite como proposta de base.
- Consulte a documentação oficial atual ao escolher versões e integrações. Não use versões memorizadas como se fossem verificadas.
- Mantenha as imagens de referência intactas. Copie apenas os assets necessários para a pasta pública da aplicação.

## 2. Construa a estrutura
Componentes sugeridos: Header, Hero, SagaSection, Footer. Centralize os dados das sagas em um arquivo tipado, separado dos componentes. Use CSS com variáveis para cores, espaçamento e tipografia. Evite dependências que não sejam necessárias à base.

Prepare pontos de integração futuros para Motion e Three.js sem implementá-los ou instalá-los nesta etapa. Se já estiverem no projeto, preserve as dependências existentes. Não misture outro motor de animação.

## 3. Siga esta direção visual
- Fundo #05070D como ponto de partida, azuis profundos e violeta; amarelo e laranja em pequenos destaques ligados à marca.
- Atmosfera cinematográfica, mantendo o desenho dos personagens das referências.
- Imagens grandes, textos curtos, títulos fortes e boa legibilidade.
- Use fontes locais/sistema inicialmente; não dependa de fontes remotas para a página funcionar.
- Menus discretos: Início, Sagas, Sobre o projeto.
- Recrie controles e textos da página em HTML, com links reais. Não transforme o pôster ou o layout completo em uma captura de tela clicável.

## 4. Abertura
Use `02_Poster_Cinematografico.png` como arte central da abertura. Ela já contém logo e texto: não sobreponha outra cópia do mesmo logo/título por cima. Mostre o título HTML e uma frase curta em uma área separada com fundo adequado. A imagem deve ficar inteira na primeira versão, sem esticar e sem cortar rostos.

Título de trabalho: Dragon Ball Super — Remake e Continuação.
Subtítulo: Uma jornada visual pelas sagas e pelo futuro que imaginamos.
Botão “Explorar sagas” deve apontar para a primeira seção de saga usando navegação por âncora.

## 5. Seções de sagas
Use `03_Layout_Sagas.png` como referência de composição e `05_Panorama_Continuacao.png` como fonte visual preferencial. O panorama tem cinco faixas empilhadas. A primeira é a abertura; as quatro seguintes servem às quatro seções abaixo. Não repita o panorama inteiro em todas as seções.

Se conseguir gerar recortes com as ferramentas locais, salve derivados em `public/assets/derived/` e registre as coordenadas usadas. Como ponto de partida, as bandas ocupam aproximadamente quintos da altura; confira visualmente e ajuste para respeitar as divisões reais. Não corte automaticamente sem revisar. Se não houver ferramentas de recorte, use janelas CSS do panorama com altura e posição controladas, preservando a proporção; não invente arquivos ausentes.

Seções propostas:
1. Moro — “A jornada contra Moro”. Texto provisório: “Explore o conceito visual desta parte da jornada.”
2. Granolah — “Uma nova perspectiva”. Texto provisório: “Conheça a proposta visual para os próximos confrontos.”
3. Super Hero — “Heróis em destaque”. Texto provisório: “Uma seção dedicada ao visual e aos personagens desta história.”
4. Black Freeza — “O horizonte da continuação”. Texto provisório: “Uma visão de fã sobre o que pode vir a seguir.”

Esses textos são editoriais provisórios, não sinopses oficiais. Não invente episódios, elenco, trailers, datas de lançamento ou anúncios. Não transcreva automaticamente o texto pequeno das imagens: pode conter erros de geração. Não coloque botões que não tenham destino útil.

No desktop, cada seção pode ter arte larga e texto fora da área principal dos rostos. No celular, coloque arte e texto em blocos sucessivos, sem forçar uma faixa panorâmica a preencher toda a tela.

## 6. Limites dos assets
As referências são imagens raster achatadas. Não tratá-las como modelos 3D, sprites animados ou camadas independentes. Não deformar, redesenhar ou trocar personagens. Não adicionar imagens genéricas. Se faltar uma arte adequada, registrar a necessidade no relatório em vez de substituir por algo sem relação com as referências.

## 7. Responsividade e acessibilidade
- Página funcional em 360 px, 768 px e 1440 px, sem rolagem horizontal involuntária.
- Sem altura fixa que esconda textos; usar composição adaptável.
- Navegação por teclado com foco visível, contraste legível e landmarks semânticos.
- Texto alternativo útil para imagens informativas e alt vazio para elementos decorativos.
- Declarar dimensões/aspect-ratio das imagens, carregar as imagens abaixo da dobra sob demanda e priorizar a arte inicial.
- Nesta etapa, rolagem natural, sem travar o scroll, sem autoplay e sem tela de carregamento artificial.
- Rodapé: “Projeto conceitual de fã. Sem afiliação oficial.”

## 8. Verifique e entregue
Execute os checks existentes e o build de produção. Se houver navegador disponível, inspecione as três larguras indicadas, links internos, foco e carregamento das imagens. Não declare testes que não executou. Evite criar testes que apenas repitam textos estáticos; concentre a verificação no comportamento real.

Entregue a base implementada, comandos exatos para instalar e rodar conforme o gerenciador usado, breve relatório dos arquivos alterados e os limites observados nos assets. Se algum check falhar, explique e corrija o que estiver ao alcance. Pare ao concluir a ETAPA 01; não avance para Motion, Three.js ou publicação.
