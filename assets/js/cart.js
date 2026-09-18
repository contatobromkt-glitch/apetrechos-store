/* =========================================================================
   Sacola, revisão do pedido, cupom, frete e envio do pedido pelo WhatsApp
   ========================================================================= */

const Cart = {
  get coupon() { return Store.read(couponKey, null); },
  set coupon(value) { Store.write(couponKey, value); },
};

function shippingCost(subtotal) {
  if (subtotal === 0) return 0;
  return subtotal >= CONFIG.freeShipping ? 0 : 24.9;
}

/* Estado do frete calculado (back-end) e dos dados de entrega. Não persiste. */
const ShippingState = {
  cep: '', options: [], selected: null, loading: false, error: '',
  address: { name: '', phone: '', street: '', number: '', complement: '', district: '', city: '', uf: '' },
  addrCep: '',   // CEP que já preencheu rua/bairro/cidade (evita sobrescrever o que o cliente digitou)
  addrError: '',
  invalid: [],   // campos com erro
  cepWarning: '',
};
const hasCheckoutApi = () => !!(CONFIG.checkoutApi && CONFIG.checkoutApi.trim());
const escAttr = (s) => String(s == null ? '' : s)
  .replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/* Campos do endereço de entrega: [chave, rótulo, atributos extras, classe do grid, obrigatório]. */
const ADDR_FIELDS = [
  ['name', 'Nome completo', 'autocomplete="name" maxlength="120"', 'span-6', true],
  ['phone', 'Celular (WhatsApp)', 'type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(27) 99999-9999" maxlength="15"', 'span-6', true],
  ['street', 'Rua / Avenida', 'autocomplete="address-line1" maxlength="160"', 'span-6', true],
  ['number', 'Número', 'inputmode="numeric" autocomplete="off" maxlength="20"', 'span-2', true],
  ['complement', 'Complemento', 'autocomplete="address-line2" placeholder="Apto, bloco" maxlength="80"', 'span-4', false],
  ['district', 'Bairro', 'autocomplete="address-level3" maxlength="120"', 'span-6', true],
  ['city', 'Cidade', 'autocomplete="address-level2" maxlength="120"', 'span-4', true],
  ['uf', 'UF', 'autocomplete="address-level1" maxlength="2" style="text-transform:uppercase"', 'span-2', true],
];

function addressFormMarkup() {
  const a = ShippingState.address;
  return `
    <fieldset class="addr-form" aria-describedby="addr-error">
      <legend class="opt-label">Dados para entrega</legend>
      <div class="addr-grid">
        ${ADDR_FIELDS.map(([key, label, attrs, span, req]) => {
          const bad = ShippingState.invalid.includes(key);
          return `
          <div class="field ${span}${bad ? ' has-error' : ''}">
            <label for="addr-${key}">${label}${req ? '' : ' <span class="text-muted">(opcional)</span>'}</label>
            <input id="addr-${key}" data-addr="${key}" value="${escAttr(a[key])}" ${attrs}
                   ${req ? 'required aria-required="true"' : ''} ${bad ? 'aria-invalid="true"' : ''}>
          </div>`;
        }).join('')}
      </div>
      <p class="err" id="addr-error" role="alert" ${ShippingState.addrError ? '' : 'hidden'}>
        ${ShippingState.addrError ? `${icon('alert', 'icon icon-sm')} ${ShippingState.addrError}` : ''}
      </p>
    </fieldset>`;
}

function hideAddrError() {
  const el = document.getElementById('addr-error');
  if (el) { el.hidden = true; el.innerHTML = ''; }
}

