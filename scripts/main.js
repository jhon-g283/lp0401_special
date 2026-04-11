// Canvas scaling — scales a 1512px-wide Figma canvas to the viewport
const CANVAS_W = 1512;
function scaleCanvas(canvasId, sectionEl, canvasH, skipHeightOnMobile) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const vw = document.documentElement.clientWidth;
  const scale = vw / CANVAS_W;
  canvas.style.transform = 'scale(' + scale + ')';
  if (skipHeightOnMobile && vw <= 768) return;
  sectionEl.style.height = Math.round(canvasH * scale) + 'px';
}
function scaleAllCanvases() {
  const isMobile = document.documentElement.clientWidth <= 768;
  scaleCanvas('navCanvas',         document.querySelector('.nav'),           71, true);
  if (!isMobile) {
    scaleCanvas('heroCanvas',        document.querySelector('.hero'),          786);
    scaleCanvas('newCanvas',         document.querySelector('.new-section'),   562);
    scaleCanvas('vsCanvas',          document.querySelector('.vs-section'),    900);
    scaleCanvas('emoCanvas',         document.querySelector('.emo-section'),   840);
    scaleCanvas('angelCanvas',       document.querySelector('.angel-section'), 802);
    scaleCanvas('noiseTopCanvas',    document.querySelector('.noise-top'),     280);
    scaleCanvas('noiseBottomCanvas', document.querySelector('.noise-bottom'),  270);
    scaleCanvas('omegaCanvas',       document.querySelector('.omega-section'), 2650);
    scaleCanvas('noiseExitCanvas',   document.querySelector('.noise-exit'),    270);
  }
}
scaleAllCanvases();
window.addEventListener('resize', scaleAllCanvases, { passive: true });

