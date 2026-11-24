'use strict';

// Dados comerciais públicos. Preencha os destinos confirmados antes da publicação.
const SITE_CONFIG = {
  whatsapp: '+55 (55) 99644-1170',
  menuUrl: '',
  contactLinks: [], // Cada item tem label e url (https, mailto ou tel).
  socialLinks: [],  // Cada item tem label e url (https).
  messages: {
    geral: 'Olá, AIVIBE! Quero transformar meu negócio com uma solução digital.',
    orcamento: 'Olá, AIVIBE! Gostaria de solicitar um orçamento.',
    site: 'Olá, AIVIBE! Tenho interesse em um site profissional ou uma página de vendas.',
    menu: 'Olá, AIVIBE! Gostaria de conhecer o AIVIBE MENU para meu negócio de alimentação.',
    menuOferta: 'Olá, AIVIBE! Quero saber sobre a implantação de R$ 97 e os primeiros 30 dias sem mensalidade do AIVIBE MENU.',
    menuIdentidade: 'Olá, AIVIBE! Quero um catálogo com a identidade do meu estabelecimento.',
    menuEssencial: 'Olá, AIVIBE! Tenho interesse no plano Essencial do AIVIBE MENU.',
    menuProfissional: 'Olá, AIVIBE! Tenho interesse no plano Profissional do AIVIBE MENU.',
    menuPremium: 'Olá, AIVIBE! Tenho interesse no plano Premium do AIVIBE MENU.',
    automacao: 'Olá, AIVIBE! Quero conversar sobre automações e agentes de IA para meu negócio.',
    sistema: 'Olá, AIVIBE! Gostaria de conversar sobre um sistema web personalizado.',
    projeto: 'Olá, AIVIBE! Vamos conversar sobre meu projeto?',
    flutuante: 'Olá, AIVIBE! Gostaria de saber mais sobre as soluções do estúdio.'
  }
};

function publicUrl(value, protocols) {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

function renderLinks(container, entries, protocols) {
  for (const entry of entries) {
    const href = publicUrl(entry.url, protocols);
    if (!href || !entry.label?.trim()) continue;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = entry.label.trim();
    container.append(link);
  }
}

function setupContacts(config) {
  const number = config.whatsapp.replace(/[\s()+.-]/g, '');
  const hasNumber = /^[1-9]\d{7,14}$/.test(number);
  const whatsappUrl = 'https://wa.me/' + number;
  const menuUrl = publicUrl(config.menuUrl, ['https:']);
  if (menuUrl) {
    document.querySelectorAll('[data-menu-page]').forEach(link => { link.href = menuUrl; });
  }
  const notice = document.querySelector('#contact-notice');
  const channels = document.querySelector('#contact-channels');
  const socials = document.querySelector('#social-channels');
  const webAndContact = ['https:', 'mailto:', 'tel:'];
  renderLinks(channels, config.contactLinks, webAndContact);
  renderLinks(socials, config.socialLinks, ['https:']);
  if (socials.childElementCount) {
    const heading = document.createElement('h2');
    heading.textContent = 'Redes sociais';
    socials.prepend(heading);
  }
  if (channels.childElementCount) {
    const alternatives = document.createElement('div');
    alternatives.className = 'notice-channels';
    renderLinks(alternatives, config.contactLinks, webAndContact);
    notice.querySelector('form').before(alternatives);
  }

  if (hasNumber) {
    renderLinks(channels, [{ label: 'WhatsApp ' + config.whatsapp, url: whatsappUrl }], ['https:']);
  }

  for (const link of document.querySelectorAll('[data-contact]')) {
    const key = link.dataset.contact;
    if (hasNumber) {
      const destination = new URL(whatsappUrl);
      destination.searchParams.set('text', config.messages[key]);
      link.href = destination.href;
      link.hidden = false;
    } else if (!link.hidden) {
      // O destino sem WhatsApp vira um controle de diálogo, inclusive para teclado.
      const button = document.createElement('button');
      button.type = 'button';
      button.className = link.className;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', notice.id);
      button.append(...link.childNodes);
      link.replaceWith(button);
      button.addEventListener('click', () => notice.showModal());
    }
  }

  notice.addEventListener('click', event => {
    if (event.target === notice) notice.close();
  });
}

function setupNavigation() {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('#nav-principal');
  const toggle = document.querySelector('.nav-toggle');
  const compact = matchMedia('(max-width: 63.999rem)');

  function setOpen(open) {
    menu.hidden = compact.matches && !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  function updateLayout() {
    const focusedInMenu = menu.contains(document.activeElement);
    header.classList.toggle('nav-ready', compact.matches);
    toggle.hidden = !compact.matches;
    setOpen(false);
    if (compact.matches && focusedInMenu) toggle.focus();
  }

  updateLayout();
  compact.addEventListener('change', updateLayout);
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', event => {
    const control = event.target.closest('a,button');
    if (!compact.matches || !control) return;
    setOpen(false);
    // O diálogo nativo devolve o foco ao elemento ativo antes de sua abertura.
    if (control.getAttribute('aria-haspopup') === 'dialog') toggle.focus();
  }, { capture: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && compact.matches && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (compact.matches && !menu.hidden && !header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', event => {
    if (compact.matches && event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });

  const links = [...menu.querySelectorAll('a[href^="#"]:not(.button)')];
  const anchors = links.map(link => document.querySelector(link.hash));
  let scheduled = false;
  function markSection() {
    const threshold = header.offsetHeight + Math.min(innerHeight * .32, 240);
    const index = anchors.findLastIndex(section => section.getBoundingClientRect().top <= threshold);
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleMark() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(markSection);
    }
  }
  addEventListener('scroll', scheduleMark, { passive: true });
  addEventListener('resize', scheduleMark);
  markSection();
}

function setupReveals() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('arrived');
      observer.unobserve(entry.target);
    }
  }, { threshold: .06 });
  document.querySelectorAll('main > section:not(.hero) > .wrap').forEach(section => observer.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();
setupContacts(SITE_CONFIG);
setupNavigation();
setupReveals();
