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
  cnpj: '', // CNPJ real da loja — vazio esconde do rodapé até ser informado
  // Back-end de checkout (frete Melhor Envio + pagamento PagBank).
  // Vazio = pagamento online desligado; o site usa só o WhatsApp.
  // Em produção, aponte para a URL do serviço apetrechos-checkout.
  checkoutApi: '', // ex.: 'https://apetrechos-checkout.onrender.com'
};

const CATEGORIES = [
  { slug: 'tenis',      name: 'Tênis',      glyph: 'sneaker', bg: ['#F6EDF1', '#EBDDE4'] },
  { slug: 'sapatenis',  name: 'Sapatênis',  glyph: 'sneaker', bg: ['#EFEBE6', '#E2DBD2'] },
  { slug: 'saltos',     name: 'Saltos',     glyph: 'sandal',  bg: ['#F4EAEE', '#E8D6DE'] },
  { slug: 'sandalias',  name: 'Sandálias',  glyph: 'sandal',  bg: ['#F7EFE6', '#EEE0CE'] },
  { slug: 'rasteiras',  name: 'Rasteiras',  glyph: 'sandal',  bg: ['#EFF2EF', '#DFE6DF'] },
  { slug: 'infantil',   name: 'Infantil',   glyph: 'sneaker', bg: ['#ECEFF4', '#DCE2EB'] },
];

/* Marcas reais revendidas pela loja. */
const BRANDS = ['Box 200', 'Pegada', 'Strike', 'Vizzano', 'Mariotta', 'Mississipi', 'Ollie', 'Sonic'];

const COLOR_TOKENS = {
  preto:    { name: 'Preto',        hex: '#1A1A1F' },
  branco:   { name: 'Branco',       hex: '#F0EDE7' },
  gelo:     { name: 'Gelo',         hex: '#D9DBDA' },
  grafite:  { name: 'Grafite',      hex: '#4A4A52' },
  caramelo: { name: 'Caramelo',     hex: '#A9662F' },
  pinhao:   { name: 'Pinhão',       hex: '#6B4423' },
  azul:     { name: 'Azul Marinho', hex: '#2A3550' },
  azulbb:   { name: 'Azul Bebê',    hex: '#9CC2DA' },
  rosa:     { name: 'Rosa',         hex: '#D96BA0' },
  dourado:  { name: 'Dourado',      hex: '#B58A3C' },
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
    photos: opts.photos || null,
    price,
    oldPrice,
    colors: colors.map((k) => COLOR_TOKENS[k]),
    sizes,
    rating: opts.rating ?? 0,
    reviews: opts.reviews ?? 0,
    tags: opts.tags || [],
    stock: opts.stock ?? 14,
    heelHeight: opts.heel || null,
    material: opts.material || 'Couro sintético de alta durabilidade',
    description:
      opts.description ||
      `${name} da linha ${brand}. Modelagem estudada para uso prolongado, com palmilha macia e acabamento impecável — o tipo de calçado que combina com o dia inteiro.`,
  };
}

/* ---------------------------------------------------------------------------
   Catálogo real (fotos em assets/img/products). Preços/numerações/estoque
   informados pela loja (07/09/2026). `oldPrice` = preço "de" real (promoção);
   null quando não há promoção. `stock` = total de pares em estoque.
   ⚠️ Itens marcados PREÇO PROVISÓRIO ainda precisam do valor real da loja.
   -------------------------------------------------------------------------- */
