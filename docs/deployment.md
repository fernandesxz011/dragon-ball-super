# GitHub e GitHub Pages

A publicação foi autorizada diretamente pelo usuário após o trabalho local. O projeto mantém React, Vite, Motion e Three.js, com uma única ponte de progresso. O roteiro anexado foi usado como direção de experiência; não foi acrescentado outro motor de scroll ou animação à integração existente.

O workflow `.github/workflows/pages.yml` instala as dependências pelo lockfile, executa lint, TypeScript e build e publica somente `dist/`. Usa Node.js 24 e as ações oficiais fixadas por commit. O token do workflow tem as permissões de leitura de código e publicação Pages/OIDC; nenhuma credencial entra no frontend.

O Vite lê `BASE_PATH`, com `/` no ambiente local. Na publicação, `actions/configure-pages` fornece o prefixo do repositório. `assetUrl()` aplica esse prefixo aos JPEGs usados por React; Vite ajusta as fontes CSS e o preload usa `%BASE_URL%`. Isso segue a [orientação oficial de base pública do Vite](https://vite.dev/guide/static-deploy.html#github-pages).

O repositório é [fernandesxz011/dragon-ball-super](https://github.com/fernandesxz011/dragon-ball-super), com a URL [fernandesxz011.github.io/dragon-ball-super/](https://fernandesxz011.github.io/dragon-ball-super/). Pages está habilitado com `build_type: workflow`. Cada envio para `main` executa os checks antes de publicar; o estado pode ser acompanhado nas [execuções do workflow](https://github.com/fernandesxz011/dragon-ball-super/actions). Configuração e deploy seguem o [fluxo oficial de GitHub Pages com Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Reproduzir o build do Pages localmente

```powershell
$env:BASE_PATH = '/dragon-ball-super/'
npm.cmd run build
npm.cmd run preview
```

Abra `http://127.0.0.1:4173/dragon-ball-super/`. Para voltar ao ambiente raiz nessa sessão:

```powershell
Remove-Item Env:BASE_PATH
npm.cmd run dev
```

Os masters, conceitos, originais e documentação permanecem no código-fonte. `node_modules/`, `dist/`, caches, logs e arquivos de ambiente são ignorados pelo Git.
