/* =========================================================================
   PDP — galeria, seleção de cor/numeração, frete e adição à sacola
   ========================================================================= */

const PDP = { product: null, color: null, size: null, image: 0 };

/* Simula ruptura de estoque: dois números do meio ficam indisponíveis
   quando o produto está com poucas peças. */
function unavailableSizes(product) {
  if (product.stock > 6) return [];
  return product.sizes.slice(1, 3);
}

function starsMarkup(rating) {
  return `<span class="stars" aria-hidden="true">${[1, 2, 3, 4, 5]
    .map((i) => icon('star', `icon icon-sm${i <= Math.round(rating) ? '' : ' off'}`))
    .join('')}</span>`;
}

/* ------------------------------------------------------------------ Render */
function renderPdp() {
  const p = PDP.product;
  const off = discountOf(p);
  const gone = unavailableSizes(p);
  const wished = Store.isWished(p.id);
  const pixPrice = p.price * (1 - CONFIG.pixDiscount);

  document.title = `${p.name} — ${p.brand} | Apetrechos Calçados`;
  document.getElementById('breadcrumb').innerHTML = `
    <a href="index.html">Início</a>${icon('chevronRight')}
    <a href="${categoryUrl(p.category)}">${p.categoryName}</a>${icon('chevronRight')}
    <span aria-current="page">${p.name}</span>`;

  const images = [0, 1, 2].map((i) => productImage(p, i % 2, { tint: PDP.color.hex }));

  document.getElementById('pdp').innerHTML = `
  <div class="gallery">
    <div class="gallery-thumbs" role="tablist" aria-label="Imagens do produto">
      ${images.map((src, i) => `
        <button class="gallery-thumb" type="button" role="tab" data-thumb="${i}"
                aria-current="${i === PDP.image}" aria-label="Ver imagem ${i + 1}">
          <img src="${src}" alt="" width="78" height="94">
        </button>`).join('')}
    </div>
    <div class="gallery-main" id="gallery-main">
      <img src="${images[PDP.image]}" alt="${p.name} na cor ${PDP.color.name}" width="600" height="720" fetchpriority="high">
      <span class="gallery-zoom-hint">${icon('zoom', 'icon icon-sm')} Clique para ampliar</span>
    </div>
  </div>

  <div>
    <p class="pdp-brand">${p.brand}</p>
    <h1 class="pdp-title">${p.name}</h1>
    <p class="pdp-rating">
      ${starsMarkup(p.rating)}
      <span>${p.rating.toFixed(1)} · ${p.reviews} avaliações</span>
    </p>

    <div class="pdp-price">
      <div class="card-prices">
        <span class="price-now">${brl(p.price)}</span>
        <span class="price-old">${brl(p.oldPrice)}</span>
        <span class="price-off">${off}% off</span>
      </div>
      <p class="card-install" style="margin-top:4px">${installmentText(p.price)}</p>
      <span class="pdp-pix">${icon('tag', 'icon icon-sm')} ${brl(pixPrice)} no PIX (10% off)</span>
    </div>

    <div class="opt-block">
      <div class="opt-head">
        <span class="opt-label">Cor: <span id="color-name">${PDP.color.name}</span></span>
      </div>
      <div class="swatch-row">
        ${p.colors.map((c) => `
          <button class="swatch" type="button" data-color="${c.name}" style="background:${c.hex}"
                  aria-pressed="${c.name === PDP.color.name}" aria-label="Cor ${c.name}" title="${c.name}"></button>`).join('')}
      </div>
    </div>

    <div class="opt-block">
      <div class="opt-head">
        <span class="opt-label">Numeração ${PDP.size ? `<span>· selecionado ${PDP.size}</span>` : ''}</span>
        <a class="link-underline" href="#guia" data-guide>${icon('ruler', 'icon icon-sm')} Guia de tamanhos</a>
      </div>
      <div class="size-picker" role="group" aria-label="Escolha a numeração">
        ${p.sizes.map((s) => `
          <button class="size-chip" type="button" data-size="${s}"
                  aria-pressed="${PDP.size === s}" ${gone.includes(s) ? 'disabled aria-label="Tamanho ' + s + ' esgotado"' : ''}>${s}</button>`).join('')}
      </div>
      <p class="err" id="size-error" role="alert" hidden style="margin-top:8px"></p>
    </div>

    <div class="pdp-actions">
      <button class="btn btn-lg" type="button" id="add-to-cart">${icon('bag')} Adicionar à sacola</button>
      <button class="wish-big" type="button" data-wish="${p.id}" aria-pressed="${wished}"
              aria-label="${wished ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${icon('heart')}</button>
    </div>

    <p class="stock-note ${p.stock <= 5 ? 'low' : ''}">
      ${icon(p.stock <= 5 ? 'alert' : 'checkCircle', 'icon icon-sm')}
      ${p.stock <= 5 ? `Só restam ${p.stock} pares em estoque` : 'Pronta entrega · sai em até 24h úteis'}
    </p>

    <div class="cep-box">
      <label class="opt-label" for="cep">Calcular frete e prazo</label>
      <div class="coupon-row" style="margin-top:8px">
        <input id="cep" inputmode="numeric" maxlength="9" placeholder="00000-000"
               autocomplete="postal-code" aria-describedby="cep-hint"
               style="height:48px;padding:0 16px;border:1px solid var(--border-strong);border-radius:var(--r-md);background:var(--bg)">
        <button class="btn btn-outline" type="button" id="cep-btn">Calcular</button>
      </div>
      <p class="hint" id="cep-hint" style="font-size:var(--fs-xs);color:var(--fg-muted);margin-top:6px">
        Frete grátis para pedidos acima de ${brl(CONFIG.freeShipping)}.
      </p>
      <div class="cep-result" id="cep-result"></div>
    </div>

    <div class="accordion">
      <details open>
        <summary>Descrição ${icon('chevronDown', 'icon icon-sm')}</summary>
        <div class="acc-body">${p.description}</div>
      </details>
      <details>
        <summary>Especificações ${icon('chevronDown', 'icon icon-sm')}</summary>
        <div class="acc-body">
          <dl class="spec-list">
            <div><dt>Categoria</dt><dd>${p.categoryName}</dd></div>
            <div><dt>Material</dt><dd>${p.material}</dd></div>
            ${p.heelHeight ? `<div><dt>Altura do salto</dt><dd>${p.heelHeight}</dd></div>` : ''}
            <div><dt>Numeração</dt><dd>${p.sizes[0]} ao ${p.sizes[p.sizes.length - 1]}</dd></div>
            <div><dt>Cores</dt><dd>${p.colors.map((c) => c.name).join(', ')}</dd></div>
            <div><dt>Garantia</dt><dd>90 dias contra defeito de fabricação</dd></div>
          </dl>
        </div>
      </details>
      <details id="guia">
        <summary>Guia de tamanhos ${icon('chevronDown', 'icon icon-sm')}</summary>
        <div class="acc-body">
          <dl class="spec-list">
            ${SIZE_RUN.map((s) => `<div><dt>Tam. ${s}</dt><dd>${(21.5 + (s - 33) * 0.7).toFixed(1)} cm de palmilha</dd></div>`).join('')}
          </dl>
          <p style="margin-top:12px">Meça o pé descalço, do calcanhar ao dedo mais longo, no fim do dia. Na dúvida entre dois números, prefira o maior.</p>
        </div>
      </details>
      <details>
        <summary>Trocas e devoluções ${icon('chevronDown', 'icon icon-sm')}</summary>
        <div class="acc-body">
          Primeira troca de numeração é gratuita. Você tem 30 dias corridos a partir do recebimento
          para solicitar troca ou devolução, com o produto sem sinais de uso e na embalagem original.
        </div>
      </details>
    </div>
  </div>`;

  document.getElementById('related').innerHTML =
    Catalog.related(p, 4).map((x) => productCard(x, { reveal: true })).join('');

  syncBadges();
  bindReveal();
}

