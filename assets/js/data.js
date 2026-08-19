/* =========================================================================
   Apetrechos Calçados — Catálogo
   Fonte única de dados da vitrine. Substituir por API quando houver back-end.
   ========================================================================= */

const CONFIG = {
  brand: 'Apetrechos',
  brandLine: 'Calçados',
  tagline: 'Conforto e estilo em um só lugar',
  instagram: 'https://www.instagram.com/loja.apetrechos/',
  whatsapp: '5511999999999', // trocar pelo número real da loja
  freeShipping: 249.9,
  installments: 10,
  pixDiscount: 0.1,
  // LGPD
  privacyUrl: 'privacy.html',
  dpo: 'privacidade@apetrechos.com.br', // Encarregado de Dados (trocar pelo real)
  // Back-end de checkout (frete Melhor Envio + pagamento PagBank).
  // Vazio = pagamento online desligado; o site usa só o WhatsApp.
  // Em produção, aponte para a URL do serviço apetrechos-checkout.
  checkoutApi: '', // ex.: 'https://apetrechos-checkout.onrender.com'
};

const CATEGORIES = [
  { slug: 'tenis',      name: 'Tênis',      glyph: 'sneaker', bg: ['#F6EDF1', '#EBDDE4'] },
  { slug: 'botas',      name: 'Botas',      glyph: 'boot',    bg: ['#EFEBE6', '#E2DBD2'] },
  { slug: 'sandalias',  name: 'Sandálias',  glyph: 'sandal',  bg: ['#F7EFE6', '#EEE0CE'] },
  { slug: 'sapatilhas', name: 'Sapatilhas', glyph: 'flat',    bg: ['#F1F0EC', '#E4E2DA'] },
  { slug: 'saltos',     name: 'Saltos',     glyph: 'sandal',  bg: ['#F4EAEE', '#E8D6DE'] },
  { slug: 'mules',      name: 'Mules',      glyph: 'flat',    bg: ['#F2EFF4', '#E3DEE9'] },
  { slug: 'rasteiras',  name: 'Rasteiras',  glyph: 'sandal',  bg: ['#EFF2EF', '#DFE6DF'] },
  { slug: 'esportivo',  name: 'Esportivo',  glyph: 'sneaker', bg: ['#ECEFF4', '#DCE2EB'] },
];

/* Marcas fictícias — nenhuma corresponde a fabricante real.
   Ao ligar o catálogo em fornecedores de verdade, trocar esta lista
   e o campo `brand` de cada item em PRODUCTS. */
const BRANDS = ['Apetrechos', 'Aurelle', 'Terrano', 'Nôa', 'Lunetta', 'Kaiah', 'Marésia', 'Solaz'];

const COLOR_TOKENS = {
  preto:     { name: 'Preto',      hex: '#1A1A1F' },
  branco:    { name: 'Off White',  hex: '#F2EFE9' },
  caramelo:  { name: 'Caramelo',   hex: '#A9662F' },
  nude:      { name: 'Nude',       hex: '#D8B49C' },
  vinho:     { name: 'Vinho',      hex: '#6B1D33' },
  dourado:   { name: 'Dourado',    hex: '#B58A3C' },
  bege:      { name: 'Bege',       hex: '#CBB79C' },
  marrom:    { name: 'Marrom',     hex: '#4E342A' },
  rosa:      { name: 'Rosa Seco',  hex: '#C48A9A' },
  prata:     { name: 'Prata',      hex: '#B9BCC2' },
  verde:     { name: 'Verde Musgo',hex: '#4A5A44' },
  jeans:     { name: 'Jeans',      hex: '#5C6E8A' },
};

const SIZE_RUN = [33, 34, 35, 36, 37, 38, 39, 40];

/* Helper compacto para declarar produtos sem repetição. */
function p(id, name, brand, category, price, oldPrice, colors, sizes, opts = {}) {
  const cat = CATEGORIES.find((c) => c.slug === category);
  return {
    id,
    name,
    brand,
    category,
    categoryName: cat.name,
    glyph: opts.glyph || cat.glyph,
    bg: opts.bg || cat.bg,
    price,
    oldPrice,
    colors: colors.map((k) => COLOR_TOKENS[k]),
    sizes,
    rating: opts.rating ?? 4.6,
    reviews: opts.reviews ?? 42,
    tags: opts.tags || [],
    stock: opts.stock ?? 14,
    heelHeight: opts.heel || null,
    material: opts.material || 'Couro sintético de alta durabilidade',
    description:
      opts.description ||
      `${name} da linha ${brand}. Modelagem estudada para uso prolongado, com palmilha macia e acabamento impecável — o tipo de calçado que combina com o dia inteiro.`,
  };
}

