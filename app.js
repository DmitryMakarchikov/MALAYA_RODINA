'use strict';
/* ============================================================
   «ДОРОГАМИ ПАМЯТИ» — логика одностраничного приложения.
   Данные — data.js, строки интерфейса — i18n.js (t(), L()).
   Всё работает офлайн: без онлайн-карт и внешних API.
   ============================================================ */

/* ============================================================
   1. УТИЛИТЫ
   ============================================================ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const ico = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const byId = (id) => PLACES.find((p) => p.id === id);
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plural = (n, f) => { const m10 = n % 10, m100 = n % 100; return f[(m10 === 1 && m100 !== 11) ? 0 : (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) ? 1 : 2]; };
const pl = (n, key) => `${n} ${plural(n, t(key).split('|'))}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dayNumber = () => { const d = new Date(); return Math.floor((d - d.getTimezoneOffset() * 6e4) / 864e5); };
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(LANG === 'be' ? 'be-BY' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; } };
// Источник: «Уточняется» хранится строкой NEED.ru — показываем на текущем языке
const srcText = (s) => (s === NEED.ru ? L(NEED) : L(s));

// Безопасное хранилище (localStorage может быть недоступен)
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* приватный режим — работаем без сохранения */ } }
};

/* ============================================================
   2. ИЗОБРАЖЕНИЯ: фото, SVG-заглушки, портреты
   ============================================================ */
const photo = (p) => PHOTOS[p.id]?.cover || '';
const tourOf = (p) => PHOTOS[p.id]?.tour || [];
const shortLabel = (p) => (L(p.name).match(/«(.+?)»/) || [, L(p.settlement)])[1];

