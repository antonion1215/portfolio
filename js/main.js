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

/*---------- スクロールアニメーション（GSAP / ScrollTrigger） ----------*/
// GSAP未読込・モーション軽減設定時はアニメーションを行わず、コンテンツはそのまま表示する（プログレッシブエンハンスメント）
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // 共通設定
  const ease = 'power2.out';
  const distance = 24;

  // Hero：読み込み時に各要素を順番にフェードアップ（Heroがあるページのみ）
  if (document.querySelector('.top_kv')) {
    gsap.from(
      [
        '.top_kv_label',
        '.top_kv_copy',
        '.top_kv_line',
        '.top_kv_name',
        '.top_kv_actions',
      ],
      {
        y: distance,
        opacity: 0,
        duration: 0.8,
        ease,
        stagger: 0.12,
      }
    );
  }

  // 各セクション見出し（ラベル＋タイトル）：スクロールで表示されたらフェードアップ
  gsap.utils.toArray('.m_section-label').forEach((label) => {
    const title = label.nextElementSibling;
    gsap.from([label, title], {
      scrollTrigger: {
        trigger: label,
        start: 'top 85%',
      },
      y: distance,
      opacity: 0,
      duration: 0.7,
      ease,
      stagger: 0.1,
    });
  });

  // カード類（Skills / Works）：スクロールで順番にフェードアップ
  ['.m_skills', '.m_works'].forEach((listSelector) => {
    const list = document.querySelector(listSelector);
    if (!list) return;

    gsap.from(list.children, {
      scrollTrigger: {
        trigger: list,
        start: 'top 80%',
      },
      y: distance,
      opacity: 0,
      duration: 0.6,
      ease,
      stagger: 0.08,
    });
  });

  // Service / Contact の本文ブロック：スクロールでフェードアップ
  gsap.utils.toArray('.top_service_lead, .m_form').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      y: distance,
      opacity: 0,
      duration: 0.7,
      ease,
    });
  });
}
