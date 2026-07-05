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

/*---------- FAQアコーディオン ----------*/
// 開閉の高さ変化は CSS（grid-template-rows）の transition に任せ、JSは状態クラスの切り替えのみ行う
document.querySelectorAll('.js_faq').forEach((faq) => {
  const question = faq.querySelector('.js_faq-q');

  question.addEventListener('click', () => {
    const willOpen = !faq.classList.contains('is-active');

    faq.classList.toggle('is-active', willOpen);
    question.setAttribute('aria-expanded', String(willOpen));
  });
});

/*---------- 無料相談フォーム（Web3Forms） ----------*/
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
        formNote.textContent = '送信ありがとうございます。24時間以内にご返信いたします。';
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
      formSubmit.textContent = '無料相談を送信する';
    }
  });
}

/*---------- スクロールアニメーション（GSAP / ScrollTrigger） ----------*/
// GSAP未読込・モーション軽減設定時はアニメーションを行わず、コンテンツはそのまま表示する（プログレッシブエンハンスメント）
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
  gsap.config({
    nullTargetWarn: false,
  });
  gsap.registerPlugin(ScrollTrigger);

  // Hero：読み込み時にラベル → コピー → サブ → CTA → 分岐バナーを重ねながら流す
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.js_hero-label', { autoAlpha: 0, y: 12, duration: 0.6 })
    .from('.js_hero-copy', { autoAlpha: 0, y: 24, duration: 0.9 }, '-=0.3')
    .from('.js_hero-sub', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.5')
    .from('.js_hero-actions', { autoAlpha: 0, scale: 0.96, duration: 0.5 }, '-=0.3')
    .from('.js_hero-note', { autoAlpha: 0, duration: 0.5 }, '-=0.25')
    .from('.js_hero-branch', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.35');

  // 各セクション見出し（ラベル＋タイトル）：控えめにフェードアップ
  gsap.utils.toArray('.m_section-label').forEach((label) => {
    const title = label.nextElementSibling;
    gsap.from([label, title], {
      scrollTrigger: {
        trigger: label,
        start: 'top 85%',
      },
      autoAlpha: 0,
      y: 16,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
    });
  });

  // 悩みカード：下から順に浮かせる
  gsap.from('.m_pain-list_item', {
    scrollTrigger: {
      trigger: '.m_pain-list',
      start: 'top 80%',
    },
    autoAlpha: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
  });

  // 橋渡し文：カードの後にタメを作って見せる
  gsap.from('.top_pain_bridge', {
    scrollTrigger: {
      trigger: '.top_pain_bridge',
      start: 'top 88%',
    },
    autoAlpha: 0,
    y: 12,
    duration: 0.7,
    ease: 'power2.out',
  });

  // 理由カード：番号付きリストの流れとして左からスライドイン
  gsap.from('.m_reason-card', {
    scrollTrigger: {
      trigger: '.m_reasons',
      start: 'top 80%',
    },
    autoAlpha: 0,
    x: -32,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
  });

  // サービスカード：2×2グリッドを順に浮かせる
  gsap.from('.m_service-card', {
    scrollTrigger: {
      trigger: '.m_services',
      start: 'top 80%',
    },
    autoAlpha: 0,
    y: 24,
    duration: 0.6,
    ease: 'power3.out',
    stagger: { amount: 0.4 },
  });

  // 料金行：表として静かに現す（動きは最小限）
  gsap.from('.m_price_row', {
    scrollTrigger: {
      trigger: '.m_price',
      start: 'top 80%',
    },
    autoAlpha: 0,
    y: 12,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.08,
  });

  // 制作の流れ：工程の進行方向（左→右）に合わせてスライドイン
  gsap.from('.m_flow_step', {
    scrollTrigger: {
      trigger: '.m_flow',
      start: 'top 80%',
    },
    autoAlpha: 0,
    x: -24,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
  });

  // 実績カード：画像モジュールとしてわずかなズームアウトで見せる
  gsap.from('.m_work-card', {
    scrollTrigger: {
      trigger: '.m_works',
      start: 'top 80%',
    },
    autoAlpha: 0,
    scale: 1.04,
    duration: 0.9,
    ease: 'power2.out',
  });

  // About：写真と本文を左右から寄せる
  gsap
    .timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: '.top_about_body',
        start: 'top 80%',
      },
    })
    .from('.js_about-photo', { autoAlpha: 0, scale: 0.92, duration: 0.7 })
    .from('.js_about-text', { autoAlpha: 0, x: 24, duration: 0.7 }, '-=0.45');

  // FAQ：行として静かに現す
  gsap.from('.m_faq', {
    scrollTrigger: {
      trigger: '.m_faq-list',
      start: 'top 80%',
    },
    autoAlpha: 0,
    y: 12,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.06,
  });

  // フォーム：締めのセクションとして浮かせる
  gsap.from('.m_form', {
    scrollTrigger: {
      trigger: '.m_form',
      start: 'top 85%',
    },
    autoAlpha: 0,
    y: 24,
    duration: 0.7,
    ease: 'power3.out',
  });
}
