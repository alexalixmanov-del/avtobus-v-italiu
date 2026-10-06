import React from 'react';
import { renderTemplate } from '../.build/template.js';
import { P0_COPY } from './copy.js';

const DAYS = {
  tue: { ua: 'вт', ru: 'вт', it: 'mar', i: 2 },
  wed: { ua: 'ср', ru: 'ср', it: 'mer', i: 3 },
  thu: { ua: 'чт', ru: 'чт', it: 'gio', i: 4 },
  fri: { ua: 'пт', ru: 'пт', it: 'ven', i: 5 },
  sat: { ua: 'сб', ru: 'сб', it: 'sab', i: 6 },
  sun: { ua: 'нд', ru: 'вс', it: 'dom', i: 7 }
};

const UA_CITIES = [
  { k: 'kryvyi', ua: 'Кривий Ріг', ru: 'Кривой Рог', it: 'Kryvyi Rih', base: 150, pesaro: 160, ancona: 170, pescara: 170, dep: ['tue', '12:00'], arr: ['sun', '14:00'] },
  { k: 'kropyv', ua: 'Кропивницький', ru: 'Кропивницкий', it: 'Kropyvnytskyi', base: 150, pesaro: 160, ancona: 170, pescara: 170, dep: ['tue', '14:00'], arr: ['sun', '12:00'] },
  { k: 'cherkasy', ua: 'Черкаси', ru: 'Черкассы', it: 'Cherkasy', base: 150, pesaro: 160, ancona: 160, pescara: 160, dep: ['tue', '16:00'], arr: ['sun', '10:00'] },
  { k: 'kyiv', ua: 'Київ', ru: 'Киев', it: 'Kyiv', base: 140, pesaro: 150, ancona: 150, pescara: 150, dep: ['tue', '19:30'], arr: ['sun', '06:30'] },
  { k: 'zhytomyr', ua: 'Житомир', ru: 'Житомир', it: 'Zhytomyr', base: 140, pesaro: 150, ancona: 150, pescara: 150, dep: ['tue', '22:30'], arr: ['sun', '04:30'] },
  { k: 'rivne', ua: 'Рівне', ru: 'Ровно', it: 'Rivne', base: 130, pesaro: 140, ancona: 140, pescara: 140, dep: ['wed', '01:00'], arr: ['sun', '02:00'] },
  { k: 'lviv', ua: 'Львів', ru: 'Львов', it: 'Lviv', base: 120, pesaro: 120, ancona: 120, pescara: 120, dep: ['wed', '03:30'], arr: ['sat', '23:00'] },
  { k: 'stryi', ua: 'Стрий', ru: 'Стрый', it: 'Stryi', base: 120, pesaro: 120, ancona: 120, pescara: 120, dep: ['wed', '05:00'], arr: ['sat', '22:00'] },
  { k: 'uzhhorod', ua: 'Ужгород', ru: 'Ужгород', it: 'Uzhhorod', base: 120, pesaro: 120, ancona: 120, pescara: 120, dep: ['wed', '07:30'], arr: ['sat', '19:00'] }
];

const IT_CITIES = [
  { k: 'trieste', name: 'Trieste', tier: 'base', arr: ['wed', '22:30'], dep: ['sat', '04:00'] },
  { k: 'venezia', name: 'Venezia', tier: 'base', arr: ['thu', '00:50'], dep: ['sat', '01:40'] },
  { k: 'padova', name: 'Padova', tier: 'base', arr: ['thu', '01:30'], dep: ['sat', '01:00'] },
  { k: 'rovigo', name: 'Rovigo', tier: 'base', arr: ['thu', '02:30'], dep: ['sat', '00:10'] },
  { k: 'ferrara', name: 'Ferrara', tier: 'base', arr: ['thu', '03:20'], dep: ['fri', '23:00'] },
  { k: 'bologna', name: 'Bologna', tier: 'base', arr: ['thu', '04:20'], dep: ['fri', '22:00'] },
  { k: 'imola', name: 'Imola', tier: 'base', arr: ['thu', '05:20'], dep: ['fri', '21:10'] },
  { k: 'forli', name: 'Forlì', tier: 'base', arr: ['thu', '06:00'], dep: ['fri', '20:20'] },
  { k: 'rimini', name: 'Rimini', tier: 'base', arr: ['thu', '07:00'], dep: ['fri', '19:20'] },
  { k: 'pesaro', name: 'Pesaro', tier: 'pesaro', arr: ['thu', '07:30'], dep: ['fri', '18:40'] },
  { k: 'ancona', name: 'Ancona', tier: 'ancona', arr: ['thu', '09:00'], dep: ['fri', '17:30'] },
  { k: 'pescara', name: 'Pescara', tier: 'pescara', arr: ['thu', '11:00'], dep: ['fri', '15:00'] }
];

const SEAT_ROWS = [
  [1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20],
  [21, 22, 23, 24], [25, 26, 27, 28], [29, 30, null, null], [31, 32, 33, 34],
  [35, 36, 37, 38], [39, 40, 41, 42], [43, 44, 45, 46], [47, 48, 49, 50]
];

