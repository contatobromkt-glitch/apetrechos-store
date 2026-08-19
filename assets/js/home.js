/* =========================================================================
   Home — hero, categorias, vitrines e newsletter
   ========================================================================= */

const HERO = [
  {
    eyebrow: 'Coleção alto verão',
    title: 'O par certo <em>muda</em> o dia inteiro',
    text: 'Modelagens testadas em uso real, numeração do 33 ao 40 e troca gratuita em 30 dias. Estilo que não cobra pedágio em conforto.',
    ctaLabel: 'Ver a coleção',
    ctaHref: 'categoria.html',
    altLabel: 'Novidades',
    altHref: 'categoria.html?tag=novidade',
    productId: 's01',
    tagKey: 'Salto bloco',
    tagValue: 'a partir de R$ 149',
  },
  {
    eyebrow: 'Couro legítimo',
    title: 'Botas que <em>duram</em> mais de uma estação',
    text: 'Cano estruturado, solado costurado e forro que respira. A peça que resolve o inverno inteiro do guarda-roupa.',
    ctaLabel: 'Ver botas',
    ctaHref: 'categoria.html?c=botas',
    altLabel: 'Guia de tamanhos',
    altHref: '#',
    productId: 'b01',
    tagKey: 'Mais vendida',
    tagValue: '173 avaliações',
  },
  {
    eyebrow: 'Outlet',
    title: 'Últimos pares com até <em>40%</em> off',
    text: 'Coleções anteriores com a mesma curadoria de sempre. Enquanto durar a numeração disponível.',
    ctaLabel: 'Aproveitar o outlet',
    ctaHref: 'categoria.html?sale=1',
    altLabel: 'Ver tênis',
    altHref: 'categoria.html?c=tenis',
    productId: 't04',
    tagKey: 'Frete grátis',
    tagValue: 'acima de R$ 249',
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
  document.getElementById('cat-scroller').innerHTML = CATEGORIES.map((c) => `
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
  const news = Catalog.byTag('novidade').slice(0, 4);
  const best = Catalog.byTag('bestseller').slice(0, 4);
  document.getElementById('rail-new').innerHTML = news.map((p) => productCard(p, { reveal: true })).join('');
  document.getElementById('rail-best').innerHTML = best.map((p) => productCard(p, { reveal: true })).join('');
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
