# Apetrechos Calçados — E-commerce

Loja online para o perfil [@loja.apetrechos](https://www.instagram.com/loja.apetrechos/).
Arquitetura de navegação inspirada na Dafiti (vitrine → filtros → produto → sacola),
com direção de arte editorial em vez do visual de outlet.

Site estático, sem build. Abra `index.html` em um servidor local e está no ar.

## Estrutura

```
apetrechos-store/
├── index.html          Home: hero rotativo, categorias, vitrines, newsletter
├── categoria.html      PLP: filtros, ordenação, paginação incremental
├── produto.html        PDP: galeria, cor/numeração, frete, acordeões
├── sacola.html         Sacola: cupom, resumo, checkout via WhatsApp
└── assets/
    ├── css/styles.css  Design system completo (tokens + componentes)
    └── js/
        ├── data.js     Catálogo (24 produtos) e configuração da loja
        ├── imagery.js  Imagens de produto geradas em SVG
        ├── app.js      Header, rodapé, sacola, drawers, toasts, tema
        ├── home.js     Home
        ├── plp.js      Vitrine e filtros
        ├── pdp.js      Página de produto
        └── cart.js     Sacola e checkout
```

## Design system

| Camada | Decisão |
|---|---|
| Estilo | Minimalismo editorial; vidro (backdrop-filter) só no header e nos drawers |
| Cor primária | `#BE185D` (rosé) · acento `#A16207` (ouro) · tinta `#0B0B0F` |
| Tipografia | Playfair Display (títulos) + Inter (corpo) |
| Espaço | Escala 4/8 px |
| Movimento | 160–380 ms, `cubic-bezier(.32,.72,0,1)`, respeita `prefers-reduced-motion` |

Todos os tokens ficam em `:root` no topo de `styles.css`. Tema claro e escuro são
pareados: o bloco `[data-theme='dark']` redefine os mesmos nomes semânticos.

## O que já funciona

- Busca com sugestões (debounce de 180 ms) e página de resultados
- Filtros por categoria, numeração, cor, marca, preço e desconto — sincronizados com a URL
- Ordenação por preço, desconto e avaliação
- PDP com troca de cor, numeração esgotada, cálculo de frete por CEP e guia de tamanhos
- Sacola persistente em `localStorage`, cupons, barra de progresso do frete grátis
- Checkout que monta o resumo do pedido e abre o WhatsApp da loja
- Favoritos, tema claro/escuro, toasts

## Antes de publicar

1. **WhatsApp** — em `assets/js/data.js`, trocar `CONFIG.whatsapp` pelo número real
   (formato `55DDNNNNNNNNN`).
2. **CNPJ** — em `assets/js/app.js`, na função `renderFooter()`.
3. **Fotos** — hoje cada produto usa uma imagem SVG gerada por `imagery.js`.
   Para usar fotos reais: adicionar `photos: ['assets/img/x-1.webp', ...]` em cada
   produto e trocar as chamadas de `productImage(p, i)` pelo item de `p.photos[i]`.
4. **Catálogo** — todo fictício: produtos, preços, avaliações e as 8 marcas
   (Apetrechos, Aurelle, Terrano, Nôa, Lunetta, Kaiah, Marésia, Solaz) são inventados,
   nenhuma corresponde a fabricante real. `PRODUCTS` em `data.js` é a fonte única;
   trocar por um `fetch()` de API mantém o resto do código intacto.
5. **Pagamento** — o checkout atual é por WhatsApp. Para checkout transparente,
   substituir o handler `#checkout` em `cart.js` pela integração do gateway.

## Rodar localmente

```bash
npx -y http-server apetrechos-store -p 5820 -c-1
```

## Publicar no GitHub Pages

Basta subir a pasta na raiz do repositório e ativar Pages na branch `main`.
Não há etapa de build.

## Verificações feitas

- Sem rolagem horizontal em 375 px, 768 px, 1024 px e 1440 px
- Contraste ≥ 4.5:1 nos pares de texto principais, nos dois temas
- Alvos de toque ≥ 44 px nos controles primários
- Hierarquia de títulos sequencial, um `h1` por página
- Sem erros de console nas quatro páginas