const T = {
  ua: {
    nav: { search: 'Рейси', stops: 'Поїздка', seats: 'Місця', faq: 'Питання' },
    hero: {
      kicker: 'Україна ⇄ Італія',
      t1: 'Автобус в Італію', t2: 'без пересадок',
      sub: 'Забронюйте поїздку з України до Італії за кілька кліків.',
      chips: ['Виїзд щовівторка', 'Без пересадок', '21 місто на маршруті']
    },
    res: { sub: 'ціна за напрямком, у євро', pick: 'Обрати місце',
      empty: 'Оберіть напрямок, міста та дату виїзду', emptySub: 'Після цього тут з’являться рейс, час у дорозі та ціна.', emptyCta: 'До пошуку' },
    seat: { title: 'Схема салону', sub: 'Оберіть місце — воно потрапить у заявку.', driver: 'водій', picked: 'обране', free: 'вільне', taken: 'зайняте', blocked: 'заблоковане', loading: 'Оновлюємо наявність місць…' },
    ph2: { email: 'olena@email.com', comment: 'Побажання, зупинка, багаж…' },
    seatsError: 'Не вдалося завантажити актуальну інформацію про посадочні місця. Спробуйте ще раз.',
    sendError: 'Не вдалося надіслати заявку. Спробуйте ще раз.',
    sendOk: 'Заявку надіслано! Номер заявки: ',
    sendOkNote: 'Менеджер зв’яжеться з вами для підтвердження місця.',
    modal: { title: 'Вашу заявку прийнято!', no: 'Номер заявки', contacts: 'Зв’язатися з менеджером', call: 'Подзвонити', close: 'Закрити' },
    dupA: 'На цю дату у вас уже є заявка № ', dupB: '. Щоб змінити її, напишіть менеджеру в WhatsApp або Viber.',
    retry: 'Спробувати ще раз',
    pax: { title: 'Дані пасажирів' },
    pass: { title: 'Ваш квиток', code: 'код', note: 'Це попередній квиток. Місце закріплюється після підтвердження менеджера у чаті.' },
    stops: { title: 'Що входить у поїздку' },
    faq: {
      title: 'Часті питання',
      items: [
        { q: 'Як забронювати місце?', a: 'Оберіть міста, дату й місце на схемі, заповніть дані пасажирів і натисніть WhatsApp або Viber. Заявка прийде менеджеру готовим повідомленням — він підтвердить бронювання.' },
        { q: 'Коли і як оплачувати?', a: 'Оплата узгоджується з менеджером у чаті після підтвердження місця. Ціна на сайті — за квиток в одну сторону, для двох пасажирів або туди-назад сума перераховується автоматично.' },
        { q: 'Скільки багажу можна взяти?', a: '30 кг у багажному відділенні та 5 кг ручної поклажі в салоні входять у квиток. Кожен додатковий кілограм — 1,5 €; вкажіть їх у заявці, і сума одразу порахується.' },
        { q: 'Які документи потрібні?', a: 'Закордонний паспорт, чинний для в’їзду в ЄС. Для дітей — власний паспорт і згода батьків, якщо дитина їде без них.' },
        { q: 'Де відбувається посадка й висадка?', a: 'Посадка та висадка проводяться у призначених місцях по маршруту. Додаткові посадку чи висадку потрібно узгодити з менеджером у чаті.' },
        { q: 'А якщо мені потрібно до Словенії?', a: 'Так, ми їдемо до Словенії — Марібор і Любляна. Обидва міста по дорозі до Італії, тож окремої пересадки не потрібно. Вартість рахується як до Трієста. Напишіть у чат — менеджер підтвердить місце висадки й точну ціну.' },
        { q: 'Чи можна передати посилку без пасажира?', a: 'Так, ми возимо документи, одяг, ліки та невеликі передачі тим самим рейсом. Напишіть у WhatsApp або Viber — узгодимо вартість за розміром.' }
      ]
    },
    f: {
      dirUaIt: 'Україна → Італія', dirItUa: 'Італія → Україна', dirLabel: 'Напрямок поїздки',
      from: 'Звідки', to: 'Куди', dateOut: 'Дата виїзду', dateBack: 'Дата повернення',
      choose: 'Оберіть місто', chooseDate: 'Оберіть дату',
      pax: 'Пасажирів', search: 'Знайти рейс', one: 'В одну сторону', round: 'Туди й назад',
      first: 'Ім’я', last: 'Прізвище', phone: 'Телефон', bag: 'Багаж',
      extraKg: 'Додаткові кілограми понад 30 кг', seat: 'Місце', total: 'до сплати', name: 'Пасажир',
      email: 'Email', emailNote: 'Надішлемо підтвердження броні на цю адресу', comment: 'Коментар', submit: 'Надіслати заявку', sending: 'Надсилаємо…',
      route: 'Маршрут', type: 'Тип квитка', price: 'Вартість', paxN: 'Пасажир', pickDate: 'оберіть дату'
    },
    ph: { first: 'Олена', last: 'Ковальчук' },
    bagRules: ['30 кг у багажнику безкоштовно', '5 кг ручної поклажі в салоні', '1,5 € за кожен додатковий кг'],
    bagNone: 'без доплат', bagExtra: 'додатково',
    onboard: [
      { t: 'Wi-Fi у салоні', d: 'Інтернет на маршруті — щоб бути на зв’язку.' },
      { t: 'Кондиціонер', d: 'Клімат влітку та обігрів у холодну пору.' },
      { t: 'Туалет', d: 'Біотуалет плюс регулярні технічні зупинки.' }
    ],
    footer: { ua: 'Україна', it: 'Італія', note: 'Розклад може змінюватися через ситуацію на кордоні', hours: 'Щодня 08:00–21:00 за київським часом' },
    consentA: 'Я погоджуюся з ', consentOferta: 'публічною офертою', consentB: ' та ', consentPrivacy: 'обробкою персональних даних', consentShort: 'згода з офертою',
    seatConflict: 'Місце вже зайняте — оберіть, будь ласка, інше. Схему оновлено.',
    searchErr: 'Щоб знайти рейс, оберіть: ',
    wdays: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    payNote: 'Розрахунок готівкою при посадці',
    legal: { oferta: 'Публічна оферта', refund: 'Умови повернення', contacts: 'Контакти й реквізити', privacy: 'Політика конфіденційності' },
    resEmptyTitle: 'Ваш рейс',
    res1: 'Рейс', res2: 'на', perPerson: 'за одного пасажира', priceLabel: 'разом', freeForms: ['вільне місце', 'вільні місця', 'вільних місць'],
    legOut: 'Туди', legBack: 'Назад', legPrice: 'за напрямок',
    durationNA: 'уточнюйте', hrs: 'год', mins: 'хв', stopsForms: ['зупинка в дорозі', 'зупинки в дорозі', 'зупинок у дорозі'], direct: 'без пересадок',
    tags: ['Wi-Fi', 'Кондиціонер', 'Туалет', 'Зупинки на відпочинок'],
    msgTitle: '🚌 Заявка з сайту Avtobus v Italiu',
    err: 'Заповніть, будь ласка: ',
    toastWa: 'Текст заявки скопійовано. Відкриваємо WhatsApp…',
    toastViber: 'Текст заявки скопійовано. У Viber натисніть і утримуйте поле повідомлення → «Вставити».',
    bar: { find: 'Знайти рейс', seat: 'Обрати місце', steps: ['Рейс', 'Місце', 'Дані'], call: 'Зателефонувати', ask: 'Є питання? Напишіть менеджеру', sentBtn: 'Заявку надіслано ✓', sentA: 'Заявку № ', sentB: ' надіслано', waHi: 'Вітаю! ', waSent: 'Моя заявка № ', waWant: 'Хочу забронювати квиток', seatsW: 'місця', extra: 'Додатково (необов’язково)', extraSub: 'Коментар, додатковий багаж. 30 кг уже включено.' },
    savedOk: ' Заявку записано в таблицю.', savedFail: ' Таблиця недоступна — надішліть заявку в чат.',
    searched: 'Рейс знайдено — оберіть місце нижче.'
  },
  ru: {
    nav: { search: 'Рейсы', stops: 'Поездка', seats: 'Места', faq: 'Вопросы' },
    hero: {
      kicker: 'Украина ⇄ Италия',
      t1: 'Автобус в Италию', t2: 'без пересадок',
      sub: 'Забронируйте поездку из Украины в Италию за пару кликов.',
      chips: ['Выезд каждый вторник', 'Без пересадок', '21 город на маршруте']
    },
    res: { sub: 'цена по направлению, в евро', pick: 'Выбрать место',
      empty: 'Выберите направление, города и дату выезда', emptySub: 'После этого здесь появятся рейс, время в пути и цена.', emptyCta: 'К поиску' },
    seat: { title: 'Схема салона', sub: 'Выберите место — оно попадёт в заявку.', driver: 'водитель', picked: 'выбрано', free: 'свободно', taken: 'занято', blocked: 'заблокировано', loading: 'Обновляем наличие мест…' },
    ph2: { email: 'olena@email.com', comment: 'Пожелания, остановка, багаж…' },
    seatsError: 'Не удалось загрузить актуальную информацию о местах. Попробуйте ещё раз.',
    sendError: 'Не удалось отправить заявку. Попробуйте ещё раз.',
    sendOk: 'Заявка отправлена! Номер заявки: ',
    sendOkNote: 'Менеджер свяжется с вами для подтверждения места.',
    modal: { title: 'Ваша заявка принята!', no: 'Номер заявки', contacts: 'Связаться с менеджером', call: 'Позвонить', close: 'Закрыть' },
    dupA: 'На эту дату у вас уже есть заявка № ', dupB: '. Чтобы изменить её, напишите менеджеру в WhatsApp или Viber.',
    retry: 'Попробовать ещё раз',
    pax: { title: 'Данные пассажиров' },
    pass: { title: 'Ваш билет', code: 'код', note: 'Это предварительный билет. Место закрепляется после подтверждения менеджера в чате.' },
    stops: { title: 'Что входит в поездку' },
    faq: {
      title: 'Частые вопросы',
      items: [
        { q: 'Как забронировать место?', a: 'Выберите города, дату и место на схеме, заполните данные пассажиров и нажмите WhatsApp или Viber. Заявка придёт менеджеру готовым сообщением — он подтвердит бронирование.' },
        { q: 'Когда и как оплачивать?', a: 'Оплата согласуется с менеджером в чате после подтверждения места. Цена на сайте — за билет в одну сторону, для двух пассажиров или туда-обратно сумма пересчитывается автоматически.' },
        { q: 'Сколько багажа можно взять?', a: '30 кг в багажном отделении и 5 кг ручной клади в салоне входят в билет. Каждый дополнительный килограмм — 1,5 €; укажите их в заявке, и сумма посчитается сразу.' },
        { q: 'Какие документы нужны?', a: 'Загранпаспорт, действительный для въезда в ЕС. Для детей — свой паспорт и согласие родителей, если ребёнок едет без них.' },
        { q: 'Где происходит посадка и высадка?', a: 'Посадка и высадка проводятся в назначенных местах по маршруту. Дополнительные посадку или высадку нужно согласовать с менеджером в чате.' },
        { q: 'А если мне нужно в Словению?', a: 'Да, мы едем в Словению — Марибор и Любляна. Оба города по пути в Италию, отдельная пересадка не нужна. Стоимость считается как до Триеста. Напишите в чат — менеджер подтвердит место высадки и точную цену.' },
        { q: 'Можно передать посылку без пассажира?', a: 'Да, мы возим документы, одежду, лекарства и небольшие передачи тем же рейсом. Напишите в WhatsApp или Viber — согласуем стоимость по размеру.' }
      ]
    },
    f: {
      dirUaIt: 'Украина → Италия', dirItUa: 'Италия → Украина', dirLabel: 'Направление поездки',
      from: 'Откуда', to: 'Куда', dateOut: 'Дата выезда', dateBack: 'Дата возвращения',
      choose: 'Выберите город', chooseDate: 'Выберите дату',
      pax: 'Пассажиров', search: 'Найти рейс', one: 'В одну сторону', round: 'Туда-обратно',
      first: 'Имя', last: 'Фамилия', phone: 'Телефон', bag: 'Багаж',
      extraKg: 'Дополнительные килограммы сверх 30 кг', seat: 'Место', total: 'к оплате', name: 'Пассажир',
      email: 'Email', emailNote: 'Отправим подтверждение брони на этот адрес', comment: 'Комментарий', submit: 'Отправить заявку', sending: 'Отправляем…',
      route: 'Маршрут', type: 'Тип билета', price: 'Стоимость', paxN: 'Пассажир', pickDate: 'выберите дату'
    },
    ph: { first: 'Елена', last: 'Ковальчук' },
    bagRules: ['30 кг в багажнике бесплатно', '5 кг ручной клади в салоне', '1,5 € за каждый дополнительный кг'],
    bagNone: 'без доплат', bagExtra: 'дополнительно',
    onboard: [
      { t: 'Wi-Fi в салоне', d: 'Интернет в дороге — чтобы быть на связи.' },
      { t: 'Кондиционер', d: 'Климат летом и обогрев в холодное время.' },
      { t: 'Туалет', d: 'Биотуалет плюс регулярные технические остановки.' }
    ],
    footer: { ua: 'Украина', it: 'Италия', note: 'Расписание может меняться из-за ситуации на границе', hours: 'Ежедневно 08:00–21:00 по киевскому времени' },
    consentA: 'Я соглашаюсь с ', consentOferta: 'публичной офертой', consentB: ' и ', consentPrivacy: 'обработкой персональных данных', consentShort: 'согласие с офертой',
    seatConflict: 'Место уже занято — выберите, пожалуйста, другое. Схема обновлена.',
    searchErr: 'Чтобы найти рейс, выберите: ',
    wdays: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    payNote: 'Расчёт наличными при посадке',
    legal: { oferta: 'Публичная оферта', refund: 'Условия возврата', contacts: 'Контакты и реквизиты', privacy: 'Политика конфиденциальности' },
    resEmptyTitle: 'Ваш рейс',
    res1: 'Рейс', res2: 'на', perPerson: 'за одного пассажира', priceLabel: 'итого', freeForms: ['свободное место', 'свободных места', 'свободных мест'],
    legOut: 'Туда', legBack: 'Обратно', legPrice: 'за направление',
    durationNA: 'уточняйте', hrs: 'ч', mins: 'мин', stopsForms: ['остановка в пути', 'остановки в пути', 'остановок в пути'], direct: 'без пересадок',
    tags: ['Wi-Fi', 'Кондиционер', 'Туалет', 'Остановки на отдых'],
    msgTitle: '🚌 Заявка с сайта Avtobus v Italiu',
    err: 'Заполните, пожалуйста: ',
    toastWa: 'Текст заявки скопирован. Открываем WhatsApp…',
    toastViber: 'Текст заявки скопирован. В Viber нажмите и удерживайте поле сообщения → «Вставить».',
    bar: { find: 'Найти рейс', seat: 'Выбрать место', steps: ['Рейс', 'Место', 'Данные'], call: 'Позвонить', ask: 'Есть вопросы? Напишите менеджеру', sentBtn: 'Заявка отправлена ✓', sentA: 'Заявка № ', sentB: ' отправлена', waHi: 'Здравствуйте! ', waSent: 'Моя заявка № ', waWant: 'Хочу забронировать билет', seatsW: 'места', extra: 'Дополнительно (необязательно)', extraSub: 'Комментарий, доп. багаж. 30 кг уже включено.' },
    savedOk: ' Заявка записана в таблицу.', savedFail: ' Таблица недоступна — отправьте заявку в чат.',
    searched: 'Рейс найден — выберите место ниже.'
  },
  it: {
    nav: { search: 'Corse', stops: 'Viaggio', seats: 'Posti', faq: 'Domande' },
    hero: {
      kicker: 'Ucraina ⇄ Italia',
      t1: 'Autobus per l’Italia', t2: 'senza cambi',
      sub: 'Prenota il viaggio dall’Ucraina all’Italia in pochi clic.',
      chips: ['Partenza ogni martedì', 'Senza cambi', '21 città sul percorso']
    },
    res: { sub: 'prezzo per tratta, in euro', pick: 'Scegli il posto',
      empty: 'Scegli direzione, città e data di partenza', emptySub: 'Poi qui compariranno corsa, durata e prezzo.', emptyCta: 'Vai alla ricerca' },
    seat: { title: 'Mappa dei posti', sub: 'Scegli un posto: finirà nella richiesta.', driver: 'autista', picked: 'scelto', free: 'libero', taken: 'occupato', blocked: 'bloccato', loading: 'Aggiorniamo la disponibilità…' },
    ph2: { email: 'olena@email.com', comment: 'Richieste, fermata, bagaglio…' },
    seatsError: 'Non è stato possibile caricare la disponibilità dei posti. Riprova.',
    sendError: 'Non è stato possibile inviare la richiesta. Riprova.',
    sendOk: 'Richiesta inviata! Numero: ',
    sendOkNote: 'L’operatore ti contatterà per confermare il posto.',
    modal: { title: 'Richiesta ricevuta!', no: 'Numero richiesta', contacts: 'Contatta l’operatore', call: 'Chiama', close: 'Chiudi' },
    dupA: 'Per questa data hai già la richiesta n. ', dupB: '. Per modificarla scrivi all’operatore su WhatsApp o Viber.',
    retry: 'Riprova',
    pax: { title: 'Dati dei passeggeri' },
    pass: { title: 'Il tuo biglietto', code: 'codice', note: 'Biglietto provvisorio. Il posto è confermato dall’operatore in chat.' },
    stops: { title: 'Cosa include il viaggio' },
    faq: {
      title: 'Domande frequenti',
      items: [
        { q: 'Come prenoto un posto?', a: 'Scegli città, data e posto sulla mappa, inserisci i dati dei passeggeri e premi WhatsApp o Viber. La richiesta arriva all’operatore già compilata: confermerà la prenotazione.' },
        { q: 'Quando e come si paga?', a: 'Il pagamento si concorda in chat con l’operatore dopo la conferma del posto. Il prezzo indicato è per la sola andata: per due passeggeri o andata e ritorno il totale si aggiorna da solo.' },
        { q: 'Quanto bagaglio posso portare?', a: '30 kg in stiva e 5 kg di bagaglio a mano sono inclusi nel biglietto. Ogni chilo in più costa 1,5 €: indicalo nella richiesta e il totale si aggiorna subito.' },
        { q: 'Quali documenti servono?', a: 'Passaporto valido per l’ingresso nell’UE. Per i minori, passaporto proprio e consenso dei genitori se viaggiano senza di loro.' },
        { q: 'Dove si sale e si scende?', a: 'La salita e la discesa avvengono nei punti prestabiliti lungo il percorso. Fermate aggiuntive vanno concordate con l’operatore in chat.' },
        { q: 'E se devo andare in Slovenia?', a: 'Sì, serviamo la Slovenia — Maribor e Lubiana. Entrambe le città sono lungo il percorso verso l’Italia, senza cambi. Il prezzo è calcolato come per Trieste. Scrivici in chat: l’operatore confermerà il punto di discesa e il prezzo esatto.' },
        { q: 'Posso spedire un pacco senza passeggero?', a: 'Sì, trasportiamo documenti, vestiti, medicine e piccoli pacchi con la stessa corsa. Scrivici su WhatsApp o Viber: concordiamo il prezzo in base alle dimensioni.' }
      ]
    },
    f: {
      dirUaIt: 'Ucraina → Italia', dirItUa: 'Italia → Ucraina', dirLabel: 'Direzione del viaggio',
      from: 'Da', to: 'A', dateOut: 'Data di partenza', dateBack: 'Data di ritorno',
      choose: 'Scegli la città', chooseDate: 'Scegli la data',
      pax: 'Passeggeri', search: 'Cerca corsa', one: 'Solo andata', round: 'Andata e ritorno',
      first: 'Nome', last: 'Cognome', phone: 'Telefono', bag: 'Bagaglio',
      extraKg: 'Chili aggiuntivi oltre i 30 kg', seat: 'Posto', total: 'totale', name: 'Passeggero',
      email: 'Email', emailNote: 'Invieremo la conferma della prenotazione a questo indirizzo', comment: 'Commento', submit: 'Invia la richiesta', sending: 'Invio…',
      route: 'Tratta', type: 'Tipo di biglietto', price: 'Prezzo', paxN: 'Passeggero', pickDate: 'scegli la data'
    },
    ph: { first: 'Olena', last: 'Kovalchuk' },
    bagRules: ['30 kg in stiva inclusi', '5 kg di bagaglio a mano', '1,5 € per ogni kg aggiuntivo'],
    bagNone: 'senza supplementi', bagExtra: 'aggiuntivi',
    onboard: [
      { t: 'Wi-Fi a bordo', d: 'Internet lungo il percorso per restare in contatto.' },
      { t: 'Aria condizionata', d: 'Clima in estate, riscaldamento in inverno.' },
      { t: 'Toilette', d: 'Toilette a bordo e sosta tecnica regolare.' }
    ],
    footer: { ua: 'Ucraina', it: 'Italia', note: 'Gli orari possono variare per la situazione alla frontiera', hours: 'Tutti i giorni 08:00–21:00, ora di Kyiv (07:00–20:00 in Italia)' },
    consentA: 'Accetto l’', consentOferta: 'offerta pubblica', consentB: ' e il ', consentPrivacy: 'trattamento dei dati personali', consentShort: 'consenso all’offerta',
    seatConflict: 'Il posto è già occupato: scegline un altro. La mappa è stata aggiornata.',
    searchErr: 'Per trovare la corsa scegli: ',
    wdays: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
    payNote: 'Pagamento in contanti alla partenza',
    legal: { oferta: 'Offerta pubblica', refund: 'Condizioni di rimborso', contacts: 'Contatti e dati fiscali', privacy: 'Informativa privacy' },
    resEmptyTitle: 'La tua corsa',
    res1: 'Corsa', res2: 'del', perPerson: 'per passeggero', priceLabel: 'totale', freeForms: ['posto libero', 'posti liberi', 'posti liberi'],
    legOut: 'Andata', legBack: 'Ritorno', legPrice: 'per tratta',
    durationNA: 'da confermare', hrs: 'h', mins: 'min', stopsForms: ['fermata lungo il percorso', 'fermate lungo il percorso', 'fermate lungo il percorso'], direct: 'senza cambi',
    tags: ['Wi-Fi', 'Aria condizionata', 'Toilette', 'Sosta di riposo'],
    msgTitle: '🚌 Richiesta dal sito Avtobus v Italiu',
    err: 'Compila per favore: ',
    toastWa: 'Testo della richiesta copiato. Apriamo WhatsApp…',
    toastViber: 'Testo copiato. In Viber tieni premuto il campo del messaggio → «Incolla».',
    bar: { find: 'Trova la corsa', seat: 'Scegli il posto', steps: ['Corsa', 'Posto', 'Dati'], call: 'Chiama', ask: 'Domande? Scrivi all’operatore', sentBtn: 'Richiesta inviata ✓', sentA: 'Richiesta n. ', sentB: ' inviata', waHi: 'Buongiorno! ', waSent: 'La mia richiesta n. ', waWant: 'Vorrei prenotare un biglietto', seatsW: 'posti', extra: 'Altro (facoltativo)', extraSub: 'Commento, bagaglio extra. 30 kg già inclusi.' },
    savedOk: ' Richiesta registrata nel foglio.', savedFail: ' Foglio non raggiungibile: invia la richiesta in chat.',
    searched: 'Corsa trovata: scegli il posto qui sotto.'
  }
};

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyz0SI9ZisBvoLYyjaml59kJCsBo0d8JgVZl9KeKrS4HrXQAzAaXSBk8eDMW-_UXHFpDw/exec';