function maskPhone(value) {
  const d = String(value).replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* Valida os dados de entrega. Devolve a lista de campos com problema. */
function validateAddress() {
  const a = ShippingState.address;
  const invalid = ADDR_FIELDS.filter(([key, , , , req]) => req && !String(a[key]).trim()).map(([key]) => key);
  const phoneDigits = a.phone.replace(/\D/g, '');
  if (a.phone && (phoneDigits.length < 10 || phoneDigits.length > 11) && !invalid.includes('phone')) invalid.push('phone');
  if (a.uf && !/^[A-Za-z]{2}$/.test(a.uf.trim()) && !invalid.includes('uf')) invalid.push('uf');
  return invalid;
}

/* Preenche rua/bairro/cidade/UF pelo CEP (ViaCEP). Só sobrescreve quando o CEP mudou. */
async function autofillAddress(cep) {
  ShippingState.cepWarning = '';
  if (!cep || cep === ShippingState.addrCep) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return;
    const d = await res.json();
    if (d.erro) {
      ShippingState.cepWarning = 'Não encontramos esse CEP nos Correios. Confira o número antes de pagar.';
      return;
    }
    Object.assign(ShippingState.address, {
      street: d.logradouro || '',
      district: d.bairro || '',
      city: d.localidade || '',
      uf: d.uf || '',
    });
    ShippingState.addrCep = cep;
  } catch { /* sem autopreenchimento: o cliente digita */ }
}

function totals() {
  const subtotal = Store.subtotal;
  const coupon = Cart.coupon;
  const discount = coupon && COUPONS[coupon] ? subtotal * COUPONS[coupon].off : 0;
  const afterDiscount = subtotal - discount;
  const freeAbove = afterDiscount >= CONFIG.freeShipping;

  let shipping;
  if (subtotal === 0 || freeAbove) shipping = 0;
  else if (ShippingState.selected) shipping = ShippingState.selected.price; // frete real escolhido
  else shipping = shippingCost(afterDiscount); // estimativa até o cliente calcular

  return { subtotal, discount, shipping, total: afterDiscount + shipping, coupon, freeAbove };
}

