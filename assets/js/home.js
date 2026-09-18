/* =========================================================================
   Home, hero, categorias, vitrines e newsletter
   ========================================================================= */

const HERO = [
  {
    eyebrow: 'Bem-vinda à Apetrechos',
    title: 'O par certo <em>combina</em> com o seu dia',
    text: 'Calçados femininos, masculinos e infantis das marcas que você conhece, Vizzano, Pegada, Mississipi e mais. Conforto e estilo para a família toda.',
    ctaLabel: 'Ver a loja',
    ctaHref: 'categoria.html',
    altLabel: 'Ver saltos',
    altHref: 'categoria.html?c=saltos',
    productId: 'h02',
    tagKey: 'Vizzano',
    tagValue: 'salto alto & meia-pata',
  },
  {
    eyebrow: 'Para os pequenos',
    title: 'Do <em>recreio</em> ao passeio',
    text: 'Tênis e sandálias infantis leves e resistentes, do Sonic ao esportivo. Numeração do 25 ao 33.',
    ctaLabel: 'Ver infantil',
    ctaHref: 'categoria.html?c=infantil',
    altLabel: 'Ver sapatênis',
    altHref: 'categoria.html?c=sapatenis',
    productId: 'k06',
    tagKey: 'Infantil',
    tagValue: 'do 25 ao 33',
  },
  {
    eyebrow: 'Para eles',
    title: 'Sapatênis em <em>couro</em> legítimo',
    text: 'Pegada e Strike com acabamento em couro e solado confortável. Do trabalho ao fim de semana.',
    ctaLabel: 'Ver sapatênis',
    ctaHref: 'categoria.html?c=sapatenis',
    altLabel: 'Ver sapatênis',
    altHref: 'categoria.html?c=sapatenis',
    productId: 'sp02',
    tagKey: 'Pegada',
    tagValue: 'couro legítimo',
  },
];

const BENEFITS = [
  ['truck', 'Frete grátis', `Em compras acima de ${brl(CONFIG.freeShipping)}`],
  ['refresh', 'Troca fácil', '30 dias para trocar numeração'],
  ['card', `Até ${CONFIG.installments}x sem juros`, `Ou 10% off no PIX`],
  ['shield', 'Compra segura', 'Ambiente protegido e nota fiscal'],
];

/* ------------------------------------------------------------------ Hero */
function renderHero() {
  const slidesEl = document.getElementById('hero-slides');
  const dotsEl = document.getElementById('hero-dots');
  if (!slidesEl || !dotsEl) return; // o hero virou vídeo, não há carrossel

  slidesEl.innerHTML = HERO.map((s, i) => {
    const product = Catalog.byId(s.productId);
    return `
    <div class="hero-slide${i === 0 ? ' is-active' : ''}" role="tabpanel" id="hero-panel-${i}" aria-label="Destaque ${i + 1} de ${HERO.length}">
      <div>
        <p class="hero-eyebrow">${s.eyebrow}</p>
        ${i === 0 ? `<h1 class="hero-title">${s.title}</h1>` : `<h2 class="hero-title">${s.title}</h2>`}
        <p class="hero-text">${s.text}</p>
        <div class="hero-cta">
          <a class="btn btn-lg" href="${s.ctaHref}">${s.ctaLabel}</a>
          <a class="btn btn-outline btn-lg" href="${s.altHref}">${s.altLabel}</a>
        </div>
      </div>
      <div class="hero-art">
        <img src="${productImage(product, 0, { w: 900, h: 760 })}" alt="${product.name}" width="900" height="760" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
        <div class="hero-tagcard">
          <div class="k">${s.tagKey}</div>
          <div class="v">${s.tagValue}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  dotsEl.innerHTML = HERO.map((_, i) =>
    `<button class="hero-dot" type="button" role="tab" aria-controls="hero-panel-${i}"
       aria-current="${i === 0}" aria-label="Destaque ${i + 1}"></button>`).join('');

  const slides = [...slidesEl.children];
  const dots = [...dotsEl.children];
  let index = 0;
  let timer;

  const go = (next) => {
    slides[index].classList.remove('is-active');
    dots[index].setAttribute('aria-current', 'false');
    index = (next + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index].setAttribute('aria-current', 'true');
  };

  const autoplay = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 7000);
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); autoplay(); }));
  document.querySelector('.hero').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.hero').addEventListener('mouseleave', autoplay);
  autoplay();
}

/* ------------------------------------------------------------------ Blocos */
function renderBenefits() {
  document.getElementById('benefits').innerHTML = BENEFITS.map(([ic, title, text]) => `
    <div class="benefit">
      ${icon(ic)}
      <div><b>${title}</b><span>${text}</span></div>
    </div>`).join('');
}

function renderCategories() {
  const scroller = document.getElementById('cat-scroller');
  if (!scroller) return; // seção "Navegue por categoria" removida
  scroller.innerHTML = CATEGORIES.map((c) => `
    <a class="cat-tile" href="${categoryUrl(c.slug)}">
      <img src="${categoryImage(c)}" alt="" width="320" height="320" loading="lazy">
      <span>${c.name}</span>
    </a>`).join('');
}

function renderSizeShortcut() {
  document.getElementById('home-sizes').innerHTML = SIZE_RUN.map((s) =>
    `<a class="size-chip" href="categoria.html?size=${s}">${s}</a>`).join('');
}

function renderRails() {
  // Loja nova: sem "mais vendidos" reais ainda. Vitrine 1 = destaques adultos,
  // vitrine 2 = infantil.
  const destaques = ['h02', 'sp01', 'r01', 's01'].map((id) => Catalog.byId(id)).filter(Boolean);
  const kids = Catalog.byCategory('infantil').slice(0, 4);
  document.getElementById('rail-new').innerHTML = destaques.map((p) => productCard(p, { reveal: true })).join('');
  document.getElementById('rail-best').innerHTML = kids.map((p) => productCard(p, { reveal: true })).join('');
}

/* ------------------------------------------------------------------ Newsletter */
function bindNewsletter() {
  const form = document.getElementById('news-form');
  const field = document.getElementById('news-field');
  const input = document.getElementById('news-email');

  const showError = (msg) => {
    field.classList.add('has-error');
    let err = field.querySelector('.err');
    if (!err) {
      err = document.createElement('span');
      err.className = 'err';
      err.setAttribute('role', 'alert');
      field.appendChild(err);
    }
    err.innerHTML = `${icon('alert', 'icon icon-sm')} ${msg}`;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  };
  const clearError = () => {
    field.classList.remove('has-error');
    field.querySelector('.err')?.remove();
    input.removeAttribute('aria-invalid');
  };

  input.addEventListener('blur', () => {
    if (input.value && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value)) {
      showError('Confira o e-mail: parece faltar um trecho depois do @.');
    } else clearError();
  });
  input.addEventListener('input', clearError);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return showError('Informe um e-mail para receber o cupom.');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) return showError('Confira o e-mail: parece faltar um trecho depois do @.');
    clearError();
    form.innerHTML = `<p style="display:flex;gap:8px;align-items:center;color:var(--success);font-weight:600">
      ${icon('checkCircle')} Pronto! Use o cupom <b>PRIMEIRACOMPRA</b> na sacola.</p>`;
    toast('Cupom PRIMEIRACOMPRA liberado para você');
  });
}

/* ------------------------------------------------------------------ Init */
document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderBenefits();
  renderCategories();
  renderSizeShortcut();
  renderRails();
  bindNewsletter();
  syncBadges();
  bindReveal();
});