/* ------------------------------------------------------------------ Eventos */
function bindPdp() {
  document.addEventListener('click', (e) => {
    const color = e.target.closest('[data-color]');
    if (color) {
      PDP.color = PDP.product.colors.find((c) => c.name === color.dataset.color);
      PDP.image = 0;
      renderPdp();
      return;
    }

    const size = e.target.closest('[data-size]');
    if (size && !size.disabled) {
      PDP.size = Number(size.dataset.size);
      document.querySelectorAll('[data-size]').forEach((b) =>
        b.setAttribute('aria-pressed', String(Number(b.dataset.size) === PDP.size)));
      document.getElementById('size-error').hidden = true;
      return;
    }

    const thumb = e.target.closest('[data-thumb]');
    if (thumb) {
      PDP.image = Number(thumb.dataset.thumb);
      renderPdp();
      return;
    }

    if (e.target.closest('#gallery-main')) {
      document.getElementById('gallery-main').classList.toggle('zoomed');
      return;
    }

    if (e.target.closest('[data-guide]')) {
      const guide = document.getElementById('guia');
      guide.open = true;
      guide.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (e.target.closest('#add-to-cart')) {
      if (!PDP.size) {
        const err = document.getElementById('size-error');
        err.hidden = false;
        err.innerHTML = `${icon('alert', 'icon icon-sm')} Escolha uma numeração para continuar.`;
        document.querySelector('[data-size]:not([disabled])')?.focus();
        return;
      }
      const btn = e.target.closest('#add-to-cart');
      btn.disabled = true;
      btn.innerHTML = `${icon('check')} Adicionando...`;
      setTimeout(() => {
        Store.add(PDP.product, PDP.size, PDP.color.name);
        toast(`${PDP.product.name} (tam. ${PDP.size}) foi para a sacola`);
        UI.openDrawer('drawer-cart');
        btn.disabled = false;
        btn.innerHTML = `${icon('bag')} Adicionar à sacola`;
      }, 420);
      return;
    }

    if (e.target.closest('#cep-btn')) {
      const input = document.getElementById('cep');
      const raw = input.value.replace(/\D/g, '');
      const out = document.getElementById('cep-result');
      if (raw.length !== 8) {
        out.innerHTML = `<p class="err" role="alert">${icon('alert', 'icon icon-sm')} Digite um CEP com 8 dígitos.</p>`;
        input.focus();
        return;
      }
      // Estimativa local — trocar por integração com a transportadora.
      const base = Number(raw.slice(0, 1));
      const days = 2 + base;
      const price = PDP.product.price >= CONFIG.freeShipping ? 0 : 18.9 + base * 2.4;
      const prazo = (d) => `${d} ${d === 1 ? 'dia útil' : 'dias úteis'}`;
      const fast = Math.max(1, days - 1);
      out.innerHTML = `
        <div><span>Econômica</span><b>${price === 0 ? 'Grátis' : brl(price)} · até ${prazo(days + 3)}</b></div>
        <div><span>Expressa</span><b>${brl(price + 22.9)} · até ${prazo(fast)}</b></div>`;
    }
  });

  document.getElementById('cep')?.addEventListener('input', (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 8);
    e.target.value = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
  });
}

/* ------------------------------------------------------------------ Init */
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id');
  const product = Catalog.byId(id) || Catalog.all()[0];

  PDP.product = product;
  PDP.color = product.colors[0];

  renderPdp();
  bindPdp();
});