/* ------------------------------------------------------------------ Render */
function renderCartPage() {
  const layout = document.getElementById('cart-layout');
  const items = Store.detailed();
  const line = document.getElementById('cart-summary-line');

  if (!items.length) {
    line.textContent = '';
    layout.innerHTML = `
      <div class="panel" style="grid-column:1/-1">
        <div class="empty-state">
          ${icon('bag', 'icon icon-lg')}
          <h3>Sua sacola está vazia</h3>
          <p>Os pares mais procurados da semana esperam por você.</p>
          <a class="btn btn-ink btn-lg" href="categoria.html">Ver a vitrine</a>
        </div>
      </div>`;
    return;
  }

  const t = totals();
  const missing = Math.max(0, CONFIG.freeShipping - (t.subtotal - t.discount));
  const pct = Math.min(100, ((t.subtotal - t.discount) / CONFIG.freeShipping) * 100);
  line.textContent = `${Store.count} ${Store.count === 1 ? 'item' : 'itens'} na sacola`;

  layout.innerHTML = `
  <div>
    <div class="panel">
      <h2 class="panel-title">Itens do pedido</h2>
      ${items.map((l) => {
        const color = l.product.colors.find((c) => c.name === l.color) || l.product.colors[0];
        return `
        <div class="cart-line">
          <img src="${productImage(l.product, 0, { tint: color.hex })}" alt="" width="84" height="84" loading="lazy">
          <div>
            <span class="cart-line-brand">${l.product.brand}</span>
            <a class="cart-line-name" href="${productUrl(l.product.id)}">${l.product.name}</a>
            <div class="cart-line-meta">Tam. ${l.size} · ${l.color} · ${brl(l.product.price)} a unidade</div>
            <div class="cart-line-bottom">
              <div class="qty">
                <button type="button" data-qty-dec="${l.key}" aria-label="Diminuir quantidade de ${l.product.name}" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus', 'icon icon-sm')}</button>
                <output aria-label="Quantidade">${l.qty}</output>
                <button type="button" data-qty-inc="${l.key}" aria-label="Aumentar quantidade de ${l.product.name}">${icon('plus', 'icon icon-sm')}</button>
              </div>
              <span class="cart-line-price">${brl(l.lineTotal)}</span>
            </div>
            <button class="link-remove" type="button" data-remove="${l.key}"
                    aria-label="Remover ${l.product.name} da sacola">
              ${icon('trash', 'icon icon-sm')} Remover
            </button>
          </div>
        </div>`;
      }).join('')}
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:20px">
        <a class="btn btn-ghost" href="categoria.html">${icon('chevronLeft', 'icon icon-sm')} Continuar comprando</a>
        <button class="btn btn-ghost" type="button" id="clear-cart" style="color:var(--danger)">Esvaziar sacola</button>
      </div>
    </div>
  </div>

  <aside class="panel summary-panel" aria-label="Resumo do pedido">
    <h2 class="panel-title">Resumo</h2>

    <div class="ship-bar">
      <div class="ship-bar-text">${missing > 0
        ? `Faltam <b>${brl(missing)}</b> para o frete grátis`
        : `<span class="free">${icon('truck', 'icon icon-sm')} Frete grátis liberado</span>`}</div>
      <div class="ship-bar-track"><div class="ship-bar-fill" style="width:${pct}%"></div></div>
    </div>

    <div class="summary-row"><span>Subtotal (${Store.count} ${Store.count === 1 ? 'item' : 'itens'})</span><span>${brl(t.subtotal)}</span></div>
    ${t.discount ? `<div class="summary-row"><span>Cupom ${t.coupon}</span><span style="color:var(--success)">− ${brl(t.discount)}</span></div>` : ''}
    <div class="summary-row"><span>Frete${(ShippingState.selected && !t.freeAbove) ? ` · ${ShippingState.selected.label}` : ''}</span><span>${t.shipping === 0 ? '<span class="free">Grátis</span>' : brl(t.shipping)}</span></div>
    <div class="summary-row is-total"><span>Total</span><span>${brl(t.total)}</span></div>
    <p class="text-muted" style="font-size:var(--fs-xs);margin:6px 0 4px">${installmentText(t.total)}, ou Pix e boleto</p>

    ${hasCheckoutApi() ? `
    <div style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px">
      <span class="opt-label">Calcular frete e pagar online</span>
      <div class="coupon-row" style="margin-top:8px">
        <input id="ship-cep" inputmode="numeric" maxlength="9" placeholder="00000-000" value="${ShippingState.cep}"
               autocomplete="postal-code" aria-label="CEP de entrega"
               style="height:48px;padding:0 16px;border:1px solid var(--border-strong);border-radius:var(--r-md);background:var(--bg)">
        <button class="btn btn-outline" type="button" id="calc-frete" style="height:48px" ${ShippingState.loading ? 'disabled' : ''}>
          ${ShippingState.loading ? 'Calculando…' : 'Calcular'}
        </button>
      </div>
      ${ShippingState.error ? `<p class="err" role="alert" style="margin-top:8px">${icon('alert', 'icon icon-sm')} ${ShippingState.error}</p>` : ''}
      ${!ShippingState.error && ShippingState.cepWarning ? `<p class="err" role="status" style="margin-top:8px">${icon('alert', 'icon icon-sm')} ${ShippingState.cepWarning}</p>` : ''}
      ${ShippingState.options.length ? `
        <div role="radiogroup" aria-label="Opções de frete" style="display:flex;flex-direction:column;gap:6px;margin-top:12px">
          ${ShippingState.options.map((o) => `
            <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid ${ShippingState.selected && ShippingState.selected.serviceId === o.serviceId ? 'var(--primary)' : 'var(--border)'};border-radius:var(--r-md);cursor:pointer">
              <span style="display:flex;align-items:center;gap:9px;font-size:var(--fs-sm)">
                <input type="radio" name="ship-opt" value="${o.serviceId}" ${ShippingState.selected && ShippingState.selected.serviceId === o.serviceId ? 'checked' : ''} style="accent-color:var(--primary)">
                <span>${o.label}${o.days ? ` · ${o.days} ${o.days === 1 ? 'dia útil' : 'dias úteis'}` : ''}</span>
              </span>
              <b style="font-variant-numeric:tabular-nums">${t.freeAbove ? '<span class="free">Grátis</span>' : brl(o.price)}</b>
            </label>`).join('')}
        </div>` : ''}
      ${ShippingState.selected ? `
        ${addressFormMarkup()}
        <button class="btn btn-block btn-lg" type="button" id="pay-online" style="margin-top:12px">
          ${icon('card')} Pagar com PagBank
        </button>
        <p class="text-muted" style="font-size:var(--fs-xs);text-align:center;margin-top:6px">Pix, cartão ou boleto, em ambiente seguro do PagBank.</p>` : ''}
    </div>` : ''}

    <button class="btn btn-block btn-lg ${hasCheckoutApi() ? 'btn-outline' : ''}" type="button" id="checkout" style="margin-top:${hasCheckoutApi() ? '10' : '20'}px">
      ${icon('whatsapp')} Finalizar pelo WhatsApp
    </button>
    <p class="trust-row">${icon('shield', 'icon icon-sm')} Pedido conferido por uma pessoa antes do envio</p>
    <p class="text-muted" style="font-size:var(--fs-xs);text-align:center;margin-top:8px">
      Ao finalizar, você compartilha os dados do pedido conosco para processá-lo.
      Veja a <a href="${CONFIG.privacyUrl}" style="color:var(--primary);text-decoration:underline;text-underline-offset:2px">Política de Privacidade</a>.
    </p>
  </aside>`;
}

