/* =========================================================================
   Apetrechos Calçados — Imagery
   Gera as imagens de produto como SVG inline (data URI). Enquanto a loja não
   tem banco de fotos, isso mantém a vitrine consistente e 100% offline.
   Para trocar por fotos reais: dar a cada produto um campo `photos: []` e
   usar essa lista em vez de productImage().
   ========================================================================= */

/* Silhuetas em viewBox 0 0 200 120, apoiadas na linha do chão y = 102. */
const GLYPHS = {
  sneaker: `
    <path d="M20,86 C20,70 30,60 46,54 L88,38 C96,35 104,38 108,45 L118,64
             C124,74 136,80 152,82 L172,85 C182,86 186,90 186,94 L186,96
             C186,100 182,102 176,102 L34,102 C25,102 20,96 20,88 Z"/>
    <path class="ln" d="M21,92 L186,92"/>
    <path class="ln" d="M20,86 C24,74 33,66 45,60"/>
    <path class="ln" d="M56,63 L72,52"/>
    <path class="ln" d="M64,71 L82,59"/>
    <path class="ln" d="M73,79 L92,67"/>
    <path class="ln" d="M108,45 C114,52 116,60 116,68"/>`,

  boot: `
    <path d="M54,16 L114,16 L110,66 C109,74 114,79 124,81 L164,89
             C176,91 182,95 182,101 L58,101 C50,101 46,97 46,90 L46,22
             C46,18 49,16 54,16 Z"/>
    <path class="ln" d="M47,34 L112,34"/>
    <path class="ln" d="M110,66 C104,72 92,74 78,73"/>
    <path class="ln" d="M58,101 L182,101"/>
    <path class="ln" d="M150,101 L150,88"/>`,

  sandal: `
    <path d="M28,88 C26,96 32,101 44,101 L162,101 C176,101 182,95 180,88
             C178,82 168,79 156,79 L44,79 C34,79 29,83 28,88 Z"/>
    <path class="ln" d="M62,79 C64,58 80,48 100,48 C120,48 134,58 136,79"/>
    <path class="ln" d="M74,79 C76,64 86,58 100,58 C114,58 124,64 126,79"/>
    <path class="ln" d="M100,48 C100,39 106,34 116,34"/>
    <path class="ln" d="M148,101 L146,116 L166,116 L167,101"/>`,

  flat: `
    <path d="M26,88 C26,74 42,67 66,65 L122,60 C148,58 168,67 176,79
             C182,88 176,97 160,98 L48,101 C34,101 26,96 26,88 Z"/>
    <path class="ln" d="M58,73 C74,65 98,62 116,66"/>
    <path class="ln" d="M27,92 C60,98 120,98 176,90"/>
    <path class="ln" d="M140,63 C148,68 152,74 152,80"/>`,
};

/**
 * Devolve um data URI SVG com a "foto" do produto.
 * @param {object} product   item do catálogo
 * @param {number} variant   0 = frente, 1 = alternativa (usada no hover)
 * @param {object} opts      { w, h, tint }
 */
/* Fundos pastel da marca (blush, lilás, azul dusty) — dão coesão ao grid
   com a identidade pink+azul, independente da cor do calçado. */
const BRAND_BGS = [
  ['#FFF0F8', '#FBD9EC'], // blush
  ['#F3ECFA', '#E4D3F1'], // lilás
  ['#EAF2F5', '#D5E6EC'], // azul dusty claro
  ['#FFF4EF', '#FBE0D6'], // pêssego suave
  ['#FDECF4', '#F6CFE6'], // rosa
  ['#EEF3F3', '#DCEAE6'], // menta acinzentada
];
function pickBrandBg(idStr) {
  let h = 0;
  for (let i = 0; i < idStr.length; i++) h = (h * 31 + idStr.charCodeAt(i)) >>> 0;
  return BRAND_BGS[h % BRAND_BGS.length];
}

function productImage(product, variant = 0, opts = {}) {
  // Fotos reais têm prioridade sobre o SVG gerado. `photos` é um array de
  // caminhos; variant 1 (hover/2ª imagem) cai na 1ª foto se não houver outra.
  if (product.photos && product.photos.length) {
    return product.photos[variant] || product.photos[0];
  }
  const w = opts.w || 600;
  const h = opts.h || 720;
  const [c1, c2] = opts.bg || pickBrandBg(product.id);
  const tint = opts.tint || product.colors[0].hex;
  const glyph = GLYPHS[product.glyph] || GLYPHS.sneaker;
  const angle = variant === 1 ? -9 : -2;
  const scale = variant === 1 ? 1.06 : 1.16;
  const id = `${product.id}${variant}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="gl${id}" cx="0.5" cy="0.38" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="${variant === 1 ? 0.5 : 0.72}"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sh${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#4a2f42" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#4a2f42" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg${id})"/>
  <circle cx="${w * 0.5}" cy="${h * 0.4}" r="${w * 0.44}" fill="url(#gl${id})"/>
  <ellipse cx="${w * 0.5}" cy="${h * 0.68}" rx="${w * 0.34}" ry="${h * 0.055}" fill="url(#sh${id})"/>
  <g transform="translate(${w * 0.5} ${h * 0.46}) rotate(${angle}) scale(${((w / 200) * scale * 0.78).toFixed(3)}) translate(-100 -60)"
     fill="${tint}" fill-opacity="0.92" stroke="${tint}" stroke-width="2.2"
     stroke-linecap="round" stroke-linejoin="round">
    <style>.ln{fill:none;stroke:${shade(tint, 0.55)};stroke-width:2.4;opacity:.75}</style>
    ${glyph}
  </g>
</svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}

/** Clareia (amount > 0) ou escurece um hex em direção ao branco/preto. */
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * amount);
  return '#' + [mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Miniatura circular usada nos atalhos de categoria da home. */
function categoryImage(category, size = 320) {
  const [c1, c2] = pickBrandBg(category.slug);
  const glyph = GLYPHS[category.glyph];
  const tint = '#C71585';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs><linearGradient id="c${category.slug}" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="${size}" height="${size}" fill="url(#c${category.slug})"/>
  <g transform="translate(${size * 0.5} ${size * 0.52}) rotate(-4) scale(${(size / 200) * 0.72}) translate(-100 -60)"
     fill="${tint}" fill-opacity="0.88" stroke="${tint}" stroke-width="2.2"
     stroke-linecap="round" stroke-linejoin="round">
    <style>.ln{fill:none;stroke:${shade(tint, 0.62)};stroke-width:2.4;opacity:.8}</style>
    ${glyph}
  </g>
</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s+/g, ' '));
}