// Обложка-заглушка для мест без фотографии (SVG по типу объекта)
const coverCache = {};
const cover = (p) => {
  const key = p.id + LANG;
  if (coverCache[key]) return coverCache[key];
  const tp = TYPES[p.type];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${tp.color}'/><stop offset='1' stop-color='${tp.c2}'/></linearGradient><pattern id='p' width='22' height='22' patternUnits='userSpaceOnUse'><path d='M0 22L22 0' stroke='rgba(255,255,255,.07)' stroke-width='2'/></pattern></defs><rect width='800' height='500' fill='url(#g)'/><rect width='800' height='500' fill='url(#p)'/><circle cx='400' cy='215' r='150' fill='rgba(255,255,255,.06)'/><g transform='translate(400 215) scale(.95)' fill='rgba(255,255,255,.88)'>${tp.glyph}</g><text x='400' y='420' text-anchor='middle' font-family='Georgia,serif' font-size='34' font-style='italic' fill='#fff'>${esc(shortLabel(p))}</text><text x='400' y='458' text-anchor='middle' font-family='Arial' font-size='15' letter-spacing='4' fill='rgba(255,255,255,.6)'>${esc((L(REGIONS[p.region].name) + ' ' + t('regionWord')).toUpperCase())}</text></svg>`;
  return (coverCache[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
};
const img = (p) => photo(p) || cover(p);

// Портрет-монограмма героя
const portrait = (h) => {
  const ini = L(h.name).split(' ').map((w) => w[0]).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 340'><defs><radialGradient id='g' cx='.5' cy='.35' r='.8'><stop offset='0' stop-color='#efe3c8'/><stop offset='1' stop-color='#b89c6c'/></radialGradient></defs><rect width='400' height='340' fill='url(#g)'/><circle cx='200' cy='130' r='62' fill='rgba(60,40,20,.28)'/><path d='M80 340c10-80 60-120 120-120s110 40 120 120z' fill='rgba(60,40,20,.28)'/><text x='200' y='150' text-anchor='middle' font-family='Georgia,serif' font-size='54' font-weight='700' fill='#fdf8ee'>${esc(ini)}</text><rect x='12' y='12' width='376' height='316' fill='none' stroke='rgba(90,60,30,.35)' stroke-width='2'/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

// Автор и лицензия снимка (credits.js). Нет записи — подпись не выводится
const creditOf = (src) => (typeof CREDITS !== 'undefined' && CREDITS[src]) || null;
const creditText = (src) => { const c = creditOf(src); return c ? `${t('photo.by')}: ${c.a ? c.a + ' · ' : ''}${c.l}` : ''; };
const creditHTML = (src, cls = 'credit') => { const c = creditOf(src); return c ? `<a class="${cls}" href="${esc(c.u)}" target="_blank" rel="noopener">${esc(creditText(src))}</a>` : ''; };
// Фото героя: портрет, снимок памятника или монограмма, если фото нет
const heroImg = (h) => h.photo?.src || portrait(h);

// Любая картинка, которая не загрузилась, заменяется заглушкой
document.addEventListener('error', (e) => {
  const el = e.target;
  if (el.tagName === 'IMG' && !el.dataset.fallback) { el.dataset.fallback = '1'; el.src = 'images/placeholder.svg'; }
}, true);

// Материалы места (для фильтров и значков)
const placeArchive = (id) => ARCHIVE.filter((a) => a.place === id);
const hasTour = (p) => tourOf(p).length > 0;
const hasPano = (p) => !!PANORAMAS[p.id];
const hasArchive = (p) => placeArchive(p.id).some((a) => a.type !== 'audio');
const hasAudio = (p) => placeArchive(p.id).some((a) => a.type === 'audio');
const placeHeroes = (id) => HEROES.filter((h) => h.places.includes(id));
const matChips = (p, cls = 'chip') => [
  hasTour(p) ? `<span class="${cls}">${ico('i-photo')}${t('chip.tour')}</span>` : '',
  hasPano(p) ? `<span class="${cls}">${ico('i-eye')}${t('chip.pano')}</span>` : '',
  hasArchive(p) ? `<span class="${cls}">${ico('i-photo')}${t('chip.archive')}</span>` : '',
  hasAudio(p) ? `<span class="${cls}">${ico('i-audio')}${t('chip.audio')}</span>` : '',
  placeHeroes(p.id).length ? `<span class="${cls}">${ico('i-star')}${t('chip.heroes')}</span>` : ''
].join('');
const typeDot = (p) => `<i class="type-dot" style="background:${TYPES[p.type].color}"></i>`;

/* ============================================================
   3. УВЕДОМЛЕНИЯ, МОДАЛЬНОЕ ОКНО, ЛАЙТБОКС
   ============================================================ */
const toast = (msg, icon = 'i-check') => {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${ico(icon)}<span>${esc(msg)}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
};

let lastFocus = null;
const openOverlay = (html) => {
  lastFocus = document.activeElement;
  $('#overlayBody').innerHTML = html;
  $('#overlay').classList.add('open');
  document.body.classList.add('no-scroll');
  setTimeout(() => $('#overlay .close-x')?.focus(), 50);
};
const closeOverlay = () => {
  if (!$('#overlay').classList.contains('open')) return;
  $('#overlay').classList.remove('open');
  document.body.classList.remove('no-scroll');
  if ($('#overlay .player')) stopAudio();
  lastFocus?.focus?.();
};
const closeBtn = () => `<button class="close-x" data-close aria-label="${t('close')}">${ico('i-close')}</button>`;
const modal = (inner) => openOverlay(`<div class="modal">${closeBtn()}${inner}</div>`);
// mediaHTML — <img> или инлайн-SVG; подпись — заголовок и текст
const lightbox = (mediaHTML, title, text, src) => openOverlay(`
  <figure class="lightbox">
    ${closeBtn()}
    <div class="lightbox-media">${mediaHTML}</div>
    <figcaption class="lightbox-cap"><div><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}${src ? creditHTML(src, 'lightbox-credit') : ''}</div></figcaption>
  </figure>`);

/* ============================================================
   4. ПРОГРЕСС: открытые места, достижения, звук
   ============================================================ */
const opened = new Set(store.get('dp_opened', []));
const progress = Object.assign({ quizRight: 0, witness: false }, store.get('dp_progress', {}));
const unlocked = new Set(store.get('dp_achievements', []));

const ACHIEVEMENTS = [
  { id: 'first', icon: 'i-pin', test: () => opened.size >= 1 },
  { id: 'brest', icon: 'i-map', test: () => PLACES.filter((p) => p.region === 'brest').every((p) => opened.has(p.id)) },
  { id: 'keeper', icon: 'i-flame', test: () => opened.size >= 10 },
  { id: 'expert', icon: 'i-quiz', test: () => progress.quizRight >= 8 },
  { id: 'witness', icon: 'i-audio', test: () => progress.witness },
  { id: 'traveler', icon: 'i-road', test: () => route.length >= 3 }
];
const checkAchievements = () => {
  ACHIEVEMENTS.forEach((a) => {
    if (unlocked.has(a.id) || !a.test()) return;
    unlocked.add(a.id);
    store.set('dp_achievements', [...unlocked]);
    toast(`${t('ach.unlocked')}: «${t('ach.' + a.id)}»`, 'i-star');
  });
  renderProgress();
};
const markOpened = (id) => {
  if (opened.has(id)) return;
  opened.add(id);
  store.set('dp_opened', [...opened]);
  checkAchievements();
};
const setProgress = (k, v) => { progress[k] = v; store.set('dp_progress', progress); checkAchievements(); };

// Счётчик в шапке и полоса прогресса на главной
const renderProgress = () => {
  const n = opened.size, total = PLACES.length;
  $('#openedCount').textContent = `${n}/${total}`;
  $('#openedChip').setAttribute('aria-label', t('opened.text').replace('{n}', n).replace('{total}', total));
  $('#openedChip').title = $('#openedChip').getAttribute('aria-label');
  const box = $('#progressBox');
  if (!box) return;
  box.innerHTML = `
    <div class="progress-main">
      <span class="block-label">${t('opened.label')}</span>
      <p class="progress-text">${t('opened.text').replace('{n}', `<b>${n}</b>`).replace('{total}', total)}</p>
      <div class="progress-bar"><i style="width:${(n / total) * 100}%"></i></div>
    </div>
    <div class="ach-list" aria-label="${t('ach.title')}">
      ${ACHIEVEMENTS.map((a) => `<span class="ach${unlocked.has(a.id) ? ' on' : ''}" title="${esc(t('ach.' + a.id + '.d'))}">${ico(a.icon)}<span>${t('ach.' + a.id)}</span></span>`).join('')}
    </div>`;
};

/* ============================================================
   5. МАРШРУТИЗАЦИЯ (hash): #/home, #/map, #/place/id/tab, #/heroes, #/archive, #/quiz, #/route
   ============================================================ */
const SCENES = ['home', 'map', 'place', 'heroes', 'archive', 'quiz', 'route'];
const go = (hash) => { if (location.hash === hash) router(); else location.hash = hash; };

let prevScene = null;
const router = () => {
  const [, scene = 'home', id, tab] = location.hash.split('/');
  const name = SCENES.includes(scene) ? scene : 'home';
  const sameScene = prevScene === name;
  prevScene = name;
  $$('.scene').forEach((s) => s.classList.toggle('active', s.id === 'scene-' + name));
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name || (name === 'place' && a.dataset.nav === 'map')));
  closeMobile();
  closePop();
  stopAudio();
  if (name !== 'quiz') { quizStopTimer(); if (quiz.view === 'q') quiz.view = 'start'; quiz.active = false; }
  if (name === 'home') slider.start(); else slider.stop();
  if (name === 'map') mapView.show();
  const onlyTab = name === 'place' && renderPlace(id, tab);
  if (name === 'heroes') renderHeroes();
  if (name === 'archive') renderArchive();
  if (name === 'quiz' && !quiz.active && quiz.view !== 'result') renderQuizStart();
  if (name === 'route') renderRoute();
  if (!onlyTab && !(sameScene && name !== 'place')) window.scrollTo({ top: 0, behavior: 'instant' });
  document.title = (name === 'place' && byId(id) ? L(byId(id).name) + ' — ' : '') + t('siteName');
  observeReveal();
};

/* ============================================================
   6. ШАПКА: язык, мобильное меню, прогресс прокрутки, параллакс
   ============================================================ */
const closeMobile = () => { $('#mobileNav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); };
$('#burger').addEventListener('click', () => {
  const open = !$('#mobileNav').classList.contains('open');
  $('#mobileNav').classList.toggle('open', open);
  $('#burger').setAttribute('aria-expanded', String(open));
});
// пункт мобильного меню закрывает его, даже если ведёт на текущую сцену
$('#mobileNav').addEventListener('click', (e) => { if (e.target.closest('a')) closeMobile(); });

window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  $('#scrollProgress').style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  $('#siteHeader').classList.toggle('scrolled', h.scrollTop > 10);
  $('#toTop').classList.toggle('show', h.scrollTop > 700);
  // параллакс обложки места
  const pc = $('#scene-place.active .place-cover');
  if (pc) pc.style.setProperty('--py', Math.min(h.scrollTop, 600) * 0.22 + 'px');
}, { passive: true });
$('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Появление блоков при прокрутке
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 }) : null;
const observeReveal = () => $$('.reveal:not(.in)').forEach((el) => io ? io.observe(el) : el.classList.add('in'));

// Переключатель языка РУС / БЕЛ
const renderLangSwitch = () => $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
const changeLang = (lang) => {
  if (lang === LANG) return;
  setLang(lang);
  applyStaticI18n();
  rebuildAll();
  toast(t('lang.changed'));
};

/* ============================================================
   7. ГЛАВНАЯ: слайдер
   ============================================================ */
const SLIDES = [
  { place: 'brest', kicker: T('Брест · 22 июня 1941', 'Брэст · 22 чэрвеня 1941'), title: T('Брестская <em>крепость-герой</em>', 'Брэсцкая <em>крэпасць-герой</em>'),
    text: T('Одно из первых мест сопротивления. Пройдите от монумента «Мужество» к Вечному огню в фототуре.', 'Адно з першых месцаў супраціву. Прайдзіце ад манумента «Мужнасць» да Вечнага агню ў фотатуры.') },
  { place: 'khatyn', kicker: T('Логойский район · 22 марта 1943', 'Лагойскі раён · 22 сакавіка 1943'), title: T('Хатынь — <em>память о сожжённых деревнях</em>', 'Хатынь — <em>памяць пра спаленыя вёскі</em>'),
    text: T('149 жителей, из них 75 детей. Мемориал хранит память о Хатыни и 185 других деревнях.', '149 жыхароў, з іх 75 дзяцей. Мемарыял захоўвае памяць пра Хатынь і 185 іншых вёсак.') },
  { place: 'krbereg', kicker: T('Жлобинский район', 'Жлобінскі раён'), title: T('Красный Берег — <em>утраченное детство</em>', 'Чырвоны Бераг — <em>страчанае дзяцінства</em>'),
    text: T('Пустой класс, белый кораблик и витражи по детским рисункам на месте донорского лагеря.', 'Пусты клас, белы караблік і вітражы па дзіцячых малюнках на месцы донарскага лагера.') },
  { place: 'kurgan', kicker: T('Смолевичский район · 1969', 'Смалявіцкі раён · 1969'), title: T('Курган <em>Славы</em>', 'Курган <em>Славы</em>'),
    text: T('Четыре штыка — четыре фронта, освобождавших Беларусь летом 1944 года.', 'Чатыры штыкі — чатыры франты, якія вызвалялі Беларусь летам 1944 года.') },
  { archive: 'grodnokurgan', old: true, img: 'images/archive/grodno-1944-liberation.jpg', kicker: T('Архив · июль 1944', 'Архіў · ліпень 1944'), title: T('Гродно <em>освобождён</em>', 'Гродна <em>вызвалены</em>'),
    text: T('Архивный снимок дней освобождения города — один из материалов раздела «Голоса и документы».', 'Архіўны здымак дзён вызвалення горада — адзін з матэрыялаў раздзела «Галасы і дакументы».') }
];
const SLIDE_TIME = 6500;
const slider = {
  i: 0, timer: null, paused: false, running: false,
  init() {
    const el = $('#slider');
    el.style.setProperty('--slide-time', SLIDE_TIME + 'ms');
    $('#slidePrev').addEventListener('click', () => this.go(this.i - 1));
    $('#slideNext').addEventListener('click', () => this.go(this.i + 1));
    el.addEventListener('mouseenter', () => { this.paused = true; el.classList.add('paused'); clearTimeout(this.timer); });
    el.addEventListener('mouseleave', () => { this.paused = false; el.classList.remove('paused'); this.go(this.i); });
    // свайп на телефоне
    let x0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) this.go(this.i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    this.render();
  },
  render() {
    $('#slides').innerHTML = SLIDES.map((s, i) => {
      const p = s.place && byId(s.place);
      return `
      <div class="slide${s.old ? ' archival' : ''}" role="group" aria-roledescription="${t('slider.slide')}" aria-label="${i + 1} / ${SLIDES.length}">
        <img src="${s.img || img(p)}" alt="" ${i ? 'loading="lazy"' : ''}>
        <div class="slide-content">
          <span class="slide-kicker">${ico('i-pin')}${esc(L(s.kicker))}</span>
          <h2 class="slide-title">${L(s.title)}</h2>
          <p class="slide-text">${esc(L(s.text))}</p>
          <div class="slide-actions">
            ${p ? `<a class="btn btn-primary" href="#/place/${p.id}">${t('btn.story')} ${ico('i-arrow')}</a><a class="btn btn-light" href="#/place/${p.id}/present">${ico('i-tour')}${t('btn.walk')}</a>`
                : `<button class="btn btn-primary" data-archive-place="${s.archive}">${ico('i-archive')}${t('btn.openArchive')}</button><a class="btn btn-light" href="#/map">${ico('i-map')}${t('btn.toMap')}</a>`}
          </div>
        </div>
      </div>`;
    }).join('');
    $('#slideDots').innerHTML = SLIDES.map((_, i) => `<button class="slider-dot" role="tab" aria-label="${t('slider.slide')} ${i + 1}"><i></i></button>`).join('');
    $('#slideTotal').textContent = String(SLIDES.length).padStart(2, '0');
    $$('.slider-dot').forEach((d, i) => d.addEventListener('click', () => this.go(i)));
    this.go(this.i);
  },
  go(n) {
    this.i = (n + SLIDES.length) % SLIDES.length;
    $$('.slide').forEach((s, k) => s.classList.toggle('active', k === this.i));
    $$('.slider-dot').forEach((d, k) => {
      d.classList.remove('active'); void d.offsetWidth; // перезапуск анимации полоски
      d.classList.toggle('active', k === this.i);
      d.setAttribute('aria-selected', String(k === this.i));
    });
    $('#slideNum').textContent = String(this.i + 1).padStart(2, '0');
    clearTimeout(this.timer);
    if (!this.paused && this.running) this.timer = setTimeout(() => this.go(this.i + 1), SLIDE_TIME);
  },
  start() { this.running = true; this.go(this.i); },
  stop() { this.running = false; clearTimeout(this.timer); }
};
document.addEventListener('keydown', (e) => {
  if ($('#overlay').classList.contains('open')) { if (e.key === 'Escape') closeOverlay(); return; }
  if (e.key === 'Escape') closePop();
  if (!$('#scene-home').classList.contains('active') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (e.key === 'ArrowRight') slider.go(slider.i + 1);
  if (e.key === 'ArrowLeft') slider.go(slider.i - 1);
});

/* ============================================================
   8. ГЛАВНАЯ: статистика, вопрос и цитата дня, области, подборка
   ============================================================ */
const FEATURED = ['brest', 'khatyn', 'krbereg', 'katyusha', 'kurgan'];

const renderHome = () => {
  const stats = [
    [PLACES.length, 'pl.place'],
    [Object.keys(REGIONS).length, 'pl.region'],
    [HEROES.length, 'pl.hero'],
    [ARCHIVE.length, 'pl.material']
  ];
  $('#stats').innerHTML = stats.map(([n, k]) => `<div class="stat"><div class="stat-num" data-count="${n}">0</div><div class="stat-label">${plural(n, t(k).split('|'))}</div></div>`).join('');
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count; const t0 = performance.now();
    const step = (tm) => { const k = Math.min(1, (tm - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });

  renderProgress();
  renderDaily();

  $('#regionCards').innerHTML = Object.entries(REGIONS).map(([k, r]) => {
    const n = PLACES.filter((p) => p.region === k).length;
    return `<button class="block region-card reveal" data-region="${k}">
      <span class="region-badge">${L(r.letter)}</span>
      <span class="region-info"><span class="t">${L(r.name)} ${t('regionWord')}</span><span class="m">${pl(n, 'pl.place')}</span></span>
      ${ico('i-arrow', 'icon region-arrow')}
    </button>`;
  }).join('');

  $('#rail').innerHTML = FEATURED.map(byId).map(tileHTML).join('');
  initTileCarousels($('#rail'));
};

// Карточка места с мини-каруселью из трёх снимков
const tileHTML = (p) => {
  const shots = [...new Set([img(p), ...tourOf(p).map((s) => s.img)])].slice(0, 3);
  return `
  <a class="block place-tile" href="#/place/${p.id}">
    <span class="place-tile-img" data-carousel>
      ${shots.map((s, i) => `<img src="${s}" alt="" loading="lazy"${i ? '' : ' class="on"'}>`).join('')}
      <span class="chip chip-dark">${typeDot(p)}${L(TYPES[p.type].short)}</span>
      ${shots.length > 1 ? `<span class="tile-dots">${shots.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</span>` : ''}
    </span>
    <span class="place-tile-body">
      <span class="place-tile-meta">${ico('i-pin')}${esc(L(p.district))}</span>
      <h3>${esc(L(p.name))}</h3>
      <p>${esc(L(p.short))}</p>
    </span>
  </a>`;
};
const initTileCarousels = (root) => $$('[data-carousel]', root).forEach((box) => {
  const imgs = $$('img', box), dots = $$('.tile-dots i', box);
  if (imgs.length < 2) return;
  let i = 0, timer = null;
  const show = (k) => { i = k % imgs.length; imgs.forEach((el, n) => el.classList.toggle('on', n === i)); dots.forEach((el, n) => el.classList.toggle('on', n === i)); };
  const card = box.closest('.place-tile');
  const start = () => { clearInterval(timer); show(i + 1); timer = setInterval(() => show(i + 1), 1100); };
  const stop = () => { clearInterval(timer); show(0); };
  card.addEventListener('mouseenter', start); card.addEventListener('focus', start);
  card.addEventListener('mouseleave', stop); card.addEventListener('blur', stop);
});

// Вопрос дня и цитата дня (меняются раз в сутки)
const renderDaily = () => {
  const d = dayNumber();
  const q = QUIZ[d % QUIZ.length];
  $('#dailyQuestion').innerHTML = `
    <span class="block-label">${ico('i-quiz')}${t('daily.q')}</span>
    ${q.img ? `<div class="daily-photo"><img src="${q.img}" alt="${esc(t('quiz.photoAlt'))}" loading="lazy"></div>` : ''}
    <h3 class="daily-title">${esc(L(q.q))}</h3>
    <div class="daily-options">${q.a.map((a, k) => `<button class="daily-opt" data-dq="${k}">${esc(L(a))}</button>`).join('')}</div>
    <div class="daily-fact" id="dailyFact" hidden></div>`;
  $$('[data-dq]').forEach((b) => b.addEventListener('click', () => {
    const k = +b.dataset.dq;
    $$('[data-dq]').forEach((x) => { x.disabled = true; x.classList.add(+x.dataset.dq === q.c ? 'correct' : +x.dataset.dq === k ? 'wrong' : 'dim'); });
    const f = $('#dailyFact');
    f.hidden = false;
    f.innerHTML = `<b>${k === q.c ? t('quiz.right') : t('quiz.wrong')}</b> ${esc(L(q.fact))}<a class="btn btn-primary btn-sm" href="#/quiz">${t('daily.toQuiz')} ${ico('i-arrow')}</a>`;
  }));

  const qt = QUOTES[d % QUOTES.length];
  $('#dailyQuote').innerHTML = `
    <span class="block-label">${ico('i-quote')}${t('daily.quote')}</span>
    <blockquote class="daily-quote">${esc(qt.text)}</blockquote>
    <p class="daily-cap">— ${esc(L(qt.cap))}</p>
    <p class="form-note">${t('source')}: ${esc(qt.src)}</p>
    <button class="btn btn-outline btn-sm" data-place="${qt.place}">${ico('i-pin')}${t('btn.story')}</button>`;
};

/* ============================================================
   9. КАРТА: локальная SVG Беларуси, свои маркеры и попапы
   ============================================================ */
// Проекция SVG: линейная между крайними точками Беларуси (проверено по контуру Минска)
const PROJ = { W: 1000, H: 871, lng0: 23.178, lng1: 32.776, lat0: 51.262, lat1: 56.172, x0: 8.2, x1: 996.6, y0: 2.6, y1: 857.7 };
const project = ([lat, lng]) => ({
  x: (PROJ.x0 + (lng - PROJ.lng0) / (PROJ.lng1 - PROJ.lng0) * (PROJ.x1 - PROJ.x0)) / PROJ.W * 100,
  y: (PROJ.y0 + (PROJ.lat1 - lat) / (PROJ.lat1 - PROJ.lat0) * (PROJ.y1 - PROJ.y0)) / PROJ.H * 100
});

const filters = { search: '', region: 'all', district: 'all', types: new Set(), tour: false, archive: false, audio: false };
const pinSVG = (color) => `<svg viewBox="0 0 30 40" aria-hidden="true"><path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 25 15 25s15-14 15-25C30 6.7 23.3 0 15 0z" fill="${color}" stroke="#fff" stroke-width="2.5"/><circle cx="15" cy="15" r="5.5" fill="#fff"/></svg>`;

const mapView = {
  ready: false, k: 1, x: 0, y: 0, base: { w: 0, h: 0, ox: 0, oy: 0 },
  init() {
    if (this.ready) return;
    this.ready = true;
    this.vp = $('#map'); this.canvas = $('#mapCanvas');
    // маркеры: три случайных пульсируют, чтобы привлечь внимание
    const pulse = new Set(shuffle(PLACES).slice(0, 3).map((p) => p.id));
    $('#mapPins').innerHTML = PLACES.map((p) => {
      const { x, y } = project(p.coords);
      return `<button class="pin${pulse.has(p.id) ? ' pulse' : ''}" data-pin="${p.id}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${pinSVG(TYPES[p.type].color)}</button>`;
    }).join('');
    this.labelPins();
    $$('.pin', this.vp).forEach((b) => {
      b.addEventListener('click', (e) => { e.stopPropagation(); openPop(byId(b.dataset.pin)); });
      b.addEventListener('mouseenter', () => highlight(b.dataset.pin, true));
      b.addEventListener('mouseleave', () => highlight(b.dataset.pin, false));
    });
    this.bindGestures();
    const relayout = () => { if ($('#scene-map').classList.contains('active')) this.layout(); };
    if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(this.vp);
    else window.addEventListener('resize', relayout);
  },
  labelPins() { $$('.pin', this.vp).forEach((b) => b.setAttribute('aria-label', L(byId(b.dataset.pin).name))); },
  show() { this.init(); this.layout(); applyFilters(false); },
  // размеры окна карты без учёта CSS-трансформаций (анимация появления сцены)
  size() { return { width: this.vp.clientWidth, height: this.vp.clientHeight }; },
  // базовый размер холста — вписать карту в окно с полями и сохранением пропорций
  layout() {
    const r = this.size();
    if (!r.width) return;
    const ar = PROJ.W / PROJ.H, pad = r.width < 500 ? 0.9 : 0.94;
    let w = r.width * pad, h = w / ar;
    if (h > r.height * pad) { h = r.height * pad; w = h * ar; }
    this.base = { w, h, ox: (r.width - w) / 2, oy: (r.height - h) / 2 };
    this.canvas.style.width = w + 'px'; this.canvas.style.height = h + 'px';
    this.apply();
  },
  apply(animate = false) {
    this.canvas.classList.toggle('anim', animate);
    // не даём утащить карту за пределы окна
    // хотя бы 30% карты остаётся в окне по каждой оси
    const r = this.size(), { w, h, ox, oy } = this.base;
    this.x = clamp(this.x, r.width * .3 - ox - w * this.k, r.width * .7 - ox);
    this.y = clamp(this.y, r.height * .3 - oy - h * this.k, r.height * .7 - oy);
    this.canvas.style.transform = `translate(${ox + this.x}px, ${oy + this.y}px) scale(${this.k})`;
    this.canvas.style.setProperty('--k', this.k);
    this.vp.classList.toggle('zoomed', this.k > 1.05);
  },
  // приближение к точке (cx, cy — координаты внутри окна карты)
  zoomAt(k2, cx, cy, animate = false) {
    k2 = clamp(k2, 1, 8);
    const { ox, oy } = this.base;
    const px = (cx - ox - this.x) / this.k, py = (cy - oy - this.y) / this.k;
    this.k = k2; this.x = cx - ox - px * k2; this.y = cy - oy - py * k2;
    this.apply(animate);
  },
  fitAll() { closePop(); this.k = 1; this.x = 0; this.y = 0; this.apply(true); },
  // показать прямоугольник (в долях холста 0..1)
  focusBox(bx, by, bw, bh, maxK = 6) {
    const r = this.size(), { w, h, ox, oy } = this.base;
    const k = clamp(Math.min(r.width * .8 / (bw * w || 1), r.height * .8 / (bh * h || 1)), 1, maxK);
    this.k = k;
    this.x = r.width / 2 - ox - (bx + bw / 2) * w * k;
    this.y = r.height / 2 - oy - (by + bh / 2) * h * k;
    this.apply(true);
  },
  focusList(list) {
    if (!list.length) return;
    const pts = list.map((p) => project(p.coords));
    const xs = pts.map((p) => p.x / 100), ys = pts.map((p) => p.y / 100);
    const x0 = Math.min(...xs), y0 = Math.min(...ys);
    this.focusBox(x0 - .03, y0 - .05, Math.max(...xs) - x0 + .06, Math.max(...ys) - y0 + .08, list.length === 1 ? 4 : 5);
  },
  focusRegion(region) {
    const paths = $$(`#mapSvg [data-region="${region}"]:not(.city)`);
    if (!paths.length) return;
    const b = paths.map((pth) => pth.getBBox()).reduce((a, c) => ({ x0: Math.min(a.x0, c.x), y0: Math.min(a.y0, c.y), x1: Math.max(a.x1, c.x + c.width), y1: Math.max(a.y1, c.y + c.height) }), { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 });
    this.focusBox(b.x0 / PROJ.W, b.y0 / PROJ.H, (b.x1 - b.x0) / PROJ.W, (b.y1 - b.y0) / PROJ.H, 3);
  },
  // Карта статична: пользователь её не двигает и не масштабирует.
  // Клик по области выбирает её (повторный — снимает выбор), клик мимо закрывает карточку.
  bindGestures() {
    this.vp.addEventListener('click', (e) => {
      if (e.target.closest('.pin, .map-pop, .map-toolbar, .map-legend')) return;
      const region = e.target.closest('[data-region]')?.dataset.region;
      if (region) setRegion(filters.region === region ? 'all' : region);
      else closePop();
    });
  }
};

// Карточка-попап у маркера: обычный div, закрывается кликом вне
const popupHTML = (p) => `
  <div class="pop">
    <button class="close-x pop-close" data-pop-close aria-label="${t('close')}">${ico('i-close')}</button>
    <img src="${img(p)}" alt="">
    <div class="pop-body">
      <h3>${esc(L(p.name))}</h3>
      <div class="pop-loc">${esc(L(p.district))} · ${L(REGIONS[p.region].name)} ${t('regionShort')}</div>
      <p>${esc(L(p.short))}</p>
      <div class="pop-mats">${matChips(p) || `<span class="chip">${ico('i-doc')}${t('chip.history')}</span>`}</div>
      <a class="btn btn-primary btn-sm" href="#/place/${p.id}">${t('btn.story')} ${ico('i-arrow')}</a>
    </div>
  </div>`;
let popPlace = null;
const openPop = (p) => {
  const pop = $('#mapPop'), pin = $(`.pin[data-pin="${p.id}"]`);
  if (!pin) return;
  popPlace = p.id;
  pop.innerHTML = popupHTML(p);
  pop.hidden = false;
  $$('.pin.sel').forEach((x) => x.classList.remove('sel'));
  pin.classList.add('sel');
  // ставим попап над маркером, не выходя за края карты
  const vr = $('#map').getBoundingClientRect(), pr = pin.getBoundingClientRect();
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = pr.left + pr.width / 2 - vr.left - pw / 2;
  let top = pr.top - vr.top - ph - 8;
  if (top < 8) top = pr.bottom - vr.top + 8;
  left = clamp(left, 8, vr.width - pw - 8);
  top = clamp(top, 8, Math.max(8, vr.height - ph - 8));
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
};
const closePop = () => {
  const pop = $('#mapPop');
  if (!pop || pop.hidden) return;
  pop.hidden = true; popPlace = null;
  $$('.pin.sel').forEach((x) => x.classList.remove('sel'));
};
document.addEventListener('pointerdown', (e) => {
  if (popPlace && !e.target.closest('.map-pop, .pin, .result')) closePop();
});

const highlight = (id, on) => {
  $(`.result[data-place="${id}"]`)?.classList.toggle('hl', on);
  $(`.pin[data-pin="${id}"]`)?.classList.toggle('hl', on);
};

const filtered = () => {
  const q = filters.search.trim().toLowerCase();
  return PLACES.filter((p) =>
    (filters.region === 'all' || p.region === filters.region) &&
    (filters.district === 'all' || L(p.district) === filters.district) &&
    (!filters.types.size || filters.types.has(p.type)) &&
    (!filters.tour || hasTour(p) || hasPano(p)) && (!filters.archive || hasArchive(p)) && (!filters.audio || hasAudio(p)) &&
    (!q || [p.name, p.settlement, p.district].map((v) => v.ru + ' ' + v.be).join(' ').toLowerCase().includes(q)));
};

const applyFilters = (refocus = true) => {
  const list = filtered();
  $('#resCount').textContent = list.length;
  $('#results').innerHTML = list.length ? list.map((p) => `
    <button class="result" data-result="${p.id}">
      <img src="${img(p)}" alt="" loading="lazy">
      <span class="result-info"><span class="t">${esc(L(p.name))}</span><span class="m">${typeDot(p)}${esc(L(p.district))}</span></span>
    </button>`).join('')
    : `<div class="empty">${ico('i-search')}<p>${t('map.nothing')}</p></div>`;
  $$('#results .result').forEach((el) => {
    el.addEventListener('mouseenter', () => highlight(el.dataset.result, true));
    el.addEventListener('mouseleave', () => highlight(el.dataset.result, false));
  });
  const ids = new Set(list.map((p) => p.id));
  $$('.pin').forEach((b) => { b.hidden = !ids.has(b.dataset.pin); });
  if (popPlace && !ids.has(popPlace)) closePop();
  $$('#mapSvg [data-region]').forEach((pth) => {
    pth.classList.toggle('active', pth.dataset.region === filters.region);
    pth.classList.toggle('dim', filters.region !== 'all' && pth.dataset.region !== filters.region);
  });
  if (refocus && mapView.ready) {
    if (filters.region !== 'all' && filters.district === 'all' && !filters.search) mapView.focusRegion(filters.region);
    else if (list.length && list.length < PLACES.length) mapView.focusList(list);
    else mapView.fitAll();
  }
};

const fillFilterOptions = () => {
  $('#fRegion').innerHTML = `<option value="all">${t('map.allRegions')}</option>` + Object.entries(REGIONS).map(([k, r]) => `<option value="${k}">${L(r.name)}</option>`).join('');
  $('#fRegion').value = filters.region;
  setDistricts();
  $('#fTypes').innerHTML = Object.entries(TYPES).map(([k, tp]) => `<button class="type-chip" data-type="${k}" aria-pressed="${filters.types.has(k)}"><i class="type-dot" style="background:${tp.color}"></i>${L(tp.short)}</button>`).join('');
  $('#mapLegend').innerHTML = Object.values(TYPES).map((tp) => `<div><i class="type-dot" style="background:${tp.color}"></i>${L(tp.short)}</div>`).join('');
  if (mapView.ready) mapView.labelPins();
};
const initFilters = () => {
  fillFilterOptions();
  let tmr;
  $('#fSearch').addEventListener('input', (e) => { filters.search = e.target.value; clearTimeout(tmr); tmr = setTimeout(applyFilters, 250); });
  $('#fRegion').addEventListener('change', (e) => setRegion(e.target.value));
  $('#fDistrict').addEventListener('change', (e) => { filters.district = e.target.value; applyFilters(); });
  $('#fTypes').addEventListener('click', (e) => {
    const b = e.target.closest('.type-chip'); if (!b) return;
    const tp = b.dataset.type; const on = !filters.types.has(tp);
    on ? filters.types.add(tp) : filters.types.delete(tp);
    b.setAttribute('aria-pressed', String(on)); applyFilters();
  });
  [['fTour', 'tour'], ['fArchive', 'archive'], ['fAudio', 'audio']].forEach(([id, k]) => $('#' + id).addEventListener('change', (e) => { filters[k] = e.target.checked; applyFilters(); }));
  $('#resetFilters').addEventListener('click', () => {
    Object.assign(filters, { search: '', region: 'all', district: 'all', tour: false, archive: false, audio: false }); filters.types.clear();
    $('#fSearch').value = ''; $('#fRegion').value = 'all'; setDistricts(); ['fTour', 'fArchive', 'fAudio'].forEach((id) => { $('#' + id).checked = false; });
    $$('#fTypes .type-chip').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    applyFilters(false); mapView.fitAll();
  });
  $('#mapFit').addEventListener('click', () => { if (filters.region !== 'all') setRegion('all'); else mapView.fitAll(); });
  // карточка в списке: приблизить маркер и открыть попап
  $('#results').addEventListener('click', (e) => {
    const r = e.target.closest('.result'); if (!r) return;
    const p = byId(r.dataset.result);
    if (window.innerWidth < 1180) $('.map-box').scrollIntoView({ behavior: 'smooth', block: 'start' });
    mapView.focusList([p]);
    setTimeout(() => openPop(p), 650);
  });
};
const setDistricts = () => {
  const sel = $('#fDistrict');
  if (filters.region === 'all') { sel.innerHTML = `<option value="all">${t('map.all')}</option>`; sel.disabled = true; return; }
  const ds = [...new Set(PLACES.filter((p) => p.region === filters.region).map((p) => L(p.district)))].sort((a, b) => a.localeCompare(b));
  sel.innerHTML = `<option value="all">${t('map.allDistricts')}</option>` + ds.map((d) => `<option>${esc(d)}</option>`).join('');
  sel.value = ds.includes(filters.district) ? filters.district : 'all';
  sel.disabled = false;
};
const setRegion = (r) => {
  filters.region = r; filters.district = 'all';
  $('#fRegion').value = r; setDistricts(); applyFilters();
};

/* ============================================================
   10. МОЙ МАРШРУТ — хранение
   ============================================================ */
let route = store.get('dp_route', []).filter((id) => byId(id));
const saveRoute = () => {
  store.set('dp_route', route);
  $$('.route-count').forEach((el) => { el.textContent = route.length; el.hidden = !route.length; });
  checkAchievements();
};
const toggleRoute = (id) => {
  const inRoute = route.includes(id);
  route = inRoute ? route.filter((x) => x !== id) : [...route, id];
  saveRoute();
  toast(t(inRoute ? 'route.removed' : 'route.added'), 'i-road');
  $$(`[data-route-toggle="${id}"]`).forEach(routeBtnState);
};
const routeBtnState = (b) => {
  const on = route.includes(b.dataset.routeToggle);
  b.setAttribute('aria-pressed', String(on));
  b.innerHTML = `${ico(on ? 'i-check' : 'i-plus')}${t(on ? 'route.inRoute' : 'route.add')}`;
};

/* ============================================================
   11. СТРАНИЦА МЕСТА
   ============================================================ */
const ARCH_TYPES = { photo: ['arch.photo', 'i-photo'], doc: ['arch.doc', 'i-doc'], audio: ['arch.audio', 'i-audio'], memory: ['arch.memory', 'i-person'], fix: ['arch.fix', 'i-info'] };

const renderPlace = (id, tab = 'past') => {
  const p = byId(id);
  const root = $('#placeRoot');
  if (!['past', 'present', 'future'].includes(tab)) tab = 'past';
  if (!p) { root.dataset.current = ''; root.innerHTML = `<div class="block block-pad empty"><p>${t('place.notFound')}</p><a class="btn btn-primary" href="#/map">${t('btn.toMap')}</a></div>`; return false; }
  // то же место — только переключаем вкладку без перерисовки
  if (root.dataset.current === id) { switchTab(tab, { scroll: true }); return true; }
  root.dataset.current = id;
  markOpened(id);

  const idx = PLACES.indexOf(p);
  const prev = PLACES[(idx - 1 + PLACES.length) % PLACES.length];
  const next = PLACES[(idx + 1) % PLACES.length];
  const heroes = placeHeroes(id);
  const arch = placeArchive(id);
  const archPhotos = arch.filter((a) => a.img);
  const memories = submissions.filter((s) => s.place === id && s.type === 'memory');

  root.innerHTML = `
    <nav class="crumbs" aria-label="${t('crumbs')}"><a href="#/map">${t('nav.map')}</a><span>/</span><a href="#/map" data-region-link="${p.region}">${L(REGIONS[p.region].name)} ${t('regionWord')}</a><span>/</span><span>${esc(L(p.settlement))}</span></nav>

    <header class="place-cover${PHOTOS[p.id]?.archival ? ' archival' : ''}" data-zoom-cover>
      <img src="${img(p)}" alt="${esc(L(p.name))}">
      ${photo(p) ? creditHTML(photo(p), 'cover-credit') : `<span class="chip chip-dark cover-note">${ico('i-photo')}${t('photo.soon')}</span>`}
      ${PHOTOS[p.id]?.archival ? `<span class="chip chip-dark cover-arch">${ico('i-archive')}${t('photo.archival')}</span>` : ''}
      <div class="place-cover-body">
        <div class="chips"><span class="chip chip-dark">${typeDot(p)}${L(TYPES[p.type].name)}</span>${matChips(p, 'chip chip-dark')}</div>
        <h1>${esc(L(p.name))}</h1>
        <div class="place-cover-loc">${ico('i-pin')}${esc(L(p.district))} · ${L(REGIONS[p.region].name)} ${t('regionWord')}</div>
        <p class="place-cover-desc">${esc(L(p.short))}</p>
        <div class="cover-actions">
          <button class="btn btn-light btn-sm" data-route-toggle="${p.id}"></button>
          <a class="btn btn-ghost-light btn-sm" href="#/place/${p.id}/present">${ico('i-tour')}${t('btn.walk')}</a>
        </div>
      </div>
    </header>

    <div class="tabs" role="tablist" aria-label="${t('tabs.label')}">
      <span class="tab-ink" id="tabInk"></span>
      <button class="tab" role="tab" id="tabbtn-past" data-tab="past" aria-controls="tab-past"><b>${ico('i-past')}${t('tab.past')}</b><small>${t('tab.past.s')}</small></button>
      <button class="tab" role="tab" id="tabbtn-present" data-tab="present" aria-controls="tab-present"><b>${ico('i-eye')}${t('tab.present')}</b><small>${t('tab.present.s')}</small></button>
      <button class="tab" role="tab" id="tabbtn-future" data-tab="future" aria-controls="tab-future"><b>${ico('i-bulb')}${t('tab.future')}</b><small>${t('tab.future.s')}</small></button>
    </div>

    <!-- Прошлое -->
    <section class="tab-panel" id="tab-past" role="tabpanel" aria-labelledby="tabbtn-past">
      <div class="two-col">
        <div class="stack">
          <div class="timeline">
            ${p.past.map(([title, txt, q, src]) => `<article class="tl-item reveal"><div class="block">
              <h3>${esc(L(title))}</h3><p>${esc(L(txt))}</p>
              ${q ? `<blockquote class="quote">${esc(q[0])}<cite>— ${esc(L(q[1]))}</cite></blockquote>` : ''}
              <p class="tl-src">${ico('i-doc')}<span><b>${t('source')}:</b> ${esc(srcText(src))}</span></p>
            </div></article>`).join('')}
          </div>
          ${archPhotos.length ? `<div class="block block-pad">
            <h3 class="block-title">${ico('i-photo')}${t('past.photos')}</h3>
            <div class="past-photos">${archPhotos.map((a) => `<figure class="past-photo${a.old ? ' old' : ''}" data-arch-zoom="${a.id}"><img src="${a.img}" alt="${esc(L(a.title))}" loading="lazy"><figcaption><b>${esc(L(a.title))}</b><span>${esc(L(a.date))} · ${esc(a.src)}</span></figcaption></figure>`).join('')}</div>
          </div>` : ''}
          <div class="block block-pad">
            <h3 class="block-title">${ico('i-person')}${t('past.memories')}</h3>
            ${memories.length ? `<div class="memories">${memories.map(memoryHTML).join('')}</div>`
              : `<p class="form-note">${t('past.memories.empty')}</p>`}
            <button class="btn btn-outline btn-sm" style="margin-top:14px" data-contribute="${p.id}" data-mode="memory">${ico('i-plus')}${t('past.memories.btn')}</button>
          </div>
        </div>
        <aside class="stack">
          ${heroes.length ? `<div class="block block-pad"><h3 class="side-title">${ico('i-star')}${t('place.people')}</h3><div class="mini-list">${heroes.map((h) => `<button class="mini" data-hero="${h.id}"><img src="${heroImg(h)}" alt=""><span><span class="t">${esc(L(h.name))}</span><span class="m">${esc(L(h.role))}</span></span></button>`).join('')}</div></div>` : ''}
          <div class="block block-pad"><h3 class="side-title">${ico('i-archive')}${t('place.archive')}</h3>
            ${arch.length ? `<div class="mini-list">${arch.map((a) => `<button class="mini" data-arch="${a.id}">${a.img ? `<img src="${a.img}" alt="">` : `<span class="mini-ico">${ico(ARCH_TYPES[a.type][1])}</span>`}<span><span class="t">${esc(L(a.title))}</span><span class="m">${t(ARCH_TYPES[a.type][0])} · ${esc(L(a.date))}</span></span></button>`).join('')}</div>`
              : `<p class="form-note">${t('place.archive.empty')}</p>`}
          </div>
        </aside>
      </div>
    </section>

    <!-- Настоящее -->
    <section class="tab-panel" id="tab-present" role="tabpanel" aria-labelledby="tabbtn-present">
      <div class="stack">
        ${tourHTML(p)}
        <div class="two-col">
          <div class="stack">
            <div class="block block-pad">
              <h3 class="block-title">${ico('i-eye')}${t('present.today')}</h3>
              <p style="color:var(--ink-2)">${esc(L(p.present))}</p>
            </div>
            ${audioBlockHTML(p)}
          </div>
          <div class="block block-pad">
            <h3 class="side-title">${ico('i-info')}${t('present.visit')}</h3>
            <dl class="facts">
              <div class="fact">${ico('i-pin')}<div><dt>${t('present.address')}</dt><dd>${esc(p.address ? L(p.address) : `${L(p.settlement)}, ${L(p.district)}`)}</dd></div></div>
              <div class="fact">${ico('i-gps')}<div><dt>${t('present.coords')}</dt><dd>${p.coords[0].toFixed(4)}, ${p.coords[1].toFixed(4)}<button class="copy-btn" data-copy="${p.coords.join(', ')}">${t('present.copy')}</button><small class="fact-note">${t('present.coordsNote')}</small></dd></div></div>
              <div class="fact">${ico('i-road')}<div><dt>${t('present.approach')}</dt><dd${p.visit?.approach ? '' : ' class="muted"'}>${esc(L(p.visit?.approach || NEED))}</dd></div></div>
              <div class="fact">${ico('i-pin')}<div><dt>${t('present.parking')}</dt><dd${p.visit?.parking && p.visit.parking !== NEED ? '' : ' class="muted"'}>${esc(L(p.visit?.parking || NEED))}</dd></div></div>
              <div class="fact">${ico('i-person')}<div><dt>${t('present.access')}</dt><dd${p.visit?.access && p.visit.access !== NEED ? '' : ' class="muted"'}>${esc(L(p.visit?.access || NEED))}</dd></div></div>
              <div class="fact">${ico('i-calendar')}<div><dt>${t('present.updated')}</dt><dd>${fmtDate(DATA_UPDATED)}</dd></div></div>
            </dl>
            <div class="ext-links">
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://yandex.by/maps/?pt=${p.coords[1]},${p.coords[0]}&z=15&l=map">${t('map.yandex')}</a>
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${p.coords[0]},${p.coords[1]}">${t('map.google')}</a>
            </div>
            <button class="btn btn-outline btn-sm btn-block" style="margin-top:10px" data-contribute="${p.id}" data-mode="fix">${ico('i-info')}${t('present.report')}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Будущее -->
    <section class="tab-panel" id="tab-future" role="tabpanel" aria-labelledby="tabbtn-future">${futureHTML(p)}</section>

    <div class="block contribute" style="margin-top:28px">
      <div><h3>${t('contrib.h')}</h3><p>${t('contrib.p')}</p></div>
      <button class="btn btn-outline" data-contribute="${p.id}">${ico('i-plus')}${t('contrib.btn')}</button>
    </div>

    <nav class="pager" aria-label="${t('pager')}">
      <button class="block" data-place="${prev.id}"><small>← ${t('pager.prev')}</small><b>${esc(L(prev.name))}</b></button>
      <button class="block" data-place="${next.id}"><small>${t('pager.next')} →</small><b>${esc(L(next.name))}</b></button>
    </nav>`;

  $$('[data-route-toggle]', root).forEach(routeBtnState);
  $$('.tab', root).forEach((tb) => tb.addEventListener('click', () => switchTab(tb.dataset.tab, { push: true, scroll: true })));
  $('.tabs', root).addEventListener('keydown', (e) => {
    const order = ['past', 'present', 'future'];
    const cur = order.indexOf($('.tab[aria-selected="true"]', root).dataset.tab);
    const n = e.key === 'ArrowRight' ? (cur + 1) % 3 : e.key === 'ArrowLeft' ? (cur + 2) % 3 : -1;
    if (n < 0) return;
    switchTab(order[n], { push: true, scroll: true }); $(`.tab[data-tab="${order[n]}"]`).focus();
  });
  $('[data-zoom-cover]', root).addEventListener('click', (e) => {
    if (!e.target.closest('.place-cover-body')) lightbox(`<img src="${img(p)}" alt="${esc(L(p.name))}">`, L(p.name), L(p.short), photo(p));
  });
  initTour(p);
  initFuture(root, p);
  // переход по ссылке «Пройтись по месту» — сразу к осмотру
  switchTab(tab, { scroll: tab !== 'past', instant: true });
  return false;
};

const switchTab = (tab, { push = false, scroll = false, instant = false } = {}) => {
  const root = $('#placeRoot');
  const order = ['past', 'present', 'future'];
  $$('.tab', root).forEach((tb) => { const on = tb.dataset.tab === tab; tb.setAttribute('aria-selected', String(on)); tb.tabIndex = on ? 0 : -1; });
  $$('.tab-panel', root).forEach((pn) => pn.classList.toggle('active', pn.id === 'tab-' + tab));
  $('#tabInk').style.transform = `translateX(${order.indexOf(tab) * 100}%)`;
  if (push) history.replaceState(null, '', `#/place/${root.dataset.current}/${tab}`);
  stopAudio();
  observeReveal();
  // прокрутка к началу панели — под закреплённые вкладки
  if (scroll) requestAnimationFrame(() => {
    const panel = $('.tab-panel.active', root);
    const offset = $('#siteHeader').offsetHeight + $('.tabs', root).offsetHeight + 24;
    if (panel) window.scrollTo({ top: Math.max(0, window.scrollY + panel.getBoundingClientRect().top - offset), behavior: instant ? 'instant' : 'smooth' });
  });
};

const memoryHTML = (m) => `
  <article class="memory${m.pending ? ' pending' : ''}">
    <blockquote>${esc(m.text)}</blockquote>
    <div class="memory-meta">
      <span>${ico('i-person')}${t('memory.narrator')}: ${esc(m.narrator || t('memory.unknown'))}</span>
      <span>${ico('i-calendar')}${t('memory.recorded')}: ${esc(m.recorded || t('memory.unknown'))}</span>
      <span class="chip chip-gold">${t('arch.pending')}</span>
    </div>
  </article>`;

/* ---------- Аудио: рассказ о месте или герое + текстовая версия ---------- */
const storyAudio = (kind, id, title) => ({ audio: `audio/${kind}/${id}.mp3`, title, transcript: NARRATION[kind][id], story: true });
const audioBlockHTML = (p) => {
  const list = [storyAudio('places', p.id, T('Рассказ о месте', 'Аповед пра месца')), ...placeArchive(p.id).filter((a) => a.type === 'audio')];
  return `<div class="block block-pad"><h3 class="side-title">${ico('i-audio')}${t('audio.title')}</h3>
    <div class="stack" style="gap:16px">${list.map((a) => `<div>${playerHTML(a)}${transcriptHTML(a)}</div>`).join('')}</div></div>`;
};
const transcriptHTML = (a) => a.transcript ? `
  <button class="link-btn transcript-btn" aria-expanded="false" data-transcript>${t('audio.showText')}</button>
  <div class="transcript" hidden>${a.story && LANG === 'be' ? `<p class="form-note">${t('audio.ruOnly')}</p>` : ''}<p>${esc(L(a.transcript))}</p>${a.story ? '' : `<p class="form-note">${t('source')}: ${esc(a.src)}</p>`}</div>` : '';

/* ---------- Пройтись по месту: фототур с точками и панорама 360° (Яндекс Карты) ---------- */
const panoURL = (pn) => {
  const [lo, la] = pn.point;
  return `https://yandex.by/map-widget/v1/?l=stv%2Csta&ll=${lo}%2C${la}&z=17&panorama%5Bpoint%5D=${lo}%2C${la}&panorama%5Bdirection%5D=${pn.dir || 0}%2C0&panorama%5Bspan%5D=120%2C60&panorama%5Bfull%5D=true`;
};
const tourHTML = (p) => {
  const shots = tourOf(p), pano = hasPano(p);
  const mode = pano && shots.length ? t('tour.mode.both') : pano ? t('tour.mode.pano') : shots.length ? t('tour.mode.tour') : t('tour.mode.soon');
  const head = `<div class="tour-head"><h3>${ico('i-tour')}${t('btn.walk')}</h3><span class="chip chip-red">${mode}</span></div>`;
  const panoBlock = pano ? `
      <div class="pano" id="pano"${shots.length ? ' hidden' : ''}>
        <div class="pano-ph" style="background-image:url('${img(p)}')">
          <div class="pano-ph-body">
            <span class="pano-badge">360°</span>
            <p>${t('tour.pano.lead')}</p>
            <button class="btn btn-primary" data-pano-open>${ico('i-eye')}${t('tour.pano.open')}</button>
            <small>${t('tour.pano.note')}${PANORAMAS[p.id].dist > 150 ? ' ' + t('tour.pano.far').replace('{m}', Math.round(PANORAMAS[p.id].dist / 10) * 10) : ''}</small>
          </div>
        </div>
      </div>` : '';
  if (!shots.length && !pano) return `
    <div class="block tour">
      ${head}
      <div class="tour-view tour-empty"><div class="tour-zoom"><img src="${cover(p)}" alt=""></div>
        <div class="tour-empty-msg"><p>${t('photo.soonHelp')}</p><button class="btn btn-light btn-sm" data-contribute="${p.id}" data-mode="photo">${ico('i-upload')}${t('photo.suggest')}</button></div>
      </div>
    </div>`;
  return `
    <div class="block tour" id="tour">
      ${head}
      ${pano && shots.length ? `<div class="pano-switch compare-switch" role="group" aria-label="${t('tour.view')}"><button aria-pressed="true" data-view="tour">${ico('i-photo')}${t('tour.mode.tour')}</button><button aria-pressed="false" data-view="pano">${ico('i-eye')}${t('tour.mode.pano')}</button></div>` : ''}
      ${panoBlock}
      ${shots.length ? `<div class="tour-stage" id="tourStage">
        <div class="tour-view" id="tourView" tabindex="0" aria-label="${t('tour.hint')}">
          <div class="tour-zoom" id="tourZoom"><img id="tourImg" src="" alt=""></div>
          <span class="chip chip-dark tour-hint" id="tourHint">${ico('i-info')}${t('tour.hint')}</span>
          <span class="chip chip-dark tour-count" id="tourCount"></span>
          ${shots.length > 1 ? `<button class="tour-nav prev" data-shot-step="-1" aria-label="${t('tour.prevShot')}">${ico('i-left')}</button><button class="tour-nav next" data-shot-step="1" aria-label="${t('tour.nextShot')}">${ico('i-right')}</button>` : ''}
          <button class="btn btn-primary btn-sm tour-back" id="tourBack" hidden>${ico('i-eye')}${t('tour.back')}</button>
          <div class="tour-panel" id="tourPanel" aria-live="polite"></div>
        </div>
        <p class="tour-credit" id="tourCredit"></p>
      </div>
      <div class="tour-thumbs" id="tourThumbs">
        ${shots.map((s, i) => `<button class="tour-thumb" data-shot="${i}"><img src="${s.img}" alt="" loading="lazy"><span>${esc(L(s.title))}</span></button>`).join('')}
      </div>` : ''}
    </div>`;
};

// Панорама грузится только по нажатию: iframe тяжёлый, а без интернета не работает
const openPano = (p) => {
  const box = $('#pano');
  if (!box) return;
  if (!navigator.onLine) { box.innerHTML = `<div class="pano-off">${ico('i-info')}<p>${t('tour.pano.offline')}</p></div>`; return; }
  box.innerHTML = `<iframe src="${panoURL(PANORAMAS[p.id])}" title="${esc(t('tour.mode.pano') + ': ' + L(p.name))}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    <p class="pano-credit">${t('tour.pano.credit')}</p>`;
};

const initTour = (p) => {
  const shots = tourOf(p);
  if (hasPano(p)) {
    $('[data-pano-open]')?.addEventListener('click', () => openPano(p));
    $$('[data-view]').forEach((b) => b.addEventListener('click', () => {
      $$('[data-view]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const pano = b.dataset.view === 'pano';
      $('#pano').hidden = !pano; $('#tourStage').hidden = pano; $('#tourThumbs').hidden = pano;
    }));
  }
  if (!shots.length) return;
  const view = $('#tourView'), zoom = $('#tourZoom'), panel = $('#tourPanel'), back = $('#tourBack');
  let shot = 0;
  const reset = () => {
    zoom.style.transform = ''; view.classList.remove('zoomed'); panel.classList.remove('open'); back.hidden = true;
    $$('.hotspot', view).forEach((h) => { h.style.left = h.dataset.x + '%'; h.style.top = h.dataset.y + '%'; });
    $$('.hotspot', view).forEach((h) => h.classList.remove('active')); $('#tourHint').style.opacity = 1;
  };
  const openPoint = (pt, i, el) => {
    const pts = shots[shot].points;
    $$('.hotspot', view).forEach((h) => h.classList.toggle('active', h === el));
    // точка переезжает в свободную часть кадра: слева от панели на ПК, над панелью на телефоне
    const sc = 2.1, narrow = view.clientWidth < 700;
    const tx = narrow ? 50 : 32, ty = narrow ? 26 : 50;
    const dx = clamp(tx - sc * pt.x, (1 - sc) * 100, 0), dy = clamp(ty - sc * pt.y, (1 - sc) * 100, 0);
    zoom.style.transformOrigin = '0 0';
    zoom.style.transform = `translate(${dx}%, ${dy}%) scale(${sc})`;
    el.style.left = dx + sc * pt.x + '%'; el.style.top = dy + sc * pt.y + '%';
    view.classList.add('zoomed');
    back.hidden = false;
    $('#tourHint').style.opacity = 0;
    panel.innerHTML = `
      <button class="close-x" data-tour-reset aria-label="${t('close')}">${ico('i-close')}</button>
      <span class="block-label">${t('tour.point')} ${i + 1} / ${pts.length}</span>
      <h4>${esc(L(pt.title))}</h4>
      <p>${esc(L(pt.text))}</p>
      ${pt.ins ? `<p class="inscription">${esc(pt.ins)}</p>` : ''}
      ${pts.length > 1 ? `<button class="btn btn-ghost btn-sm" data-tour-next>${t('tour.nextPoint')} →</button>` : ''}`;
    panel.classList.add('open');
    // фото с карточкой целиком под шапкой и закреплёнными вкладками
    const tabs = $('.tabs'), tb = tabs && getComputedStyle(tabs).position === 'sticky' ? tabs.getBoundingClientRect().bottom : $('.site-header').getBoundingClientRect().bottom;
    const vr = view.getBoundingClientRect(), gap = 12;
    if (vr.top < tb + gap || vr.bottom > innerHeight) window.scrollBy({ top: vr.top - tb - gap, behavior: 'smooth' });
    $('[data-tour-next]', panel)?.addEventListener('click', () => { const hs = $$('.hotspot', view); hs[(i + 1) % hs.length].click(); });
    $('[data-tour-reset]', panel).addEventListener('click', reset);
  };
  const setShot = (k) => {
    shot = (k + shots.length) % shots.length; reset();
    const s = shots[shot];
    $('#tourImg').src = s.img; $('#tourImg').alt = L(s.title);
    $('#tourCount').textContent = `${shot + 1} / ${shots.length}`;
    $('#tourCredit').innerHTML = creditHTML(s.img);
    $$('.hotspot', view).forEach((h) => h.remove());
    s.points.forEach((pt, i) => {
      const b = document.createElement('button');
      b.className = 'hotspot'; b.style.left = pt.x + '%'; b.style.top = pt.y + '%'; b.dataset.x = pt.x; b.dataset.y = pt.y;
      b.innerHTML = `${i + 1}<span class="hs-label">${esc(L(pt.title))}</span>`;
      b.setAttribute('aria-label', L(pt.title));
      b.addEventListener('click', (e) => { e.stopPropagation(); openPoint(pt, i, b); });
      view.appendChild(b);
    });
    $$('.tour-thumb[data-shot]').forEach((th) => th.classList.toggle('active', +th.dataset.shot === shot));
    $(`.tour-thumb[data-shot="${shot}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };
  $$('.tour-thumb[data-shot]').forEach((th) => th.addEventListener('click', () => setShot(+th.dataset.shot)));
  $$('[data-shot-step]', view).forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); setShot(shot + +b.dataset.shotStep); }));
  back.addEventListener('click', (e) => { e.stopPropagation(); reset(); });
  view.addEventListener('click', (e) => { if (view.classList.contains('zoomed') && !e.target.closest('.tour-panel, .tour-back')) reset(); });
  view.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setShot(shot + 1);
    if (e.key === 'ArrowLeft') setShot(shot - 1);
    if (e.key === 'Escape') reset();
  });
  // свайп между ракурсами (только в общем виде, чтобы не мешать приближению)
  let x0 = null;
  view.addEventListener('touchstart', (e) => { x0 = view.classList.contains('zoomed') ? null : e.touches[0].clientX; }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (x0 === null || shots.length < 2) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) setShot(shot + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  setShot(0);
};

/* ---------- Будущее: проблема, предложение, визуализация, статус ---------- */
// Макеты, накладываемые на фотографию: стенд, табличка с QR-кодом, навес со схемой
const svgLabel = (p) => esc(shortLabel(p).toUpperCase().slice(0, 22));
const QR_G = `<g fill="#1b1915"><rect x="4" y="4" width="14" height="14"/><rect x="34" y="4" width="14" height="14"/><rect x="4" y="34" width="14" height="14"/><rect x="22" y="22" width="6" height="6"/><rect x="30" y="30" width="6" height="6"/><rect x="38" y="38" width="10" height="10"/><rect x="22" y="40" width="6" height="8"/><rect x="8" y="8" width="6" height="6" fill="#fff"/><rect x="38" y="8" width="6" height="6" fill="#fff"/><rect x="8" y="38" width="6" height="6" fill="#fff"/></g>`;
const OVERLAYS = {
  stand: (p) => `<svg viewBox="0 0 200 270" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="34" y="170" width="10" height="100" fill="#3a3a3a"/><rect x="156" y="170" width="10" height="100" fill="#3a3a3a"/>
    <rect x="6" y="6" width="188" height="176" rx="6" fill="#fdfbf6" stroke="#2b2b2b" stroke-width="5"/>
    <rect x="9" y="9" width="182" height="34" fill="#8b1a1a"/>
    <text x="100" y="31" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#fff">${svgLabel(p)}</text>
    <rect x="18" y="54" width="70" height="52" fill="#b9a988"/><path d="M18 106 L40 80 L56 94 L70 78 L88 106Z" fill="#7d6b4c"/>
    <g fill="#8a8072"><rect x="96" y="56" width="86" height="5"/><rect x="96" y="67" width="80" height="5"/><rect x="96" y="78" width="86" height="5"/><rect x="96" y="89" width="62" height="5"/><rect x="96" y="100" width="76" height="5"/>
    <rect x="18" y="118" width="100" height="5"/><rect x="18" y="129" width="94" height="5"/><rect x="18" y="140" width="100" height="5"/><rect x="18" y="151" width="70" height="5"/></g>
    <rect x="130" y="116" width="52" height="52" fill="#fff" stroke="#1b1915" stroke-width="2"/><g transform="translate(130 116)">${QR_G}</g>
  </svg>`,
  qr: (p) => `<svg viewBox="0 0 120 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="55" y="110" width="10" height="120" fill="#3a3a3a"/>
    <rect x="6" y="6" width="108" height="112" rx="6" fill="#fdfbf6" stroke="#2b2b2b" stroke-width="4"/>
    <rect x="9" y="9" width="102" height="22" fill="#8b1a1a"/>
    <text x="60" y="24" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-weight="700" fill="#fff">${svgLabel(p)}</text>
    <g fill="#8a8072"><rect x="16" y="38" width="88" height="4"/><rect x="16" y="46" width="76" height="4"/></g>
    <rect x="34" y="56" width="52" height="52" fill="#fff" stroke="#1b1915" stroke-width="2"/><g transform="translate(34 56)">${QR_G}</g>
  </svg>`,
  canopy: (p) => `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 46 L150 6 L290 46 Z" fill="#5c3b22" stroke="#2b2b2b" stroke-width="4"/>
    <rect x="30" y="46" width="10" height="204" fill="#5c3b22"/><rect x="260" y="46" width="10" height="204" fill="#5c3b22"/>
    <rect x="50" y="62" width="200" height="130" rx="4" fill="#fdfbf6" stroke="#2b2b2b" stroke-width="4"/>
    <rect x="53" y="65" width="194" height="22" fill="#8b1a1a"/>
    <text x="150" y="80" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#fff">${svgLabel(p)}</text>
    <g fill="none" stroke="#7d6b4c" stroke-width="2"><path d="M64 140 H196"/><rect x="70" y="106" width="16" height="14"/><rect x="96" y="106" width="16" height="14"/><rect x="122" y="106" width="16" height="14"/><rect x="148" y="146" width="16" height="14"/><rect x="174" y="146" width="16" height="14"/></g>
    <rect x="204" y="132" width="38" height="38" fill="#fff" stroke="#1b1915" stroke-width="2"/><g transform="translate(205 133) scale(.69)">${QR_G}</g>
  </svg>`
};
const overlayHTML = (p) => { const kind = FUTURE_BY_TYPE[p.type].overlay; return `<div class="stand stand-${kind}">${OVERLAYS[kind](p)}</div>`; };
const SOLUTIONS = { stand: ['stand', 'qr', 'audio'], qr: ['qr', 'page', 'route'], canopy: ['canopy', 'names', 'qr'] };
const SOL_ICONS = { stand: 'i-stand', qr: 'i-qr', audio: 'i-audio', page: 'i-doc', route: 'i-road', canopy: 'i-layers', names: 'i-person' };

const futureHTML = (p) => {
  const F = FUTURE_BY_TYPE[p.type];
  if (!F || !p.future) return `
    <div class="block contribute"><div><h3>${t('fut.none')}</h3></div>
      <button class="btn btn-primary" data-contribute="${p.id}" data-mode="idea">${ico('i-bulb')}${t('fut.suggest')}</button></div>`;
  const status = p.future.status || 'idea';
  const step = STATUS_STEP[status];
  const before = img(p);
  const kind = F.overlay;
  return `
  <div class="stack">
    <div class="block future-top">
      <div>
        <span class="block-label">${t('fut.label')}</span>
        <h2>${t('fut.h.' + kind)}</h2>
        <p>${esc(L(p.future.proposal))}</p>
      </div>
      <div><span class="status">${L(STATUS[status])}</span><div class="status-steps" title="${t('fut.statusFlow')}">${[1, 2, 3, 4].map((n) => `<span class="${n <= step ? 'on' : ''}"></span>`).join('')}</div></div>
    </div>

    <div class="block block-pad">
      <div class="cmp-head">
        <h3 class="block-title" style="margin:0">${ico('i-layers')}${t('fut.compare')}</h3>
        <div class="compare-switch" role="group" aria-label="${t('fut.compareView')}"><button aria-pressed="true" data-cmp="side">${t('fut.side')}</button><button aria-pressed="false" data-cmp="swipe">${t('fut.slider')}</button></div>
      </div>
      <div class="compare" id="cmpSide">
        <figure class="block cmp">
          <div class="cmp-media" data-cmp-zoom="before" role="button" tabindex="0" aria-label="${t('fut.zoom')}"><span class="chip chip-dark">${t('fut.now')}</span><img src="${before}" alt="${esc(L(p.name))}"></div>
          <figcaption class="cmp-cap">${esc(L(F.problem))}</figcaption>
        </figure>
        <figure class="block cmp after">
          <div class="cmp-media" data-cmp-zoom="after" role="button" tabindex="0" aria-label="${t('fut.zoom')}"><span class="chip chip-gold-solid">${t('fut.offer')}</span><img src="${before}" alt="">${overlayHTML(p)}</div>
          <figcaption class="cmp-cap">${esc(L(F.benefit))}</figcaption>
          <div class="cmp-note">${t('fut.note')}</div>
        </figure>
      </div>
      <div class="swipe" id="cmpSwipe" hidden style="--pos:50%">
        <div class="swipe-layer"><img src="${before}" alt=""></div>
        <div class="swipe-layer swipe-after"><img src="${before}" alt="">${overlayHTML(p)}</div>
        <span class="chip chip-dark" style="left:14px">${t('fut.now')}</span><span class="chip chip-gold-solid" style="right:14px">${t('fut.offer')}</span>
        <div class="swipe-line"></div>
        <input type="range" min="0" max="100" value="50" step="0.1" aria-label="${t('fut.sliderAria')}">
      </div>
    </div>

    <div class="solution-cards">
      ${SOLUTIONS[kind].map((s) => `<article class="block solution"><div class="solution-ico">${ico(SOL_ICONS[s])}</div><h4>${t('sol.' + s)}</h4><p>${t('sol.' + s + '.d')}</p></article>`).join('')}
    </div>

    <div class="two-col">
      <div class="block block-pad">
        <h3 class="block-title">${ico('i-check')}${t('fut.benefit')}</h3>
        <p style="color:var(--ink-2)">${esc(L(F.benefit))}</p>
        <dl class="proposal-table" style="margin-top:18px">
          <div class="proposal-row"><dt>${t('fut.problem')}</dt><dd>${esc(L(F.problem))}</dd></div>
          <div class="proposal-row"><dt>${t('fut.proposal')}</dt><dd>${esc(L(p.future.proposal))}</dd></div>
          <div class="proposal-row"><dt>${t('fut.status')}</dt><dd>${L(STATUS[status])}</dd></div>
          <div class="proposal-row"><dt>${t('fut.cost')}</dt><dd>${p.future.cost ? esc(L(p.future.cost)) : t('fut.notDefined')}</dd></div>
        </dl>
      </div>
      <div class="block block-pad">
        <h3 class="block-title">${ico('i-doc')}${t('fut.steps')}</h3>
        <ol class="steps" id="steps">${F.steps.map((s) => `<li tabindex="0">${esc(L(s))}</li>`).join('')}</ol>
        <p class="note-line">${t('fut.stepsNote')}</p>
      </div>
    </div>

    <div class="block contribute">
      <div><h3>${t('fut.better')}</h3><p>${t('fut.better.p')}</p></div>
      <button class="btn btn-primary" data-contribute="${p.id}" data-mode="idea">${ico('i-bulb')}${t('fut.suggest')}</button>
    </div>
  </div>`;
};

const initFuture = (root, p) => {
  $$('[data-cmp]', root).forEach((b) => b.addEventListener('click', () => {
    $$('[data-cmp]', root).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#cmpSide').hidden = b.dataset.cmp !== 'side';
    $('#cmpSwipe').hidden = b.dataset.cmp !== 'swipe';
  }));
  const range = $('#cmpSwipe input', root);
  let raf = 0;
  range?.addEventListener('input', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => $('#cmpSwipe').style.setProperty('--pos', range.value + '%')); });
  const F = FUTURE_BY_TYPE[p.type];
  const zoomCmp = (m) => {
    const after = m.dataset.cmpZoom === 'after';
    // макет — инлайн-SVG поверх снимка, поэтому в лайтбоксе показываем тот же слой
    lightbox(`<img src="${img(p)}" alt="">${after ? overlayHTML(p) : ''}`,
      after ? t('fut.offer') : t('fut.now'),
      after ? t('fut.note') : L(F.problem), photo(p));
  };
  $$('[data-cmp-zoom]', root).forEach((m) => {
    m.addEventListener('click', () => zoomCmp(m));
    m.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zoomCmp(m); } });
  });
  $$('#steps li', root).forEach((li) => {
    const toggle = () => li.classList.toggle('done');
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
};

/* ============================================================
   12. ФОРМЫ: дополнить историю, предложить идею, сообщить об изменении
   ============================================================ */
const submissions = store.get('dp_submissions', []);
const saveSubmission = (s) => {
  submissions.unshift({ ...s, id: 'u' + Date.now(), date: new Date().toLocaleDateString(LANG === 'be' ? 'be-BY' : 'ru-RU') });
  store.set('dp_submissions', submissions);
  checkAchievements();
};

const validate = (form) => {
  let ok = true;
  $$('[required]', form).forEach((f) => {
    if (f.closest('[hidden]')) return;
    const bad = !f.value.trim();
    f.closest('.field')?.classList.toggle('invalid', bad);
    if (bad && ok) { f.focus(); ok = false; }
  });
  return ok;
};
const typeOptions = (sel) => ['photo', 'doc', 'memory', 'fix'].map((k) => `<option value="${k}"${k === sel ? ' selected' : ''}>${t('arch.' + k)}</option>`).join('');
// поля «рассказчик» и «дата записи» нужны только для воспоминаний
const memoryFields = (pre) => `
  <div class="field" data-memory-only hidden><label for="${pre}Narrator">${t('memory.narrator')}</label><input class="input" id="${pre}Narrator" required placeholder="${t('memory.narrator.ph')}"><span class="field-err">${t('form.required')}</span></div>
  <div class="field" data-memory-only hidden><label for="${pre}Recorded">${t('memory.recorded')}</label><input class="input" id="${pre}Recorded" type="date"></div>`;
const bindMemoryToggle = (form, select) => {
  const sync = () => $$('[data-memory-only]', form).forEach((el) => { el.hidden = select.value !== 'memory'; });
  select.addEventListener('change', sync); sync();
};

const MODES = {
  history: { title: 'form.history', type: 'photo' },
  photo: { title: 'photo.suggest', type: 'photo' },
  memory: { title: 'past.memories.btn', type: 'memory' },
  fix: { title: 'present.report', type: 'fix' },
  idea: { title: 'fut.suggest', type: 'fix', idea: true }
};
const openContribute = (placeId, mode = 'history') => {
  const p = byId(placeId);
  const m = MODES[mode] || MODES.history;
  modal(`
    <h2>${t(m.title)}</h2>
    <div class="modal-sub">${esc(L(p.name))}</div>
    <form id="cForm" novalidate>
      <div class="form-grid">
        ${m.idea ? '' : `<div class="field full"><label for="cType">${t('form.what')}</label><select class="select" id="cType">${typeOptions(m.type)}</select></div>${memoryFields('c')}`}
        <div class="field full"><label for="cText">${t(m.idea ? 'form.idea' : 'form.desc')}</label>
          <textarea class="textarea" id="cText" required placeholder="${t(m.idea ? 'form.idea.ph' : 'form.desc.ph')}"></textarea>
          <span class="field-err">${t('form.required')}</span></div>
        <div class="field"><label for="cFile">${t('form.file')} <span class="opt">(${t('form.optional')})</span></label>
          <label class="file-drop">${ico('i-upload')}<span data-fname>${t('form.chooseFile')}</span><input type="file" id="cFile"></label></div>
        <div class="field"><label for="cContact">${t('form.contact')}</label>
          <input class="input" id="cContact" required placeholder="${t('form.contact.ph')}" autocomplete="email"><span class="field-err">${t('form.contact.err')}</span></div>
        <div class="full"><button class="btn btn-primary btn-block" type="submit">${ico('i-upload')}${t('form.send')}</button></div>
        <p class="form-note full">${t('form.note')}</p>
      </div>
    </form>`);
  const f = $('#cForm');
  if (!m.idea) bindMemoryToggle(f, $('#cType'));
  $('#cFile').addEventListener('change', (e) => { $('[data-fname]', f).textContent = e.target.files[0]?.name || t('form.chooseFile'); });
  $$('.input, .textarea', f).forEach((i) => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(f)) return;
    const type = m.idea ? 'fix' : $('#cType').value;
    saveSubmission({
      place: placeId, type,
      title: t(m.idea ? 'form.ideaTitle' : 'form.addTitle.' + type),
      text: $('#cText').value.trim(),
      narrator: type === 'memory' ? $('#cNarrator').value.trim() : '',
      recorded: type === 'memory' ? $('#cRecorded').value : ''
    });
    closeOverlay();
    toast(t('form.thanks'));
    // воспоминание сразу видно на странице места с пометкой «На проверке»
    if (type === 'memory' && $('#placeRoot').dataset.current === placeId) { $('#placeRoot').dataset.current = ''; renderPlace(placeId, 'past'); }
  });
};

/* ============================================================
   13. АУДИОПЛЕЕР (один на страницу, независим от фототура)
   ============================================================ */
let audio = null;
const playerHTML = (a) => `
  <div class="player" data-audio="${a.audio}">
    <button class="player-btn" aria-label="${t('audio.play')}">${ico('i-play')}</button>
    <div class="player-main"><div class="player-title">${esc(L(a.title))} <span class="eq"><i></i><i></i><i></i></span></div><div class="player-bar"><i></i></div></div>
    <span class="player-time">0:00</span>
  </div>`;
const fmt = (s) => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
const stopAudio = () => {
  if (audio) { audio.pause(); audio = null; }
  $$('.player.playing').forEach((pl) => { pl.classList.remove('playing'); const b = $('.player-btn', pl); b.innerHTML = ico('i-play'); b.setAttribute('aria-label', t('audio.play')); });
};
document.addEventListener('click', (e) => {
  const tb = e.target.closest('[data-transcript]');
  if (tb) {
    const box = tb.nextElementSibling, open = box.hidden;
    box.hidden = !open; tb.setAttribute('aria-expanded', String(open));
    tb.textContent = t(open ? 'audio.hideText' : 'audio.showText');
    return;
  }
  const btn = e.target.closest('.player-btn');
  const bar = e.target.closest('.player-bar');
  const pl = (btn || bar)?.closest('.player');
  if (!pl) return;
  if (bar && audio && pl.classList.contains('playing')) {
    const r = bar.getBoundingClientRect(); audio.currentTime = ((e.clientX - r.left) / r.width) * (audio.duration || 0); return;
  }
  if (!btn) return;
  if (pl.classList.contains('playing')) { stopAudio(); return; }
  stopAudio();
  const a = audio = new Audio(pl.dataset.audio);
  pl.classList.add('playing'); btn.innerHTML = ico('i-pause'); btn.setAttribute('aria-label', t('audio.pause'));
  // обработчики держат свою ссылку: после stopAudio() глобальная audio = null
  a.addEventListener('timeupdate', () => {
    if (audio !== a || !pl.isConnected) return;
    $('.player-bar i', pl).style.width = (a.currentTime / (a.duration || 1)) * 100 + '%';
    $('.player-time', pl).textContent = `${fmt(a.currentTime)} / ${fmt(a.duration)}`;
  });
  a.addEventListener('ended', () => { if (audio === a) stopAudio(); });
  a.play().then(() => { if (!progress.witness) setProgress('witness', true); }).catch((e) => { if (audio !== a || e?.name === 'AbortError') return; stopAudio(); toast(t('audio.fail'), 'i-info'); });
});

/* ============================================================
   14. ГЕРОИ
   ============================================================ */
let heroRegion = 'all';
const renderHeroes = () => {
  const regs = ['all', ...new Set(HEROES.map((h) => byId(h.places[0]).region))];
  $('#heroFilter').innerHTML = regs.map((r) => `<button data-hr="${r}" aria-pressed="${r === heroRegion}">${r === 'all' ? t('all') : L(REGIONS[r].name)}</button>`).join('');
  $$('#heroFilter button').forEach((b) => b.addEventListener('click', () => { heroRegion = b.dataset.hr; renderHeroes(); }));
  const list = HEROES.filter((h) => heroRegion === 'all' || h.places.some((id) => byId(id).region === heroRegion));
  $('#heroesGrid').innerHTML = list.map((h) => {
    const p = byId(h.places[0]);
    return `<button class="block hero reveal" data-hero="${h.id}">
      <span class="hero-img${h.photo && !h.photo.cap ? ' portrait' : ''}"><img src="${heroImg(h)}" alt="${esc(L(h.name))}" loading="lazy"><span class="chip chip-dark">${esc(L(REGIONS[p.region].name))} ${t('regionShort')}</span></span>
      <span class="hero-body">
        <span class="t">${esc(L(h.name))}</span>
        <span class="hero-years">${h.years}</span>
        <span class="d">${esc(L(h.role))}. ${esc(L(h.short))}</span>
        <span class="hero-place">${ico('i-pin')}${esc(L(p.name))}</span>
      </span>
    </button>`;
  }).join('');
  observeReveal();
};
const openHero = (id) => {
  const h = HEROES.find((x) => x.id === id);
  modal(`
    <div class="hero-modal">
      <figure class="hero-photo"><img src="${heroImg(h)}" alt="${esc(L(h.name))}">${h.photo?.cap ? `<figcaption>${esc(L(h.photo.cap))}</figcaption>` : ''}${h.photo ? creditHTML(h.photo.src, 'credit') : ''}</figure>
      <div>
        <h2>${esc(L(h.name))}</h2>
        <div class="modal-sub">${h.years} · ${esc(L(h.role))}</div>
        <p>${esc(L(h.bio))}</p>
        ${NARRATION.heroes[h.id] ? `<div class="hero-audio">${playerHTML(storyAudio('heroes', h.id, T('Рассказ о герое', 'Аповед пра героя')))}${transcriptHTML(storyAudio('heroes', h.id, ''))}</div>` : ''}
        <span class="block-label">${t(h.places.length > 1 ? 'hero.places' : 'hero.place')}</span>
        <div class="linked-places">${h.places.map((pid) => { const p = byId(pid); return `<button class="mini" data-place="${p.id}"><img src="${img(p)}" alt=""><span><span class="t">${esc(L(p.name))}</span><span class="m">${esc(L(p.district))}</span></span></button>`; }).join('')}</div>
      </div>
    </div>`);
};

/* ============================================================
   15. ГОЛОСА И ДОКУМЕНТЫ (архив)
   ============================================================ */
const archFilter = { place: 'all', type: 'all', q: '' };
const allArchive = () => submissions.map((s) => ({ ...s, pending: true, dateText: t('arch.received') + ' ' + s.date, src: t('arch.pending') })).concat(ARCHIVE);

const archCard = (a) => {
  const p = byId(a.place);
  const [tName, tIco] = ARCH_TYPES[a.type] || ARCH_TYPES.doc;
  let media = '';
  if (a.img) media = `<div class="arch-media${a.old ? ' old' : ''}" data-arch-zoom="${a.id}" role="button" tabindex="0" aria-label="${t('fut.zoom')}"><img src="${a.img}" alt="${esc(L(a.title))}" loading="lazy"><span class="chip chip-dark">${ico(tIco)}${t(tName)}</span></div>`;
  else if (a.type === 'audio') media = `<div class="arch-audio-top"><span class="chip chip-dark">${ico(tIco)}${t(tName)}</span><div class="wave">${Array.from({ length: 26 }, (_, i) => `<i style="height:${10 + Math.round(Math.abs(Math.sin(i * 1.7)) * 46)}px"></i>`).join('')}</div></div><div class="arch-player">${playerHTML(a)}${transcriptHTML(a)}</div>`;
  else media = `<div class="arch-doc${a.type === 'memory' ? ' arch-memory' : ''}"><span class="chip ${a.pending ? 'chip-gold' : 'chip-red'}">${ico(tIco)}${a.pending ? t('arch.pending') + ' · ' + t(tName) : t(tName)}</span><div>${esc(a.quote || (a.type === 'memory' ? a.text : L(a.title)))}</div></div>`;
  return `<article class="block arch${a.pending ? ' pending' : ''}">
    ${media}
    <div class="arch-body">
      <h3>${esc(L(a.title))}</h3>
      <div class="arch-date">${esc(a.dateText || L(a.date))}</div>
      ${a.type === 'memory' ? `<p class="arch-meta">${t('memory.narrator')}: ${esc(a.narrator || t('memory.unknown'))} · ${t('memory.recorded')}: ${esc(a.recorded || t('memory.unknown'))}</p>` : `<p>${esc(L(a.text))}</p>`}
      <div class="arch-foot">${p ? `<button class="chip chip-link" data-place="${p.id}">${ico('i-pin')}${esc(L(p.settlement))}</button>` : ''}<span class="arch-src">${esc(a.src)}</span></div>
    </div>
  </article>`;
};

const renderArchive = () => {
  const q = archFilter.q.toLowerCase();
  const text = (v) => (v && typeof v === 'object' ? v.ru + ' ' + v.be : v || '');
  const list = allArchive().filter((a) =>
    (archFilter.place === 'all' || a.place === archFilter.place) &&
    (archFilter.type === 'all' || a.type === archFilter.type) &&
    (!q || [a.title, a.text, a.quote, a.narrator].map(text).join(' ').toLowerCase().includes(q)));
  $('#aTypes').innerHTML = [['all', 'all'], ['photo', 'arch.photos'], ['doc', 'arch.docs'], ['audio', 'arch.audio'], ['memory', 'arch.memories']].map(([k, n]) => `<button data-at="${k}" aria-pressed="${archFilter.type === k}">${t(n)}</button>`).join('');
  $$('#aTypes button').forEach((b) => b.addEventListener('click', () => { archFilter.type = b.dataset.at; renderArchive(); }));
  $('#archiveGrid').innerHTML = list.length ? list.map(archCard).join('')
    : `<div class="block empty" style="column-span:all">${ico('i-archive')}<p>${t('arch.empty')}</p></div>`;
};

const fillArchiveOptions = () => {
  const withArch = new Set(ARCHIVE.map((a) => a.place).concat(submissions.map((s) => s.place)));
  $('#aPlace').innerHTML = `<option value="all">${t('arch.allPlaces')}</option>` + PLACES.filter((p) => withArch.has(p.id)).map((p) => `<option value="${p.id}">${esc(L(p.name))}</option>`).join('');
  $('#aPlace').value = withArch.has(archFilter.place) ? archFilter.place : 'all';
  const cur = $('#sfPlace').value;
  $('#sfPlace').innerHTML = `<option value="">${t('form.choose')}</option>` + Object.entries(REGIONS).map(([k, r]) => `<optgroup label="${L(r.name)} ${t('regionWord')}">${PLACES.filter((p) => p.region === k).map((p) => `<option value="${p.id}">${esc(L(p.name))}</option>`).join('')}</optgroup>`).join('');
  $('#sfPlace').value = cur;
  const ty = $('#sfType').value || 'photo';
  $('#sfType').innerHTML = typeOptions(ty);
};

const initArchive = () => {
  fillArchiveOptions();
  $('#aPlace').addEventListener('change', (e) => { archFilter.place = e.target.value; renderArchive(); });
  let tm; $('#aSearch').addEventListener('input', (e) => { archFilter.q = e.target.value; clearTimeout(tm); tm = setTimeout(renderArchive, 200); });

  const form = $('#archiveForm'), drop = $('#sfDrop'), file = $('#sfFile');
  bindMemoryToggle(form, $('#sfType'));
  file.addEventListener('change', () => { $('#sfFileName').textContent = file.files[0]?.name || t('form.dropFile'); });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) { file.files = e.dataTransfer.files; $('#sfFileName').textContent = e.dataTransfer.files[0].name; } });
  $$('.input, .textarea, .select', form).forEach((i) => i.addEventListener('input', () => i.closest('.field')?.classList.remove('invalid')));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    const type = $('#sfType').value;
    saveSubmission({ place: $('#sfPlace').value, type, title: $('#sfTitle').value.trim(), text: $('#sfText').value.trim(),
      narrator: type === 'memory' ? $('#sfNarrator').value.trim() : '', recorded: type === 'memory' ? $('#sfRecorded').value : '' });
    form.reset(); $('#sfFileName').textContent = t('form.dropFile');
    $('#sfType').dispatchEvent(new Event('change'));
    archFilter.place = 'all'; archFilter.type = 'all';
    fillArchiveOptions();
    renderArchive();
    toast(t('form.thanksArchive'));
    $('#archiveGrid').scrollIntoView({ behavior: 'smooth' });
  });
};

const openArchiveItem = (id) => {
  const a = allArchive().find((x) => x.id === id);
  if (!a) return;
  if (!progress.witness) setProgress('witness', true);
  if (a.img) return lightbox(`<img src="${a.img}" alt="${esc(L(a.title))}">`, `${L(a.title)} · ${L(a.date)}`, `${L(a.text)} ${t('source')}: ${a.src}`, a.img);
  const p = byId(a.place);
  modal(`<h2>${esc(L(a.title))}</h2><div class="modal-sub">${esc(a.dateText || L(a.date))} · ${esc(p ? L(p.name) : '')}</div>
    ${a.quote ? `<blockquote class="quote" style="margin-bottom:16px">${esc(a.quote)}</blockquote>` : ''}
    ${a.type === 'audio' ? `<div style="margin-bottom:16px">${playerHTML(a)}${transcriptHTML(a)}</div>` : ''}
    <p>${esc(L(a.text))}</p><p class="form-note">${t('source')}: ${esc(a.src)}</p>
    ${p ? `<button class="btn btn-outline btn-sm" data-place="${p.id}">${ico('i-pin')}${t('btn.openPlace')}</button>` : ''}`);
};

/* ============================================================
   16. ВИКТОРИНА
   ============================================================ */
const Q_COUNT = 10, Q_TIME = 25;
const quiz = { active: false, view: 'start', list: [], i: 0, score: 0, streak: 0, best: 0, log: [], timer: null, t0: 0, saved: false, answered: false };

const quizStopTimer = () => { cancelAnimationFrame(quiz.timer); quiz.timer = null; };

const renderQuizStart = () => {
  quiz.active = false; quiz.view = 'start';
  const best = store.get('dp_quiz_best', 0);
  $('#quiz').innerHTML = `
    <div class="quiz-start">
      <div class="big-ico">${ico('i-quiz')}</div>
      <h2>${t('quiz.startH')}</h2>
      <p>${t('quiz.startP')}</p>
      <div class="rules">
        <div class="rule"><b>${Q_COUNT}</b><span>${t('quiz.rule.q').replace('{n}', QUIZ.length)}</span></div>
        <div class="rule"><b>${Q_TIME} ${t('quiz.sec')}</b><span>${t('quiz.rule.time')}</span></div>
        <div class="rule"><b>+20</b><span>${t('quiz.rule.streak')}</span></div>
      </div>
      <button class="btn btn-primary" id="qStart">${ico('i-play')}${t('quiz.start')}</button>
      ${best ? `<div class="best">${t('quiz.best')}: ${best} ${t('quiz.points')}</div>` : ''}
    </div>`;
  $('#qStart').addEventListener('click', startQuiz);
};

const startQuiz = () => {
  Object.assign(quiz, { active: true, i: 0, score: 0, streak: 0, best: 0, log: [], saved: false });
  // перемешиваем вопросы и варианты ответов
  quiz.list = shuffle(QUIZ).slice(0, Q_COUNT).map((q) => {
    const order = shuffle(q.a.map((_, k) => k));
    return { ...q, a: order.map((k) => q.a[k]), c: order.indexOf(q.c) };
  });
  renderQuestion();
};

const renderQuestion = () => {
  quizStopTimer();
  quiz.view = 'q'; quiz.answered = false;
  const q = quiz.list[quiz.i];
  $('#quiz').innerHTML = `
    <div class="q-top">
      <div class="q-dots">${quiz.list.map((_, k) => `<i class="${k < quiz.i ? (quiz.log[k].ok ? 'ok' : 'bad') : k === quiz.i ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="q-stats">
        <span class="q-stat" id="qScore">${ico('i-star')}${quiz.score}</span>
        <span class="q-stat streak" id="qStreak">${ico('i-flame')}×${quiz.streak}</span>
      </div>
    </div>
    <div class="q-timer"><i id="qTimer"></i></div>
    <div class="q-body">
      ${q.img ? `<div class="q-photo"><img src="${q.img}" alt="${t('quiz.photoAlt')}"></div>` : ''}
      <div class="q-cat"><span class="chip chip-red">${t('quiz.cat.' + q.cat)}</span> <span class="chip">${t('quiz.question')} ${quiz.i + 1} / ${quiz.list.length}</span></div>
      <h3 class="q-text">${esc(L(q.q))}</h3>
      <div class="q-feedback" id="qFeedback" aria-live="polite"></div>
      <div class="options">${q.a.map((a, k) => `<button class="option" data-k="${k}"><kbd>${k + 1}</kbd><span>${esc(L(a))}</span></button>`).join('')}</div>
    </div>`;
  $$('.option').forEach((b) => b.addEventListener('click', () => answer(+b.dataset.k)));
  quiz.t0 = performance.now();
  const bar = $('#qTimer');
  const tick = (tm) => {
    const left = 1 - (tm - quiz.t0) / (Q_TIME * 1000);
    if (!bar.isConnected) return;
    bar.style.transform = `scaleX(${Math.max(0, left)})`;
    bar.style.backgroundPosition = `${left * 100}% 0`;
    if (left <= 0) { answer(-1); return; }
    quiz.timer = requestAnimationFrame(tick);
  };
  quiz.timer = requestAnimationFrame(tick);
};

const answer = (k) => {
  if (!quiz.active || quiz.answered) return;
  quiz.answered = true;
  quizStopTimer();
  const q = quiz.list[quiz.i];
  const ok = k === q.c;
  const secs = (performance.now() - quiz.t0) / 1000;
  let pts = 0;
  if (ok) {
    quiz.streak++;
    pts = 100 + Math.round(Math.max(0, Q_TIME - secs) * 2) + (quiz.streak > 1 ? (quiz.streak - 1) * 20 : 0);
    quiz.score += pts; quiz.best = Math.max(quiz.best, quiz.streak);
  } else quiz.streak = 0;
  quiz.log.push({ q: q.q, ok, right: q.a[q.c], place: q.place, pts });

  $$('.option').forEach((b) => {
    const n = +b.dataset.k; b.disabled = true;
    b.classList.add(n === q.c ? 'correct' : n === k ? 'wrong' : 'dim');
  });
  $('#qScore').innerHTML = `${ico('i-star')}${quiz.score}`;
  $('#qStreak').innerHTML = `${ico('i-flame')}×${quiz.streak}`;
  $('#qScore').classList.add('bump');
  if (quiz.streak > 1) $('#qStreak').classList.add('bump');
  const last = quiz.i === quiz.list.length - 1;
  const fb = $('#qFeedback');
  fb.className = 'q-feedback show ' + (ok ? 'ok' : 'bad');
  fb.innerHTML = `<b>${ok ? `${t('quiz.right')} +${pts}` : k < 0 ? t('quiz.timeout') : t('quiz.wrong')}</b><span>${esc(L(q.fact))}</span><button class="btn btn-primary btn-sm" id="qNext">${t(last ? 'quiz.result' : 'quiz.next')} ${ico('i-arrow')}</button>`;
  $('#qNext').focus();
  $('#qNext').addEventListener('click', () => { quiz.i++; last ? renderResult() : renderQuestion(); });
};

const RANKS = [[90, 'rank.keeper'], [70, 'rank.expert'], [40, 'rank.explorer'], [0, 'rank.traveler']];
const renderResult = () => {
  quiz.active = false; quiz.view = 'result';
  const right = quiz.log.filter((l) => l.ok).length;
  const pct = Math.round((right / quiz.list.length) * 100);
  const rank = t(RANKS.find(([m]) => pct >= m)[1]);
  const prevBest = store.get('dp_quiz_best', 0);
  const record = !quiz.saved ? quiz.score > prevBest : quiz.record;
  if (!quiz.saved) {
    quiz.saved = true; quiz.record = record;
    if (record) store.set('dp_quiz_best', quiz.score);
    if (right > progress.quizRight) setProgress('quizRight', right);
    if (pct >= 70) confetti();
  }
  const C = 2 * Math.PI * 86;
  $('#quiz').innerHTML = `
    <div class="q-result">
      <div class="result-top">
        <div class="ring">
          <svg viewBox="0 0 200 200" aria-hidden="true"><circle class="bg" cx="100" cy="100" r="86"/><circle class="fg" id="ringFg" cx="100" cy="100" r="86" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>
          <div class="ring-num"><div><b>${right}/${quiz.list.length}</b><span>${t('quiz.correct')}</span></div></div>
        </div>
        <div>
          <span class="block-label">${t(record ? 'quiz.record' : 'quiz.yourResult')}</span>
          <div class="rank">${rank}</div>
          <div class="result-stats">
            <span class="q-stat">${ico('i-star')}${quiz.score} ${t('quiz.points')}</span>
            <span class="q-stat streak">${ico('i-flame')}${t('quiz.bestStreak')} ×${quiz.best}</span>
            <span class="q-stat">${pct}%</span>
          </div>
        </div>
      </div>
      <div class="review">${quiz.log.map((l) => `
        <div class="review-item"><span class="mark ${l.ok ? 'ok' : 'bad'}">${l.ok ? '✓' : '✕'}</span>
          <div>${esc(L(l.q))}<small>${l.ok ? '+' + l.pts + ' ' + t('quiz.points') : t('quiz.answer') + ': ' + esc(L(l.right))}</small></div>
          <button class="btn btn-ghost btn-sm" data-place="${l.place}">${t('quiz.place')} ${ico('i-arrow')}</button></div>`).join('')}</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
        <button class="btn btn-primary" id="qAgain">${ico('i-reset')}${t('quiz.again')}</button>
        <a class="btn btn-outline" href="#/map">${ico('i-map')}${t('quiz.toMap')}</a>
      </div>
    </div>`;
  requestAnimationFrame(() => setTimeout(() => { $('#ringFg').style.strokeDashoffset = C * (1 - pct / 100); }, 60));
  $('#qAgain').addEventListener('click', startQuiz);
};

// Конфетти — только за хороший результат, не мешает нажатиям (pointer-events: none)
const confetti = () => {
  const colors = ['#8b1a1a', '#c9a063', '#3f7451', '#2c4a6e', '#fff'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 2 + Math.random() * 2.5 + 's';
    c.style.animationDelay = Math.random() * .6 + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
};
// горячие клавиши 1–4 — только во время вопроса
document.addEventListener('keydown', (e) => {
  if (!quiz.active || quiz.view !== 'q' || quiz.answered) return;
  if (!$('#scene-quiz').classList.contains('active') || $('#overlay').classList.contains('open')) return;
  if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  const n = '1234'.indexOf(e.key);
  if (n >= 0) $$('.option')[n]?.click();
});

/* ============================================================
   17. МОЙ МАРШРУТ — сцена
   ============================================================ */
const haversine = ([a1, o1], [a2, o2]) => {
  const R = 6371, r = Math.PI / 180;
  const h = Math.sin((a2 - a1) * r / 2) ** 2 + Math.cos(a1 * r) * Math.cos(a2 * r) * Math.sin((o2 - o1) * r / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const renderRoute = () => {
  const root = $('#routeRoot');
  if (!route.length) {
    root.innerHTML = `<div class="block block-pad empty route-empty">${ico('i-road')}<p>${t('route.empty')}</p><a class="btn btn-primary" href="#/map">${ico('i-map')}${t('btn.toMap')}</a></div>`;
    return;
  }
  const places = route.map(byId);
  const pts = places.map((p) => p.coords);
  const km = pts.slice(1).reduce((s, c, i) => s + haversine(pts[i], c), 0);
  const ll = pts.map((c) => `${c[0]},${c[1]}`);
  const yandex = `https://yandex.by/maps/?rtext=${ll.join('~')}&rtt=auto`;
  const google = `https://www.google.com/maps/dir/${ll.join('/')}`;
  const proj = places.map((p) => project(p.coords));
  root.innerHTML = `
    <div class="route-layout">
      <div class="block route-box">
        <div class="results-head"><span>${t('route.stops')}</span><b>${route.length}</b></div>
        <ol class="route-list" id="routeList">
          ${places.map((p, i) => `
          <li class="route-item" draggable="true" data-i="${i}">
            <span class="route-num">${i + 1}</span>
            <img src="${img(p)}" alt="" loading="lazy">
            <span class="result-info"><a class="t" href="#/place/${p.id}">${esc(L(p.name))}</a><span class="m">${typeDot(p)}${esc(L(p.district))}</span></span>
            <span class="route-actions">
              <button class="round-btn sm" data-route-move="-1" aria-label="${t('route.up')}"${i ? '' : ' disabled'}>${ico('i-left', 'icon rot90')}</button>
              <button class="round-btn sm" data-route-move="1" aria-label="${t('route.down')}"${i < places.length - 1 ? '' : ' disabled'}>${ico('i-right', 'icon rot90')}</button>
              <button class="round-btn sm" data-route-del aria-label="${t('route.remove')}">${ico('i-close')}</button>
            </span>
          </li>`).join('')}
        </ol>
        <p class="form-note route-hint">${t('route.hint')}</p>
      </div>
      <aside class="stack">
        <div class="block route-map">
          <svg viewBox="0 0 1000 871" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t('route.mapAria')}">
            ${$('#mapSvg').innerHTML}
            <polyline points="${proj.map((c) => `${c.x * 10},${c.y * 8.71}`).join(' ')}" fill="none" stroke="#8b1a1a" stroke-width="5" stroke-dasharray="14 8" stroke-linejoin="round"/>
            ${proj.map((c, i) => `<g transform="translate(${c.x * 10} ${c.y * 8.71})"><circle r="20" fill="#8b1a1a" stroke="#fff" stroke-width="4"/><text y="7" text-anchor="middle" font-size="20" font-weight="700" fill="#fff" font-family="Arial">${i + 1}</text></g>`).join('')}
          </svg>
        </div>
        <div class="block block-pad">
          <p class="route-km">${t('route.km').replace('{km}', Math.round(km))}</p>
          <div class="ext-links">
            <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${yandex}">${t('map.yandex')}</a>
            <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${google}">${t('map.google')}</a>
          </div>
          <button class="btn btn-ghost btn-sm btn-block" style="margin-top:10px" id="routeClear">${ico('i-reset')}${t('route.clear')}</button>
        </div>
      </aside>
    </div>`;
  const list = $('#routeList');
  const move = (from, to) => {
    if (to < 0 || to >= route.length || from === to) return;
    const [x] = route.splice(from, 1); route.splice(to, 0, x);
    saveRoute(); renderRoute();
  };
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.route-item'); if (!li) return;
    const i = +li.dataset.i;
    const mv = e.target.closest('[data-route-move]');
    if (mv) { move(i, i + +mv.dataset.routeMove); return; }
    if (e.target.closest('[data-route-del]')) { route.splice(i, 1); saveRoute(); renderRoute(); }
  });
  // перетаскивание остановок (на компьютере)
  let dragI = null;
  list.addEventListener('dragstart', (e) => { const li = e.target.closest('.route-item'); dragI = +li.dataset.i; li.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
  list.addEventListener('dragend', () => $$('.route-item', list).forEach((x) => x.classList.remove('dragging', 'over')));
  list.addEventListener('dragover', (e) => { e.preventDefault(); const li = e.target.closest('.route-item'); $$('.route-item', list).forEach((x) => x.classList.toggle('over', x === li)); });
  list.addEventListener('drop', (e) => { e.preventDefault(); const li = e.target.closest('.route-item'); if (li && dragI !== null) move(dragI, +li.dataset.i); dragI = null; });
  $('#routeClear').addEventListener('click', () => { route = []; saveRoute(); renderRoute(); });
};

/* ============================================================
   18. ОБЩИЕ ОБРАБОТЧИКИ КЛИКОВ (делегирование)
   ============================================================ */
document.addEventListener('click', (e) => {
  const tg = e.target;
  if (tg.closest('[data-close]') || tg.id === 'overlay' || tg.id === 'overlayBody') { closeOverlay(); return; }
  if (tg.closest('[data-pop-close]')) { closePop(); return; }
  const lang = tg.closest('[data-lang]');
  if (lang) { changeLang(lang.dataset.lang); return; }
  const rt = tg.closest('[data-route-toggle]');
  if (rt) { toggleRoute(rt.dataset.routeToggle); return; }
  const place = tg.closest('[data-place]');
  if (place) { closeOverlay(); go('#/place/' + place.dataset.place); return; }
  const region = tg.closest('button[data-region]');
  if (region) { go('#/map'); setTimeout(() => setRegion(region.dataset.region), 120); return; }
  const regLink = tg.closest('[data-region-link]');
  if (regLink) { e.preventDefault(); go('#/map'); setTimeout(() => setRegion(regLink.dataset.regionLink), 120); return; }
  const hero = tg.closest('[data-hero]');
  if (hero) { openHero(hero.dataset.hero); return; }
  const arch = tg.closest('[data-arch], [data-arch-zoom]');
  if (arch) { openArchiveItem(arch.dataset.arch || arch.dataset.archZoom); return; }
  const archPlace = tg.closest('[data-archive-place]');
  if (archPlace) { archFilter.place = archPlace.dataset.archivePlace; go('#/archive'); $('#aPlace').value = archFilter.place; renderArchive(); return; }
  const contr = tg.closest('[data-contribute]');
  if (contr) { openContribute(contr.dataset.contribute, contr.dataset.mode); return; }
  const copy = tg.closest('[data-copy]');
  if (copy) { navigator.clipboard?.writeText(copy.dataset.copy).then(() => toast(t('present.copied')), () => toast(copy.dataset.copy)); return; }
  const rail = tg.closest('[data-rail]');
  if (rail) { $('#rail').scrollBy({ left: +rail.dataset.rail * 340, behavior: 'smooth' }); return; }
});
// Enter/пробел на «кнопках» из div (увеличение снимков в архиве)
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.arch-media[data-arch-zoom]')) { e.preventDefault(); openArchiveItem(e.target.dataset.archZoom); }
});

/* ============================================================
   19. ЯЗЫК: перерисовка всего динамического содержимого
   ============================================================ */
const rebuildAll = () => {
  renderLangSwitch();
  slider.render();
  renderHome();
  fillFilterOptions();
  applyFilters(false);
  fillArchiveOptions();
  $('#sfFileName').textContent = t('form.dropFile');
  $('#placeRoot').dataset.current = ''; // место перерисуется на новом языке
  if (quiz.view === 'q') renderQuestion();
  else if (quiz.view === 'result') renderResult();
  else renderQuizStart();
  const keepY = window.scrollY;
  prevScene = null;
  router();
  window.scrollTo({ top: keepY, behavior: 'instant' });
};

/* ============================================================
   20. ЗАПУСК
   ============================================================ */
$('#year').textContent = new Date().getFullYear();
applyStaticI18n();
renderLangSwitch();
saveRoute();
initFilters();
initArchive();
slider.init();
renderHome();
window.addEventListener('hashchange', router);
router();
