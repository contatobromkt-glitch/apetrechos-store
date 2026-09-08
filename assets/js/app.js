/* =========================================================================
   Apetrechos Calçados — Runtime compartilhado
   Header, rodapé, sacola, favoritos, drawers, toasts e tema.
   ========================================================================= */

/* ------------------------------------------------------------------ Ícones
   Traço 1.6 / 24x24, família única (padrão Lucide). Nunca emoji. */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  user: '<path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  heart: '<path d="M19.5 12.6 12 20l-7.5-7.4a4.6 4.6 0 0 1 0-6.5 4.6 4.6 0 0 1 6.5 0l1 1 1-1a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.5Z"/>',
  bag: '<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  chevronLeft: '<path d="m15 6-6 6 6 6"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  star: '<path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.4 9.4l6-.8L12 3Z"/>',
  truck: '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 20v-4h4"/>',
  card: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/>',
  shield: '<path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M6 7l1 13h10l1-13"/>',
  check: '<path d="m5 13 4 4L19 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1"/>',
  whatsapp: '<path d="M3.5 20.5 5 16.4A8 8 0 1 1 8.1 19.4l-4.6 1.1Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.4 1-1v-.6l-1.8-.7-.8.9a5.6 5.6 0 0 1-2.5-2.5l.9-.8-.7-1.8H10c-.6 0-1 .4-1 1Z"/>',
  ruler: '<path d="M3.5 14.5 14.5 3.5 20.5 9.5 9.5 20.5Z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8.5v5M8.5 11h5"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8-9-9Z"/><circle cx="8" cy="8.5" r="1.4"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
};

function icon(name, cls = 'icon') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ------------------------------------------------------------------ Formatação */
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const installmentText = (v, n = CONFIG.installments) => `${n}x de ${brl(v / n)} sem juros`;
const productUrl = (id) => `produto.html?id=${id}`;
const categoryUrl = (slug) => `categoria.html?c=${slug}`;

/* ------------------------------------------------------------------ Estado */
const Store = {
  cartKey: 'apx.cart.v1',
  wishKey: 'apx.wish.v1',

  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ }
  },

  /* --- Sacola --- */
  get cart() { return this.read(this.cartKey, []); },
  set cart(items) { this.write(this.cartKey, items); this.emit(); },

  lineKey: (id, size, color) => `${id}|${size}|${color}`,

  add(product, size, color, qty = 1) {
    const items = this.cart;
    const key = this.lineKey(product.id, size, color);
    const found = items.find((i) => i.key === key);
    if (found) found.qty = Math.min(found.qty + qty, 10);
    else items.push({ key, id: product.id, size, color, qty });
    this.cart = items;
    return found ? 'updated' : 'added';
  },
  setQty(key, qty) {
    const items = this.cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i));
    this.cart = items;
  },
  remove(key) { this.cart = this.cart.filter((i) => i.key !== key); },
  clear() { this.cart = []; },

  detailed() {
    return this.cart
      .map((line) => {
        const product = Catalog.byId(line.id);
        return product ? { ...line, product, lineTotal: product.price * line.qty } : null;
      })
      .filter(Boolean);
  },
  get count() { return this.cart.reduce((n, i) => n + i.qty, 0); },
  get subtotal() { return this.detailed().reduce((s, i) => s + i.lineTotal, 0); },

  /* --- Favoritos --- */
  get wish() { return this.read(this.wishKey, []); },
  toggleWish(id) {
    const list = this.wish;
    const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    this.write(this.wishKey, next);
    this.emit();
    return next.includes(id);
  },
  isWished(id) { return this.wish.includes(id); },

  emit() { document.dispatchEvent(new CustomEvent('store:change')); },
};

/* Cupons de demonstração */
const COUPONS = { APETRECHOS10: { off: 0.1, label: '10% off' }, PRIMEIRACOMPRA: { off: 0.15, label: '15% off' } };
const couponKey = 'apx.coupon.v1';