/* ------------------------------------------------------------------ Checkout */
function checkoutMessage() {
  const t = totals();
  const lines = Store.detailed().map(
    (l) => `• ${l.qty}x ${l.product.name} (${l.product.brand}), tam. ${l.size}, ${l.color}, ${brl(l.lineTotal)}`
  );
  return [
    `Olá! Quero finalizar meu pedido na ${CONFIG.brand} ${CONFIG.brandLine}:`,
    '',
    ...lines,
    '',
    `Subtotal: ${brl(t.subtotal)}`,
    t.discount ? `Cupom ${t.coupon}: -${brl(t.discount)}` : null,
    `Frete: ${t.shipping === 0 ? 'grátis' : brl(t.shipping)}`,
    `Total: ${brl(t.total)}`,
    ...addressLinesForMessage(),
  ].filter(Boolean).join('\n');
}

/* Se o cliente já preencheu o endereço na sacola, manda junto no WhatsApp. */
function addressLinesForMessage() {
  const a = ShippingState.address;
  if (!a.street.trim()) return [];
  return [
    '',
    'Entrega:',
    a.name.trim() || null,
    `${a.street.trim()}, ${a.number.trim() || 's/n'}${a.complement.trim() ? ` - ${a.complement.trim()}` : ''}`,
    [a.district.trim(), [a.city.trim(), a.uf.trim().toUpperCase()].filter(Boolean).join('/')].filter(Boolean).join(', '),
    ShippingState.cep ? `CEP ${ShippingState.cep}` : null,
  ];
}

/* ------------------------------------------------------------ Frete/pagamento */
const apiBase = () => CONFIG.checkoutApi.replace(/\/$/, '');

async function quoteShipping() {
  const input = document.getElementById('ship-cep');
  const cep = (input?.value || ShippingState.cep || '').replace(/\D/g, '');
  if (cep.length !== 8) {
    ShippingState.error = 'Digite um CEP com 8 dígitos.';
    renderCartPage();
    document.getElementById('ship-cep')?.focus();
    return;
  }
  ShippingState.cep = input.value;
  Object.assign(ShippingState, { loading: true, error: '', options: [], selected: null });
  renderCartPage();
  try {
    const items = Store.detailed().map((l) => ({ id: l.id, qty: l.qty }));
    const [res] = await Promise.all([
      fetch(`${apiBase()}/shipping/quote`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, items }),
      }),
      autofillAddress(cep), // em paralelo: já deixa rua/bairro/cidade prontos
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Não foi possível calcular o frete.');
    ShippingState.options = data.options || [];
    if (!ShippingState.options.length) ShippingState.error = 'Nenhuma opção de frete para esse CEP.';
    // Com uma opção só, já deixa escolhida (menos um clique).
    if (ShippingState.options.length === 1) ShippingState.selected = ShippingState.options[0];
  } catch (err) {
    ShippingState.error = err.message || 'Erro ao calcular o frete. Tente novamente.';
  } finally {
    ShippingState.loading = false;
    renderCartPage();
  }
}

