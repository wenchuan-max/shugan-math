(() => {
  'use strict';
  const C = window.EnglishCore;
  const V = window.EnglishVocabulary;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const labels = {correct: '独立拼对', assisted: '用了提示', wrong: '拼写有误', skipped: '这次没想起'};
  const glossaryFilters = ['book', 'unit', 'type', 'scope', 'search', 'word'];

  const partsOfSpeech = {n: '名词', v: '动词', vt: '及物动词', vi: '不及物动词', adj: '形容词',
    adv: '副词', prep: '介词', pron: '代词', det: '限定词', conj: '连词', num: '数词', int: '感叹词'};

  function readableMeaning(text) {
    return text.replace(/(^|[\s;；])((?:[a-z]+\.\s*&\s*)?[a-z]+\.)(?=\s|[^\x00-\x7F]|[()]|$)\s*/gi,
      (match, separator, abbreviations) => {
        const labels = abbreviations.toLowerCase().match(/[a-z]+/g).map(key => partsOfSpeech[key]);
        return labels.every(Boolean) ? (separator ? '\n' : '') + labels.join('、') + '：' : match;
      }).replace(/;\s*/g, '；');
  }

  function create({getState, save, redraw, params, normalUrl, speak, toast}) {
    function savedRound() {
      const round = getState().vocabPractice.round;
      if (!Array.isArray(round?.ids) || !round.ids.length || round.ids.length > 10 ||
          !round.ids.every(id => V.byId.has(id)) || !Array.isArray(round.answers) ||
          !Number.isInteger(round.index) || round.index < 0 || round.index > round.ids.length) return null;
      if (round.answers.length < round.index || round.answers.length > Math.min(round.index + 1, round.ids.length) ||
          !round.answers.every((answer, index) => answer?.id === round.ids[index] && Object.hasOwn(labels, answer.kind))) return null;
      return round;
    }

    function filters(source) {
      return Object.fromEntries(glossaryFilters
        .filter(key => typeof source?.[key] === 'string' && source[key])
        .map(key => [key, source[key]]));
    }

    function unitName(word) {
      const lesson = C.lessonById.get(word.lessonId);
      const book = C.books.find(item => item.id === word.bookId);
      return book.title + ' · ' + (lesson.number ? 'Unit ' + lesson.number + ' · ' + lesson.title : 'Welcome Unit');
    }

    function glossaryLink(filter) {
      return escape(normalUrl('words', filters(filter)));
    }

    function setup(round) {
      const selected = filters(params());
      const plan = V.practiceWords(getState(), selected);
      const lesson = C.lessonById.get(selected.unit);
      const book = C.books.find(item => item.id === selected.book);
      const range = [
        lesson ? unitName({lessonId: lesson.id, bookId: lesson.bookId}) : book?.title || '全部七册',
        selected.word && V.byId.get(selected.word)?.word, selected.type, {due: '只练待复习词', wrong: '只练最近错词', marked: '只练标记词'}[selected.scope],
        selected.search && '查找「' + selected.search + '」'
      ].filter(Boolean).join(' / ');
      const inProgress = round && round.index < round.ids.length;
      return '<section class="vw-review-card"><span class="small-label">练习范围</span><h2>' + escape(range) +
        '</h2><p>先练错词和到期词，空位再补新词。</p>' +
        '<div class="vw-review-counts"><span><strong>' + plan.review + '</strong> 待复习</span>' +
        '<span><strong>' + plan.newWords + '</strong> 新词</span></div>' +
        (inProgress ? '<p>上轮还有 ' + (round.ids.length - round.index) +
          ' 个词待处理。开始新一轮会替换上轮进度，已核对的记录仍会保留。</p>' : '') +
        '<div class="en-actions">' +
        (inProgress ? '<a class="btn primary" href="#wordreview">继续上轮 →</a>' : '') +
        (plan.queue.length ? '<button class="btn ' + (inProgress ? 'ghost' : 'primary') +
          '" data-act="vr-start">开始' + (inProgress ? '新一轮' : '这一轮') + ' · ' + plan.queue.length +
          ' 词 →</button>' : '<p>这一范围暂时没有到期词或新词。</p>') +
        '<a class="btn ghost" href="' + glossaryLink(selected) + '">回到词表选范围</a></div>' +
        (plan.queue.length ? '<details class="vw-review-preview"><summary>先看这组词</summary><ul>' +
          plan.queue.map(word => '<li><strong lang="en">' + escape(word.word) + '</strong><span>' +
            escape(word.meaning) + '</span></li>').join('') + '</ul></details>' : '') + '</section>';
    }

    function card(round) {
      const word = V.byId.get(round.ids[round.index]);
      const answer = round.answers[round.index];
      const completed = round.index + (answer ? 1 : 0);
      return '<section class="vw-review-card"><div class="vw-review-progress"><span>' +
        escape(unitName(word)) + '</span><strong>第 ' + (round.index + 1) + ' / ' + round.ids.length +
        ' 词</strong></div><progress aria-label="本轮完成词数" value="' + completed + '" max="' +
        round.ids.length + '"></progress><div class="vw-review-prompt"><span class="small-label">' +
        escape(word.category) + ' · 看中文写英文</span><h2>' + escape(readableMeaning(word.meaning)) + '</h2></div>' +
        (answer ? feedback(round, answer) :
          '<form id="vw-review-form"><label for="vw-review-answer">你的拼写</label>' +
          (round.hinted ? '<p class="vw-pattern" lang="en" aria-label="首字母提示">' +
            escape(V.mask(word, 3)) + '</p>' : '') +
          '<input id="vw-review-answer" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="200" value="' +
          escape(round.draft) + '"><div class="en-actions"><button class="btn primary" type="submit">核对拼写</button>' +
          '<button class="btn ghost" type="button" data-act="vr-hint"' + (round.hinted ? ' disabled' : '') +
          '>看首字母</button><button class="en-text-button" type="button" data-act="vr-skip">想不起来</button></div></form>') +
        '</section>';
    }

    function feedback(round, answer) {
      const right = answer.kind === 'correct' || answer.kind === 'assisted';
      return '<div class="vw-review-feedback ' + (right ? 'right' : 'miss') + '" role="status"><span>' +
        labels[answer.kind] + '</span><strong lang="en">' + escape(answer.expected) + '</strong>' +
        (answer.text && !right ? '<p>你写的是 <span lang="en">' + escape(answer.text) + '</span></p>' : '') +
        '<p>' + (answer.kind === 'correct' ? '已安排下次复习。' : '已加入待复习，可以在本轮结束后再写。') + '</p></div>' +
        '<div class="en-actions"><button class="btn primary" data-act="vr-next">' +
        (round.index + 1 === round.ids.length ? '查看本轮结果' : '下一个词') +
        ' →</button><button class="btn ghost" data-act="vr-speak">▶ 听读音</button></div>';
    }

    function finish(round) {
      const missed = round.answers.filter(answer => answer.kind !== 'correct');
      const nextUrl = escape(normalUrl('wordreview', {...filters(round.filters), setup: 1}));
      return '<section class="vw-review-card"><span class="small-label">本轮完成</span><h2 tabindex="-1" id="vw-review-result">' +
        '这轮练完了。</h2><div class="vw-review-counts"><span><strong>' + (round.ids.length - missed.length) +
        '</strong> 独立拼对</span><span><strong>' + missed.length + '</strong> 需要再练</span></div>' +
        (missed.length ? '<ul class="vw-review-missed">' + missed.map(answer => {
          const word = V.byId.get(answer.id);
          return '<li><strong lang="en">' + escape(word.word) + '</strong><span>' +
            escape(word.meaning) + '</span><small>' + labels[answer.kind] + '</small></li>';
        }).join('') + '</ul>' : '<p>这组都独立写对了。到期后，它们会自动回到复习队列。</p>') +
        '<div class="en-actions">' + (missed.length ? '<button class="btn primary" data-act="vr-retry">重练这 ' +
          missed.length + ' 个词 →</button>' : '') + '<a class="btn ' + (missed.length ? 'ghost' : 'primary') +
          '" href="' + nextUrl + '">选词开始下一轮 →</a></div></section>';
    }

    function render() {
      const round = savedRound();
      const selecting = params().setup || !round;
      return '<main id="main" class="container en-page vw-review"><a class="small-label" href="' +
        glossaryLink(selecting ? params() : round.filters) + '">← 返回中英词表</a><header><div class="eyebrow">' +
        '一次只看一个词</div><h1>每日背词</h1><p>每轮最多 10 个。练到一半离开，回来可以接着写。</p></header>' +
        (selecting ? setup(round) : round.index < round.ids.length ? card(round) : finish(round)) + '</main>';
    }

    function refresh(focus) {
      save();
      redraw();
      if (focus) document.querySelector(focus)?.focus();
    }

    function start(ids, selected) {
      getState().vocabPractice.round = {ids, filters: selected, index: 0, answers: [], draft: '', hinted: false};
      if (location.hash === '#wordreview') refresh('#vw-review-answer');
      else {
        save();
        location.hash = 'wordreview';
      }
    }

    function check(round, skipped = false) {
      if (!round || round.index >= round.ids.length || round.answers[round.index]) return;
      if (!skipped && !V.normal(round.draft)) {
        toast('先写下想到的英文，或点「想不起来」。');
        return;
      }
      const word = V.byId.get(round.ids[round.index]);
      const text = skipped ? '' : round.draft;
      const result = V.grade(word, text);
      const kind = skipped ? 'skipped' : !result.correct ? 'wrong' : round.hinted ? 'assisted' : 'correct';
      V.recordSpelling(getState(), word, result, round.hinted);
      round.answers[round.index] = {id: word.id, text, expected: result.expected, kind};
      refresh('[data-act="vr-next"]');
    }

    function click(button) {
      const action = button.dataset.act;
      if (!action?.startsWith('vr-')) return false;
      const round = savedRound();
      if (action === 'vr-start') {
        const selected = filters(params());
        const {queue} = V.practiceWords(getState(), selected);
        if (queue.length) start(queue.map(word => word.id), selected);
        return true;
      }
      if (!round) return true;
      if (action === 'vr-retry') {
        start(round.answers.filter(answer => answer.kind !== 'correct').map(answer => answer.id), filters(round.filters));
      } else if (action === 'vr-next' && round.answers[round.index]) {
        round.index += 1;
        round.draft = '';
        round.hinted = false;
        refresh(round.index < round.ids.length ? '#vw-review-answer' : '#vw-review-result');
      } else if (action === 'vr-hint' && !round.answers[round.index]) {
        round.hinted = true;
        refresh('#vw-review-answer');
      } else if (action === 'vr-skip') {
        check(round, true);
      } else if (action === 'vr-speak') {
        speak(V.byId.get(round.ids[round.index]).word);
      }
      return true;
    }

    function input(field) {
      if (field.id !== 'vw-review-answer') return false;
      const round = savedRound();
      if (round && !round.answers[round.index]) {
        round.draft = field.value;
        save();
      }
      return true;
    }

    function submit(event) {
      if (event.target.id !== 'vw-review-form') return false;
      event.preventDefault();
      check(savedRound());
      return true;
    }

    return {render, click, input, submit};
  }

  window.EnglishWordReview = {create};
})();