const PRODUCTS = [
  // ---- Tênis -------------------------------------------------------------
  p('t01', 'Tênis Chunky Sole Off White', 'Apetrechos', 'tenis', 279.9, 399.9,
    ['branco', 'preto', 'nude'], [34, 35, 36, 37, 38, 39],
    { tags: ['novidade', 'bestseller'], rating: 4.8, reviews: 128, bg: ['#F7F4EF', '#E9E3D8'] }),
  p('t02', 'Tênis Casual Retrô Camurça', 'Aurelle', 'tenis', 229.9, 299.9,
    ['caramelo', 'verde', 'preto'], [35, 36, 37, 38, 39, 40],
    { rating: 4.7, reviews: 86, bg: ['#F4EEE6', '#E5D9C9'] }),
  p('t03', 'Tênis Slip On Minimal', 'Lunetta', 'tenis', 159.9, 219.9,
    ['preto', 'branco'], [33, 34, 35, 36, 37, 38],
    { tags: ['bestseller'], rating: 4.5, reviews: 64 }),
  p('t04', 'Tênis Plataforma Tratorado', 'Nôa', 'tenis', 319.9, 429.9,
    ['preto', 'branco', 'rosa'], [34, 35, 36, 37, 38, 39],
    { tags: ['novidade'], rating: 4.9, reviews: 51, bg: ['#F1EFF3', '#E0DBE6'] }),

  // ---- Botas -------------------------------------------------------------
  p('b01', 'Bota Montaria Cano Longo', 'Terrano', 'botas', 489.9, 649.9,
    ['marrom', 'preto', 'caramelo'], [34, 35, 36, 37, 38, 39],
    { tags: ['bestseller'], rating: 4.9, reviews: 173, material: 'Couro legítimo com forro têxtil', heel: '4 cm' }),
  p('b02', 'Bota Coturno Tratorada', 'Kaiah', 'botas', 349.9, 449.9,
    ['preto', 'vinho'], [34, 35, 36, 37, 38, 39, 40],
    { rating: 4.7, reviews: 92, heel: '5 cm' }),
  p('b03', 'Bota Chelsea Elástico', 'Aurelle', 'botas', 299.9, 379.9,
    ['caramelo', 'preto'], [35, 36, 37, 38, 39],
    { tags: ['novidade'], rating: 4.6, reviews: 38, heel: '3 cm' }),
  p('b04', 'Bota Ankle Boot Bico Fino', 'Terrano', 'botas', 399.9, 529.9,
    ['preto', 'nude', 'vinho'], [34, 35, 36, 37, 38],
    { rating: 4.8, reviews: 77, heel: '7 cm', stock: 4 }),

  // ---- Sandálias ---------------------------------------------------------
  p('s01', 'Sandália Salto Bloco Tiras', 'Apetrechos', 'sandalias', 219.9, 299.9,
    ['nude', 'preto', 'dourado'], [34, 35, 36, 37, 38, 39],
    { tags: ['bestseller', 'novidade'], rating: 4.8, reviews: 140, heel: '6 cm', bg: ['#F8F0E5', '#EFDFC8'] }),
  p('s02', 'Sandália Plataforma Corda', 'Lunetta', 'sandalias', 179.9, 249.9,
    ['bege', 'preto'], [34, 35, 36, 37, 38],
    { rating: 4.5, reviews: 59, heel: '8 cm' }),
  p('s03', 'Sandália Anabela Tiras Finas', 'Marésia', 'sandalias', 149.9, 199.9,
    ['preto', 'caramelo', 'branco'], [33, 34, 35, 36, 37, 38, 39],
    { rating: 4.4, reviews: 45, heel: '5 cm' }),
  p('s04', 'Sandália Metalizada Festa', 'Aurelle', 'sandalias', 259.9, 349.9,
    ['dourado', 'prata'], [34, 35, 36, 37, 38],
    { tags: ['novidade'], rating: 4.7, reviews: 33, heel: '9 cm', stock: 3 }),

  // ---- Sapatilhas --------------------------------------------------------
  p('f01', 'Sapatilha Bico Fino Clássica', 'Solaz', 'sapatilhas', 189.9, 239.9,
    ['preto', 'nude', 'vinho'], [33, 34, 35, 36, 37, 38, 39],
    { tags: ['bestseller'], rating: 4.9, reviews: 210, material: 'Couro macio com palmilha em gel' }),
  p('f02', 'Sapatilha Boneca Laço', 'Lunetta', 'sapatilhas', 129.9, 169.9,
    ['preto', 'rosa', 'branco'], [33, 34, 35, 36, 37, 38],
    { rating: 4.5, reviews: 71 }),
  p('f03', 'Sapatilha Camurça Costura', 'Marésia', 'sapatilhas', 149.9, 189.9,
    ['caramelo', 'verde', 'preto'], [34, 35, 36, 37, 38, 39],
    { rating: 4.6, reviews: 40 }),

  // ---- Saltos ------------------------------------------------------------
  p('h01', 'Scarpin Bico Fino Verniz', 'Aurelle', 'saltos', 289.9, 379.9,
    ['preto', 'vinho', 'nude'], [34, 35, 36, 37, 38, 39],
    { tags: ['bestseller'], rating: 4.7, reviews: 118, heel: '9 cm', glyph: 'sandal' }),
  p('h02', 'Scarpin Salto Taça Nude', 'Apetrechos', 'saltos', 249.9, 329.9,
    ['nude', 'preto'], [34, 35, 36, 37, 38],
    { tags: ['novidade'], rating: 4.8, reviews: 62, heel: '7 cm', glyph: 'sandal' }),
  p('h03', 'Meia Pata Salto Alto', 'Nôa', 'saltos', 279.9, 359.9,
    ['preto', 'bege'], [34, 35, 36, 37, 38, 39],
    { rating: 4.6, reviews: 47, heel: '10 cm', glyph: 'sandal', stock: 5 }),

  // ---- Mules -------------------------------------------------------------
  p('m01', 'Mule Bico Quadrado Salto Baixo', 'Apetrechos', 'mules', 199.9, 269.9,
    ['preto', 'caramelo', 'branco'], [34, 35, 36, 37, 38, 39],
    { tags: ['novidade', 'bestseller'], rating: 4.8, reviews: 95, heel: '4 cm' }),
  p('m02', 'Mule Salto Bloco Couro', 'Terrano', 'mules', 329.9, 419.9,
    ['marrom', 'preto'], [35, 36, 37, 38, 39],
    { rating: 4.7, reviews: 36, heel: '6 cm', material: 'Couro legítimo' }),

  // ---- Rasteiras ---------------------------------------------------------
  p('r01', 'Rasteira Tiras Trançadas', 'Lunetta', 'rasteiras', 89.9, 129.9,
    ['caramelo', 'preto', 'dourado'], [33, 34, 35, 36, 37, 38, 39],
    { tags: ['bestseller'], rating: 4.5, reviews: 156 }),
  p('r02', 'Rasteira Fivela Metal', 'Marésia', 'rasteiras', 109.9, 149.9,
    ['preto', 'branco', 'nude'], [34, 35, 36, 37, 38],
    { rating: 4.4, reviews: 63 }),

  // ---- Esportivo ---------------------------------------------------------
  p('e01', 'Tênis Running Amortecimento', 'Kaiah', 'esportivo', 299.9, 399.9,
    ['preto', 'jeans', 'rosa'], [34, 35, 36, 37, 38, 39, 40],
    { tags: ['novidade'], rating: 4.7, reviews: 88, glyph: 'sneaker', material: 'Malha respirável com entressola em EVA' }),
  p('e02', 'Tênis Treino Leve Malha', 'Solaz', 'esportivo', 239.9, 319.9,
    ['branco', 'preto'], [34, 35, 36, 37, 38, 39],
    { rating: 4.6, reviews: 54, glyph: 'sneaker' }),
];

/* --------------------------------------------------------------------------
   Consultas
   -------------------------------------------------------------------------- */
const Catalog = {
  all: () => PRODUCTS,
  byId: (id) => PRODUCTS.find((x) => x.id === id),
  byCategory: (slug) => (slug ? PRODUCTS.filter((x) => x.category === slug) : PRODUCTS),
  byTag: (tag) => PRODUCTS.filter((x) => x.tags.includes(tag)),
  related: (product, n = 4) =>
    PRODUCTS.filter((x) => x.id !== product.id && x.category === product.category)
      .concat(PRODUCTS.filter((x) => x.id !== product.id && x.category !== product.category))
      .slice(0, n),
  search: (q) => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter((x) =>
      [x.name, x.brand, x.categoryName].join(' ').toLowerCase().includes(term)
    );
  },
  priceRange: () => {
    const prices = PRODUCTS.map((x) => x.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  },
};

const discountOf = (p) => Math.round((1 - p.price / p.oldPrice) * 100);
