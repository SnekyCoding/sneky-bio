(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- глитч имени: один раз при загрузке и при наведении ---------- */
  const name = document.querySelector('.hero-name');
  if (name && !reduceMotion) {
    const glitch = () => {
      name.classList.remove('glitch');
      void name.offsetWidth;
      name.classList.add('glitch');
    };
    setTimeout(glitch, 400);
    name.addEventListener('mouseenter', glitch);
  }

  /* ---------- helpers для чатов ---------- */
  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function scrollFeed(feed) { feed.scrollTop = feed.scrollHeight; }

  /* ---------- бот на первом экране ---------- */
  const feed = document.getElementById('heroFeed');
  const MENU = '<button type="button" data-reply="bots">🤖 Боты</button>' +
    '<button type="button" data-reply="sites">🛒 Сайты</button>' +
    '<button type="button" data-reply="projects">🗂 Проекты</button>' +
    '<button type="button" data-reply="contact">💬 Написать</button>';
  const BACK = '<button type="button" data-reply="menu">⬅️ Назад</button>';

  const replies = {
    menu: {
      text: 'Что ещё показать?',
      kb: MENU
    },
    bots: {
      text: 'Боты от 1 000 ₽. В каждом есть админ-панель: статистика, рассылки, баны, реферальные ссылки и обязательные подписки.',
      kb: '<a href="#admin">🕹 Показать админку</a>' + BACK
    },
    sites: {
      text: 'Делаю сайты и интернет-магазины: каталог, корзина, личный кабинет, оплата. Вот пример, оплата там тестовая.',
      kb: '<a href="https://snekyshop.duckdns.org/" target="_blank" rel="noopener">🛒 SnekyStore</a>' + BACK
    },
    projects: {
      text: 'Последние работы: SnekyStore, Access Bot и Bunny GPT.',
      kb: '<a href="#projects">🗂 К проектам</a>' + BACK
    },
    contact: {
      text: 'Пишите в Telegram <a href="https://t.me/sneky" target="_blank" rel="noopener">@sneky</a> или на почту <code>esenin2211@gmail.com</code>',
      kb: '<a href="https://t.me/sneky" target="_blank" rel="noopener">💬 Открыть Telegram</a>' + BACK
    }
  };

  if (feed) {
    feed.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-reply]');
      if (!btn || btn.disabled) return;
      const r = replies[btn.dataset.reply];
      if (!r) return;

      feed.querySelectorAll('.kb button').forEach(b => { b.disabled = true; });
      const label = btn.textContent.trim();
      feed.appendChild(el('div', 'msg out new', label.replace(/</g, '&lt;')));

      const typing = el('div', 'msg in typing', '<i></i><i></i><i></i>');
      feed.appendChild(typing);
      scrollFeed(feed);

      setTimeout(() => {
        typing.remove();
        feed.appendChild(el('div', 'msg in new', r.text));
        feed.appendChild(el('div', 'kb new', r.kb));
        scrollFeed(feed);
      }, reduceMotion ? 0 : 650);
    });
  }

  /* ---------- админ-панель: экраны как в реальном боте ---------- */
  function groupScreen(id, name, count, text) {
    return {
      text: 'Группа: <b>' + name + '</b><br><br><b>ID группы:</b> ' + id + '<br><b>Сообщений:</b> ' + count + '<br><b>Текст:</b> ' + text,
      rows: [
        [['❌ Удалить сообщения у пользователей', 'groups']],
        [['⭕ Удалить группу (без сообщений)', 'groups']],
        [['🔤 Изменить название группы', 'groups']],
        [['⏳ Остановить таймер', 'groups']],
        [['◀️ Назад', 'groups']]
      ]
    };
  }
  const BACK_MENU = [['◀️ Выйти в меню', 'menu']];
  const screens = {
    menu: {
      text: 'Привет, админ! Что будем делать? 😐<br><br>Чтобы узнать ID пользователя через его username, воспользуйся ботом @username_to_id_bot',
      rows: [
        [['Статистика 🔢', 'stats'], ['Рассылка 📢', 'mail']],
        [['Забанить ❌', 'ban'], ['Разбанить ✅', 'unban']],
        [['Инфа 🤠', 'info'], ['Написать по ID ✍️', 'write']],
        [['Изменить обязательные подписки 💰', 'subs']],
        [['Управление админами 👨‍💻', 'admins']]
      ]
    },
    stats: {
      text: '<u><b>Статистика 🔢</b></u><br><br>🕐 Используют сейчас: <b>137</b><br><br>💚 Живых пользователей: <b>4 609</b><br>⛔ Кинули в блок: <b>203</b><br><br>🚫 Забаненых: <b>12</b><br>👨‍💻 Админов: <b>2</b><br><br>Всего пользователей: <b>4 812</b>',
      rows: [[['Обновить 🔁', 'stats']], BACK_MENU]
    },
    mail: {
      text: '💌 Рассылка',
      rows: [[['📦 Группы отправленных сообщений', 'groups']], [['📪 Создать рассылку', 'newmail']], BACK_MENU]
    },
    groups: {
      text: '📦 Группы отправленных сообщений',
      rows: [[['акция 01.06', 'group']], [['тестовая группа', 'group2']], [['➕ Добавить группу', 'groups']], [['◀️ Назад', 'mail']]]
    },
    group: groupScreen(1, 'акция 01.06', 5, '🔥 Скидка 20% на все тарифы до конца недели. Успейте оформить подписку, пока действует акция…'),
    group2: groupScreen(2, 'тестовая группа', 1, 'Проверка рассылки, не обращайте внимания 🙂'),
    newmail: {
      text: 'Отправьте сообщение для рассылки 📪<br><br>Можно прикрепить картинку, добавить кнопки, выбрать группу и время автоудаления.',
      rows: [[['◀️ Назад', 'mail']]]
    },
    ban: { text: 'Отправьте ID пользователя, которого нужно забанить ❌', rows: [BACK_MENU] },
    unban: { text: 'Отправьте ID пользователя, которого нужно разбанить ✅', rows: [BACK_MENU] },
    info: {
      text: '🔎 Выберите какая информация вам нужна:',
      rows: [[['О пользователе 📱', 'user']], [['Рефералка 🤝', 'ref']], BACK_MENU]
    },
    user: {
      text: '📱 Пользователь <code>628104553</code><br><br>В боте с: <b>12.09.2026</b><br>Пришёл по ссылке: <b>promo_vk</b><br>Статус: <b>активен</b>',
      rows: [[['◀️ Назад', 'info']]]
    },
    ref: {
      text: '🤝 Переходы по реферальным ссылкам<br><br>promo_vk: <b>341</b><br>ads_tg: <b>128</b><br>blogger_01: <b>57</b>',
      rows: [[['◀️ Назад', 'info']]]
    },
    write: { text: 'Отправьте ID пользователя, которому нужно написать ✍️', rows: [BACK_MENU] },
    subs: {
      text: 'Выберите кнопку для изменения или добавьте новую обязательную подписку:',
      rows: [[['📢 @news_channel', 'subs']], [['➕ Добавить подписку', 'subs']], [['👋 Изменить приветствие', 'subs']], BACK_MENU]
    },
    admins: {
      text: '🕹 Управление админами',
      rows: [[['Показать список админов 👨‍💻', 'adminlist']], [['Добавить ✅', 'admins'], ['Убрать ❌', 'admins']], BACK_MENU]
    },
    adminlist: {
      text: '👨‍💻 Список админов:<br><br>1) <code>628104553</code> ➡️ @sneky<br>2) <code>771203984</code> ➡️ @manager',
      rows: [BACK_MENU]
    }
  };

  const adminMsg = document.getElementById('adminMsg');
  const adminText = document.getElementById('adminText');
  const adminKb = document.getElementById('adminKb');
  const adminBot = document.getElementById('adminBot');
  let clock = 10;

  function render(key) {
    const s = screens[key];
    if (!s || !adminText) return;
    clock += 1;
    const t = '0:' + String(clock % 60).padStart(2, '0');
    adminText.innerHTML = s.text + '<time>' + t + '</time>';
    adminKb.innerHTML = s.rows.map(row =>
      '<div class="kb-row">' + row.map(([label, go]) =>
        '<button type="button" data-go="' + go + '">' + label + '</button>').join('') + '</div>'
    ).join('');
    adminMsg.classList.remove('edited');
    void adminMsg.offsetWidth;
    adminMsg.classList.add('edited');
    const af = document.getElementById('adminFeed');
    if (af) af.scrollTop = af.scrollHeight;
  }

  if (adminBot) {
    adminBot.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-go]');
      if (btn) render(btn.dataset.go);
    });
  }

  /* ---------- карусель проектов ---------- */
  const car = document.getElementById('carousel');
  const prev = document.getElementById('carPrev');
  const next = document.getElementById('carNext');
  const dotsBox = document.getElementById('carDots');
  if (car) {
    const slides = [...car.querySelectorAll('.slide')];
    dotsBox.innerHTML = slides.map(() => '<i></i>').join('');
    const dots = [...dotsBox.children];
    const step = () => slides[0].getBoundingClientRect().width + 20;
    function sync() {
      const max = car.scrollWidth - car.clientWidth;
      prev.disabled = car.scrollLeft <= 4;
      next.disabled = car.scrollLeft >= max - 4;
      let idx = Math.round(car.scrollLeft / step());
      if (car.scrollLeft >= max - 4) idx = slides.length - 1;
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    }
    prev.addEventListener('click', () => car.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => car.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    car.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ---------- окно с подробностями проекта ---------- */
  const projects = {
    shop: {
      wide: true,
      kind: 'Сайт на Django',
      title: 'SnekyStore',
      lead: 'Интернет-магазин одежды и обуви. Оплата работает в тестовом режиме, поэтому заказ можно пройти до конца. Тестовая карта 5555 5555 5555 4444, остальные данные любые',
      features: [
        ['Каталог', 'Категории, бренды, товары с фото и размерами. Фильтры, поиск в шапке и блок недавно просмотренных товаров.'],
        ['Корзина', 'Хранится в сессии и в базе, счётчик товаров виден в шапке. Промокод применяется прямо в корзине.'],
        ['Аккаунты', 'Регистрация, вход и личный кабинет с историей заказов. Сохранённые данные сами подставляются при оформлении. Частота запросов ограничена, чтобы защитить от перебора.'],
        ['Купоны', 'Скидки с лимитом на число использований.'],
        ['Заказы и доставка', 'Самовывоз, курьер или Почта России, у каждого способа своя цена. После оформления товар резервируется на 24 часа.'],
        ['Оплата', 'Через ЮKassa. Если заказ не оплатить за 24 часа, Celery отменит его автоматически.'],
        ['Информационные страницы', 'Доставка, оплата, возврат, реквизиты, политика конфиденциальности.'],
        ['Деплой', 'Docker Compose: nginx → gunicorn, Celery worker и beat, PostgreSQL.']
      ],
      stack: ['Python', 'Django', 'PostgreSQL', 'Celery', 'ЮKassa', 'Docker Compose', 'nginx', 'gunicorn'],
      images: [
        ['images/shop-catalog.webp', 'Каталог магазина'],
        ['images/shop-product.webp', 'Карточка товара с выбором размера'],
        ['images/shop-cart.webp', 'Корзина с промокодом'],
        ['images/shop-checkout.webp', 'Оформление заказа и выбор доставки'],
        ['images/shop-order.webp', 'Заказ оформлен, товар зарезервирован на 24 часа'],
        ['images/shop-pay.webp', 'Тестовая оплата через ЮKassa'],
        ['images/shop-paid.webp', 'Оплата прошла'],
        ['images/shop-profile.webp', 'Личный кабинет: заказы и данные']
      ],
      links: '<a class="btn" href="https://snekyshop.duckdns.org/" target="_blank" rel="noopener">Открыть магазин</a><span class="tag-price">от 35 000 ₽ под ключ</span>'
    },
    access: {
      kind: 'Telegram-бот на Aiogram 3',
      title: 'Access Bot',
      lead: 'Бот для продажи доступа в приватные Telegram-каналы. Пользователь выбирает тариф, оплачивает чек и получает одноразовые ссылки в закрытые чаты. Когда срок тарифа заканчивается, бот сам исключает его из чатов.',
      features: [
        ['Тарифы', 'От одного дня до доступа навсегда. У каждого тарифа своя картинка и цена.'],
        ['Оплата', 'Ссылка на оплату через ЮKassa и кнопка «Проверить оплату». После оплаты бот сразу присылает ссылки в чаты.'],
        ['Автоисключение', 'APScheduler следит за сроками и убирает пользователя из чатов, когда тариф истёк.'],
        ['Админ-панель', 'Стандартная админка, плюс ручное добавление и удаление пользователей в приватных чатах, изменение чатов, тарифов и текста меню.'],
        ['Картинки тарифов', 'При изменении тарифа его текст автоматически подставляется в фото в боте.']
      ],
      stack: ['Python', 'Aiogram 3', 'PostgreSQL', 'SQLAlchemy', 'APScheduler', 'ЮKassa'],
      images: [
        ['images/acceess_bot-800.webp', 'Обложка Access Bot'],
        ['images/access-menu.webp', 'Главное меню с выбором подписки'],
        ['images/access-tariff.webp', 'Тариф с картинкой и ценой'],
        ['images/access-pay.webp', 'Оплата через ЮKassa (тестовый платёж)'],
        ['images/access-paid.webp', 'Платёж прошёл'],
        ['images/access-links.webp', 'Ссылки в приватные чаты после оплаты'],
        ['images/access-admin.webp', 'Админка: чаты, тарифы и текст меню']
      ],
      links: '<a class="btn ghost" href="https://t.me/sneky_projects/320" target="_blank" rel="noopener">Пост в канале</a><span class="tag-price">10 000 ₽ под ключ</span>'
    },
    bunny: {
      kind: 'Telegram-бот на Aiogram 3',
      title: 'Bunny GPT',
      lead: 'Telegram-бот, в котором можно бесплатно генерировать текст и картинки. У каждого пользователя свой профиль и настройки, а для расширенных возможностей есть платная подписка с оплатой в крипте.',
      features: [
        ['Генерация', 'Текст: GPT-3.5-turbo, GPT-4, Gemini-1.5. Картинки: Pollinations, Prodia, Flux. Можно повторить генерацию или очистить историю.'],
        ['Роли', 'Бот отвечает в выбранной пользователем роли.'],
        ['Профиль и настройки', 'У каждого пользователя свои: длина истории сообщений, дополнительные кнопки, анонимность в топе и своя GIF в главном меню.'],
        ['Топ и рефералы', 'Топ пользователей и реферальная программа с уведомлением о новом приглашённом.'],
        ['Подписка', 'Статус продвинутого пользователя, оплата в крипте через CryptoBot.'],
        ['FAQ', 'Ответы на частые вопросы прямо в боте.'],
        ['Админ-панель', 'Стандартная админка, плюс изменение цены подписки и статуса пользователя.']
      ],
      stack: ['Python', 'Aiogram 3', 'PostgreSQL', 'SQLAlchemy', 'CryptoBot', 'g4f', 'Gemini API'],
      images: [
        ['images/bunny_gpt-800.webp', 'Логотип Bunny GPT'],
        ['images/bunny-menu.webp', 'Главное меню со своей GIF'],
        ['images/bunny-profile.webp', 'Профиль пользователя'],
        ['images/bunny-text-models.webp', 'Выбор модели для текста'],
        ['images/bunny-chat.webp', 'Диалог с Gemini'],
        ['images/bunny-image-models.webp', 'Выбор модели для картинок'],
        ['images/bunny-settings.webp', 'Настройки бота'],
        ['images/bunny-help.webp', 'Раздел помощи'],
        ['images/bunny-referral.webp', 'Реферальная программа'],
        ['images/bunny-payment.webp', 'Оплата подписки через CryptoBot']
      ],
      links: '<a class="btn" href="https://t.me/gptbunnybot" target="_blank" rel="noopener">Открыть @gptbunnybot</a><a class="btn ghost" href="https://t.me/sneky_projects/310" target="_blank" rel="noopener">Пост в канале</a>'
    }
  };

  const modal = document.getElementById('pmodal');
  const pmTrack = document.getElementById('pmTrack');
  const pmThumbs = document.getElementById('pmThumbs');
  const pmPrev = document.getElementById('pmPrev');
  const pmNext = document.getElementById('pmNext');
  const pmCount = document.getElementById('pmCount');
  const pmCap = document.getElementById('pmCap');
  let current = null, curIdx = 0;

  function goTo(i, smooth) {
    if (!current) return;
    i = Math.max(0, Math.min(current.images.length - 1, i));
    pmTrack.scrollTo({ left: i * pmTrack.clientWidth, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    markIndex(i);
  }
  function markIndex(i) {
    curIdx = i;
    const n = current.images.length;
    pmCount.textContent = (i + 1) + ' / ' + n;
    pmCap.textContent = current.images[i][1];
    pmPrev.disabled = i === 0;
    pmNext.disabled = i === n - 1;
    [...pmThumbs.children].forEach((b, k) => {
      const on = k === i;
      b.setAttribute('aria-current', String(on));
      if (on) {
        const l = b.offsetLeft - (pmThumbs.clientWidth - b.offsetWidth) / 2;
        pmThumbs.scrollTo({ left: l, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }
  if (pmTrack) {
    let raf = 0;
    pmTrack.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(pmTrack.scrollLeft / pmTrack.clientWidth);
        if (current && i !== curIdx) markIndex(i);
      });
    }, { passive: true });
    pmPrev.addEventListener('click', () => goTo(curIdx - 1, true));
    pmNext.addEventListener('click', () => goTo(curIdx + 1, true));
    pmThumbs.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-i]');
      if (b) goTo(Number(b.dataset.i), true);
    });
  }

  function openProject(key) {
    const p = projects[key];
    if (!p || !modal) return;
    current = p;
    modal.classList.toggle('wide', !!p.wide);
    document.getElementById('pmKind').textContent = p.kind;
    document.getElementById('pmTitle').textContent = p.title;
    document.getElementById('pmLead').textContent = p.lead;
    document.getElementById('pmFeatures').innerHTML = p.features.map(([t, d]) =>
      '<div class="pm-feat"><b>' + t + '</b><span>' + d + '</span></div>').join('');
    document.getElementById('pmStack').innerHTML = p.stack.map(s => '<li>' + s + '</li>').join('');
    document.getElementById('pmLinks').innerHTML = p.links;
    pmTrack.innerHTML = p.images.map(([src, alt], i) =>
      '<div class="pm-slide"><img src="' + src + '" alt="' + alt + '"' + (i > 1 ? ' loading="lazy"' : '') + '></div>').join('');
    const many = p.images.length > 1;
    pmThumbs.innerHTML = many ? p.images.map(([src, alt], i) =>
      '<button type="button" data-i="' + i + '" aria-label="' + alt + '"><img src="' + src + '" alt="" loading="lazy"></button>').join('') : '';
    pmPrev.hidden = pmNext.hidden = pmCount.hidden = !many;
    modal.scrollTop = 0;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
    pmTrack.scrollLeft = 0;
    markIndex(0);
  }
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (!current || e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(curIdx + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(curIdx - 1, true); }
    });
    window.addEventListener('resize', () => { if (modal.open) goTo(curIdx, false); });
  }
  function closeProject() {
    if (modal.open) modal.close();
  }
  if (modal) {
    document.querySelectorAll('.slide').forEach(s => {
      s.querySelector('.slide-open').addEventListener('click', () => openProject(s.dataset.project));
    });
    document.getElementById('pmClose').addEventListener('click', closeProject);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
    modal.addEventListener('close', () => { document.body.style.overflow = ''; });
  }

  /* ---------- активная команда в навигации ---------- */
  const ids = ['start', 'services', 'admin', 'projects', 'contact'];
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const links = document.querySelectorAll('.nav a');
  function updateActive() {
    let current = sections[0] && sections[0].id;
    for (const s of sections) {
      if (s.getBoundingClientRect().top - 160 <= 0) current = s.id;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = ids[ids.length - 1];
    }
    links.forEach(a => a.classList.toggle('active', a.dataset.key === current));
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
})();
