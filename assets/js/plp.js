/* =========================================================================
   PLP, vitrine com filtros, ordenação e paginação incremental
   ========================================================================= */

const PAGE_SIZE = 8;
const [PRICE_MIN, PRICE_MAX] = Catalog.priceRange();

const State = {
  categories: [],
  sizes: [],
  colors: [],
  brands: [],
  maxPrice: PRICE_MAX,
  saleOnly: false,
  tag: null,
  q: '',
  sort: 'relevance',
  shown: PAGE_SIZE,
};

/* ------------------------------------------------------------------ URL */
function readUrl() {
  const q = new URLSearchParams(location.search);
  const list = (k) => (q.get(k) ? q.get(k).split(',').filter(Boolean) : []);
  State.categories = q.get('c') ? [q.get('c')] : list('cats');
  State.sizes = list('size').map(Number);
  State.colors = list('color');
  State.brands = list('brand');
  State.maxPrice = q.get('max') ? Number(q.get('max')) : PRICE_MAX;
  State.saleOnly = q.get('sale') === '1';
  State.tag = q.get('tag');
  State.q = q.get('q') || '';
  State.sort = q.get('sort') || 'relevance';
}

function writeUrl() {
  const q = new URLSearchParams();
  if (State.categories.length === 1) q.set('c', State.categories[0]);
  else if (State.categories.length) q.set('cats', State.categories.join(','));
  if (State.sizes.length) q.set('size', State.sizes.join(','));
  if (State.colors.length) q.set('color', State.colors.join(','));
  if (State.brands.length) q.set('brand', State.brands.join(','));
  if (State.maxPrice < PRICE_MAX) q.set('max', String(State.maxPrice));
  if (State.saleOnly) q.set('sale', '1');
  if (State.tag) q.set('tag', State.tag);
  if (State.q) q.set('q', State.q);
  if (State.sort !== 'relevance') q.set('sort', State.sort);
  const url = q.toString() ? `?${q}` : location.pathname;
  history.replaceState(null, '', url);
}

/* ------------------------------------------------------------------ Filtro */
function applyFilters() {
  let list = Catalog.all();

  if (State.q) list = Catalog.search(State.q);
  if (State.tag) list = list.filter((p) => p.tags.includes(State.tag));
  if (State.categories.length) list = list.filter((p) => State.categories.includes(p.category));
  if (State.sizes.length) list = list.filter((p) => p.sizes.some((s) => State.sizes.includes(s)));
  if (State.colors.length) list = list.filter((p) => p.colors.some((c) => State.colors.includes(c.name)));
  if (State.brands.length) list = list.filter((p) => State.brands.includes(p.brand));
  if (State.saleOnly) list = list.filter((p) => discountOf(p) >= 25);
  list = list.filter((p) => p.price <= State.maxPrice);

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    discount: (a, b) => discountOf(b) - discountOf(a),
    rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    relevance: (a, b) => b.tags.length - a.tags.length || b.reviews - a.reviews,
  };
  return [...list].sort(sorters[State.sort] || sorters.relevance);
}

/* Contagens usadas nos rótulos das facetas (ignoram a própria faceta). */
function countFor(predicate) {
  return Catalog.all().filter(predicate).length;
}

/* ------------------------------------------------------------------ Filtros: markup */
function filtersMarkup(idPrefix) {
  const allColors = [...new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.name)))]
    .map((name) => PRODUCTS.flatMap((p) => p.colors).find((c) => c.name === name));

  return `
  <details class="filter-group" open>
    <summary>Categoria ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      ${CATEGORIES.map((c) => `
        <label class="check">
          <input type="checkbox" data-f="cat" value="${c.slug}" ${State.categories.includes(c.slug) ? 'checked' : ''}>
          <span>${c.name}</span>
          <span class="n">${countFor((p) => p.category === c.slug)}</span>
        </label>`).join('')}
    </div>
  </details>

  <details class="filter-group" open>
    <summary>Numeração ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      <div class="size-grid">
        ${SIZE_RUN.map((s) => `
          <button class="size-chip" type="button" data-f="size" value="${s}"
                  aria-pressed="${State.sizes.includes(s)}">${s}</button>`).join('')}
      </div>
    </div>
  </details>

  <details class="filter-group" open>
    <summary>Cor ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      <div class="swatch-row">
        ${allColors.map((c) => `
          <button class="swatch" type="button" data-f="color" value="${c.name}"
                  style="background:${c.hex}" aria-pressed="${State.colors.includes(c.name)}"
                  aria-label="Cor ${c.name}" title="${c.name}"></button>`).join('')}
      </div>
    </div>
  </details>

  <details class="filter-group" open>
    <summary>Marca ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      ${BRANDS.map((b) => `
        <label class="check">
          <input type="checkbox" data-f="brand" value="${b}" ${State.brands.includes(b) ? 'checked' : ''}>
          <span>${b}</span>
          <span class="n">${countFor((p) => p.brand === b)}</span>
        </label>`).join('')}
    </div>
  </details>

  <details class="filter-group" open>
    <summary>Preço ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      <div class="range-row">
        <span>${brl(PRICE_MIN)}</span>
        <input type="range" id="${idPrefix}-price" min="${PRICE_MIN}" max="${PRICE_MAX}" step="10"
               value="${State.maxPrice}" data-f="price" aria-label="Preço máximo">
        <span id="${idPrefix}-price-out">${brl(State.maxPrice)}</span>
      </div>
    </div>
  </details>

  <details class="filter-group" open>
    <summary>Ofertas ${icon('chevronDown', 'icon icon-sm')}</summary>
    <div class="filter-body">
      <label class="check">
        <input type="checkbox" data-f="sale" ${State.saleOnly ? 'checked' : ''}>
        <span>Somente 25% off ou mais</span>
        <span class="n">${countFor((p) => discountOf(p) >= 25)}</span>
      </label>
    </div>
  </details>

  <button class="btn btn-ghost btn-block" type="button" data-f="clear" style="margin-top:16px">Limpar filtros</button>`;
}

