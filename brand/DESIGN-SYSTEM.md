# Apetrechos Calçados — Design System

> Especificação de handoff. Formato pensado para ser lido por uma ferramenta de
> design (Claude Design, Figma, etc.) ou por outro dev. Os valores canônicos estão
> em [`tokens.json`](tokens.json); os mesmos tokens vivem em `assets/css/styles.css`
> como custom properties. **Fonte da verdade:** o CSS em produção.

- **Marca:** Apetrechos Calçados
- **Assinatura:** *Conforto e estilo em um só lugar*
- **Estilo:** Minimalismo editorial. Vidro (`backdrop-filter`) só no cabeçalho, drawers e overlays — nunca decorativo.
- **Versão:** 1.0.0 · 29/07/2026

---

## 1. Princípios

1. **Editorial, não outlet.** A concorrência (Dafiti et al.) compete por densidade e vermelho de promoção. A Apetrechos compete parecendo marca: respiro largo, tipografia serifada, um acento por tela.
2. **Uma ação primária por tela.** Só um botão preenchido/rosé por vista. O resto é secundário (contorno) ou fantasma.
3. **Cor funcional carrega ícone ou texto.** Verde/vermelho nunca comunicam sozinhos.
4. **Toque confortável.** Todo controle primário ≥ 44px.
5. **Dois temas pareados.** Claro e escuro definidos juntos; o escuro dessatura, não inverte.

---

## 2. Cor

### Primárias da marca

| Token | Hex | Uso |
|---|---|---|
| `brand-700` (Rosé) | `#BE185D` | Cor primária: CTA, links ativos, preços em destaque, o "e" do logo |
| `gold-700` (Ouro) | `#A16207` | Acento editorial: selos, PIX, detalhes premium |
| `ink-900` (Tinta) | `#0B0B0F` | Texto principal, botão escuro, rodapé, fundo do tema escuro |

### Semânticos — tema claro

| Papel | Token | Hex |
|---|---|---|
| Fundo | `bg` | `#FFFFFF` |
| Superfície | `surface` | `#FAF9F8` |
| Superfície 2 | `surface-2` | `#F3F1EF` |
| Texto | `fg` | `#0B0B0F` |
| Texto suave | `fg-muted` | `#5C5C68` |
| Texto sutil | `fg-subtle` | `#6C6C78` |
| Borda | `border` | `#E7E4E2` |
| Borda forte | `border-strong` | `#D3CFCC` |
| Primária | `primary` | `#BE185D` |
| Primária hover | `primary-hover` | `#7A0F3C` |

### Semânticos — tema escuro

| Papel | Token | Hex |
|---|---|---|
| Fundo | `bg` | `#0B0B0F` |
| Superfície | `surface` | `#131319` |
| Texto | `fg` | `#F6F5F7` |
| Texto suave | `fg-muted` | `#A7A5AE` |
| Primária | `primary` | `#F472B6` |
| Acento | `accent` | `#E3B341` |

> No escuro a primária é rosé **dessaturado** (`#F472B6`) — mantém a marca legível sobre tinta sem “vibrar”.

### Sinais

`success #15803D` · `danger #C02626` · `success-bg #EAF6EE`

### Paleta de produto (swatches do catálogo)

`Preto #1A1A1F` · `Off White #F2EFE9` · `Caramelo #A9662F` · `Nude #D8B49C` · `Vinho #6B1D33` · `Dourado #B58A3C` · `Bege #CBB79C` · `Marrom #4E342A` · `Rosa Seco #C48A9A` · `Prata #B9BCC2` · `Verde Musgo #4A5A44` · `Jeans #5C6E8A`

### Contraste verificado (WCAG AA)

| Par | Claro | Escuro |
|---|---|---|
| Texto / fundo | 19.6:1 | 18.1:1 |
| Texto suave / fundo | 6.6:1 | 8.1:1 |
| Texto sutil / fundo | 5.2:1 | 5.3:1 |
| On-primary / primária | 6.0:1 | 7.0:1 |

Todos os pares de texto passam AA (≥ 4.5:1) nos dois temas.

---

## 3. Tipografia

| Papel | Fonte | Observação |
|---|---|---|
| Display | **Playfair Display** (400–700 + itálico) | Títulos, números-herói, o logotipo |
| Corpo / UI | **Inter** (300–700) | Texto, rótulos, botões, tabelas |

- **Escala (rem, base 16px):** 12 · 13 · 15 · 16 · 20 · 24 · 32 · 44 · 60
- **Entrelinha:** títulos 1.15 · corpo 1.6
- **Tracking:** títulos `-0.01em` · rótulos em caixa alta `0.22em`
- **Números:** `font-variant-numeric: tabular-nums` em preços, quantidades e tabelas
- **Mobile (<900px):** o corpo sobe para 16px (evita o auto-zoom do iOS nos campos)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap');
```

---

## 4. Espaço, forma, elevação

- **Espaço:** escala 4/8 → `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`
- **Raio:** `sm 6` · `md 10` · `lg 16` · `xl 24` · `full 999`
- **Elevação:** 4 níveis, sombra base `rgba(11,11,15,*)` (troca para `rgba(0,0,0,*)` no escuro)
  - `e-1` hairline · `e-2` card · `e-3` popover/drawer · `e-4` modal

---

## 5. Movimento

- **Durações:** `fast 160ms` · `base 240ms` · `slow 380ms`
- **Curva padrão:** `cubic-bezier(.32,.72,0,1)` · **saída:** `cubic-bezier(.16,1,.3,1)`
- Entrada em `ease-out`, saída mais curta que entrada
- Sempre respeitar `prefers-reduced-motion` (reduzir para ~0.01ms)

---

## 6. Componentes-chave

| Componente | Regra |
|---|---|
| **Botão** | Altura 44px (54px `lg`), raio `full`, peso 600. Só um preenchido por tela. Variantes: preenchido (rosé), contorno, fantasma, tinta. |
| **Card de produto** | Mídia 5:6, raio `lg`. Badge (desconto/novidade/últimas), favorito, marca em caixa alta, nome, avaliação, preço tabular, parcelamento, swatches. Segunda imagem no hover. |
| **Ícones** | Família única, traço 1.6, `viewBox` 24 (padrão Lucide). Nunca emoji. Tamanhos 16/20/24. |
| **Vidro** | `backdrop-filter: blur(18px)` só em header, drawers e overlays. Sinaliza dispensa de fundo, não decoração. |
| **Chips/badges** | Raio `full`, caixa alta 10px, tracking `0.08em`. Desconto = rosé; novidade = contorno; últimas peças = ouro. |
| **Toast** | Fundo tinta, texto claro, `aria-live="polite"`, auto-dismiss 3.6s, não rouba foco. |

---

## 7. Acessibilidade (não-negociável)

- Contraste AA em todos os pares de texto, nos dois temas
- Foco visível (`outline` 2px na cor `ring`)
- Um `<h1>` por página, hierarquia sequencial
- Alvos de toque ≥ 44px
- Todo ícone-botão tem `aria-label`
- `prefers-reduced-motion` respeitado
- Cor nunca é o único indicador

---

## 8. Como consumir

- **Tokens canônicos:** `tokens.json` (camadas primitivo → semântico, com referências `{color.primitive.brand.700}`)
- **Em produção:** `assets/css/styles.css`, bloco `:root` (linhas ~30–110). Tema escuro em `[data-theme='dark']`.
- **Fontes:** Google Fonts (Playfair Display + Inter). Para ambiente offline/print, embutir como `@font-face` data URI.
- Ao gerar telas novas, **derivar toda cor e tipo destes tokens** — não introduzir hex cru em componente.
