# GS Contábil — Design System (MASTER)

Fonte: skill UI UX Pro Max (dados `products.csv`, `colors.csv`, `typography.csv`, `landing.csv`, `ui-reasoning.csv`), consultados diretamente porque não há Python neste PC.

## Direção
- **Categoria**: Serviço profissional / B2B (contabilidade) — próximo de "Legal Services" e "Banking/Traditional Finance".
- **Padrão de página**: Trust & Authority + Minimal (hero com missão → pilares → soluções → prova/processo → CTA claro).
- **Estilo**: Accessible & Ethical + Minimalism / Swiss.
- **Anti-padrões evitados**: degradês roxo/rosa "de IA", visual brincalhão, credenciais escondidas, emoji como ícone.

## Cores (tokens em `styles.css`)
| Token | Hex | Uso |
|---|---|---|
| `--ink` | #0c0c12 | fundos escuros (hero, planejamento, rodapé) — preto do logo |
| `--paper` | #f7f7f9 | fundo claro |
| `--brand` | #a3199a | magenta em fundo claro (6.6:1) — botões e destaques |
| `--brand-bright` | #ef6be9 | magenta em fundo escuro (7:1) |
| `--sky` | #8fd3f0 | azul das barras do logo — detalhes e ícones de checagem |
| `--text-muted` | #52525e | texto secundário (7.4:1) |

A cor de destaque aparece só em CTAs, eyebrows e números — nunca como degradê.

## Tipografia
- Títulos: **Lexend** 500–600 (par "Corporate Trust": finanças, acessibilidade).
- Texto: **Source Sans 3** 400–600, base 17px, line-height 1.6.

## Regras
- Alvos de toque ≥ 44px; foco visível em todos os elementos interativos.
- Ícones SVG (traço 1.75, estilo Lucide) via sprite inline.
- Movimento: entradas de 600–700ms com `cubic-bezier(.2,.7,.2,1)`; desligado com `prefers-reduced-motion`.
- Breakpoints: 1440+ / 1080 / 960 / 860 / 640px + celular deitado; sem rolagem horizontal em 375px.
- Não inventar números, depoimentos ou certificações — usar apenas fatos já publicados pela GS Contábil.

## Movimento (v2)
- Tokens: `--dur-fast` 160ms (feedback), `--dur` 280ms (estado), `--dur-slow` 700ms (entrada). Entrada usa `--ease-out` (desacelera), saída `--ease-in`, progresso/faixa contínua é linear.
- Parallax só na foto decorativa do topo, só com mouse, nunca em texto ou controles.
- Conteúdo em movimento contínuo (faixa de serviços) tem botão de pausa e para fora da tela.
- `prefers-reduced-motion`: sem animações, sem parallax, título e linha do tempo no estado final.

## Componentes de CX (v2)
- Assistente de atendimento: chips (radio/checkbox reais, foco visível), prévia `white-space: pre-line`, envio abre wa.me em nova aba. Sem JS, o formulário envia a mensagem padrão.
- Avisos (toast) somem em 3,5s e usam `role="status"`.
- Barras fixas não escondem o foco: o cabeçalho reaparece quando recebe foco do teclado.
