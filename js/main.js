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

/*---------- お問い合わせフォーム（Web3Forms） ----------*/
const form = document.querySelector('.js_form');
const formSubmit = document.querySelector('.js_form-submit');
const formNote = document.querySelector('.js_form-note');

if (form && formSubmit && formNote) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    formSubmit.disabled = true;
    formSubmit.textContent = '送信中...';
    formNote.hidden = true;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
      });
      const json = await res.json();

      if (json.success) {
        formNote.textContent = '送信しました。3営業日以内にご返信いたします。';
        formNote.dataset.state = 'success';
        formNote.hidden = false;
        form.reset();
      } else {
        throw new Error(json.message);
      }
    } catch {
      formNote.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
      formNote.dataset.state = 'error';
      formNote.hidden = false;
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = '送信する';
    }
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
