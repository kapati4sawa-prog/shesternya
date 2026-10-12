'use strict';

const services = [
  ['🌀', 'Заміна підшипників бака', 'Розбираємо бак, міняємо підшипники й сальники.', '1 400'],
  ['💧', 'Пральна не зливає воду', 'Чистка або заміна помпи і фільтра.', '600'],
  ['🔥', 'Заміна ТЕНа', 'Пральна не гріє воду або вибиває автомат.', '700'],
  ['❄️', 'Заправка фреоном', 'Пошук витоку, пайка, вакуумування, заправка.', '900'],
  ['⚙️', 'Заміна компресора', 'Підбір компресора, гарантія 12 місяців.', '2 500'],
  ['🧠', 'Ремонт модуля керування', 'Холодильник не вмикається або не тримає температуру.', '800'],
  ['🍽️', 'Усунення протікання', 'Заміна ущільнювачів, шлангів, клапанів.', '500'],
  ['🌊', 'Заміна циркуляційної помпи', 'Посудомийка не миє або шумить.', '900'],
  ['🔥', 'Заміна конфорки або ТЕНа', 'Для електричних плит і духовок.', '450'],
  ['🌡️', 'Ремонт терморегулятора', 'Духовка перегріває або не гріє.', '500'],
  ['☕', 'Ремонт кавомашин', 'Декальцинація, чистка, заміна помпи й бойлера.', '400'],
  ['🌀', 'Пилососи, блендери, мультиварки', 'Заміна двигунів, плат, кнопок.', '300'],
  ['🌬️', 'Чистка і діагностика кондиціонера', 'Чистка блоків, перевірка тиску та дренажу.', '700'],
  ['🧊', 'Заправка кондиціонера', 'Заправка після перевірки на герметичність.', '1 000']
];

const byId = (id) => document.getElementById(id);

// FAQ accordion.
document.querySelectorAll('.question').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    if (!answer || !answer.classList.contains('answer')) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    button.classList.toggle('open', !isOpen);
    answer.setAttribute('aria-hidden', String(isOpen));
    answer.style.maxHeight = isOpen ? '0px' : `${answer.scrollHeight}px`;
  });
});

function showCards() {
  const box = byId('cards');
  if (!box) return;

  box.innerHTML = services.map((service) => `
    <article class="card">
      <div class="icon" aria-hidden="true">${service[0]}</div>
      <h3 class="service-title">${service[1]}</h3>
      <p>${service[2]}</p>
      <span class="price">від ${service[3]} ₴</span>
    </article>
  `).join('');

  box.classList.remove('fade');
  // Restart the short entrance animation without delaying other page functionality.
  requestAnimationFrame(() => box.classList.add('fade'));
}

if (byId('cards')) {
  showCards();
}