// Omega hero main visual — fade-in on scroll
(function() {
  var heroEls = ['omegaHeroBg', 'omegaHeroFg']
    .map(function(id) { return document.getElementById(id); })
    .filter(Boolean);
  if (!heroEls.length) return;
  function onScroll() {
    var section = document.querySelector('.omega-section');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      heroEls.forEach(function(el) { el.classList.add('fade-in'); });
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Omega banner — TV power-on on scroll (scroll-only, never on initial load)
(function() {
  const banner = document.getElementById('omegaBanner');
  if (!banner) return;
  function onScroll() {
    const rect = banner.getBoundingClientRect();
    const viewH = window.innerHeight;
    // Fire when banner enters the lower 80% of the viewport during scroll
    if (rect.top < viewH * 0.8 && rect.bottom > 0) {
      banner.classList.add('tv-on');
      window.removeEventListener('scroll', onScroll);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Omega subsection cards — TV power-on on scroll
(function() {
  var cards = ['omegaCard1', 'omegaCard2', 'omegaCard3'];
  var remaining = cards.map(function(id) { return document.getElementById(id); })
                       .filter(Boolean);
  if (!remaining.length) return;
  function onScroll() {
    var viewH = window.innerHeight;
    remaining = remaining.filter(function(card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < viewH * 0.8 && rect.bottom > 0) {
        card.classList.add('tv-on');
        return false; // remove from remaining
      }
      return true;
    });
    if (!remaining.length) window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Omega side images (PC) — fade-in on scroll
(function() {
  var imgs = Array.from(document.querySelectorAll('.omega-pc-img'));
  if (!imgs.length) return;
  function onScroll() {
    var viewH = window.innerHeight;
    imgs = imgs.filter(function(el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < viewH * 0.85 && rect.bottom > 0) {
        el.classList.add('in');
        return false;
      }
      return true;
    });
    if (!imgs.length) window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.sr,.sr-l,.sr-r,.omega-card-sp__img').forEach(el => observer.observe(el));

// Directional fade-in helper (VS / EMO / ANGEL)
(function() {
  var sections = [
    document.querySelector('.vs-section'),
    document.querySelector('.emo-section'),
    document.querySelector('.angel-section')
  ];
  sections.forEach(function(section) {
    var items = section.querySelectorAll('.fi-ltr, .fi-rtl');
    var triggered = false;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          items.forEach(function(el) {
            var delay = parseInt(el.dataset.delay || '0', 10);
            setTimeout(function() { el.classList.add('in'); }, delay);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });
    obs.observe(section);
  });
})();

// NEW section — staggered fade-in on scroll
(function() {
  var newSection = document.querySelector('.new-section');
  var newItems = newSection.querySelectorAll('.new-sr');
  var triggered = false;
  var newObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        newItems.forEach(function(el) {
          var delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(function() { el.classList.add('in'); }, delay);
        });
        newObs.disconnect();
      }
    });
  }, { threshold: 0.15 });
  newObs.observe(newSection);
})();

// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// System unlock typing animation
(function() {
  const el = document.getElementById('unlockText');
  const el2 = document.getElementById('omegaText');
  if (!el) return;
  const fullText = el.dataset.text || '';
  el.textContent = '';

  function typeText(target, text, onDone) {
    let i = 0;
    function typeNext() {
      if (i < text.length) {
        target.textContent = text.slice(0, ++i);
        var ch = text[i - 1];
        var delay = ch === '.' ? 140 : ch === ' ' ? 80 : 55 + Math.random() * 45;
        setTimeout(typeNext, delay);
      } else {
        target.classList.add('typed');
        if (onDone) onDone();
      }
    }
    typeNext();
  }

  let triggered = false;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        obs.disconnect();
        setTimeout(function() {
          typeText(el, fullText, function() {
            if (!el2) return;
            setTimeout(function() {
              typeText(el2, 'OMEGA', null);
            }, 300);
          });
        }, 400);
      }
    });
  }, { threshold: 0.6 });
  obs.observe(el);
})();

// ── Feature Demo Modal (jQuery) ──────────────────────────────
$(function() {
  var taskDescriptions = {
    'data-recovery':      '削除されたデータを自動で検出し、安全に復元します。',
    'email-assistant':    '上司の感情・状況を読み取り、最適なメール文を生成します。',
    'spoiler-blocker':    '検索・SNSで話題の作品のネタバレを自動ブロックします。',
    'schedule-optimizer': '予定を分析し、最適な時間配分を提案します。'
  };

  // Open modal
  $('#openFeatureModal').on('click', function() {
    $('#featureModal').removeClass('fm-overlay--hidden').attr('aria-hidden', 'false');
    $('body').addClass('fm-body-lock');
  });

  // Close modal
  function closeModal() {
    $('#featureModal').addClass('fm-overlay--hidden').attr('aria-hidden', 'true');
    $('body').removeClass('fm-body-lock');
    angelReset();
  }
  $('#closeFeatureModal').on('click', closeModal);
  $('#featureModal').on('click', function(e) {
    if ($(e.target).is('#featureModal')) closeModal();
  });
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') { closeModal(); closeVersusModal(); closeEmoModal(); }
  });

  // Tab switching
  $('.fm-tab').on('click', function() {
    var target = $(this).data('tab');
    // バーサスシステムタブは独立したVSモーダルを開く
    if (target === 'vs') {
      closeModal();
      openVersusModal();
      return;
    }
    // EMO機能タブは独立したEMOモーダルを開く
    if (target === 'emo') {
      closeModal();
      openEmoModal();
      return;
    }
    $('.fm-tab').removeClass('fm-tab--active').attr('aria-selected', 'false');
    $(this).addClass('fm-tab--active').attr('aria-selected', 'true');
    $('.fm-panel').addClass('fm-panel--hidden');
    $('#panel' + target.charAt(0).toUpperCase() + target.slice(1)).removeClass('fm-panel--hidden');
  });

  // ── Versus Modal ────────────────────────────────────────────
  function openVersusModal() {
    $('#versusModal').removeClass('vm-overlay--hidden').attr('aria-hidden', 'false');
    $('body').addClass('fm-body-lock');
    vmShowView('form');
    $('#vmPrompt').val('');
    $('#vmBattleBtn').prop('disabled', true);
    $('#vmBarA, #vmBarB').css('width', '0%');
    // TV power-on animation
    var $intro = $('#vmIntroSection');
    $intro.removeClass('tv-on');
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { $intro.addClass('tv-on'); });
    });
  }

  function closeVersusModal() {
    $('#versusModal').addClass('vm-overlay--hidden').attr('aria-hidden', 'true');
    $('body').removeClass('fm-body-lock');
  }

  $('#closeVersusModal').on('click', closeVersusModal);
  $('#versusModal').on('click', function(e) {
    if ($(e.target).is('#versusModal')) closeVersusModal();
  });

  function vmShowView(view) {
    $('#vmViewForm, #vmViewLoading, #vmViewResult').hide();
    if (view === 'form')    $('#vmViewForm').show();
    if (view === 'loading') $('#vmViewLoading').show();
    if (view === 'result')  $('#vmViewResult').show();
  }

  $('#vmPrompt').on('input', function() {
    $('#vmBattleBtn').prop('disabled', $.trim($(this).val()) === '');
  });

  $('#vmBattleBtn').on('click', function() {
    if ($(this).prop('disabled')) return;
    vmShowView('loading');
    setTimeout(function() {
      var claudeWins = Math.random() >= 0.5;
      var scoreA = claudeWins ? Math.round(60 + Math.random() * 25) : Math.round(70 + Math.random() * 20);
      var scoreB = claudeWins ? Math.round(scoreA + 5 + Math.random() * 20) : Math.round(40 + Math.random() * 25);
      var pctA   = claudeWins ? Math.round(55 + Math.random() * 20) : Math.round(70 + Math.random() * 20);
      var pctB   = claudeWins ? Math.round(pctA + 8 + Math.random() * 15) : Math.round(pctA - 10 - Math.random() * 15);
      $('#vmCardA').removeClass('vm-result-card--winner vm-result-card--loser').addClass(claudeWins ? 'vm-result-card--loser' : 'vm-result-card--winner');
      $('#vmCardB').removeClass('vm-result-card--winner vm-result-card--loser').addClass(claudeWins ? 'vm-result-card--winner' : 'vm-result-card--loser');
      $('#vmCardA .vm-result-card__trophy, #vmCardB .vm-result-card__trophy').hide();
      (claudeWins ? $('#vmCardB') : $('#vmCardA')).find('.vm-result-card__trophy').show();
      $('#vmCardA .vm-result-card__score').text(scoreA);
      $('#vmCardB .vm-result-card__score').text(scoreB);
      var winner = claudeWins ? 'Claude' : 'GPT-4';
      var loser  = claudeWins ? 'GPT-4'  : 'Claude';
      var wScore = claudeWins ? scoreB : scoreA;
      var lScore = claudeWins ? scoreA : scoreB;
      $('#vmWinnerTitle').text(winner + ' の勝利！');
      $('#vmWinnerScore').text('最終スコア: ' + loser + ' ' + lScore + ' - ' + wScore + ' ' + winner);
      vmShowView('result');
      setTimeout(function() {
        $('#vmBarA').css('width', pctA + '%');
        $('#vmBarB').css('width', pctB + '%');
      }, 100);
      // 剣アイコンを画面に浮遊させる
      for (var i = 0; i < 2; i++) {
        (function(i) { setTimeout(spawnSwordFloater, i * 100); })(i);
      }
    }, 2200);
  });

  $('#vmRetryBtn').on('click', function() {
    $('#vmPrompt').val('');
    $('#vmBattleBtn').prop('disabled', true);
    $('#vmBarA, #vmBarB').css('width', '0%');
    $('#vmCardA').removeClass('vm-result-card--winner vm-result-card--loser').addClass('vm-result-card--loser');
    $('#vmCardB').removeClass('vm-result-card--winner vm-result-card--loser').addClass('vm-result-card--winner');
    $('#vmCardA .vm-result-card__trophy').hide();
    $('#vmCardB .vm-result-card__trophy').show();
    vmShowView('form');
  });

  // ── EMO Modal ────────────────────────────────────────────────
  var emoMoodEmojis = ['😞','😕','😐','😊','😄'];
  var emoResponses = [
    { label: '低調モード — 天秤AIからのエール', text: '辛い時こそ、一歩一歩進めばいい。今日できることを一緒に探しましょう。あなたのそばにいます。' },
    { label: '少し不調モード — 天秤AIからのサポート', text: 'ちょっと疲れているんですね。無理せず、できる範囲でお手伝いします。深呼吸して一緒に進みましょう。' },
    { label: '通常モード — 天秤AIからの回答', text: 'ご質問ありがとうございます。しっかりサポートします。何でも気軽に相談してください。' },
    { label: '好調モード — 天秤AIからの回答', text: '絶好調ですね！その勢いでいきましょう。精度の高いサポートでお応えします。一緒に最高の結果を出しましょう！' },
    { label: '絶好調モード — 天秤AIフルパワー', text: 'パーフェクトなコンディション！AIも全力で応えます。今日は何でもできる気がしますね。最高の回答をお届けします！🚀' }
  ];

  function getMoodIndex(val) {
    val = parseInt(val);
    if (val < 20) return 0;
    if (val < 40) return 1;
    if (val < 60) return 2;
    if (val < 80) return 3;
    return 4;
  }

  function openEmoModal() {
    $('#emoModal').removeClass('em-overlay--hidden').attr('aria-hidden', 'false');
    $('body').addClass('fm-body-lock');
    $('#emPrompt').val('');
    $('#emResponse').hide();
    $('#emMoodSlider').val(50);
    $('#emMoodEmoji').text('😐');
  }

  function closeEmoModal() {
    $('#emoModal').addClass('em-overlay--hidden').attr('aria-hidden', 'true');
    $('body').removeClass('fm-body-lock');
  }

  $('#closeEmoModal').on('click', closeEmoModal);
  $('#emoModal').on('click', function(e) {
    if ($(e.target).is('#emoModal')) closeEmoModal();
  });

  // スライダー → 絵文字更新
  $('#emMoodSlider').on('input', function() {
    var idx = getMoodIndex($(this).val());
    $('#emMoodEmoji').text(emoMoodEmojis[idx]);
  });

  // Sword floater: spawn drifting swords on versus system result
  function spawnSwordFloater() {
    var $container = $('#sword-floaters');
    if (!$container.length) {
      $('body').append('<div id="sword-floaters"></div>');
      $container = $('#sword-floaters');
    }
    var size  = Math.round(32 + Math.random() * 32);
    var left  = (Math.random() * 85 + 5).toFixed(1);
    var top   = (Math.random() * 75 + 10).toFixed(1);
    var dur   = (6 + Math.random() * 6).toFixed(1);
    var delay = (-Math.random() * parseFloat(dur)).toFixed(1);
    var rnd   = function() { return Math.round((Math.random() - 0.5) * 90); };
    var el    = document.createElement('span');
    el.textContent = '⚔️';
    el.setAttribute('aria-hidden', 'true');
    el.className = 'sword-floater';
    el.style.left     = left + '%';
    el.style.top      = top  + '%';
    el.style.fontSize = size + 'px';
    el.style.setProperty('--drift-dur',   dur   + 's');
    el.style.setProperty('--drift-delay', delay + 's');
    el.style.setProperty('--dx1', rnd() + 'px');
    el.style.setProperty('--dy1', rnd() + 'px');
    el.style.setProperty('--dx2', rnd() + 'px');
    el.style.setProperty('--dy2', rnd() + 'px');
    el.style.setProperty('--dx3', rnd() + 'px');
    el.style.setProperty('--dy3', rnd() + 'px');
    $container[0].appendChild(el);
  }

  // Heart floater: spawn drifting hearts on emotional system send
  var heartColors = ['#ff5e8e','#ff9ecc','#ff6b35','#ffb347','#a855f7','#6366f1','#22d3ee','#4ade80','#f43f5e','#fb7185'];
  function spawnHeartFloater() {
    var $container = $('#heart-floaters');
    if (!$container.length) {
      $('body').append('<div id="heart-floaters"></div>');
      $container = $('#heart-floaters');
    }
    var size  = Math.round(28 + Math.random() * 36);
    var left  = (Math.random() * 85 + 5).toFixed(1);
    var top   = (Math.random() * 75 + 10).toFixed(1);
    var dur   = (6 + Math.random() * 6).toFixed(1);
    var delay = (-Math.random() * parseFloat(dur)).toFixed(1);
    var rnd   = function() { return Math.round((Math.random() - 0.5) * 80); };
    var color = heartColors[Math.floor(Math.random() * heartColors.length)];
    var el    = document.createElement('span');
    el.textContent = '♥';
    el.setAttribute('aria-hidden', 'true');
    el.className = 'heart-floater';
    el.style.left     = left + '%';
    el.style.top      = top  + '%';
    el.style.fontSize = size + 'px';
    el.style.color    = color;
    el.style.setProperty('--drift-dur',   dur   + 's');
    el.style.setProperty('--drift-delay', delay + 's');
    el.style.setProperty('--dx1', rnd() + 'px');
    el.style.setProperty('--dy1', rnd() + 'px');
    el.style.setProperty('--dx2', rnd() + 'px');
    el.style.setProperty('--dy2', rnd() + 'px');
    el.style.setProperty('--dx3', rnd() + 'px');
    el.style.setProperty('--dy3', rnd() + 'px');
    $container[0].appendChild(el);
  }

  // 送信
  $('#emSendBtn').on('click', function() {
    var prompt = $.trim($('#emPrompt').val());
    if (!prompt) { $('#emPrompt').focus(); return; }
    var idx = getMoodIndex($('#emMoodSlider').val());
    var res = emoResponses[idx];
    $('#emResponseLabel').text(res.label);
    $('#emResponseText').text(res.text);
    $('#emResponse').hide().fadeIn(400);
    // カラフルなハートを画面に浮遊させる
    for (var i = 0; i < 12; i++) {
      (function(i) { setTimeout(spawnHeartFloater, i * 80); })(i);
    }
  });

  // エンジェル名 — live preview
  $('#angelName').on('input', function() {
    var val = $.trim($(this).val());
    var $preview = $('#angelNamePreview');
    if (val) {
      $preview.text('エンジェル名：' + val).addClass('fm-input-preview--visible');
    } else {
      $preview.text('').removeClass('fm-input-preview--visible');
    }
  });

  // バトル開始ボタン — プロンプト入力で有効化
  var $vsBtn = $('#vsBattleBtn');
  $vsBtn.prop('disabled', true);
  $('#vsPrompt').on('input', function() {
    $vsBtn.prop('disabled', $.trim($(this).val()) === '');
  });

  function vsShowView(view) {
    $('#vsViewForm, #vsViewLoading, #vsViewResult').hide();
    $('#vsViewResult').css('display', 'none');
    if (view === 'form')    { $('#vsViewForm').show(); }
    if (view === 'loading') { $('#vsViewLoading').show(); }
    if (view === 'result')  { $('#vsViewResult').show(); }
  }

  function vsAnimateBar(barId, pct) {
    setTimeout(function() {
      $('#' + barId).css('width', pct + '%');
    }, 100);
  }

  $vsBtn.on('click', function() {
    if ($vsBtn.prop('disabled')) return;
    vsShowView('loading');
    setTimeout(function() {
      var claudeWins = Math.random() >= 0.5;
      var scoreA = claudeWins ? Math.round(60 + Math.random() * 25) : Math.round(70 + Math.random() * 20);
      var scoreB = claudeWins ? Math.round(scoreA + 5 + Math.random() * 20) : Math.round(40 + Math.random() * 25);
      var pctA   = claudeWins ? Math.round(55 + Math.random() * 20) : Math.round(70 + Math.random() * 20);
      var pctB   = claudeWins ? Math.round(pctA + 8 + Math.random() * 15) : Math.round(pctA - 10 - Math.random() * 15);
      $('#vsCardGpt').removeClass('fm-vs-result-card--winner fm-vs-result-card--loser').addClass(claudeWins ? 'fm-vs-result-card--loser' : 'fm-vs-result-card--winner');
      $('#vsCardClaude').removeClass('fm-vs-result-card--winner fm-vs-result-card--loser').addClass(claudeWins ? 'fm-vs-result-card--winner' : 'fm-vs-result-card--loser');
      $('#vsCardGpt .fm-vs-result-card__trophy, #vsCardClaude .fm-vs-result-card__trophy').hide();
      (claudeWins ? $('#vsCardClaude') : $('#vsCardGpt')).find('.fm-vs-result-card__trophy').show();
      $('#vsScoreGpt').text(scoreA);
      $('#vsScoreClaude').text(scoreB);
      var winner = claudeWins ? 'Claude' : 'GPT-4';
      var loser  = claudeWins ? 'GPT-4'  : 'Claude';
      var wScore = claudeWins ? scoreB : scoreA;
      var lScore = claudeWins ? scoreA : scoreB;
      $('#vsWinnerTitle').text(winner + ' の勝利！');
      $('#vsWinnerScore').text('最終スコア: ' + loser + ' ' + lScore + ' - ' + wScore + ' ' + winner);
      vsShowView('result');
      vsAnimateBar('vsBarGpt', pctA);
      vsAnimateBar('vsBarClaude', pctB);
      // 剣アイコンを画面に浮遊させる
      for (var i = 0; i < 2; i++) {
        (function(i) { setTimeout(spawnSwordFloater, i * 100); })(i);
      }
    }, 2000);
  });

  $('#vsRetryBtn').on('click', function() {
    $('#vsPrompt').val('');
    $vsBtn.prop('disabled', true);
    $('#vsBarGpt, #vsBarClaude').css('width', '0%');
    vsShowView('form');
  });

  // エンジェル作成ボタン — ローディング画面へ
  function angelShowView(view) {
    if (view === 'form') {
      $('#angelViewLoading').hide();
      $('#angelViewForm').show();
    } else {
      $('#angelViewForm').hide();
      $('#angelViewLoading').show();
    }
  }

  function angelUpdateBlocks(filled) {
    $('#angelBlocks .angel-block').each(function(i) {
      if (i < filled) {
        $(this).addClass('angel-block--active');
      } else {
        $(this).removeClass('angel-block--active');
      }
    });
  }

  var taskLabels = {
    'data-recovery':      '削除データの自動復元',
    'email-assistant':    '上司の機嫌を考慮したメール作成',
    'spoiler-blocker':    'ネタバレ防止機能',
    'schedule-optimizer': 'スケジュール最適化'
  };

  var angelInterval = null;

  function angelReset() {
    if (angelInterval) { clearInterval(angelInterval); angelInterval = null; }
    angelShowView('form');
    $('#angelName').val('');
    $('#angelTask').val($('#angelTask option:first').val());
    $('#angelNamePreview').text('');
    $('#angelPercent').text('0%');
    $('#angelStatus').text('作成中...').removeClass('angel-loading__status--complete');
    $('#angelCompleteInfo').hide().removeClass('angel-loading__info--visible');
    $('.angel-loading__icon').removeClass('angel-loading__icon--complete');
    angelUpdateBlocks(0);
  }

  // Angel floater: spawn drifting icon on each creation
  var angelFloaterCount = 0;
  function spawnAngelFloater() {
    var $container = $('#angel-floaters');
    if (!$container.length) {
      $('body').append('<div id="angel-floaters"></div>');
      $container = $('#angel-floaters');
    }
    var size  = Math.round(80 + Math.random() * 56);
    var left  = (Math.random() * 85 + 5).toFixed(1);
    var top   = (Math.random() * 75 + 10).toFixed(1);
    var dur   = (7 + Math.random() * 7).toFixed(1);
    var delay = (-Math.random() * parseFloat(dur)).toFixed(1);
    var rnd   = function() { return Math.round((Math.random() - 0.5) * 90); };
    var el    = document.createElement('img');
    el.src    = 'images/angel-icon-square-v2.svg';
    el.alt    = '';
    el.setAttribute('aria-hidden', 'true');
    el.className = 'angel-floater';
    el.style.left   = left + '%';
    el.style.top    = top  + '%';
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    angelFloaterCount++;
    if (angelFloaterCount > 1) {
      var hue = Math.round(Math.random() * 360);
      el.style.filter = 'invert(1) sepia(1) saturate(4) hue-rotate(' + hue + 'deg)';
    }
    el.style.setProperty('--drift-dur',   dur   + 's');
    el.style.setProperty('--drift-delay', delay + 's');
    el.style.setProperty('--dx1', rnd() + 'px');
    el.style.setProperty('--dy1', rnd() + 'px');
    el.style.setProperty('--dx2', rnd() + 'px');
    el.style.setProperty('--dy2', rnd() + 'px');
    el.style.setProperty('--dx3', rnd() + 'px');
    el.style.setProperty('--dy3', rnd() + 'px');
    $container[0].appendChild(el);
  }

  $('#angelSubmitBtn').on('click', function() {
    var angelName = $.trim($('#angelName').val()) || '名前未設定';
    var taskVal   = $('#angelTask').val();
    var taskLabel = taskLabels[taskVal] || '未選択';

    angelShowView('loading');

    var progress = 0;
    var $percent = $('#angelPercent');
    var $status  = $('#angelStatus');
    var $info    = $('#angelCompleteInfo');

    $percent.text('0%');
    $status.text('作成中...').removeClass('angel-loading__status--complete');
    $info.hide();
    angelUpdateBlocks(0);

    angelInterval = setInterval(function() {
      // ランダムな増分で自然なローディングを演出
      progress += Math.random() * 2.5 + 0.3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(angelInterval); angelInterval = null;
        $percent.text('100%');
        angelUpdateBlocks(10);
        $('.angel-loading__icon').addClass('angel-loading__icon--complete');
        // 1.5秒後に作成完了＋エンジェル情報を表示＋フローター追加
        setTimeout(function() {
          spawnAngelFloater();
          $status.text('作成完了！').addClass('angel-loading__status--complete');
          $('#angelCompleteName').text(angelName);
          $('#angelCompleteTask').text(taskLabel);
          $info.removeClass('angel-loading__info--visible').show();
          // 次フレームでクラスを付与してボーダーアニメーションを発火
          requestAnimationFrame(function() {
            $info.addClass('angel-loading__info--visible');
          });
        }, 1500);
      } else {
        $percent.text(progress.toFixed(2) + '%');
        angelUpdateBlocks(Math.floor(progress / 10));
      }
    }, 150);
  });

  // タスク内容 — update notice
  $('#angelTask').on('change', function() {
    var val = $(this).val();
    var $notice = $('#taskNotice');
    var $text   = $('#taskNoticeText');
    if (val && taskDescriptions[val]) {
      $text.text(taskDescriptions[val]);
      $notice.addClass('fm-task-notice--active');
    } else {
      $text.text('タスクを選択すると、エンジェルの動作内容が表示されます。');
      $notice.removeClass('fm-task-notice--active');
    }
  });
});
// ──────────────────────────────────────────────────────────────