/* ------------------------------------------------------------------ Toast */
function toast(message, kind = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  }
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `${icon(kind === 'success' ? 'checkCircle' : 'alert')}<span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, 3600);
}

/* ------------------------------------------------------------------ Tema */
const Theme = {
  key: 'apx.theme',
  get() { return localStorage.getItem(this.key) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); },
  apply(value) {
    document.documentElement.dataset.theme = value;
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.innerHTML = icon(value === 'dark' ? 'sun' : 'moon');
      btn.setAttribute('aria-label', value === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    });
  },
  toggle() { const next = this.get() === 'dark' ? 'light' : 'dark'; localStorage.setItem(this.key, next); this.apply(next); },
};

/* ------------------------------------------------------------------ Overlay / drawers */
const UI = {
  openDrawer(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    this.lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.removeAttribute('aria-hidden');
    document.getElementById('overlay').classList.add('is-open');
    document.body.classList.add('no-scroll');
    drawer.querySelector('button, a, input')?.focus();
  },
  closeDrawers() {
    document.querySelectorAll('.drawer.is-open').forEach((d) => {
      d.classList.remove('is-open');
      d.setAttribute('aria-hidden', 'true');
    });
    document.getElementById('overlay')?.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    this.lastFocus?.focus?.();
  },
};

/* ------------------------------------------------------------------ Card de produto */
function productCard(product, opts = {}) {
  const off = discountOf(product);
  const wished = Store.isWished(product.id);
  const badges = [];
  if (off >= 20) badges.push(`<span class="chip chip-sale">-${off}%</span>`);
  if (product.tags.includes('novidade')) badges.push('<span class="chip chip-new">Novidade</span>');
  if (product.stock <= 5) badges.push('<span class="chip chip-low">Últimas peças</span>');

  return `
  <article class="card${opts.reveal ? ' reveal' : ''}">
    <a class="card-media" href="${productUrl(product.id)}" aria-label="${product.name}">
      <img src="${productImage(product, 0)}" alt="${product.name} — ${product.colors[0].name}" width="600" height="720" loading="lazy" decoding="async">
      <img class="img-alt" src="${productImage(product, 1, { tint: (product.colors[1] || product.colors[0]).hex })}" alt="" aria-hidden="true" width="600" height="720" loading="lazy" decoding="async">
      <span class="card-badges">${badges.join('')}</span>
    </a>
    <button class="card-wish" type="button" data-wish="${product.id}" aria-pressed="${wished}"
            aria-label="${wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}: ${product.name}">
      ${icon('heart')}
    </button>
    <div class="card-quick">
      <a class="btn btn-ink btn-block" href="${productUrl(product.id)}">Escolher tamanho</a>
    </div>
    <div class="card-body">
      <span class="card-brand">${product.brand}</span>
      <a class="card-name" href="${productUrl(product.id)}">${product.name}</a>
      ${product.reviews > 0 ? `<span class="card-rating">${icon('star', 'icon')} ${product.rating.toFixed(1)}
        <span class="text-muted">(${product.reviews})</span></span>` : ''}
      <div class="card-prices">
        <span class="price-now">${brl(product.price)}</span>
        ${off > 0 ? `<span class="price-old">${brl(product.oldPrice)}</span>
        <span class="price-off">${off}% off</span>` : ''}
      </div>
      <span class="card-install">${installmentText(product.price)}</span>
      <div class="card-colors">
        ${product.colors.slice(0, 4).map((c) => `<span class="swatch-dot" style="background:${c.hex}" title="${c.name}"></span>`).join('')}
        <span>${product.colors.length} ${product.colors.length > 1 ? 'cores' : 'cor'}</span>
      </div>
    </div>
  </article>`;
}

/* ------------------------------------------------------------------ Header */
function renderHeader() {
  const current = document.body.dataset.page;
  const activeCat = new URLSearchParams(location.search).get('c');

  const navItems = CATEGORIES.map(
    (c) => `<li><a class="nav-link" href="${categoryUrl(c.slug)}"
      ${activeCat === c.slug ? 'aria-current="page"' : ''}>${c.name}</a></li>`
  ).join('');

  document.getElementById('header').innerHTML = `
  <div class="announce">
    <div class="container">
      <span class="announce-item">${icon('truck', 'icon icon-sm')} Frete grátis acima de ${brl(CONFIG.freeShipping)}</span>
      <span class="announce-item">${icon('card', 'icon icon-sm')} Até ${CONFIG.installments}x sem juros</span>
      <span class="announce-item">${icon('refresh', 'icon icon-sm')} 30 dias para trocar</span>
    </div>
  </div>
  <div class="site-header">
    <div class="container">
      <div class="header-main">
        <button class="icon-btn menu-toggle" type="button" data-open-drawer="drawer-menu" aria-label="Abrir menu de categorias">
          ${icon('menu')}
        </button>
        <a class="logo" href="index.html" aria-label="${CONFIG.brand} ${CONFIG.brandLine} — início">
          <img class="logo-img on-light" src="assets/img/logo-light.png" alt="${CONFIG.brand} ${CONFIG.brandLine}" width="983" height="470">
          <img class="logo-img on-dark" src="assets/img/logo-trans.png" alt="${CONFIG.brand} ${CONFIG.brandLine}" width="983" height="470" aria-hidden="true">
        </a>
        <div class="search">
          <form class="search-field" role="search" id="search-form">
            ${icon('search', 'icon icon-sm')}
            <input type="search" id="search-input" placeholder="Buscar por modelo, marca ou tamanho"
                   aria-label="Buscar produtos" autocomplete="off">
          </form>
          <div class="search-panel" id="search-panel" hidden role="listbox" aria-label="Sugestões"></div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" type="button" data-theme-toggle></button>
          <button class="icon-btn" type="button" data-open-drawer="drawer-wish" aria-label="Meus favoritos" id="wish-btn">
            ${icon('heart')}<span class="badge-count" id="wish-count" hidden>0</span>
          </button>
          <button class="icon-btn" type="button" data-open-drawer="drawer-cart" aria-label="Abrir sacola">
            ${icon('bag')}<span class="badge-count" id="cart-count" hidden>0</span>
          </button>
        </div>
      </div>
    </div>
    <nav class="nav-bar" aria-label="Categorias">
      <div class="container">
        <ul class="nav-list">
          ${navItems}
        </ul>
      </div>
    </nav>
  </div>`;

  // Drawer de menu (mobile) + drawer da sacola + overlay
  document.getElementById('drawers').innerHTML = `
  <div class="overlay" id="overlay"></div>

  <aside class="drawer drawer-left" id="drawer-menu" aria-hidden="true" aria-label="Categorias">
    <div class="drawer-head">
      <span class="drawer-title">Categorias</span>
      <button class="icon-btn" type="button" data-close-drawer aria-label="Fechar menu">${icon('close')}</button>
    </div>
    <div class="drawer-body">
      ${CATEGORIES.map((c) => `<a class="mobile-nav-link" href="${categoryUrl(c.slug)}">${c.name}${icon('chevronRight', 'icon icon-sm')}</a>`).join('')}
    </div>
  </aside>

  <aside class="drawer drawer-right" id="drawer-wish" aria-hidden="true" aria-label="Meus favoritos">
    <div class="drawer-head">
      <span class="drawer-title">Meus favoritos</span>
      <button class="icon-btn" type="button" data-close-drawer aria-label="Fechar favoritos">${icon('close')}</button>
    </div>
    <div class="drawer-body" id="wish-drawer-body"></div>
  </aside>

  <aside class="drawer drawer-right" id="drawer-cart" aria-hidden="true" aria-label="Sacola de compras">
    <div class="drawer-head">
      <span class="drawer-title">Sua sacola</span>
      <button class="icon-btn" type="button" data-close-drawer aria-label="Fechar sacola">${icon('close')}</button>
    </div>
    <div class="drawer-body" id="cart-drawer-body"></div>
    <div class="drawer-foot" id="cart-drawer-foot"></div>
  </aside>`;

  if (current) {
    document.querySelectorAll(`.nav-link[href="${current}"]`).forEach((l) => l.setAttribute('aria-current', 'page'));
  }
}

/* ------------------------------------------------------------------ Rodapé */
function renderFooter() {
  const wa = `https://wa.me/${CONFIG.whatsapp}`;
  const waAsk = (q) => `${wa}?text=${encodeURIComponent(q)}`;
  const ajuda = [
    ['Trocas e devoluções', waAsk('Olá! Tenho uma dúvida sobre trocas e devoluções.')],
    ['Prazos de entrega', waAsk('Olá! Queria saber sobre o prazo de entrega.')],
    ['Formas de pagamento', waAsk('Olá! Quais são as formas de pagamento?')],
    ['Ajuda com a numeração', waAsk('Olá! Preciso de ajuda para escolher a numeração.')],
  ];
  const loja = [
    ['Instagram @loja.apetrechos', CONFIG.instagram],
    ['Política de Privacidade', CONFIG.privacyUrl],
    ['Seus direitos (LGPD)', `${CONFIG.privacyUrl}#direitos`],
    ['Fale no WhatsApp', wa],
  ];
  const linkList = (arr) => arr.map(([t, h]) =>
    `<li><a href="${h}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${t}</a></li>`).join('');
  document.getElementById('footer').innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <img src="assets/img/logo-trans.png" alt="${CONFIG.brand} ${CONFIG.brandLine}" width="983" height="470" style="height:56px;width:auto">
          <p style="margin-top:16px">${CONFIG.tagline}. Calçados femininos, masculinos e infantis das melhores marcas, com entrega para todo o Brasil e atendimento humano no WhatsApp.</p>
          <div class="footer-social">
            <a href="${CONFIG.instagram}" target="_blank" rel="noopener" aria-label="Instagram da loja">${icon('instagram')}</a>
            <a href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp da loja">${icon('whatsapp')}</a>
          </div>
          <div class="footer-pay">
            ${['PIX', 'VISA', 'MASTER', 'ELO', 'AMEX', 'BOLETO'].map((p) => `<span class="pay-chip">${p}</span>`).join('')}
          </div>
        </div>
        <div class="footer-col">
          <h3>Comprar</h3>
          <ul>${CATEGORIES.map((c) => `<li><a href="${categoryUrl(c.slug)}">${c.name}</a></li>`).join('')}</ul>
        </div>
        <div class="footer-col">
          <h3>Ajuda</h3>
          <ul>${linkList(ajuda)}</ul>
        </div>
        <div class="footer-col">
          <h3>A loja</h3>
          <ul>${linkList(loja)}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${CONFIG.brand} ${CONFIG.brandLine}.${CONFIG.cnpj ? ` CNPJ ${CONFIG.cnpj}.` : ''}</span>
        <span class="footer-legal">
          <a href="${CONFIG.privacyUrl}">Política de Privacidade</a>
          <span aria-hidden="true">·</span>
          <a href="${CONFIG.privacyUrl}#direitos">Seus direitos (LGPD)</a>
        </span>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="${wa}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${icon('whatsapp', 'icon icon-lg')}</a>`;
}

