/* =========================================================
   이은빈 포트폴리오 — main.js
   1. 로딩 커튼 + 히어로 시퀀스
   2. 스크롤 진입 애니메이션
   3. 숫자 카운트업
   4. 기여도 게이지
   5. 헤더(진행바 / 숨김 / 현재 섹션)
   6. 기술 티커
   7. 이메일 복사 · 맨 위로
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  /* ── 1. 로딩 커튼 + 히어로 시퀀스 ───────────────────── */
  var curtain = $('#curtain');
  var hero = $('.hero');
  var bar = $('#bar');

  function startHero() {
    if (hero) hero.classList.add('is-ready');
    if (bar) bar.dataset.on = 'true';
  }

  if (reduce || !curtain) {
    if (curtain) curtain.remove();
    startHero();
  } else {
    document.body.dataset.lock = 'true';
    requestAnimationFrame(function () { curtain.dataset.show = 'true'; });
    window.addEventListener('load', function () {
      setTimeout(function () {
        curtain.dataset.done = 'true';
        document.body.dataset.lock = 'false';
        startHero();
        setTimeout(function () { curtain.remove(); }, 800);
      }, 520);
    });
    // 로드 이벤트가 이미 지난 경우 대비
    setTimeout(function () {
      if (curtain.isConnected && curtain.dataset.done !== 'true') {
        curtain.dataset.done = 'true';
        document.body.dataset.lock = 'false';
        startHero();
      }
    }, 2600);
  }

  /* ── 2~4. 스크롤 진입 처리 ──────────────────────────── */
  var animated = $$('[data-reveal], [data-group], [data-rise], [data-draw], [data-gauge]');

  function activate(el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-gauge')) fillGauge(el);
    countUp(el);
  }

  if (!('IntersectionObserver' in window) || reduce) {
    animated.forEach(activate);
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        activate(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    animated.forEach(function (el) { io.observe(el); });
  }

  /* 기여도 게이지: 채워질 개수만큼 점 활성화 */
  function fillGauge(el) {
    var on = parseInt(el.getAttribute('data-gauge'), 10) || 0;
    $$('i', el).forEach(function (dot, idx) {
      if (idx < on) dot.setAttribute('data-on', '');
    });
  }

  /* 숫자 카운트업 */
  function countUp(scope) {
    $$('[data-count]', scope).forEach(function (node) {
      if (node.dataset.counted) return;
      node.dataset.counted = 'true';

      var target = parseFloat(node.getAttribute('data-count'));
      var dec = parseInt(node.getAttribute('data-dec'), 10) || 0;
      if (isNaN(target)) return;
      if (reduce) { node.textContent = target.toFixed(dec); return; }

      var dur = 1100;
      var t0 = null;
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = target.toFixed(dec);
      };
      requestAnimationFrame(step);
    });
  }

  /* ── 5. 헤더 ────────────────────────────────────────── */
  var progress = $('#progress');
  var totop = $('#totop');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    if (bar && bar.dataset.on === 'true') {
      // 아래로 빠르게 스크롤하면 헤더를 숨기고, 위로 올리면 다시 보여준다
      bar.dataset.hidden = (y > 240 && y > lastY + 6) ? 'true' : 'false';
    }
    if (totop) totop.dataset.on = y > window.innerHeight ? 'true' : 'false';

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* 현재 보고 있는 섹션 표시 */
  var links = $$('.bar__nav a');
  var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, { rootMargin: '-55% 0px -40% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ── 6. 기술 티커 ───────────────────────────────────── */
  var track = $('#ticker');
  if (track && !reduce) {
    var set = $('.ticker__set', track);
    var width = set.offsetWidth;

    if (width > 0) {
    // 화면을 두 번 이상 채울 만큼 복제해 끊김 없이 흐르게 한다
    var need = Math.min(Math.ceil((window.innerWidth * 2) / width) + 1, 8);
    for (var i = 0; i < need; i++) track.appendChild(set.cloneNode(true));
    var offset = 0;
    var speed = 0.42; // px / frame
    var running = true;

    var loop = function () {
      if (running) {
        offset -= speed;
        if (Math.abs(offset) >= width) offset += width;
        track.style.transform = 'translateX(' + offset + 'px)';
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
    });
    }
  }

  /* ── 7. 이메일 복사 · 맨 위로 ───────────────────────── */
  $$('.copy').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        btn.dataset.done = 'true';
        btn.textContent = '복사했습니다';
        setTimeout(function () {
          btn.dataset.done = 'false';
          btn.textContent = label;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          window.location.href = 'mailto:' + text;
        });
      } else {
        window.location.href = 'mailto:' + text;
      }
    });
  });

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
})();