// Telegram and email notifications are sent by the existing sheet backend.

const FLAG_INP = 'padding:16px 15px 16px 51px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:700;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%';
const ICON_INP = 'padding:16px 15px 16px 48px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:600;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%';
const ICON_INP_EMPTY = 'padding:16px 15px 16px 48px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:600;color:#9DB3CD;background:rgba(255,255,255,0.06);width:100%';
const PLAIN_INP = 'padding:16px 15px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:600;color:#9DB3CD;background:rgba(255,255,255,0.06);width:100%';

const INP_LIGHT = 'padding:14px 15px;min-height:54px;border:1px solid rgba(255,255,255,0.14);border-radius:12px;font-size:16px;font-weight:600;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%';
const INP_BAD = ';border-color:rgba(206,43,55,0.85);background:rgba(206,43,55,0.1)';

const WA_NUM = '380674704617';
const VIBER_NUM = '%2B380674704617';

export class Component extends React.Component {
  seatReq = 0;
  errRef = React.createRef();

  state = {
    lang: this.props.defaultLang || 'ua',
    dir: 'ua_it',
    from: '',
    to: '',
    dateOut: '',
    pax: '1',
    extraKg: 0,
    email: '',
    comment: '',
    seatStatus: {},
    seatsLoading: false,
    seatsError: false,
    sending: false,
    sentId: '',
    sendError: false,
    dupId: '',
    modalOpen: false,
    lead: { first: '', last: '', phone: '' },
    extra: [],
    seats: [],
    seatMode: 'any',
    openFaq: 0,
    showErrors: false,
    consent: false,
    seatConflict: false,
    typing: false,
    toast: ''
  };