// Countdown to 4/1 2026
(function() {
  var target = new Date(2026, 3, 1); // April 1, 2026
  var now = new Date();
  var diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  var isToday = diff <= 0;
  var daysText = isToday ? '0' : String(diff);
  // Mobile countdown
  var mobileEl = document.getElementById('countdownMobile');
  if (mobileEl) {
    mobileEl.innerHTML = isToday
      ? '本日 <strong>4/1</strong> 解禁！'
      : '4/1 まであと <strong>' + daysText + '</strong> 日';
  }
})();

// Mobile hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMobileMenu = document.getElementById('navMobileMenu');
if (hamburgerBtn && navMobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navMobileMenu.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    navMobileMenu.setAttribute('aria-hidden', !isOpen);
  });
  navMobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// Arrow Down / A key → scroll to next section (demo)
(function() {
  var stops = [
    { id: 'top' },
    { id: 'new-section' },
    { id: 'vs' },
    { id: 'emo' },
    { id: 'angel' },
    { id: 'and-section' },
    { id: 'glitch-section' },
    { id: 'omega' },
    { canvasId: 'omega', canvasY: 350  }, // OMEGA文字・アイコン
    { canvasId: 'omega', canvasY: 1150 }, // カード1: インフィニットジェネレーション
    { canvasId: 'omega', canvasY: 1650 }, // カード2
    { canvasId: 'omega', canvasY: 2040 }, // カード3
    { id: 'price' },
    { id: 'price-options' }, // 追加オプション
    { id: 'contact' },
  ];
  var currentIndex = 0;
  var locked = false;

  function scrollToStop(stop) {
    if (stop.id) {
      var el = document.getElementById(stop.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (stop.canvasId) {
      var section = document.getElementById(stop.canvasId);
      if (!section) return;
      var scale = document.documentElement.clientWidth / 1512;
      var sectionTop = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: sectionTop + stop.canvasY * scale, behavior: 'smooth' });
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.key !== 'ArrowDown' && e.key !== 'a' && e.key !== 'A') return;
    if (locked) return;
    if (currentIndex >= stops.length - 1) return;

    currentIndex++;
    locked = true;
    scrollToStop(stops[currentIndex]);
    setTimeout(function() { locked = false; }, 1200);
  });
})();