/* ------------------------------------------------------------------ Render */
function renderFilters() {
  document.getElementById('filters-desktop').innerHTML = filtersMarkup('d');
  const mobileBody = document.getElementById('filters-mobile');
  if (mobileBody) mobileBody.innerHTML = filtersMarkup('m');
}

function renderHeadings(total) {
  const cat = State.categories.length === 1 ? CATEGORIES.find((c) => c.slug === State.categories[0]) : null;
  let title = 'Vitrine completa';
  if (State.q) title = `Resultados para “${State.q}”`;
  else if (State.tag === 'novidade') title = 'Novidades da estação';
  else if (State.tag === 'bestseller') title = 'Os mais vendidos';
  else if (State.saleOnly) title = 'Outlet';
  else if (cat) title = cat.name;

  document.getElementById('plp-title').textContent = title;
  document.getElementById('plp-count').textContent =
    `${total} ${total === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
  document.title = `${title}, Apetrechos Calçados`;

  document.getElementById('breadcrumb').innerHTML = `
    <a href="index.html">Início</a>${icon('chevronRight')}
    <a href="categoria.html">Calçados</a>${cat ? `${icon('chevronRight')}<span aria-current="page">${cat.name}</span>` : ''}`;
}

function renderActiveFilters() {
  const tags = [];
  State.categories.forEach((c) =>
    tags.push([CATEGORIES.find((x) => x.slug === c).name, 'cat', c]));
  State.sizes.forEach((s) => tags.push([`Tam. ${s}`, 'size', s]));
  State.colors.forEach((c) => tags.push([c, 'color', c]));
  State.brands.forEach((b) => tags.push([b, 'brand', b]));
  if (State.saleOnly) tags.push(['25% off ou mais', 'sale', '1']);
  if (State.maxPrice < PRICE_MAX) tags.push([`Até ${brl(State.maxPrice)}`, 'price', '']);
  if (State.q) tags.push([`Busca: ${State.q}`, 'q', '']);
  if (State.tag) tags.push([State.tag === 'novidade' ? 'Novidades' : 'Mais vendidos', 'tag', '']);

  const el = document.getElementById('active-filters');
  el.innerHTML = tags.length
    ? tags.map(([label, kind, value]) => `
        <span class="tag-filter">${label}
          <button type="button" data-remove-filter="${kind}" data-value="${value}"
                  aria-label="Remover filtro ${label}">${icon('close', 'icon icon-sm')}</button>
        </span>`).join('') +
      `<button class="tag-filter tag-plain" type="button" data-f="clear">Limpar tudo</button>`
    : '';
}

function renderGrid() {
  const list = applyFilters();
  renderHeadings(list.length);
  renderActiveFilters();

  const grid = document.getElementById('plp-grid');
  const more = document.getElementById('plp-more');

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        ${icon('search', 'icon icon-lg')}
        <h3>Nenhum par com essa combinação</h3>
        <p>Tente soltar um filtro, a numeração e a cor costumam ser as mais restritivas.</p>
        <button class="btn btn-ink" type="button" data-f="clear">Limpar filtros</button>
      </div>`;
    more.innerHTML = '';
    return;
  }

  const visible = list.slice(0, State.shown);
  grid.innerHTML = visible.map((p) => productCard(p, { reveal: true })).join('');
  more.innerHTML = list.length > State.shown
    ? `<button class="btn btn-outline btn-lg" type="button" id="load-more">
         Carregar mais (${list.length - State.shown} restantes)</button>`
    : `<p class="text-muted" style="font-size:var(--fs-sm)">Você viu todos os ${list.length} produtos.</p>`;

  syncBadges();
  bindReveal();
}