  static META = {
    ua: { lang: 'uk', title: 'Автобус в Італію — квитки Україна ⇄ Італія | Avtobus v Italiu' },
    ru: { lang: 'ru', title: 'Автобус в Италию — билеты Украина ⇄ Италия | Avtobus v Italiu' },
    it: { lang: 'it', title: 'Autobus per l’Italia — biglietti Ucraina ⇄ Italia | Avtobus v Italiu' }
  };

  componentDidMount() {
    const next = {};
    const l = this.detectLang();
    if (l && l !== this.state.lang) next.lang = l;
    next.seatsLoading = false;
    next.liveDates = true;
    this.setState(next, () => { this.applyMeta(); this.loadSeats(); });
    const isField = el => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== 'checkbox';
    this.onFocusIn = e => { if (isField(e.target) && !this.state.typing) this.setState({ typing: true }); };
    this.onFocusOut = () => {
      setTimeout(() => { if (!isField(document.activeElement) && this.state.typing) this.setState({ typing: false }); }, 120);
    };
    document.addEventListener('focusin', this.onFocusIn);
    document.addEventListener('focusout', this.onFocusOut);
    this.onModalKey = event => {
      if (!this.state.modalOpen) return;
      if (event.key === 'Escape') return this.setState({ modalOpen: false });
      if (event.key !== 'Tab') return;
      const controls = [...document.querySelectorAll('[role="dialog"] button, [role="dialog"] a[href]')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', this.onModalKey);
    if (!this.endpoint()) return;
    const every = 60000;
    this.poll = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - (this.lastFetch || 0) >= every) this.loadSeats(true);
    }, every);
    this.onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - (this.lastFetch || 0) < every) return;
      this.loadSeats(true);
    };
    document.addEventListener('visibilitychange', this.onVisible);
  }

  componentWillUnmount() {
    this.seatReq++;
    this.seatAbort?.abort();
    if (this.poll) clearInterval(this.poll);
    if (this.timer) clearTimeout(this.timer);
    if (this.onVisible) document.removeEventListener('visibilitychange', this.onVisible);
    if (this.onFocusIn) document.removeEventListener('focusin', this.onFocusIn);
    if (this.onFocusOut) document.removeEventListener('focusout', this.onFocusOut);
    if (this.onModalKey) document.removeEventListener('keydown', this.onModalKey);
    if (this.savedOverflow !== undefined) document.body.style.overflow = this.savedOverflow;
  }

  endpoint() { return (this.props.sheetEndpoint || SHEET_URL).trim(); }


  routeKey() {
    const s = this.state;
    return s.from + '-' + s.to;
  }

  routeLabel() {
    const r = this.routeNames();
    return r.f + ' → ' + r.t;
  }

  humanDate(iso) {
    if (!iso) return '';
    const p = iso.split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
  }

  loadSeats(silent) {
    const url = this.endpoint();
    const req = ++this.seatReq;
    this.seatAbort?.abort();
    if (document.visibilityState !== 'visible' || this.state.seatMode === 'any' || !this.state.from || !this.state.to || !this.state.dateOut) {
      return this.setState({ seatStatus: {}, seatsLoading: false, seatsError: false });
    }
    if (!url || !this.state.dateOut) return;
    this.lastFetch = Date.now();
    const q = url + (url.indexOf('?') > -1 ? '&' : '?') +
      'action=seats&route=' + encodeURIComponent(this.routeKey()) +
      '&routeLabel=' + encodeURIComponent(this.routeLabel()) +
      '&date=' + encodeURIComponent(this.serviceDate()) +
      '&dateLabel=' + encodeURIComponent(this.humanDate(this.serviceDate())) +
      '&departureDate=' + encodeURIComponent(this.state.dateOut);
    if (!silent) this.setState({ seatsLoading: true, seatsError: false, seatStatus: {} });
    const controller = new AbortController();
    this.seatAbort = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);
    return fetch(q, { method: 'GET', signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        if (req !== this.seatReq) return;
        if (!data || data.success === false || !Array.isArray(data.seats)) throw new Error('bad payload');
        const map = {};
        (data.seats || []).forEach(row => {
          const n = parseInt(row.seat, 10);
          if (n) map[n] = String(row.status || '').toLowerCase();
        });
        this.setState(st => ({
          seatStatus: map,
          seatsLoading: false,
          seatsError: false,
          seats: st.sentId ? st.seats : st.seats.filter(n => !map[n] || map[n] === 'free')
        }));
      })
      .catch(() => {
        if (req !== this.seatReq) return;
        this.setState({ seatsLoading: false, seatsError: true });
      }).finally(() => clearTimeout(timeout));
  }

  applyMeta() {
    const m = Component.META[this.state.lang];
    if (!m) return;
    try {
      document.documentElement.lang = m.lang;
      if (document.title !== m.title) document.title = m.title;
    } catch (e) { /* ignore */ }
  }

  pickLang(code) {
    window.location.assign(code === 'ua' ? '/' : '/' + code + '/');
  }

  detectLang() { return this.props.defaultLang || 'ua'; }

  render() { return renderTemplate(this.renderVals()); }

  prettyDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d)) return this.humanDate(iso);
    return this.t().wdays[d.getDay()] + ' ' + this.humanDate(iso);
  }

  scrollToEl(el) {
    if (!el) return;
    const head = window.innerWidth <= 940 ? 80 : 24;
    const y = el.getBoundingClientRect().top + window.pageYOffset - head;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  scrollToId(id) {
    setTimeout(() => this.scrollToEl(document.getElementById(id)), 60);
  }

  scrollToErr() {
    setTimeout(() => {
      const s = this.state;
      let el = null;
      if (!s.from || !s.to || !s.dateOut) el = document.getElementById('v3search');
      else if (this.passengers().some(p => !p.first.trim() || !p.last.trim() || !this.validPhone(p.phone))) el = document.getElementById('v3pax');
      this.scrollToEl(el || this.errRef.current);
    }, 60);
  }

  sig() {
    const s = this.state;
    return JSON.stringify([s.dir, s.from, s.to, s.dateOut, s.pax, s.seatMode, s.seats, s.lead, s.extra, s.extraKg, s.email, s.comment, s.consent]);
  }

  componentDidUpdate(_props, previous) {
    if (this.state.modalOpen && !previous.modalOpen) {
      this.previousFocus = document.activeElement;
      this.savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.querySelector('[role="dialog"] button')?.focus();
    } else if (!this.state.modalOpen && previous.modalOpen) {
      document.body.style.overflow = this.savedOverflow || '';
      if (this.previousFocus?.isConnected) this.previousFocus.focus({preventScroll:true});
    }
    if (this.state.sentId && !this.state.sending && this.sentSig && this.sig() !== this.sentSig) {
      this.sentSig = '';
      this.setState({ sentId: '' });
    }
  }

  waChatUrl() {
    const s = this.state;
    const b = this.t().bar;
    let text;
    if (s.sentId) {
      text = b.waHi + b.waSent + s.sentId;
    } else {
      const parts = [];
      const r = this.routeNames();
      if (s.from || s.to) parts.push((s.from ? r.f : '…') + ' → ' + (s.to ? r.t : '…'));
      if (s.dateOut) parts.push(this.prettyDate(s.dateOut));
      if (s.seats.length) parts.push(b.seatsW + ' ' + s.seats.join(', '));
      text = b.waHi + b.waWant + (parts.length ? ': ' + parts.join(', ') : '');
    }
    return 'https://wa.me/' + (s.lang === 'it' ? '393245958718' : WA_NUM) + '?text=' + encodeURIComponent(text);
  }

  step() {
    const s = this.state;
    if (!s.from || !s.to || !s.dateOut) return 1;
    if (this.passengers().some(p => !p.first.trim() || !p.last.trim() || !this.validPhone(p.phone)) || !s.consent) return 2;
    return 3;
  }

  copy(text) {
    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { /* blocked */ }
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(fallback);
        return;
      }
    } catch (e) { /* blocked */ }
    fallback();
  }

  failValidation() {
    this.setState({ showErrors: true, toast: '' }, () => this.scrollToErr());
  }

  lang() { return this.state.lang; }
  t() { return T[this.lang()]; }
  accent() { return this.props.accent || '#F2B01E'; }

  cityName(c) { return c.name || c[this.lang()]; }

  hhmm(pair) { return pair ? pair[1] : '—'; }
  dayAbbr(pair) { return pair ? DAYS[pair[0]][this.lang()] : ''; }
  timeLabel(pair) { return pair ? this.dayAbbr(pair) + ' ' + pair[1] : this.t().durationNA; }

  absMinutes(pair) {
    if (!pair) return null;
    const parts = pair[1].split(':');
    return DAYS[pair[0]].i * 1440 + parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  duration(depPair, arrPair) {
    const a = this.absMinutes(depPair), b = this.absMinutes(arrPair);
    if (a === null || b === null) return this.t().durationNA;
    let m = b - a;
    if (m < 0) m += 7 * 1440;
    const t = this.t();
    const h = Math.floor(m / 60), min = m % 60;
    return h + ' ' + t.hrs + (min ? ' ' + min + ' ' + t.mins : '');
  }

  plural(n, forms) {
    if (this.lang() === 'it') return n === 1 ? forms[0] : forms[1];
    const a = n % 100, b = n % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b === 1) return forms[0];
    if (b >= 2 && b <= 4) return forms[1];
    return forms[2];
  }

  legStops(uaIt, fromKey, toKey) {
    const lang = this.lang();
    if (uaIt) {
      const i = Math.max(0, UA_CITIES.findIndex(c => c.k === fromKey));
      const j = Math.max(0, IT_CITIES.findIndex(c => c.k === toKey));
      return UA_CITIES.slice(i).map(c => ({ city: c[lang], pair: c.dep }))
        .concat(IT_CITIES.slice(0, j + 1).map(c => ({ city: c.name, pair: c.arr })));
    }
    const itRev = IT_CITIES.slice().reverse();
    const uaRev = UA_CITIES.slice().reverse();
    const i = Math.max(0, itRev.findIndex(c => c.k === fromKey));
    const j = Math.max(0, uaRev.findIndex(c => c.k === toKey));
    return itRev.slice(i).map(c => ({ city: c.name, pair: c.dep }))
      .concat(uaRev.slice(0, j + 1).map(c => ({ city: c[lang], pair: c.arr })));
  }

  legInfo(uaIt, fromKey, toKey) {
    const nodes = this.legStops(uaIt, fromKey, toKey);
    return {
      nodes: nodes,
      dep: nodes[0].pair,
      arr: nodes[nodes.length - 1].pair,
      stops: Math.max(0, nodes.length - 2)
    };
  }

  price(uaKey, itKey) {
    const u = UA_CITIES.find(c => c.k === uaKey);
    const i = IT_CITIES.find(c => c.k === itKey);
    if (!u || !i) return 0;
    return i.tier === 'base' ? u.base : u[i.tier];
  }

  unitPrice() {
    const s = this.state;
    return this.price(s.dir === 'ua_it' ? s.from : s.to, s.dir === 'ua_it' ? s.to : s.from);
  }

  total() {
    return this.unitPrice() * this.paxCount() + this.kgCost();
  }

  paxCount() { return Math.max(1, parseInt(this.state.pax, 10) || 1); }

  kgCost() { return Math.round(this.state.extraKg * 1.5 * 100) / 100; }

  money(n) {
    const s = (Math.round(n * 100) / 100).toString();
    return this.lang() === 'it' ? s : s.replace('.', ',');
  }

  shiftDate(iso, days) {
    if (!iso) return '';
    const date = new Date(iso + 'T12:00:00Z');
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  boardingOffset(dir = this.state.dir, from = this.state.from) {
    const city = (dir === 'ua_it' ? UA_CITIES : IT_CITIES).find(c => c.k === from);
    return city ? (DAYS[city.dep[0]].i - (dir === 'ua_it' ? 2 : 5) + 7) % 7 : 0;
  }

  serviceDate() { return this.shiftDate(this.state.dateOut, -this.boardingOffset()); }

  selectFrom(from) {
    this.setState(s => ({from, dateOut:this.shiftDate(s.dateOut, this.boardingOffset(s.dir,from) - this.boardingOffset(s.dir,s.from)), seats:[]}), () => this.loadSeats());
  }

  dateOptions() {
    const weekday = (this.state.dir === 'ua_it' ? 2 : 5) + this.boardingOffset();
    const lang = this.lang();
    const out = [];
    const now = this.state.liveDates ? Date.now() : (this.props.initialNow || Date.now());
    const calendar = new Intl.DateTimeFormat('sv-SE', {timeZone:'Europe/Kyiv'}).format(new Date(now));
    const d = new Date(calendar + 'T12:00:00');
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 2);
    while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
    const wdKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][weekday];
    const abbr = DAYS[wdKey] ? DAYS[wdKey][lang] : '';
    for (let i = 0; i < 12; i++) {
      const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      out.push({
        k: iso,
        name: abbr + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear(),
        short: String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0'),
        day: abbr
      });
      d.setDate(d.getDate() + 7);
    }
    return out;
  }

  seatState(n) {
    const s = this.state;
    if (!s.from || !s.to || !s.dateOut) return 'locked';
    if (s.seatsError || s.seatsLoading) return 'locked';
    const v = (this.state.seatStatus || {})[n];
    if (v === 'taken' || v === 'blocked') return v;
    if (v && v !== 'free') return 'blocked';
    return 'free';
  }

  passengers() {
    const s = this.state;
    const list = [s.lead];
    for (let i = 0; i < this.paxCount() - 1; i++) list.push(s.extra[i] || { first: '', last: '', phone: '' });
    return list;
  }

  setLead(key) {
    return e => {
      const v = key === 'phone' ? this.cleanPhone(e.target.value) : e.target.value;
      this.setState(st => ({ lead: Object.assign({}, st.lead, { [key]: v }) }));
    };
  }

  setExtra(i, key) {
    return e => {
      const v = key === 'phone' ? this.cleanPhone(e.target.value) : e.target.value;
      this.setState(st => {
        const extra = st.extra.slice();
        extra[i] = Object.assign({}, extra[i] || { first: '', last: '', phone: '' }, { [key]: v });
        return { extra: extra };
      });
    };
  }

  toggleSeat(n) {
    const max = this.paxCount();
    const cur = this.state.seats;
    if (this.state.seatConflict) this.setState({ seatConflict: false });
    if (cur.indexOf(n) > -1) return this.setState({ seats: cur.filter(x => x !== n) });
    const next = cur.length >= max ? cur.slice(1).concat(n) : cur.concat(n);
    this.setState({ seats: next.sort((a, b) => a - b) });
  }

  cleanPhone(phone) { return String(phone || '').replace(/[^+0-9]/g, ''); }

  normalizePhone(phone) {
    const value = String(phone || '').trim();
    if (/^0\d{9}$/.test(value)) return '+38' + value;
    if (/^\d{9}$/.test(value)) return '+380' + value;
    if (/^(380|39)\d+$/.test(value)) return '+' + value;
    return value;
  }

  validPhone(phone) {
    const value = this.normalizePhone(phone);
    if (!/^\+\d+$/.test(value)) return false;
    const digits = value.slice(1);
    if (value.startsWith('+380')) return digits.length === 12;
    if (value.startsWith('+39')) return digits.length >= 11 && digits.length <= 13;
    return digits.length >= 9 && digits.length <= 15;
  }

  missing() {
    const t = this.t();
    const s = this.state;
    const out = [];
    if (!s.from) out.push(t.f.from);
    if (!s.to) out.push(t.f.to);
    if (!s.dateOut) out.push(t.f.dateOut);
    if (s.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email.trim())) out.push(t.f.email);
    this.passengers().forEach((p, i) => {
      const who = ' (' + t.f.paxN + ' ' + (i + 1) + ')';
      if (!p.first.trim()) out.push(t.f.first + who);
      if (!p.last.trim()) out.push(t.f.last + who);
      if (!this.validPhone(p.phone)) out.push(t.f.phone + who);
    });
    if (!s.consent) out.push(t.consentShort);
    return out;
  }

  routeNames() {
    const s = this.state;
    const src = s.dir === 'ua_it' ? UA_CITIES : IT_CITIES;
    const dst = s.dir === 'ua_it' ? IT_CITIES : UA_CITIES;
    const f = src.find(c => c.k === s.from);
    const t = dst.find(c => c.k === s.to);
    return {
      f: f ? this.cityName(f) : '—',
      t: t ? this.cityName(t) : '—',
      fo: f || src[0], to: t || dst[0]
    };
  }

  message() {
    const t = this.t();
    const s = this.state;
    const r = this.routeNames();
    const lines = [
      t.msgTitle,
      t.f.route + ': ' + r.f + ' → ' + r.t,
      t.f.dateOut + ': ' + this.prettyDate(s.dateOut),
      t.f.pax + ': ' + this.paxCount(),
      ''
    ];
    this.passengers().forEach((p, i) => {
      const seat = s.seats[i] || t.ui.anySeat;
      lines.push(t.f.paxN + ' ' + (i + 1) + ': ' + p.first + ' ' + p.last);
      lines.push('   ' + t.f.phone + ': ' + this.normalizePhone(p.phone));
      lines.push('   ' + t.f.seat + ': ' + seat);
    });
    lines.push('');
    lines.push(t.ui.boarding + ': ' + r.f + ' — ' + t.ui.addressPending);
    lines.push(t.ui.dropoff + ': ' + r.t + ' — ' + t.ui.addressPending);
    if (s.email.trim()) lines.push(t.f.email + ': ' + s.email.trim());
    if (s.comment.trim()) lines.push(t.f.comment + ': ' + s.comment.trim());
    lines.push(t.f.bag + ': 30 kg + 5 kg' + (s.extraKg ? ' · +' + s.extraKg + ' kg = ' + this.kgCost() + ' €' : ''));
    lines.push(t.f.price + ': ' + this.total() + ' €');
    return lines.filter(x => x !== null).join('\n');
  }

  payload(channel) {
    const s = this.state;
    const r = this.routeNames();
    const ps = this.passengers();
    const lead = ps[0] || { first: '', last: '', phone: '' };
    return {
      action: 'application',
      channel: channel === 'wa' ? 'WhatsApp' : (channel === 'viber' ? 'Viber' : 'Сайт'),
      lang: this.lang(),
      fullName: (lead.first + ' ' + lead.last).trim(),
      phone: this.normalizePhone(lead.phone),
      email: s.email.trim(),
      route: this.routeKey(),
      routeLabel: this.routeLabel(),
      fromCity: r.f,
      toCity: r.t,
      // The existing sheet indexes seats by the date the whole service starts.
      // Keep that key for GET/POST consistency, and expose the actual boarding date.
      date: this.serviceDate(),
      dateLabel: this.humanDate(this.serviceDate()),
      departureDate: s.dateOut,
      departureDateLabel: this.humanDate(s.dateOut),
      seats: s.seats.join(', '),
      seatPreference: s.seats.length ? 'selected' : 'any',
      seatRequestLabel: s.seats.length ? s.seats.join(', ') : this.t().ui.anySeat,
      boardingAddress: this.t().ui.addressPending,
      dropoffAddress: this.t().ui.addressPending,
      paxCount: this.paxCount(),
      comment: s.comment.trim(),
      extraKg: s.extraKg,
      extraKgEur: this.kgCost(),
      totalEur: this.total(),
      passengers: ps.map((p, i) => ({
        n: i + 1, firstName: p.first, lastName: p.last, phone: this.normalizePhone(p.phone),
        seat: s.seats[i] || ''
      })),
      passengersFlat: ps.map((p, i) => (i + 1) + ') ' + p.first + ' ' + p.last + ' · ' + this.normalizePhone(p.phone) + ' · ' + (s.seats[i] || this.t().ui.anySeat)).join(' | '),
      message: this.message()
    };
  }

  saveToSheet(channel) {
    const url = this.endpoint();
    if (!url) return Promise.resolve({ ok: false, error: 'no-endpoint' });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    return fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(this.payload(channel))
    })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(d => (d && d.success) ? { ok: true, id: d.id } : { ok: false, error: (d && d.error) || 'failed', seats: (d && d.seats) || [], id: (d && d.id) || '' })
      .catch(() => ({ ok: false, error: 'network' }))
      .finally(() => clearTimeout(timeout));
  }

  book(channel, onDone) {
    if (this.state.sending) return;
    if (this.missing().length) return this.failValidation();
    this.setState({ showErrors: false, sending: true, sendError: false, seatConflict: false, sentId: '', dupId: '' });

    const finish = id => {
      this.sentSig = this.sig();
      this.setState({ sending: false, sentId: id, modalOpen: true });
      this.loadSeats(true);
      if (onDone) onDone();
    };
    const fail = () => this.setState({ sending: false, sendError: true }, () => this.scrollToErr());

    if (!this.endpoint()) return fail();

    // таблиця зберігає заявку і сама надсилає Telegram та листи
    this.saveToSheet(channel).then(res => {
      if (res.ok) return finish(res.id);
      if (res.error === 'duplicate') {
        this.setState({ sending: false, dupId: res.id || '—' }, () => this.scrollToErr());
        return;
      }
      if (res.error === 'seat_taken') {
        const taken = res.seats || [];
        this.setState(st => ({
          sending: false,
          seatConflict: true,
          seats: st.seats.filter(n => taken.indexOf(n) === -1)
        }), () => { this.loadSeats(true); this.scrollToErr(); });
        return;
      }
      fail();
    });
  }

  submit(channel) {
    this.book(channel || 'site');
  }

  flash(text, ms) {
    this.setState({ toast: text });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ toast: '' }), ms || 4200);
  }

  langBtn(code) {
    const on = this.state.lang === code;
    return 'padding:6px 9px;min-height:44px;min-width:40px;border:none;background:transparent;border-radius:8px;font-size:13.5px;font-weight:' + (on ? '700' : '500') + ';letter-spacing:0.02em;cursor:pointer;-webkit-appearance:none;' +
      (on ? 'background:transparent;color:#FFFFFF' : 'background:transparent;color:rgba(220,231,244,0.62)');
  }

  segBtn(on) {
    return 'display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 10px;min-height:50px;border:none;border-radius:11px;' +
      'font-size:clamp(13px,1.5vw,15px);font-weight:800;cursor:pointer;-webkit-appearance:none;white-space:nowrap;text-align:center;' +
      'transition:background 0.15s ease,color 0.15s ease;' +
      (on
        ? 'background:' + this.accent() + ';color:#08182F;box-shadow:0 2px 10px rgba(0,0,0,0.25)'
        : 'background:transparent;color:#9DB3CD');
  }

  renderVals() {
    const t = this.t();
    const s = this.state;
    const acc = this.accent();
    const uaIt = s.dir === 'ua_it';
    const r = this.routeNames();


    const dateOutOpts = this.dateOptions();
    const chosen = dateOutOpts.find(d => d.k === s.dateOut);
    const unit = this.unitPrice();

    let freeCount = 0;
    const seats = [];
    SEAT_ROWS.forEach((row, ri) => {
      row.forEach((n, ci) => {
        if (!n) return;
        const st = this.seatState(n);
        if (st === 'free') freeCount++;
        const on = s.seats.indexOf(n) > -1;
        const off = st !== 'free';
        const status = on ? t.seat.picked : st === 'free' ? t.seat.free : st === 'blocked' ? t.seat.blocked : st === 'locked' ? t.ui.unavailable : t.seat.taken;
        const skin = on
          ? 'background:' + acc + ';color:#08182F;border:1px solid ' + acc + ';transform:scale(1.05);cursor:pointer'
          : st === 'blocked'
            ? 'background:rgba(255,255,255,0.04);color:#92A8C3;border:1px dashed rgba(255,255,255,0.3);text-decoration:line-through;cursor:not-allowed'
            : off
              ? 'background:rgba(206,43,55,0.18);color:#F0A6A6;border:1px solid rgba(206,43,55,0.5);text-decoration:line-through;cursor:not-allowed'
              : 'background:rgba(255,255,255,0.07);color:#DCE8F6;border:1px solid rgba(255,255,255,0.2);cursor:pointer';
        seats.push({
          n: n, off: s.sending || (off && !on), status: st, selected: on, label: t.f.seat + ' ' + n + ': ' + status,
          onClick: (off && !on) ? () => {} : () => this.toggleSeat(n),
          style: 'grid-row:' + (ri + 1) + ';grid-column:' + (ci < 2 ? ci + 1 : ci + 2) +
            ';min-height:44px;padding:5px 0;border-radius:9px;font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums;-webkit-appearance:none;transition:transform 0.12s ease,border-color 0.12s ease;' + skin
        });
      });
    });

    const rows = this.passengers().map((p, i) => ({
      title: t.f.paxN + ' ' + (i + 1),
      first: p.first, last: p.last, phone: p.phone,
      firstInvalid: s.showErrors && !p.first.trim(), lastInvalid: s.showErrors && !p.last.trim(), phoneInvalid: s.showErrors && !this.validPhone(p.phone),
      seat: s.seats[i] || t.ui.anySeat,
      firstStyle: INP_LIGHT + ((s.showErrors && !p.first.trim()) ? INP_BAD : ''),
      lastStyle: INP_LIGHT + ((s.showErrors && !p.last.trim()) ? INP_BAD : ''),
      phoneStyle: INP_LIGHT + ((s.showErrors && !this.validPhone(p.phone)) ? INP_BAD : ''),
      wrapStyle: i === 0
        ? 'padding:0'
        : 'margin-top:16px;padding:16px 16px 18px;border:1px dashed rgba(255,255,255,0.16);border-radius:14px;background:rgba(255,255,255,0.03)',
      acFirst: i === 0 ? 'given-name' : 'off',
      acLast: i === 0 ? 'family-name' : 'off',
      acPhone: i === 0 ? 'tel' : 'off',
      onFirst: i === 0 ? this.setLead('first') : this.setExtra(i - 1, 'first'),
      onLast: i === 0 ? this.setLead('last') : this.setExtra(i - 1, 'last'),
      onPhone: i === 0 ? this.setLead('phone') : this.setExtra(i - 1, 'phone')
    }));

    const outLeg = this.legInfo(uaIt, s.from, s.to);
    const depPair = outLeg.dep;
    const arrPair = outLeg.arr;
    const stopCount = outLeg.stops;

    const legRow = (leg, tag, dateLabel, isBack) => ({
      tag: tag,
      dateLabel: dateLabel,
      tagStyle: 'padding:5px 11px;border-radius:99px;font-size:13px;font-weight:800;letter-spacing:0.02em;text-transform:none;' +
        (isBack ? 'background:rgba(255,255,255,0.09);color:#B9CBE1' : 'background:' + acc + ';color:#08182F'),
      fromName: isBack ? r.t : r.f,
      toName: isBack ? r.f : r.t,
      depTime: this.timeLabel(leg.dep),
      arrTime: this.timeLabel(leg.arr),
      duration: this.duration(leg.dep, leg.arr),
      tags: t.tags,
      price: this.money(unit * this.paxCount()),
      priceLabel: t.legPrice,
      perPerson: this.money(unit) + ' € · ' + t.perPerson
    });

    const legs = [legRow(outLeg, t.legOut, chosen ? chosen.name : t.f.pickDate, false)];

    const lead = s.lead.first || s.lead.last ? (s.lead.first + ' ' + s.lead.last).trim() : '—';
    const code = 'AVI-' + (s.dateOut ? s.dateOut.slice(5).replace('-', '') : '••••') + '-' + (s.seats[0] || '••');

    return {
      t: t,
      setUa: () => this.pickLang('ua'),
      setRu: () => this.pickLang('ru'),
      setIt: () => this.pickLang('it'),
      langUa: this.langBtn('ua'), langRu: this.langBtn('ru'), langIt: this.langBtn('it'),

      lbl: 'font-size:13px;font-weight:700;letter-spacing:0.02em;text-transform:none;color:#A9C0DA',
      lblLight: 'font-size:13px;font-weight:800;letter-spacing:0.02em;text-transform:none;color:#6F8AA8',
      inp: 'padding:16px 15px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:700;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%',
      inpIcon: 'padding:16px 15px 16px 48px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:600;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%',
      inpFlag: 'padding:16px 15px 16px 51px;min-height:58px;border:1px solid rgba(255,255,255,0.14);border-radius:13px;font-size:16px;font-weight:700;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%',
      inpSm: 'padding:13px 15px;min-height:50px;border:1px solid rgba(255,255,255,0.16);border-radius:12px;font-size:16px;font-weight:700;color:#F5F8FC;background:rgba(255,255,255,0.05);width:100%',
      inpLight: 'padding:14px 15px;min-height:54px;border:1px solid rgba(255,255,255,0.14);border-radius:12px;font-size:16px;font-weight:600;color:#F5F8FC;background:rgba(255,255,255,0.06);width:100%',
      passLbl: 'font-size:13px;font-weight:800;letter-spacing:0.02em;text-transform:none;color:#6F8AA8',
      ticketLbl: 'font-size:13px;font-weight:800;letter-spacing:0.02em;text-transform:none;color:#41597A',
      passVal: 'font-family:\'Unbounded\',sans-serif;font-weight:500;font-size:16px;color:#061225;margin-top:5px',

      dirSelectedA: uaIt, dirSelectedB: !uaIt,
      dirA: this.segBtn(uaIt), dirB: this.segBtn(!uaIt),
      routeReady: !!(s.from && s.to && s.dateOut),
      needsRoute: !(s.from && s.to && s.dateOut),
      fromInp: s.from ? FLAG_INP : PLAIN_INP,
      dateInp: s.dateOut ? ICON_INP : ICON_INP_EMPTY,
      toInp: s.to ? FLAG_INP : PLAIN_INP,
      isUaIt: uaIt && !!s.from,
      hasFrom: !!s.from,
      hasTo: !!s.to,
      trustRows: t.hero.chips,
      isItUa: !uaIt && !!s.from,
      toFlagIt: uaIt && !!s.to,
      toFlagUa: !uaIt && !!s.to,
      setDirA: () => this.setState({ dir: 'ua_it', from: '', to: '', dateOut: '', seats: [], seatMode:'any' }, () => this.loadSeats()),
      setDirB: () => this.setState({ dir: 'it_ua', from: '', to: '', dateOut: '', seats: [], seatMode:'any' }, () => this.loadSeats()),

      form: s,
      fromOptions: [{ k: '', name: t.f.choose }].concat((uaIt ? UA_CITIES : IT_CITIES).map(c => ({ k: c.k, name: this.cityName(c) }))),
      toOptions: [{ k: '', name: t.f.choose }].concat((uaIt ? IT_CITIES : UA_CITIES).map(c => ({ k: c.k, name: this.cityName(c) }))),
      dateOutOptions: [{ k: '', name: t.f.chooseDate }].concat(dateOutOpts),
      paxOptions: ['1', '2', '3', '4', '5', '6'],
      bagRules: t.bagRules,
      kgLabel: s.extraKg ? '+' + s.extraKg + ' kg' : '0 kg',
      kgCost: this.money(this.kgCost()),
      kgMinus: () => this.setState(st => ({ extraKg: Math.max(0, st.extraKg - 1) })),
      kgPlus: () => this.setState(st => ({ extraKg: Math.min(60, st.extraKg + 1) })),
      stepBtn: 'width:42px;height:42px;border:none;border-radius:9px;background:rgba(255,255,255,0.08);color:#F5F8FC;font-size:19px;font-weight:700;cursor:pointer;-webkit-appearance:none',
      onFrom: e => this.selectFrom(e.target.value),
      onTo: e => this.setState({ to: e.target.value, seats: [] }, () => this.loadSeats()),
      onDateOut: e => this.setState({ dateOut: e.target.value, seats: [] }, () => this.loadSeats()),
      onPax: e => {
        const n = Math.max(1, parseInt(e.target.value, 10) || 1) - 1;
        const extra = [];
        for (let i = 0; i < n; i++) extra.push(this.state.extra[i] || { first: '', last: '', phone: '' });
        this.setState({ pax: e.target.value, extra: extra, seats: [] });
      },

      doSearch: e => {
        const miss = [];
        if (!s.from) miss.push(t.f.from);
        if (!s.to) miss.push(t.f.to);
        if (!s.dateOut) miss.push(t.f.dateOut);
        if (miss.length) {
          if (e && e.preventDefault) e.preventDefault();
          return this.flash(t.searchErr + miss.join(', '), 4200);
        }
        this.flash(t.searched);
      },

      resultTitle: (s.from && s.to && s.dateOut)
        ? t.res1 + ' ' + r.f + ' → ' + r.t + (chosen ? ' · ' + chosen.name : '')
        : t.resEmptyTitle,
      dateStrip: dateOutOpts.slice(0, 8).map(d => ({
        day: d.day, date: d.short, price: this.money(unit),
        onClick: () => this.setState({ dateOut: d.k, seats: [] }, () => { this.loadSeats(); this.scrollToId('v3seats'); }),
        style: 'flex:0 0 auto;scroll-snap-align:start;min-width:94px;padding:12px 14px;border-radius:13px;text-align:left;cursor:pointer;-webkit-appearance:none;border:1px solid ' +
          (d.k === s.dateOut ? acc : 'rgba(255,255,255,0.13)') + ';' +
          (d.k === s.dateOut ? 'background:' + acc + ';color:#08182F' : 'background:rgba(255,255,255,0.04);color:#F5F8FC')
      })),
      legs: legs,
      trip: {
        priceLabel: t.priceLabel,
        total: this.money(this.total()),
        freeLine: s.seatMode === 'any' || s.seatsLoading || s.seatsError ? t.ui.availabilityOptional : freeCount + ' ' + this.plural(freeCount, t.freeForms)
      },

      seats: seats,
      sending: s.sending,
      seatCounter: s.seatMode === 'any' ? t.ui.optionalLabel : s.seats.length + ' / ' + this.paxCount(),
      anySeat: s.seatMode === 'any', manualSeat: s.seatMode === 'manual',
      chooseAnySeat: () => this.setState({seatMode:'any',seats:[],seatConflict:false}, () => this.loadSeats()),
      chooseManualSeat: () => this.setState({seatMode:'manual'}, () => this.loadSeats()),
      seatsLoading: s.seatsLoading,
      seatsFailed: s.seatsError,
      retrySeats: () => this.loadSeats(),
      email: s.email,
      comment: s.comment,
      onEmail: e => this.setState({ email: e.target.value }),
      onComment: e => this.setState({ comment: e.target.value }),
      submitLabel: s.sending ? t.f.sending : (s.sentId ? t.bar.sentBtn : t.f.submit),
      submitDisabled: s.sending || !!s.sentId,
      submitStyle: 'flex:1;min-width:min(100%,220px);min-height:56px;padding:0 26px;border:none;border-radius:13px;font-family:\'Unbounded\',sans-serif;font-weight:500;font-size:16px;' +
        (s.sending ? 'background:rgba(242,176,30,0.5);color:#08182F;cursor:progress'
          : s.sentId ? 'background:rgba(242,176,30,0.5);color:#08182F;cursor:default'
          : 'background:' + acc + ';color:#08182F;cursor:pointer'),
      doSubmit: () => this.submit('site'),
      sentId: s.sentId,
      sentText: t.sendOk + s.sentId,
      sendFailed: s.sendError,
      paxRows: rows,

      pass: {
        from: r.f, to: r.t,
        depTime: this.timeLabel(depPair), arrTime: this.timeLabel(arrPair),
        dateOut: chosen ? chosen.name : '—',
        seats: s.seats.join(', ') || t.ui.anySeat,
        pax: this.paxCount(),
        lead: lead,
        code: code
      },

      faqRows: t.faq.items.map((q, i) => ({
        q: q.q, a: q.a, id: 'faq-answer-' + i, hidden: s.openFaq !== i, open: s.openFaq === i, expanded: s.openFaq === i ? 'true' : 'false',
        onClick: () => this.setState({ openFaq: s.openFaq === i ? -1 : i }),
        iconStyle: 'width:28px;height:28px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:17px;font-weight:700;transition:transform 0.18s ease;transform:rotate(' + (s.openFaq === i ? '45deg' : '0deg') + ');' +
          (s.openFaq === i ? 'background:' + acc + ';color:#08182F' : 'background:rgba(255,255,255,0.08);color:#F5F8FC')
      })),

      total: this.money(this.total()),
      totalText: (s.from && s.to && s.dateOut) ? this.money(this.total()) + ' €' : '—',
      helpPhone: s.lang === 'it' ? '+39 324 595 8718' : '+380 67 470 46 17',
      viberHref: 'viber://chat?number=' + (s.lang === 'it' ? '%2B393245958718' : VIBER_NUM),
      callHref: s.lang === 'it' ? 'tel:+393245958718' : 'tel:+380674704617',
      waHref: 'https://wa.me/' + (s.lang === 'it' ? '393245958718' : WA_NUM),
      mbarStyle: 'display:none;position:fixed;left:0;right:0;bottom:0;z-index:70;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:#061225;border-top:1px solid rgba(255,255,255,0.12);align-items:center;transition:transform 0.2s ease;' +
        (s.typing ? 'transform:translateY(130%);pointer-events:none' : 'transform:none'),
      barSteps: t.bar.steps.map((name, i) => {
        const st = this.step();
        const on = st === i + 1, done = st > i + 1;
        return { label: (done ? '✓ ' : (i + 1) + ' ') + name, style: 'white-space:nowrap;color:' + (on ? '#F2B01E' : done ? '#8FA8C6' : '#8FA8C6') };
      }),
      barLabel: (() => {
        const st = this.step();
        if (st === 1) return t.bar.find;
        if (st === 2) return t.ui.toDetails;
        return s.sending ? t.f.sending : t.f.submit;
      })(),
      barAction: () => {
        const st = this.step();
        if (st === 1) {
          const miss = [];
          if (!s.from) miss.push(t.f.from);
          if (!s.to) miss.push(t.f.to);
          if (!s.dateOut) miss.push(t.f.dateOut);
          this.flash(t.searchErr + miss.join(', '), 4200);
          return this.scrollToId('v3search');
        }
        if (st === 2) return this.scrollToId('v3pax');
        this.submit('site');
      },
      showErrors: s.showErrors && this.missing().length > 0,
      errorText: t.err + this.missing().join(', '),
      errRef: this.errRef,
      seatConflict: s.seatConflict,
      consent: s.consent,
      onConsent: e => this.setState({ consent: !!e.target.checked }),
      consentBox: 'flex:0 0 auto;width:22px;height:22px;margin:1px 0 0;accent-color:#F2B01E;cursor:pointer' ,
      consentWrap: 'display:flex;gap:12px;align-items:flex-start;margin-top:18px;padding:14px 15px;border-radius:13px;cursor:pointer;border:1px solid ' +
        ((s.showErrors && !s.consent) ? 'rgba(206,43,55,0.6)' : 'rgba(255,255,255,0.12)') + ';background:rgba(255,255,255,0.03)',
      waChatHref: this.waChatUrl(),
      applicationWhatsApp: 'https://wa.me/' + (s.lang === 'it' ? '393245958718' : WA_NUM) + '?text=' + encodeURIComponent(this.message()),
      copyApplication: () => { this.copy(this.message()); this.flash(t.ui.copied); },
      fromAddress: r.f + ' — ' + t.ui.addressPending, toAddress: r.t + ' — ' + t.ui.addressPending,
      modalOpen: s.modalOpen && !!s.sentId,
      closeModal: () => this.setState({ modalOpen: false }),
      stopClick: e => e.stopPropagation(),
      dupShown: !!s.dupId,
      dupText: t.dupA + s.dupId + t.dupB,
      barSent: !!s.sentId,
      barOpen: !s.sentId,
      barSentText: '✓ ' + t.bar.sentA + s.sentId + t.bar.sentB,
      toast: s.toast
    };
  }
}


