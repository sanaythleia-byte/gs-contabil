# GS Contábil — site institucional (redesign)

Site estático (HTML + CSS + JS, sem build) da GS Contábil, assessoria contábil em Ananindeua – PA.
Redesign do site publicado em https://gscontabilassessoria.vercel.app/, mantendo todos os textos, serviços, artigos e contatos.

## Estrutura

```
index.html            página inicial
artigos/*.html        3 artigos (Imposto de Renda, MEI, Planejamento tributário)
styles.css            todo o visual (tokens de cor/tipografia no topo do arquivo)
script.js             menu mobile, animações, menu ativo, mapa sob demanda
favicon.svg           ícone do site
assets/               logo, foto do escritório e capas dos artigos
design-system/        decisões de design (MASTER.md)
servidor-local.ps1    servidor para ver o site no PC (http://localhost:8081)
```

## Ver no computador

```powershell
powershell -ExecutionPolicy Bypass -File servidor-local.ps1 -Port 8081
```

Depois abra http://localhost:8081.

## Publicar na Vercel

Importe este repositório na Vercel (Add New → Project). Não há comando de build: a pasta raiz é publicada como está. O `vercel.json` ativa URLs limpas (`/artigos/mei-obrigacoes`), como no site atual.

## O que mudou no redesign

- Identidade visual alinhada ao logo: preto, magenta e azul-céu, aplicados como cores sólidas (sem degradês).
- Tipografia Lexend (títulos) + Source Sans 3 (texto), pensada para leitura fácil.
- Ícones SVG no lugar de símbolos de texto; contraste de cores dentro do padrão WCAG AA.
- Cada "Saiba mais" abre o WhatsApp já com a mensagem do serviço escolhido.
- Menu mobile acessível (Esc fecha, foco visível, alvos de toque de 44px+), menu indica a seção atual.
- Mapa do Google carregado só quando o visitante clica (página mais leve).
- Animações suaves que respeitam a opção "reduzir movimento" do sistema.
- Âncoras antigas (`#reforma`, `#especialidades`, `#localizacao`) continuam funcionando.

## Versão 2 — UI, UX, CX, motion e responsividade

**CX (experiência do cliente)**
- Assistente "Como podemos ajudar?": o visitante escolhe perfil e assunto, digita o nome (opcional) e o site monta a mensagem do WhatsApp, com prévia ao vivo e botão "Copiar mensagem".
- Os cartões "Para quem atendemos" levam ao assistente já com o perfil marcado.
- Botões para copiar endereço e telefone, com aviso de confirmação.

**Motion graphics**
- Título do topo entra palavra por palavra; foto, selo e gráfico aparecem em sequência.
- Gráfico animado inspirado no logo: o anel se desenha, as barras crescem e a seta de tendência sobe.
- Faixa contínua com os serviços (com botão de pausa e pausa automática fora da tela).
- Linha do tempo de "Como começar" se preenche conforme a rolagem; as linhas de "Por que" se desenham.
- Tudo é desligado quando o sistema pede "reduzir movimento".

**Interatividade e UI**
- Barra de progresso de leitura no cabeçalho; cabeçalho se esconde ao descer e volta ao subir.
- Brilho que segue o cursor nos cartões; perguntas frequentes abrem e fecham com animação suave.
- Botão "voltar ao topo"; menu destaca a seção atual.
- Artigos: tempo de leitura, botão "Compartilhar", sumário clicável que acompanha a leitura.

**Responsividade**
- Espaçamentos e margens fluidos; telas grandes (1440px+) usam container mais largo.
- Celular: barra fixa com WhatsApp, Ligar e Rota no lugar do botão flutuante.
- Tablet e celular: artigos viram carrossel deslizável.
- Celular deitado: topo compacto. Impressão: sem menus e botões flutuantes.
- Foto do escritório em 2 tamanhos (800px para celular: 53 KB em vez de 261 KB).