/* ------------------------------------------------------------------ LGPD: aviso */
function renderConsentNotice() {
  if (localStorage.getItem('apx.consent') === '1') return;
  const bar = document.createElement('div');
  bar.className = 'consent-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Aviso de privacidade');
  bar.innerHTML = `
    <p>Usamos armazenamento local do seu navegador só para funções essenciais
       (sacola, favoritos e tema). Seus dados são tratados conforme a
       <a href="${CONFIG.privacyUrl}">Política de Privacidade</a> (LGPD).</p>
    <button class="btn" type="button" id="consent-ok">Entendi</button>`;
  document.body.appendChild(bar);
  requestAnimationFrame(() => bar.classList.add('is-in'));
  bar.querySelector('#consent-ok').addEventListener('click', () => {
    try { localStorage.setItem('apx.consent', '1'); } catch { /* modo privado */ }
    bar.classList.remove('is-in');
    bar.addEventListener('transitionend', () => bar.remove(), { once: true });
  });
}

/* ------------------------------------------------------------------ Sacola: drawer */
function renderCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const foot = document.getElementById('cart-drawer-foot');
  if (!body) return;

  const items = Store.detailed();
  if (!items.length) {
    body.innerHTML = `
      <div class="empty-state">
        ${icon('bag', 'icon icon-lg')}
        <h3>Sua sacola está vazia</h3>
        <p>Que tal começar pelos modelos mais vendidos da semana?</p>
        <a class="btn btn-ink" href="categoria.html">Ver a vitrine</a>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = items.map((line) => {
    const color = line.product.colors.find((c) => c.name === line.color) || line.product.colors[0];
    return `
    <div class="cart-line">
      <img src="${productImage(line.product, 0, { tint: color.hex })}" alt="" width="76" height="92" loading="lazy">
      <div>
        <span class="cart-line-brand">${line.product.brand}</span>
        <a class="cart-line-name" href="${productUrl(line.product.id)}">${line.product.name}</a>
        <div class="cart-line-meta">Tam. ${line.size} · ${line.color}</div>
        <div class="cart-line-bottom">
          <div class="qty">
            <button type="button" data-qty-dec="${line.key}" aria-label="Diminuir quantidade" ${line.qty <= 1 ? 'disabled' : ''}>${icon('minus', 'icon icon-sm')}</button>
            <output aria-label="Quantidade">${line.qty}</output>
            <button type="button" data-qty-inc="${line.key}" aria-label="Aumentar quantidade">${icon('plus', 'icon icon-sm')}</button>
          </div>
          <span class="cart-line-price">${brl(line.lineTotal)}</span>
        </div>
        <button class="link-remove" type="button" data-remove="${line.key}"
                aria-label="Remover ${line.product.name} da sacola">
          ${icon('trash', 'icon icon-sm')} Remover
        </button>
      </div>
    </div>`;
  }).join('');

  const subtotal = Store.subtotal;
  const missing = Math.max(0, CONFIG.freeShipping - subtotal);
  const pct = Math.min(100, (subtotal / CONFIG.freeShipping) * 100);

  foot.innerHTML = `
    <div class="ship-bar">
      <div class="ship-bar-text">${missing > 0
        ? `Faltam <b>${brl(missing)}</b> para o frete grátis`
        : `<span class="free">Frete grátis liberado</span>`}</div>
      <div class="ship-bar-track"><div class="ship-bar-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="summary-row is-total"><span>Subtotal</span><span>${brl(subtotal)}</span></div>
    <p class="text-muted" style="font-size:var(--fs-xs);margin-bottom:12px">${installmentText(subtotal)}</p>
    <a class="btn btn-block btn-lg" href="sacola.html">Fechar pedido</a>
    <button class="btn btn-ghost btn-block" type="button" data-close-drawer style="margin-top:8px">Continuar comprando</button>`;
}

/* ------------------------------------------------------------------ Favoritos: drawer */
function renderWishDrawer() {
  const body = document.getElementById('wish-drawer-body');
  if (!body) return;
  const items = Store.wish.map((id) => Catalog.byId(id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = `
      <div class="empty-state">
        ${icon('heart', 'icon icon-lg')}
        <h3>Sua lista de favoritos está vazia</h3>
        <p>Toque no coração dos produtos que você amar para guardá-los aqui.</p>
        <a class="btn btn-ink" href="categoria.html">Explorar a vitrine</a>
      </div>`;
    return;
  }
  body.innerHTML = items.map((product) => `
    <div class="cart-line">
      <a href="${productUrl(product.id)}" aria-label="${product.name}"><img src="${productImage(product, 0)}" alt="${product.name}" width="76" height="92" loading="lazy"></a>
      <div>
        <span class="cart-line-brand">${product.brand}</span>
        <a class="cart-line-name" href="${productUrl(product.id)}">${product.name}</a>
        <div class="cart-line-bottom"><span class="cart-line-price">${brl(product.price)}</span></div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px">
          <a class="btn btn-ink" href="${productUrl(product.id)}" style="padding:8px 14px;font-size:var(--fs-xs)">Ver produto</a>
          <button class="link-remove" type="button" data-wish="${product.id}"
                  aria-label="Remover ${product.name} dos favoritos">${icon('trash', 'icon icon-sm')} Remover</button>
        </div>
      </div>
    </div>`).join('');
}

function syncBadges() {
  const cartCount = Store.count;
  const wishCount = Store.wish.length;
  const cartEl = document.getElementById('cart-count');
  const wishEl = document.getElementById('wish-count');
  if (cartEl) { cartEl.textContent = cartCount; cartEl.hidden = cartCount === 0; }
  if (wishEl) { wishEl.textContent = wishCount; wishEl.hidden = wishCount === 0; }
  document.querySelectorAll('[data-wish]').forEach((btn) => {
    const on = Store.isWished(btn.dataset.wish);
    btn.setAttribute('aria-pressed', String(on));
  });
}

/* ------------------------------------------------------------------ Busca */
function bindSearch() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-panel');
  if (!form) return;

  let timer;
  const close = () => { panel.hidden = true; };

  const run = () => {
    const q = input.value.trim();
    if (q.length < 2) return close();
    const results = Catalog.search(q).slice(0, 6);
    panel.hidden = false;
    panel.innerHTML = results.length
      ? results.map((p) => `
        <a class="search-row" href="${productUrl(p.id)}" role="option">
          <img src="${productImage(p, 0)}" alt="" width="44" height="52">
          <span>
            <span class="sr-name">${p.name}</span><br>
            <span class="sr-meta">${p.brand} · ${brl(p.price)}</span>
          </span>
        </a>`).join('')
      : `<p class="search-empty">Nada encontrado para “${q}”. Tente “Vizzano”, “tênis” ou “infantil”.</p>`;
  };

  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 180); });
  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) run(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) location.href = `categoria.html?q=${encodeURIComponent(q)}`;
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ------------------------------------------------------------------ Reveal on scroll */
function bindReveal() {
  const items = document.querySelectorAll('.reveal:not(.is-in)');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('is-in'), Math.min(i * 40, 200));
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ Boot */
function boot() {
  Theme.apply(Theme.get());
  renderHeader();
  renderFooter();
  Theme.apply(Theme.get()); // reaplica nos botões recém-criados
  renderCartDrawer();
  renderWishDrawer();
  syncBadges();
  bindSearch();
  renderConsentNotice();

  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-drawer]');
    if (open) { UI.openDrawer(open.dataset.openDrawer); return; }
    if (e.target.closest('[data-close-drawer]') || e.target.id === 'overlay') { UI.closeDrawers(); return; }
    if (e.target.closest('[data-theme-toggle]')) { Theme.toggle(); return; }

    const wish = e.target.closest('[data-wish]');
    if (wish) {
      const on = Store.toggleWish(wish.dataset.wish);
      toast(on ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
      return;
    }
    const inc = e.target.closest('[data-qty-inc]');
    if (inc) { const l = Store.cart.find((i) => i.key === inc.dataset.qtyInc); Store.setQty(l.key, l.qty + 1); return; }
    const dec = e.target.closest('[data-qty-dec]');
    if (dec) { const l = Store.cart.find((i) => i.key === dec.dataset.qtyDec); Store.setQty(l.key, l.qty - 1); return; }
    const rm = e.target.closest('[data-remove]');
    if (rm) { Store.remove(rm.dataset.remove); toast('Item removido da sacola'); return; }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') UI.closeDrawers(); });

  document.addEventListener('store:change', () => {
    renderCartDrawer();
    renderWishDrawer();
    syncBadges();
    document.dispatchEvent(new CustomEvent('page:refresh'));
  });

  bindReveal();
}

document.addEventListener('DOMContentLoaded', boot);