const PRODUCTS = [
  // ---- Tênis (Box 200) ---------------------------------------------------
  p('t01', 'Tênis Box 200 Preto', 'Box 200', 'tenis', 50.0, null,
    ['preto'], [34, 39, 40, 41],
    { stock: 6, photos: ['assets/img/products/box200-preto.jpg'],
      material: 'Cabedal têxtil respirável com solado em EVA',
      description: 'Tênis esportivo todo preto, leve e respirável, com solado em EVA que amortece a passada. Ideal para corrida, caminhada e o dia a dia.' }),
  /* ⏸️ AGUARDANDO PREÇO da loja — reativar quando confirmado (fotos já em assets/img/products):
  p('t02', 'Tênis Box 200 Gelo', 'Box 200', 'tenis', 0, null,
    ['gelo'], [34, 35, 38, 39, 41, 42, 43, 44],
    { stock: 9, photos: ['assets/img/products/box200-gelo.jpg'],
      material: 'Cabedal têxtil respirável com solado em EVA',
      description: 'Tênis esportivo cinza-gelo com detalhes em preto e entressola branca. Conforto e leveza para treinar ou passear.' }),
  p('t03', 'Tênis Box 200 Preto e Dourado', 'Box 200', 'tenis', 0, null,
    ['preto'], [47, 49],
    { stock: 2, photos: ['assets/img/products/box200-preto-dourado.jpg'],
      material: 'Cabedal têxtil respirável com solado em EVA',
      description: 'Tênis esportivo preto com detalhes dourados e solado emborrachado com aderência. Visual esportivo com um toque de sofisticação.' }),
  */

  // ---- Sapatênis ---------------------------------------------------------
  p('sp01', 'Sapatênis Pegada Levitech Branco', 'Pegada', 'sapatenis', 149.95, 329.95,
    ['branco'], [39, 40],
    { stock: 2, photos: ['assets/img/products/pegada-sapatenis-branco.jpg'],
      material: 'Couro legítimo com tecnologia Levitech',
      description: 'Sapatênis masculino em couro branco com tecnologia Levitech de amortecimento. Visual limpo e confortável para trabalho ou passeio.' }),
  p('sp02', 'Sapatênis Pegada Pinhão', 'Pegada', 'sapatenis', 100.0, 209.95,
    ['pinhao'], [39],
    { stock: 2, photos: ['assets/img/products/pegada-sapatenis-pinhao.jpg'],
      material: 'Couro legítimo com zíper lateral',
      description: 'Sapatênis masculino em couro na cor pinhão, com zíper lateral e cadarço. Elegante e confortável para usar o dia inteiro.' }),
  p('sp03', 'Sapatênis Strike Gelo', 'Strike', 'sapatenis', 100.0, 210.0,
    ['gelo'], [38, 39, 40, 41],
    { stock: 4, photos: ['assets/img/products/strike-sapatenis-gelo.jpg'],
      material: 'Couro com solado emborrachado',
      description: 'Sapatênis casual off-white com solado caramelo e costura aparente. Estiloso e versátil para compor vários looks.' }),

  // ---- Saltos ------------------------------------------------------------
  p('h01', 'Sandália Vizzano Salto Alto Preta', 'Vizzano', 'saltos', 50.0, 129.95,
    ['preto'], [38],
    { stock: 1, heel: '10 cm', glyph: 'sandal', photos: ['assets/img/products/vizzano-salto-alto-preta.jpg'],
      material: 'Material sintético premium',
      description: 'Sandália meia-pata de salto alto e bico aberto, na cor preta. Assinatura Vizzano: elegante e surpreendentemente confortável para festas e eventos.' }),
  p('h02', 'Sandália Vizzano Salto Alto Caramelo', 'Vizzano', 'saltos', 59.95, 199.95,
    ['caramelo'], [35, 38],
    { stock: 2, heel: '12 cm', glyph: 'sandal', photos: ['assets/img/products/vizzano-salto-alto-caramelo.jpg'],
      material: 'Sintético premium com salto amadeirado',
      description: 'Sandália meia-pata caramelo com detalhe dourado estilo bambu e salto amadeirado. Um statement sofisticado da Vizzano.' }),
  p('h03', 'Sandália Mariotta Salto Fino Grafite', 'Mariotta', 'saltos', 109.95, 189.95,
    ['grafite'], [36, 39],
    { stock: 2, heel: '9 cm', glyph: 'sandal', photos: ['assets/img/products/mariotta-salto-fino-grafite.jpg'],
      material: 'Tecido com brilho metalizado e tira de strass',
      description: 'Sandália de salto fino grafite com brilho metalizado, tira de strass e amarração no tornozelo. Perfeita para ocasiões especiais.' }),

  // ---- Sandálias ---------------------------------------------------------
  p('s01', 'Sandália Flatform Vizzano Preta', 'Vizzano', 'sandalias', 149.95, 209.95,
    ['preto'], [35, 36, 37, 39],
    { stock: 4, heel: '6 cm', glyph: 'sandal', photos: ['assets/img/products/vizzano-flatform-preta.jpg'],
      material: 'Sintético com aviamentos metálicos',
      description: 'Sandália flatform preta com tiras e aplicações metálicas prateadas e fivela. O conforto do solado alto com muita atitude.' }),
  p('s02', 'Tamanco Vizzano Caramelo', 'Vizzano', 'sandalias', 64.95, 154.95,
    ['caramelo'], [34, 36, 39],
    { stock: 3, heel: '6 cm', glyph: 'sandal', photos: ['assets/img/products/vizzano-tamanco-caramelo.jpg'],
      material: 'Sintético com solado tratorado',
      description: 'Tamanco caramelo com tira em dedo e solado tratorado (flatform). Tendência e conforto para o verão.' }),

  // ---- Rasteiras ---------------------------------------------------------
  p('r01', 'Rasteira Mississipi Branca', 'Mississipi', 'rasteiras', 59.95, 109.95,
    ['branco'], [35, 36, 37],
    { stock: 3, glyph: 'sandal', photos: ['assets/img/products/mississipi-rasteira-branca.jpg'],
      material: 'Sintético macio com tira de pedraria',
      description: 'Rasteira branca com tirinhas e aplicação de pedraria no peito do pé. Delicada e confortável para o dia a dia.' }),
  p('r02', 'Rasteira Mississipi Preta', 'Mississipi', 'rasteiras', 59.95, 129.95,
    ['preto'], [35, 36, 38],
    { stock: 3, glyph: 'sandal', photos: ['assets/img/products/mississipi-rasteira-preta.jpg'],
      material: 'Verniz sintético',
      description: 'Rasteira preta em verniz com tiras finas cruzadas estilo gladiadora. Clássica e combina com tudo.' }),

  // ---- Infantil ----------------------------------------------------------
  p('k01', 'Tênis Ollie Space 2 Infantil Marinho', 'Ollie', 'infantil', 139.95, null,
    ['azul'], [31, 35],
    { stock: 2, photos: ['assets/img/products/ollie-space2-preto.jpg'],
      material: 'Sintético com solado leve',
      description: 'Tênis casual infantil azul-marinho com três listras brancas e solado branco. Estilo esportivo para o dia a dia das crianças.' }),
  p('k02', 'Tênis Ollie Space 2 Infantil Branco', 'Ollie', 'infantil', 139.95, null,
    ['branco'], [30, 32, 36],
    { stock: 3, photos: ['assets/img/products/ollie-space2-branco.jpg'],
      material: 'Sintético com solado leve',
      description: 'Tênis casual infantil branco com listras azul-marinho. Combina com o uniforme e com o look de passeio.' }),
  p('k03', 'Tênis Ollie Pro Max 3 Infantil Gelo', 'Ollie', 'infantil', 149.95, null,
    ['gelo'], [31, 32],
    { stock: 3, photos: ['assets/img/products/ollie-promax3-gelo.jpg'],
      material: 'Sintético com solado emborrachado',
      description: 'Tênis infantil estilo skate, branco e cinza, com solado robusto. Resistente para brincar à vontade.' }),
  p('k04', 'Sandália Sonic Infantil', 'Sonic', 'infantil', 99.95, 129.95,
    ['azul'], [29, 30, 32, 33],
    { stock: 3, glyph: 'sandal', photos: ['assets/img/products/sonic-sandalia-infantil.jpg'],
      material: 'Material emborrachado com fecho em velcro',
      description: 'Sandália infantil do Sonic azul-marinho com aplicação em relevo e fecho em velcro. Diversão e praticidade para calçar sozinho.' }),
  p('k05', 'Tênis Box Kids Preto e Vermelho', 'Box 200', 'infantil', 50.0, null,
    ['preto'], [29, 30, 31, 32, 33],
    { stock: 19, photos: ['assets/img/products/box-kids-preto-vermelho.jpg'],
      material: 'Cabedal têxtil com solado leve',
      description: 'Tênis esportivo infantil preto com solado vermelho e detalhe em laranja. Leve e confortável para as crianças correrem o dia todo. Promoção: leve 2 pares por R$ 80.' }),
  p('k06', 'Tênis Box Kids Azul e Rosa', 'Box 200', 'infantil', 50.0, null,
    ['azulbb'], [29, 30, 33],
    { stock: 3, photos: ['assets/img/products/box-kids-azul-rosa.jpg'],
      material: 'Cabedal têxtil com solado leve',
      description: 'Tênis esportivo infantil em degradê azul-bebê e rosa, com entressola branca. Leve, macio e cheio de charme.' }),
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

const discountOf = (p) => (p.oldPrice && p.oldPrice > p.price) ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