function update({ resetPage = true } = {}) {
  if (resetPage) State.shown = PAGE_SIZE;
  writeUrl();
  renderGrid();
}

/* ------------------------------------------------------------------ Eventos */
function bindFilterEvents() {
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.f === 'cat') {
      State.categories = el.checked
        ? [...State.categories, el.value]
        : State.categories.filter((c) => c !== el.value);
      syncMirrors('cat', el.value, el.checked);
      update();
    }
    if (el.dataset.f === 'brand') {
      State.brands = el.checked ? [...State.brands, el.value] : State.brands.filter((b) => b !== el.value);
      syncMirrors('brand', el.value, el.checked);
      update();
    }
    if (el.dataset.f === 'sale') {
      State.saleOnly = el.checked;
      document.querySelectorAll('[data-f="sale"]').forEach((i) => (i.checked = el.checked));
      update();
    }
    if (el.id === 'sort') { State.sort = el.value; update(); }
  });

  document.addEventListener('input', (e) => {
    if (e.target.dataset.f !== 'price') return;
    State.maxPrice = Number(e.target.value);
    document.querySelectorAll('[id$="-price-out"]').forEach((o) => (o.textContent = brl(State.maxPrice)));
    document.querySelectorAll('[data-f="price"]').forEach((r) => (r.value = State.maxPrice));
    clearTimeout(window.__priceTimer);
    window.__priceTimer = setTimeout(() => update(), 220);
  });

  document.addEventListener('click', (e) => {
    const size = e.target.closest('[data-f="size"]');
    if (size) {
      const v = Number(size.value);
      const on = !State.sizes.includes(v);
      State.sizes = on ? [...State.sizes, v] : State.sizes.filter((s) => s !== v);
      document.querySelectorAll(`[data-f="size"][value="${v}"]`).forEach((b) => b.setAttribute('aria-pressed', String(on)));
      update();
      return;
    }
    const color = e.target.closest('[data-f="color"]');
    if (color) {
      const v = color.value;
      const on = !State.colors.includes(v);
      State.colors = on ? [...State.colors, v] : State.colors.filter((c) => c !== v);
      document.querySelectorAll(`[data-f="color"][value="${v}"]`).forEach((b) => b.setAttribute('aria-pressed', String(on)));
      update();
      return;
    }
    if (e.target.closest('[data-f="clear"]')) {
      Object.assign(State, { categories: [], sizes: [], colors: [], brands: [], maxPrice: PRICE_MAX, saleOnly: false, tag: null, q: '' });
      renderFilters();
      update();
      return;
    }
    const rm = e.target.closest('[data-remove-filter]');
    if (rm) {
      const { removeFilter: kind, value } = rm.dataset;
      if (kind === 'cat') State.categories = State.categories.filter((c) => c !== value);
      if (kind === 'size') State.sizes = State.sizes.filter((s) => s !== Number(value));
      if (kind === 'color') State.colors = State.colors.filter((c) => c !== value);
      if (kind === 'brand') State.brands = State.brands.filter((b) => b !== value);
      if (kind === 'sale') State.saleOnly = false;
      if (kind === 'price') State.maxPrice = PRICE_MAX;
      if (kind === 'q') State.q = '';
      if (kind === 'tag') State.tag = null;
      renderFilters();
      update();
      return;
    }
    if (e.target.id === 'load-more') {
      State.shown += PAGE_SIZE;
      update({ resetPage: false });
      document.getElementById('load-more')?.focus();
    }
  });
}

/* Mantém os dois painéis de filtro (desktop + drawer) em sincronia. */
function syncMirrors(kind, value, checked) {
  document.querySelectorAll(`[data-f="${kind}"][value="${CSS.escape(value)}"]`)
    .forEach((input) => { input.checked = checked; });
}

/* ------------------------------------------------------------------ Init */
document.addEventListener('DOMContentLoaded', () => {
  // Drawer de filtros para telas pequenas
  document.getElementById('drawers').insertAdjacentHTML('beforeend', `
    <aside class="drawer drawer-right" id="drawer-filters" aria-hidden="true" aria-label="Filtros">
      <div class="drawer-head">
        <span class="drawer-title">Filtrar</span>
        <button class="icon-btn" type="button" data-close-drawer aria-label="Fechar filtros">${icon('close')}</button>
      </div>
      <div class="drawer-body" id="filters-mobile"></div>
      <div class="drawer-foot">
        <button class="btn btn-block btn-lg" type="button" data-close-drawer>Ver resultados</button>
      </div>
    </aside>`);

  readUrl();
  document.getElementById('sort').value = State.sort;
  renderFilters();
  bindFilterEvents();
  renderGrid();
});