// ============================================================
// Sparkle effect for "0ヶ月分お得" badge (always on)
// ============================================================
(function() {
  var badge = document.querySelector('.price-grid__note:not([aria-hidden])');
  if (!badge || badge.style.visibility === 'hidden') {
    badge = document.querySelector('.price-grid__note:not([style*="hidden"])');
  }
  if (!badge) return;

  var COLORS = ['#fbbf24', '#ffffff', '#fde68a', '#fcd34d', '#fff7ed', '#fed7aa'];
  var CHARS  = ['✦', '✧', '✸', '✺', '★', '✵'];

  var sparkles   = [];
  var spawnTimer = 0;
  var spawnAngle = 0;

  function createNoteSparkle(startAngle) {
    var rect  = badge.getBoundingClientRect();
    var rx    = rect.width  / 2 + 14;
    var ry    = rect.height / 2 + 14;
    var cx    = rect.width  / 2;
    var cy    = rect.height / 2;
    var fontSize = Math.random() * 7 + 5;

    var el = document.createElement('span');
    el.className   = 'note-sparkle';
    el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    el.style.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.fontSize = fontSize + 'px';
    badge.appendChild(el);

    sparkles.push({
      el:         el,
      halfSize:   fontSize / 2,
      life:       0,
      maxLife:    Math.round(Math.random() * 35 + 40),
      orbitAngle: startAngle,
      speed:      (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1),
      rx: rx, ry: ry, cx: cx, cy: cy
    });
  }

  function noteSparkleLoop() {
    var toRemove = [];

    for (var i = 0; i < sparkles.length; i++) {
      var s = sparkles[i];
      s.life++;
      s.orbitAngle += s.speed;

      var rad      = s.orbitAngle * Math.PI / 180;
      var px       = s.cx + Math.cos(rad) * s.rx - s.halfSize;
      var py       = s.cy + Math.sin(rad) * s.ry - s.halfSize;
      var progress = s.life / s.maxLife;
      var opacity  = progress < 0.2 ? progress / 0.2
                   : progress > 0.75 ? (1 - progress) / 0.25
                   : 1;
      var scale    = 0.3 + Math.sin(progress * Math.PI) * 1.1;

      s.el.style.transform = 'translate(' + px + 'px,' + py + 'px) scale(' + scale + ')';
      s.el.style.opacity   = opacity;

      if (s.life >= s.maxLife) {
        s.el.remove();
        toRemove.push(i);
      }
    }

    for (var j = toRemove.length - 1; j >= 0; j--) {
      sparkles.splice(toRemove[j], 1);
    }

    spawnTimer++;
    if (spawnTimer >= 12) {
      createNoteSparkle(spawnAngle);
      spawnAngle = (spawnAngle + 67) % 360;
      spawnTimer = 0;
    }

    requestAnimationFrame(noteSparkleLoop);
  }

  // 初期バースト
  for (var i = 0; i < 6; i++) createNoteSparkle(i * 60);
  requestAnimationFrame(noteSparkleLoop);
})();

