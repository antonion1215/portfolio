'use strict';

/*---------- ハンバーガーメニュー ----------*/
const hamburger = document.querySelector('.js_hamburger');
const nav = document.querySelector('.js_nav');

const toggleMenu = (forceClose = false) => {
  const willClose = forceClose || hamburger.classList.contains('is-active');

  hamburger.classList.toggle('is-active', !willClose);
  nav.classList.toggle('is-active', !willClose);
  hamburger.setAttribute('aria-expanded', String(!willClose));
};

hamburger.addEventListener('click', () => toggleMenu());

// メニュー内リンクをタップしたら閉じる
document.querySelectorAll('.js_nav-link').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(true));
});

/*---------- お問い合わせフォーム（送信機能は準備中） ----------*/
const formSubmit = document.querySelector('.js_form-submit');
const formNote = document.querySelector('.js_form-note');

if (formSubmit && formNote) {
  formSubmit.addEventListener('click', (e) => {
    // 送信先未設定のため送信を抑止し、準備中メッセージを表示する
    e.preventDefault();
    formNote.hidden = false;
  });
}