function showError(id, message) {
  const input = byId(id);
  const error = byId(`${id}Err`);
  if (!input || !error) return false;

  error.textContent = message;
  input.classList.toggle('bad', Boolean(message));
  input.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

function checkName(value) {
  const name = value.trim();
  if (!name) return 'Введіть ім’я';
  if (name.length < 2) return 'Занадто коротке ім’я';
  if (/[0-9]/.test(name)) return 'В імені не має бути цифр';
  return '';
}

function checkPhone(value) {
  const phone = value.replace(/[\s()-]/g, '');
  if (!phone) return 'Введіть телефон';
  if (!/^\+?380[0-9]{9}$/.test(phone)) return 'Формат: +380 XX XXX XX XX';
  return '';
}

function checkEmail(value) {
  const email = value.trim();
  if (!email) return 'Введіть e-mail';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Перевірте формат e-mail';
  return '';
}

function checkPass(value) {
  if (!value) return 'Введіть пароль';
  if (value.length < 8) return 'Мінімум 8 символів';
  if (!/[0-9]/.test(value)) return 'Додайте хоча б одну цифру';
  if (!/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(value)) return 'Додайте хоча б одну літеру';
  return '';
}

function checkPass2(value) {
  const password = byId('pass');
  if (!password) return '';
  if (value !== password.value) return 'Паролі не збігаються';
  return '';
}

function checkAgree() {
  const checkbox = byId('agree');
  return checkbox && checkbox.checked ? '' : 'Потрібна ваша згода';
}

function checkType(value) {
  return value ? '' : 'Оберіть тип техніки';
}

function checkProblem(value) {
  return value.trim().length >= 10 ? '' : 'Опишіть проблему хоча б 10 символами';
}

function setupForm(formId, fields, doneId) {
  const form = byId(formId);
  if (!form) return;

  fields.forEach(([id, validate]) => {
    const input = byId(id);
    if (!input) return;

    input.addEventListener('blur', () => {
      showError(id, validate(input.type === 'checkbox' ? input.checked : input.value));
    });

    input.addEventListener('input', () => {
      // Remove a stale error as soon as the corrected value becomes valid.
      const currentValue = input.type === 'checkbox' ? input.checked : input.value;
      if (!validate(currentValue)) showError(id, '');

      if (id === 'pass' && byId('pass2') && byId('pass2').value) {
        showError('pass2', checkPass2(byId('pass2').value));
      }
    });

    if (input.type === 'checkbox') {
      input.addEventListener('change', () => {
        showError(id, validate(input.checked));
      });
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;
    let firstInvalid = null;

    fields.forEach(([id, validate]) => {
      const input = byId(id);
      if (!input) {
        isValid = false;
        return;
      }
      const value = input.type === 'checkbox' ? input.checked : input.value;
      const fieldIsValid = showError(id, validate(value));
      if (!fieldIsValid) {
        isValid = false;
        firstInvalid ||= input;
      }
    });

    if (!isValid) {
      firstInvalid?.focus();
      return;
    }

    form.hidden = true;
    const done = byId(doneId);
    if (done) {
      done.style.display = 'block';
      done.setAttribute('tabindex', '-1');
      done.focus();
    }
  });
}

setupForm('regForm', [
  ['name', checkName],
  ['phone', checkPhone],
  ['email', checkEmail],
  ['pass', checkPass],
  ['pass2', checkPass2],
  ['agree', checkAgree]
], 'regDone');

setupForm('reqForm', [
  ['cname', checkName],
  ['cphone', checkPhone],
  ['ctype', checkType],
  ['cproblem', checkProblem]
], 'reqDone');

// Password visibility toggle and strength meter.
const passInput = byId('pass');
const pass2Input = byId('pass2');
const showPassButton = byId('showPass');
const meterBar = byId('meterBar');
const meterText = byId('meterText');

if (passInput && meterBar && meterText) {
  passInput.addEventListener('input', () => {
    const password = passInput.value;
    if (!password) {
      meterBar.style.width = '0%';
      meterBar.style.backgroundColor = 'var(--danger)';
      meterText.textContent = 'Введіть пароль, щоб перевірити його надійність.';
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-ZА-ЯІЇЄҐ]/.test(password)) score++;
    if (/[^a-zA-Z0-9А-Яа-яІіЇїЄєҐґ]/.test(password)) score++;

    meterBar.style.width = `${score * 25}%`;
    if (score <= 1) {
      meterBar.style.backgroundColor = 'var(--danger)';
      meterText.textContent = 'Слабкий пароль';
    } else if (score <= 3) {
      meterBar.style.backgroundColor = '#ffb04d';
      meterText.textContent = 'Середній пароль';
    } else {
      meterBar.style.backgroundColor = '#58d68d';
      meterText.textContent = 'Надійний пароль';
    }
  });
}

if (passInput && pass2Input && showPassButton) {
  showPassButton.addEventListener('click', () => {
    const shouldShow = passInput.type === 'password';
    passInput.type = shouldShow ? 'text' : 'password';
    pass2Input.type = shouldShow ? 'text' : 'password';
    showPassButton.setAttribute('aria-pressed', String(shouldShow));
    showPassButton.setAttribute('aria-label', shouldShow ? 'Приховати пароль' : 'Показати пароль');
  });
}
