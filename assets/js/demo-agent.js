/* =========================================================================
   Apetrechos Calçados — DEMONSTRAÇÃO do atendente de WhatsApp
   -------------------------------------------------------------------------
   Widget de demonstracao (sem back-end, sem chave, sem numero conectado).
   Simula, dentro do proprio site, como sera a conversa com o agente de
   atendimento oficial (WhatsApp Cloud API + Claude). As respostas usam os
   PRODUTOS E PRECOS REAIS do catalogo da loja (data.js), no mesmo tom do
   system prompt do agente: acolhedor, uma pergunta de cada vez, conduzindo
   para a venda e sem inventar dado que nao tem.

   Ao ir para producao, este arquivo pode ser removido — quem responde passa
   a ser o back-end de verdade (pasta apetrechos-whatsapp-agent).
   ========================================================================= */
(function () {
  'use strict';

  // ---- Helpers seguros (reusa os do site, com fallback) -------------------
  const cfg = (typeof CONFIG !== 'undefined') ? CONFIG : { pixDiscount: 0.1, installments: 10, freeShipping: 249.9 };
  const money =
    (typeof brl === 'function')
      ? brl
      : (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pixOf = (v) => money(v * (1 - (cfg.pixDiscount || 0.1)));
  const parcela = (v) => money(v / (cfg.installments || 10));

  function catBySlug(slug) {
    if (typeof Catalog !== 'undefined') return Catalog.byCategory(slug);
    return (typeof PRODUCTS !== 'undefined') ? PRODUCTS.filter((p) => p.category === slug) : [];
  }
  function allProducts() {
    return (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
  }

  const now = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // ---- Estilos (aparencia de WhatsApp) ------------------------------------
  const CSS = `
  .apx-chat, .apx-chat * { box-sizing: border-box; }
  .apx-chat {
    position: fixed; right: 16px; bottom: 84px; z-index: 1200;
    width: 380px; max-width: calc(100vw - 24px);
    height: 580px; max-height: calc(100vh - 120px);
    display: flex; flex-direction: column; overflow: hidden;
    border-radius: 16px; background: #ECE5DD;
    box-shadow: 0 18px 50px rgba(0,0,0,.28), 0 4px 14px rgba(0,0,0,.18);
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    opacity: 0; transform: translateY(14px) scale(.98); pointer-events: none;
    transition: opacity .22s ease, transform .22s ease;
  }
  .apx-chat.is-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

  /* Cabecalho estilo WhatsApp */
  .apx-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    background: #075E54; color: #fff; flex: 0 0 auto; }
  .apx-avatar { width: 40px; height: 40px; border-radius: 50%; flex: 0 0 auto;
    display: grid; place-items: center; background: #FF66C4; color: #fff;
    font-family: 'Poppins', system-ui, sans-serif; font-size: 20px; font-weight: 600; }
  .apx-id { line-height: 1.15; min-width: 0; flex: 1; }
  .apx-id b { display: block; font-size: 15px; font-weight: 600; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; }
  .apx-status { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #D9F2EA; }
  .apx-status i { width: 7px; height: 7px; border-radius: 50%; background: #4ADE80;
    box-shadow: 0 0 0 0 rgba(74,222,128,.7); animation: apxPulse 2s infinite; }
  @keyframes apxPulse { 0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)} 70%{box-shadow:0 0 0 6px rgba(74,222,128,0)} 100%{box-shadow:0 0 0 0 rgba(74,222,128,0)} }
  .apx-x { margin-left: auto; background: transparent; border: 0; color: #fff; cursor: pointer;
    width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-size: 20px; }
  .apx-x:hover { background: rgba(255,255,255,.15); }

  /* Corpo com "papel de parede" do WhatsApp */
  .apx-body { flex: 1 1 auto; overflow-y: auto; padding: 14px 12px 6px;
    background-color: #ECE5DD;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg fill='%23d9cfc4' fill-opacity='.28'%3E%3Ccircle cx='6' cy='6' r='1.4'/%3E%3Ccircle cx='26' cy='18' r='1.4'/%3E%3Ccircle cx='14' cy='30' r='1.4'/%3E%3C/g%3E%3C/svg%3E");
    scroll-behavior: smooth; }
  .apx-day { text-align: center; margin: 2px auto 12px; }
  .apx-day span { background: #D6E7F5; color: #47606E; font-size: 11px; font-weight: 600;
    letter-spacing: .04em; padding: 4px 12px; border-radius: 8px; text-transform: uppercase; }

  .apx-msg { max-width: 82%; margin: 6px 0; padding: 7px 10px 6px; border-radius: 10px;
    font-size: 14px; line-height: 1.42; color: #1F2C34; position: relative;
    box-shadow: 0 1px .5px rgba(0,0,0,.13); white-space: normal; word-wrap: break-word;
    animation: apxIn .18s ease; }
  @keyframes apxIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  .apx-msg.in  { background: #fff; border-top-left-radius: 3px; margin-right: auto; }
  .apx-msg.out { background: #DCF8C6; border-top-right-radius: 3px; margin-left: auto; }
  .apx-msg strong { font-weight: 600; }
  .apx-msg em { color: #556; font-style: italic; }
  .apx-time { display: block; text-align: right; font-size: 10.5px; color: #8a9aa2; margin-top: 3px; }
  .apx-msg.out .apx-time::after { content: " ✓✓"; color: #34B7F1; letter-spacing: -1px; }

  /* Indicador "digitando..." */
  .apx-typing { display: inline-flex; gap: 4px; padding: 11px 12px; }
  .apx-typing i { width: 7px; height: 7px; border-radius: 50%; background: #9aa6ac; animation: apxBlink 1.2s infinite; }
  .apx-typing i:nth-child(2){ animation-delay: .2s; } .apx-typing i:nth-child(3){ animation-delay: .4s; }
  @keyframes apxBlink { 0%,60%,100%{ opacity:.3; transform: translateY(0);} 30%{ opacity:1; transform: translateY(-3px);} }

  /* Sugestoes rapidas (chips) */
  .apx-chips { display: flex; flex-wrap: wrap; gap: 7px; justify-content: flex-end;
    padding: 4px 2px 8px; }
  .apx-chip { background: #fff; color: #075E54; border: 1px solid #b8d8d0; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 600; padding: 7px 12px; border-radius: 999px;
    box-shadow: 0 1px 2px rgba(0,0,0,.08); transition: background .15s, transform .1s; }
  .apx-chip:hover { background: #E7F5F0; } .apx-chip:active { transform: scale(.97); }

  /* Barra de digitacao */
  .apx-input { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; padding: 9px 10px;
    background: #F0F0F0; }
  .apx-input input { flex: 1; border: 0; outline: 0; background: #fff; border-radius: 999px;
    padding: 11px 14px; font: inherit; font-size: 14px; color: #1F2C34; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
  .apx-send { flex: 0 0 auto; width: 44px; height: 44px; border-radius: 50%; border: 0; cursor: pointer;
    background: #075E54; color: #fff; display: grid; place-items: center; transition: background .15s, transform .1s; }
  .apx-send:hover { background: #0a7d6f; } .apx-send:active { transform: scale(.94); }
  .apx-send svg { width: 20px; height: 20px; }

  /* Balãozinho de convite ao lado do botao */
  .apx-nudge { position: fixed; right: 80px; bottom: 26px; z-index: 1150; max-width: 220px;
    background: #fff; color: #1F2C34; font-family: 'Inter', system-ui, sans-serif; font-size: 13px;
    line-height: 1.35; padding: 10px 12px; border-radius: 12px 12px 2px 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,.18); opacity: 0; transform: translateY(6px);
    transition: opacity .3s, transform .3s; pointer-events: none; }
  .apx-nudge.show { opacity: 1; transform: translateY(0); }
  .apx-nudge b { color: #075E54; }
  .apx-badge { position: fixed; right: 12px; bottom: 62px; z-index: 1150;
    background: #C71585; color: #fff; font: 700 10px/1 'Mulish', sans-serif; letter-spacing: .05em;
    padding: 4px 7px; border-radius: 999px; text-transform: uppercase; box-shadow: 0 4px 10px rgba(0,0,0,.2);
    pointer-events: none; }

  /* Realca o botao flutuante existente (ponto verde de "online") */
  .wa-float { position: relative; }
  .wa-float::after { content: ""; position: absolute; top: 2px; right: 2px; width: 12px; height: 12px;
    border-radius: 50%; background: #4ADE80; border: 2px solid #fff; }

  @media (max-width: 480px) {
    .apx-chat { right: 0; bottom: 0; width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
    .apx-nudge { right: 76px; max-width: 190px; }
  }

  /* Tema escuro do site -> chat estilo WhatsApp dark */
  :root[data-theme="dark"] .apx-chat { background: #0B141A; }
  :root[data-theme="dark"] .apx-head { background: #1F2C34; }
  :root[data-theme="dark"] .apx-body { background-color: #0B141A; }
  :root[data-theme="dark"] .apx-msg.in  { background: #202C33; color: #E9EDEF; }
  :root[data-theme="dark"] .apx-msg.out { background: #005C4B; color: #E9EDEF; }
  :root[data-theme="dark"] .apx-msg em { color: #9fb0b8; }
  :root[data-theme="dark"] .apx-input { background: #1F2C34; }
  :root[data-theme="dark"] .apx-input input { background: #2A3942; color: #E9EDEF; }
  :root[data-theme="dark"] .apx-chip { background: #202C33; color: #7fd8c6; border-color: #2A3942; }
  :root[data-theme="dark"] .apx-day span { background: #182229; color: #8aa0ab; }
  :root[data-theme="dark"] .apx-nudge { background: #202C33; color: #E9EDEF; }
  `;

  // ---- Marcacao simples do WhatsApp: *negrito* _italico_ \n --------------
  function fmt(text) {
    const esc = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc
      .replace(/\*(.+?)\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  // ---- Estado da conversa -------------------------------------------------
  const ctx = { started: false, lastCategory: null, lastProducts: [] };

  // ---- Base de respostas do agente (fluxo de atendimento) -----------------
  const CAT_KEYS = {
    tenis: ['tenis', 'tênis', 'tenies'],
    botas: ['bota', 'botas', 'coturno', 'chelsea', 'montaria', 'ankle'],
    sandalias: ['sandalia', 'sandália', 'sandalias', 'anabela'],
    sapatilhas: ['sapatilha', 'sapatilhas', 'boneca'],
    saltos: ['salto', 'saltos', 'scarpin', 'meia pata'],
    mules: ['mule', 'mules'],
    rasteiras: ['rasteira', 'rasteiras', 'rasteirinha'],
    esportivo: ['esportivo', 'esporte', 'academia', 'corrida', 'running', 'treino'],
  };
  const CAT_LABEL = {
    tenis: 'tênis', botas: 'botas', sandalias: 'sandálias', sapatilhas: 'sapatilhas',
    saltos: 'saltos', mules: 'mules', rasteiras: 'rasteiras', esportivo: 'tênis esportivos',
  };

  function listaProdutos(items) {
    return items.slice(0, 3).map(
      (p) => `• *${p.name}* — ${money(p.price)} _(no Pix ${pixOf(p.price)})_`
    ).join('\n');
  }

  function respostaCategoria(slug) {
    const items = catBySlug(slug);
    ctx.lastCategory = slug;
    ctx.lastProducts = items;
    if (!items.length) {
      return {
        text: 'Esse tipo eu vou confirmar pra você certinho com a loja pra não te passar informação errada 😊 Enquanto isso, quer ver os mais vendidos?',
        chips: ['Ver tênis', 'Ver botas', 'Ver sandálias'],
      };
    }
    return {
      text:
        `Temos opções lindas de ${CAT_LABEL[slug]}! 😍 Alguns queridinhos que estão saindo bastante:\n\n` +
        `${listaProdutos(items)}\n\n` +
        `Todos em até ${cfg.installments || 10}x sem juros. Qual chamou sua atenção? E qual número você calça?`,
      chips: ['Calço 36', 'Calço 37', 'Calço 38', 'Falar com atendente'],
    };
  }

  function respostaTamanho(size) {
    const base = ctx.lastProducts.length ? ctx.lastProducts : allProducts();
    const disp = base.filter((p) => p.sizes.includes(size));
    if (!disp.length) {
      return {
        text:
          `No número *${size}* esse modelo já está acabando 😕 Deixa eu confirmar reposição com a loja pra não te dar informação furada, tá? ` +
          `Se quiser, já te mostro modelos parecidos disponíveis no ${size}.`,
        chips: ['Ver parecidos', 'Falar com atendente'],
      };
    }
    return {
      text:
        `No *${size}* eu tenho estes prontos pra envio 👟\n\n` +
        `${listaProdutos(disp)}\n\n` +
        `Quer que eu já separe algum pra você? 😊`,
      chips: ['Quero fechar pedido', 'Formas de pagamento', 'Calcular frete'],
    };
  }

  // Detecta a intencao e devolve a resposta do agente
  function responder(msgRaw) {
    const m = msgRaw.toLowerCase();
    const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const norm = strip(m);

    // 1) categoria de produto
    for (const slug in CAT_KEYS) {
      if (CAT_KEYS[slug].some((k) => norm.includes(strip(k)))) {
        return respostaCategoria(slug);
      }
    }

    // 2) numero/tamanho (33 a 44)
    const sizeMatch = norm.match(/\b(3[3-9]|4[0-4])\b/);
    if (sizeMatch && /(calc|numer|tamanh|veste|uso|meu pe|manda|tem|no )/.test(norm) || (sizeMatch && ctx.lastCategory)) {
      return respostaTamanho(parseInt(sizeMatch[1], 10));
    }

    // 3) formas de pagamento
    if (/(paga|pagamento|pix|cartao|cartão|boleto|parcel|juros|desconto)/.test(norm)) {
      return {
        text:
          'Você pode pagar assim 💳\n\n' +
          '• *Pix* — 10% de desconto na hora\n' +
          `• *Cartão* — em até ${cfg.installments || 10}x sem juros\n` +
          '• *Boleto* — à vista\n\n' +
          'Quer que eu calcule o valor de algum modelo no Pix?',
        chips: ['Ver tênis', 'Calcular frete', 'Quero fechar pedido'],
      };
    }

    // 4) frete / entrega / prazo / cep
    if (/(frete|entrega|entregar|prazo|cep|chega|envio|enviam|correio|sedex)/.test(norm)) {
      return {
        text:
          'Enviamos para *todo o Brasil* 📦\n\n' +
          `• *Frete grátis* nas compras acima de ${money(cfg.freeShipping || 249.9)}\n` +
          '• Abaixo disso, o valor depende do seu CEP\n\n' +
          'Me passa seu CEP que eu calculo o frete e o prazo certinho pra sua região 😉',
        chips: ['Ver tênis', 'Formas de pagamento', 'Falar com atendente'],
      };
    }

    // 5) intencao de compra
    if (/(comprar|quero|fechar|pedido|finalizar|levar|separa)/.test(norm)) {
      return {
        text:
          'Perfeito! 🥳 Pra fechar seu pedido eu só preciso de:\n\n' +
          '1️⃣ O *modelo e a cor*\n' +
          '2️⃣ Seu *número*\n' +
          '3️⃣ Seu *CEP* (pra frete e prazo)\n\n' +
          'Pode me mandar? Aí eu já monto tudo e te envio o link de pagamento 💛',
        chips: ['Formas de pagamento', 'Falar com atendente'],
      };
    }

    // 6) falar com humano / troca / devolucao / reclamacao
    if (/(atendente|humano|pessoa|troca|trocar|devolu|reclama|problema|defeito|reembolso)/.test(norm)) {
      return {
        text:
          'Claro! Vou te encaminhar pra uma atendente da Apetrechos cuidar disso com todo carinho 💛 ' +
          'Só um instante que já te chamo por aqui, tá?',
        chips: [],
      };
    }

    // 7) agradecimento / despedida
    if (/(obrigad|valeu|agradec|tchau|ate mais|até mais|show|perfeito$)/.test(norm)) {
      return {
        text: 'Imagina, tô aqui pra isso 💛 Qualquer dúvida é só me chamar. A Apetrechos agradece a visita! 👟✨',
        chips: [],
      };
    }

    // 8) saudacao
    if (/^(oi|ola|olá|bom dia|boa tarde|boa noite|e ai|opa)/.test(norm)) {
      return {
        text: 'Oi! 😊 Que bom te ver por aqui. Me conta: você procura algum modelo em especial ou quer que eu te mostre os mais vendidos?',
        chips: ['Ver tênis', 'Ver botas', 'Ver sandálias'],
      };
    }

    // 9) fallback
    return {
      text:
        'Deixa eu te ajudar melhor 😊 Posso te mostrar modelos, calcular frete, explicar as formas de pagamento ou te passar pra uma atendente. Sobre qual desses você quer falar?',
      chips: ['Ver tênis', 'Ver botas', 'Formas de pagamento', 'Falar com atendente'],
    };
  }

  // ---- Construcao do widget ----------------------------------------------
  let panel, body, input, nudgeEl, badgeEl;

  function build() {
    const style = document.createElement('style');
    style.id = 'apx-chat-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.className = 'apx-chat';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Atendimento Apetrechos (demonstração)');
    panel.innerHTML = `
      <div class="apx-head">
        <div class="apx-avatar">A</div>
        <div class="apx-id">
          <b>Apetrechos Calçados</b>
          <span class="apx-status"><i></i> atendente online</span>
        </div>
        <button class="apx-x" type="button" aria-label="Fechar conversa">&times;</button>
      </div>
      <div class="apx-body">
        <div class="apx-day"><span>Demonstração do atendimento</span></div>
      </div>
      <form class="apx-input">
        <input type="text" placeholder="Escreva uma mensagem…" aria-label="Mensagem" autocomplete="off">
        <button class="apx-send" type="submit" aria-label="Enviar">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-6l8-2.5-8-2.5v-6l19 8.5-19 8.5Z"/></svg>
        </button>
      </form>`;
    document.body.appendChild(panel);

    body = panel.querySelector('.apx-body');
    input = panel.querySelector('input');

    panel.querySelector('.apx-x').addEventListener('click', close);
    panel.querySelector('.apx-input').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      send(text);
    });

    // Balãozinho de convite (aparece uma vez, depois de 2,5s)
    badgeEl = document.createElement('div');
    badgeEl.className = 'apx-badge';
    badgeEl.textContent = 'Demo';
    document.body.appendChild(badgeEl);

    nudgeEl = document.createElement('div');
    nudgeEl.className = 'apx-nudge';
    nudgeEl.innerHTML = '<b>Oi! 👋</b> Sou a atendente da Apetrechos. Toca aqui pra ver como funciona.';
    document.body.appendChild(nudgeEl);
    setTimeout(() => { if (!ctx.started) nudgeEl.classList.add('show'); }, 2500);
    setTimeout(() => nudgeEl.classList.remove('show'), 9000);
  }

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function addUser(text) {
    const el = document.createElement('div');
    el.className = 'apx-msg out';
    el.innerHTML = `${fmt(text)}<span class="apx-time">${now()}</span>`;
    body.appendChild(el);
    scrollDown();
  }

  function addBot(text) {
    const el = document.createElement('div');
    el.className = 'apx-msg in';
    el.innerHTML = `${fmt(text)}<span class="apx-time">${now()}</span>`;
    body.appendChild(el);
    scrollDown();
  }

  function addChips(chips) {
    if (!chips || !chips.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'apx-chips';
    chips.forEach((label) => {
      const b = document.createElement('button');
      b.className = 'apx-chip';
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', () => {
        wrap.remove();
        send(label);
      });
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
    scrollDown();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'apx-msg in apx-typing-wrap';
    el.innerHTML = '<span class="apx-typing"><i></i><i></i><i></i></span>';
    body.appendChild(el);
    scrollDown();
    return el;
  }

  // "Digita" e responde, com atraso proporcional ao tamanho do texto
  function botReply(reply) {
    const typing = showTyping();
    const delay = Math.min(1900, 500 + reply.text.length * 9);
    setTimeout(() => {
      typing.remove();
      addBot(reply.text);
      if (reply.chips) setTimeout(() => addChips(reply.chips), 180);
    }, delay);
  }

  function send(text) {
    addUser(text);
    input.value = '';
    // remove chips antigos (o cliente ja escolheu um caminho)
    body.querySelectorAll('.apx-chips').forEach((c) => c.remove());
    botReply(responder(text));
  }

  function open() {
    if (!panel) build();
    panel.classList.add('is-open');
    nudgeEl && nudgeEl.classList.remove('show');
    setTimeout(() => input && input.focus(), 250);
    if (!ctx.started) {
      ctx.started = true;
      botReply({
        text:
          'Oi! 👋 Seja bem-vinda à *Apetrechos Calçados*. Eu sou a assistente virtual da loja e te ajudo a escolher o par ideal 😊\n\n' +
          'Como posso te ajudar hoje?',
        chips: ['Ver tênis', 'Ver botas', 'Ver sandálias', 'Formas de pagamento', 'Prazo de entrega'],
      });
    }
  }

  function close() { panel && panel.classList.remove('is-open'); }

  function toggle() {
    if (!panel) build();
    panel.classList.contains('is-open') ? close() : open();
  }

  // ---- Ligacao com o botao flutuante existente do site --------------------
  // Intercepta o clique no .wa-float (que hoje so abre um link wa.me) e, em
  // vez de sair do site, abre a DEMONSTRACAO do atendente aqui dentro.
  document.addEventListener('click', (e) => {
    const wa = e.target.closest('.wa-float');
    if (wa) { e.preventDefault(); e.stopPropagation(); toggle(); }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel && panel.classList.contains('is-open')) close();
  });

  // Expõe para uso manual, se quiser abrir via console/onclick.
  window.ApetrechosDemo = { open, close, toggle };
})();