export { T };
const EXTRA = {"ua": [["Багаж включено", "30 кг багажу та 5 кг ручної поклажі. Додатковий кілограм — 1,5 €."], ["Зупинки на маршруті", "Посадка й висадка у визначених місцях. Додаткові зупинки узгодьте з менеджером."], ["Документи для поїздки", "Перевірте чинність закордонного паспорта та вимоги для в’їзду. Деталі — у питаннях нижче."]], "ru": [["Багаж включён", "30 кг багажа и 5 кг ручной клади. Дополнительный килограмм — 1,5 €."], ["Остановки на маршруте", "Посадка и высадка в назначенных местах. Дополнительные остановки согласуйте с менеджером."], ["Документы для поездки", "Проверьте срок действия загранпаспорта и условия въезда. Подробности — в вопросах ниже."]], "it": [["Bagaglio incluso", "30 kg di bagaglio e 5 kg a mano. Ogni chilo aggiuntivo costa 1,5 €."], ["Fermate lungo il percorso", "Salita e discesa nei punti previsti. Concorda eventuali fermate aggiuntive con l’operatore."], ["Documenti di viaggio", "Controlla la validità del passaporto e i requisiti d’ingresso. Dettagli nelle domande qui sotto."]]};
const UI = {"ua": {"summary": "Від 120 € · Україна → Італія: вівторок / середа · Італія → Україна: п’ятниця / субота", "help": "Не знайшли відповідь?", "helpSub": "Уточніть маршрут, багаж або документи у менеджера.", "front": "Перед салону", "rear": "Зад салону", "windows": "Вікна"}, "ru": {"summary": "От 120 € · Украина → Италия: вторник / среда · Италия → Украина: пятница / суббота", "help": "Не нашли ответ?", "helpSub": "Уточните маршрут, багаж или документы у менеджера.", "front": "Перед салона", "rear": "Зад салона", "windows": "Окна"}, "it": {"summary": "Da 120 € · Ucraina → Italia: martedì / mercoledì · Italia → Ucraina: venerdì / sabato", "help": "Non trovi la risposta?", "helpSub": "Chiedi all’operatore informazioni su itinerario, bagagli o documenti.", "front": "Parte anteriore", "rear": "Parte posteriore", "windows": "Finestrini"}};
for (const lang of Object.keys(T)) { T[lang].onboard.push(...EXTRA[lang].map(([t,d]) => ({t,d}))); T[lang].ui = UI[lang]; }