// ============================================================
// Sparkle orbit effect for feature-demo-btn
// ============================================================
(function() {
  var btn = document.getElementById('openFeatureModal');
  var wrapper = btn ? btn.closest('.feature-demo-wrapper') : null;
  if (!btn || !wrapper) return;

  var COLORS = ['#fbbf24', '#ffffff', '#93c5fd', '#fde68a', '#f9a8d4', '#a5f3fc'];
  var CHARS  = ['✦', '✧', '★', '✸', '✺', '✵'];

  var sparkles    = [];
  var raf         = null;
  var isHovered   = false;
  var spawnTimer  = 0;
  var spawnAngle  = 0;

  function createSparkle(startAngle) {
    var rect    = btn.getBoundingClientRect();
    var wRect   = wrapper.getBoundingClientRect();
    var rx      = rect.width  / 2 + 30;
    var ry      = rect.height / 2 + 30;
    var fontSize = Math.random() * 10 + 8;

    var el = document.createElement('span');
    el.className   = 'btn-sparkle';
    el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
    el.style.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.fontSize = fontSize + 'px';
    wrapper.appendChild(el);

    sparkles.push({
      el:          el,
      halfSize:    fontSize / 2,
      life:        0,
      maxLife:     Math.round(Math.random() * 45 + 50),
      orbitAngle:  startAngle,
      speed:       (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 1.5 + 0.8),
      rx:          rx,
      ry:          ry,
      cx:          rect.left - wRect.left + rect.width  / 2,
      cy:          rect.top  - wRect.top  + rect.height / 2
    });
  }

  function tick() {
    var toRemove = [];

    for (var i = 0; i < sparkles.length; i++) {
      var s = sparkles[i];
      s.life++;
      s.orbitAngle += s.speed;

      var rad      = s.orbitAngle * Math.PI / 180;
      var px       = s.cx + Math.cos(rad) * s.rx - s.halfSize;
      var py       = s.cy + Math.sin(rad) * s.ry - s.halfSize;
      var progress = s.life / s.maxLife;
      var opacity  = progress < 0.2 ? progress / 0.2
                   : progress > 0.75 ? (1 - progress) / 0.25
                   : 1;
      var scale    = 0.4 + Math.sin(progress * Math.PI) * 0.9;

      s.el.style.transform = 'translate(' + px + 'px,' + py + 'px) scale(' + scale + ')';
      s.el.style.opacity   = opacity;

      if (s.life >= s.maxLife) {
        s.el.remove();
        toRemove.push(i);
      }
    }

    for (var j = toRemove.length - 1; j >= 0; j--) {
      sparkles.splice(toRemove[j], 1);
    }

    if (isHovered) {
      spawnTimer++;
      if (spawnTimer >= 7) {
        createSparkle(spawnAngle);
        spawnAngle  = (spawnAngle + 53) % 360;
        spawnTimer  = 0;
      }
    }

    if (isHovered || sparkles.length > 0) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  btn.addEventListener('mouseenter', function() {
    isHovered = true;
    // 初期バースト
    for (var i = 0; i < 8; i++) {
      createSparkle(i * 45);
    }
    if (!raf) raf = requestAnimationFrame(tick);
  });

  btn.addEventListener('mouseleave', function() {
    isHovered = false;
  });
})();