async function payOnline(btn) {
  if (!ShippingState.selected) return;
  const cep = ShippingState.cep.replace(/\D/g, '');

  // Endereço completo é obrigatório: é com ele que a loja gera a etiqueta.
  const invalid = validateAddress();
  if (invalid.length) {
    ShippingState.invalid = invalid;
    ShippingState.addrError = invalid.length === 1 && invalid[0] === 'phone'
      ? 'Confira o celular: informe DDD + número.'
      : 'Preencha os campos destacados para enviarmos o seu pedido.';
    renderCartPage();
    document.getElementById(`addr-${invalid[0]}`)?.focus();
    return;
  }
  ShippingState.invalid = [];
  ShippingState.addrError = '';
  hideAddrError();

  const a = ShippingState.address;
  const customer = { name: a.name.trim(), phone: a.phone.trim() };
  const address = {
    street: a.street.trim(), number: a.number.trim(), complement: a.complement.trim(),
    district: a.district.trim(), city: a.city.trim(), uf: a.uf.trim().toUpperCase(),
  };

  btn.disabled = true;
  btn.innerHTML = `${icon('card')} Redirecionando…`;
  try {
    const items = Store.detailed().map((l) => ({ id: l.id, qty: l.qty, size: l.size, color: l.color }));
    const res = await fetch(`${apiBase()}/checkout`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, cep, shippingServiceId: ShippingState.selected.serviceId, customer, address }),
    });
    const data = await res.json();
    if (!res.ok || !data.payUrl) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
    window.location.href = data.payUrl; // vai para a tela segura do PagBank
  } catch (err) {
    toast(err.message || 'Erro ao iniciar o pagamento.', 'error');
    btn.disabled = false;
    btn.innerHTML = `${icon('card')} Pagar com PagBank`;
  }
}

/* ------------------------------------------------------------------ Eventos */
document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();

  document.addEventListener('page:refresh', renderCartPage);

  // Máscara do CEP (sem re-render, para não perder o foco ao digitar).
  document.addEventListener('input', (e) => {
    if (e.target.id === 'ship-cep') {
      const v = e.target.value.replace(/\D/g, '').slice(0, 8);
      e.target.value = v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v;
      ShippingState.cep = e.target.value;
      return;
    }
    // Dados de entrega: guarda no estado sem re-renderizar (não perde o foco).
    const key = e.target.dataset && e.target.dataset.addr;
    if (key) {
      if (key === 'phone') e.target.value = maskPhone(e.target.value);
      if (key === 'uf') e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
      ShippingState.address[key] = e.target.value;
      if (ShippingState.invalid.includes(key)) {
        ShippingState.invalid = ShippingState.invalid.filter((k) => k !== key);
        const field = e.target.closest('.field');
        field?.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
        if (!ShippingState.invalid.length) { ShippingState.addrError = ''; hideAddrError(); }
      }
    }
  });

  // Seleção da opção de frete.
  document.addEventListener('change', (e) => {
    if (e.target.name === 'ship-opt') {
      ShippingState.selected = ShippingState.options.find((o) => String(o.serviceId) === String(e.target.value)) || null;
      renderCartPage();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#clear-cart')) {
      if (confirm('Remover todos os itens da sacola?')) {
        Store.clear();
        Cart.coupon = null;
        toast('Sacola esvaziada');
      }
      return;
    }

    if (e.target.closest('#apply-coupon')) {
      const input = document.getElementById('coupon');
      const code = input.value.trim().toUpperCase();
      const msg = document.getElementById('coupon-msg');
      if (!COUPONS[code]) {
        msg.className = 'err';
        msg.style.marginTop = '8px';
        msg.innerHTML = `${icon('alert', 'icon icon-sm')} Cupom inválido ou expirado. Confira o código e tente de novo.`;
        input.focus();
        return;
      }
      Cart.coupon = code;
      toast(`Cupom ${code} aplicado, ${COUPONS[code].label}`);
      renderCartPage();
      return;
    }

    if (e.target.closest('#remove-coupon')) {
      Cart.coupon = null;
      renderCartPage();
      toast('Cupom removido');
      return;
    }

    if (e.target.closest('#calc-frete')) { quoteShipping(); return; }
    if (e.target.closest('#pay-online')) { payOnline(e.target.closest('#pay-online')); return; }

    if (e.target.closest('#checkout')) {
      if (!Store.count) return;
      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(checkoutMessage())}`;
      window.open(url, '_blank', 'noopener');
      toast('Abrimos o WhatsApp com o resumo do seu pedido');
    }
  });
});