T.ua.ui.dateNote = 'Дата старту рейсу. День і час посадки у вашому місті дивіться в картці рейсу.';
T.ru.ui.dateNote = 'Дата начала рейса. День и время посадки в вашем городе указаны в карточке рейса.';
T.it.ui.dateNote = 'Data di inizio della corsa. Giorno e ora di salita nella tua città sono indicati nella scheda della corsa.';

T.ua.ui.skip = 'Перейти до вмісту'; T.ru.ui.skip = 'Перейти к содержимому'; T.it.ui.skip = 'Vai al contenuto';
T.ua.ui.unavailable = 'Недоступне'; T.ru.ui.unavailable = 'Недоступно'; T.it.ui.unavailable = 'Non disponibile';

T.ua.ui.phoneError = 'Вкажіть коректний телефон: 9–15 цифр, з кодом країни.';
T.ru.ui.phoneError = 'Укажите корректный телефон: 9–15 цифр, с кодом страны.';
T.it.ui.phoneError = 'Inserisci un numero valido: 9–15 cifre, con prefisso internazionale.';

for (const lang of Object.keys(T)) {
  Object.assign(T[lang].ui, P0_COPY[lang]);
  T[lang].payNote = P0_COPY[lang].payment;
  T[lang].faq.items[0].a = P0_COPY[lang].bookingFaq;
  T[lang].faq.items[1].a = P0_COPY[lang].payment;
  T[lang].seat.sub = P0_COPY[lang].seatSub;
  T[lang].seatsError = P0_COPY[lang].seatsUnavailable;
}
T.ua.bar.steps = ['Рейс', 'Дані', 'Заявка'];
T.ru.bar.steps = ['Рейс', 'Данные', 'Заявка'];
T.it.bar.steps = ['Corsa', 'Dati', 'Richiesta'];

T.ua.ui.optionalLabel = 'Необов’язково'; T.ru.ui.optionalLabel = 'Необязательно'; T.it.ui.optionalLabel = 'Facoltativo';
