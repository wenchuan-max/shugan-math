(() => {
  'use strict';

  const scriptUrl = new URL(document.currentScript.src);
  const version = scriptUrl.searchParams.get('v');
  const topbar = document.querySelector('.topbar');
  if (!topbar || typeof HTMLDialogElement === 'undefined') return;
  const subjects = {math:'数学', english:'英语', chinese:'语文', physics:'物理'};
  const paths = {math:'index.html', english:'english/index.html', chinese:'chinese/index.html', physics:'physics/index.html'};
  const currentSubject = document.body.dataset.subject || 'math';
  const suggestions = ['二次函数', 'exchange', '落霞与孤鹜齐飞', '城南旧事', '平抛运动'];
  const pageSize = 12;
  const icon = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/></svg>';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[character]);
  const normalize = value => value.normalize('NFKC').normalize('NFD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/[\p{P}\p{S}\s]+/gu,' ').trim();
  const compact = value => normalize(value).replaceAll(' ', '');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'site-search-toggle';
  button.setAttribute('aria-label', '全站搜索');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
  button.innerHTML = icon + '<span>全站搜索</span>';
  topbar.insertBefore(button, topbar.querySelector('.mobile-toggle'));

  const dialog = document.createElement('dialog');
  dialog.className = 'site-search';
  dialog.setAttribute('aria-labelledby', 'site-search-title');
  dialog.innerHTML = '<div class="site-search-header"><div><p>数学 · 英语 · 语文 · 物理</p>' +
    '<h2 id="site-search-title">全站搜索</h2></div>' +
    '<button type="button" data-site-close aria-label="关闭搜索">×</button></div>' +
    '<form class="site-search-form" role="search">' + icon +
    '<input type="search" aria-label="搜索站内课程与资料" placeholder="输入知识点、单词、诗句或书名" maxlength="80" autocomplete="off" autofocus>' +
    '</form><div class="site-search-filters" role="group" aria-label="筛选科目">' +
    Object.entries({all:'全部科目', ...subjects}).map(([id, label]) =>
      '<button type="button" data-site-subject="' + id + '" aria-pressed="' + (id === 'all') + '">' + label + '</button>').join('') +
    '</div><div class="site-search-body"><p class="site-search-status" role="status"></p>' +
    '<div class="site-search-results"></div></div>';
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const input = form.querySelector('input');
  const status = dialog.querySelector('.site-search-status');
  const results = dialog.querySelector('.site-search-results');
  const body = dialog.querySelector('.site-search-body');
  let index, pending, loadError = false, selected = 'all', limit = pageSize;

  function load() {
    if (index || pending) return;
    const indexUrl = new URL('site-search-index.js', scriptUrl);
    if (version) indexUrl.searchParams.set('v', version);
    pending = document.createElement('script');
    pending.src = indexUrl.href;
    pending.onload = () => {
      const data = window.SiteSearchIndex;
      if (!Array.isArray(data?.records) || (version && data.version !== version)) {
        failed();
        return;
      }
      index = data.records.map(([subject, type, title, scope, description, route, keywords]) => ({
        subject, type, title, scope, description, route, keywords,
        titleKey:compact(title), scopeKey:compact(scope), descriptionKey:compact(description), keywordKey:compact(keywords)
      }));
      pending.remove();
      pending = null;
      delete window.SiteSearchIndex;
      render();
    };
    pending.onerror = failed;
    loadError = false;
    document.head.append(pending);
    render();
  }

  function failed() {
    pending?.remove();
    pending = null;
    loadError = true;
    render();
  }

  function rank(item, terms, full) {
    const {titleKey, scopeKey, descriptionKey, keywordKey} = item;
    if (titleKey === full) return 0;
    if (titleKey.startsWith(full)) return 1;
    if (titleKey.includes(full)) return 2;
    let score = 0;
    for (const term of terms) {
      if (titleKey.includes(term)) continue;
      if (descriptionKey.includes(term)) score += 1;
      else if (scopeKey.includes(term)) score += 2;
      else if (keywordKey.includes(term)) score += 3;
      else return Infinity;
    }
    return 3 + score;
  }

  function resultUrl(item) {
    if (item.subject === currentSubject) return '#' + item.route;
    const target = new URL(paths[item.subject], scriptUrl);
    if (version) target.searchParams.set('v', version);
    if (new URLSearchParams(location.search).get('qa') === '1') target.searchParams.set('qa','1');
    target.hash = item.route;
    return target.href;
  }

  function resultRow(item, full) {
    const {subject, type, title, scope, description, keywords, keywordKey} = item;
    const quote = type === '古诗文' && !item.titleKey.includes(full) && keywordKey.includes(full)
      ? keywords.split(/[。！？\n]/u).find(line => compact(line).includes(full))?.trim() : '';
    return '<li><a href="' + escape(resultUrl(item)) + '" class="site-search-result">' +
      '<span class="site-search-tag" data-site-kind="' + subject + '">' + subjects[subject] + ' · ' + type + '</span>' +
      '<strong>' + escape(title) + '</strong><small>' + escape(scope) + '</small>' +
      '<span class="site-search-description">' + escape(quote ? '「' + quote + '」' : description) + '</span>' +
      '<span class="site-search-arrow" aria-hidden="true">↗</span></a></li>';
  }

  function render() {
    if (loadError) {
      status.textContent = '搜索暂时没有加载成功。';
      results.innerHTML = '<button type="button" class="btn small ghost" data-site-retry>重新加载</button>';
      return;
    }
    if (!index) {
      status.textContent = '正在准备搜索…';
      results.replaceChildren();
      return;
    }
    const query = normalize(input.value);
    if (!query) {
      status.textContent = input.value.trim() ? '请输入文字或数字。' : '可以试试这些关键词';
      results.innerHTML = '<div class="site-search-suggestions">' +
        suggestions.map(value => '<button type="button" data-site-query="' + value + '">' + value + '</button>').join('') + '</div>';
      return;
    }
    const terms = query.split(' '), full = terms.join('');
    const matches = index.filter(item => selected === 'all' || item.subject === selected)
      .map(item => ({item, score:rank(item, terms, full)})).filter(hit => Number.isFinite(hit.score))
      .sort((a, b) => a.score - b.score);
    status.textContent = matches.length ? '找到 ' + matches.length + ' 条' : '没有找到。试试更短的词，或换到全部科目。';
    results.innerHTML = matches.length ? '<ul>' + matches.slice(0, limit).map(hit => resultRow(hit.item, full)).join('') + '</ul>' +
      (matches.length > limit ? '<button type="button" class="btn small ghost" data-site-more>再显示 ' +
        Math.min(pageSize, matches.length - limit) + ' 条</button>' : '') : '';
  }

  function resetResults() {
    limit = pageSize;
    body.scrollTop = 0;
    render();
  }

  function chooseSubject(subject) {
    selected = subject;
    dialog.querySelectorAll('[data-site-subject]').forEach(filter =>
      filter.setAttribute('aria-pressed', String(filter.dataset.siteSubject === selected)));
  }

  button.addEventListener('click', () => {
    if (dialog.open) return;
    dialog.showModal();
    input.focus();
    load();
  });
  dialog.addEventListener('close', () => button.focus({preventScroll:true}));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) input.focus();
      else button.click();
    }
  });
  input.addEventListener('input', event => {
    if (!event.isComposing) resetResults();
  });
  input.addEventListener('compositionend', resetResults);
  form.addEventListener('submit', event => {
    event.preventDefault();
    results.querySelector('a')?.click();
  });
  dialog.addEventListener('click', event => {
    if (event.target.closest('[data-site-close], .site-search-result')) {
      dialog.close();
    } else if (event.target.closest('[data-site-retry]')) {
      load();
    } else if (event.target.closest('[data-site-more]')) {
      const previous = limit;
      limit += pageSize;
      render();
      results.querySelectorAll('a')[previous]?.focus();
    } else {
      const filter = event.target.closest('[data-site-subject]');
      const suggestion = event.target.closest('[data-site-query]');
      if (filter) {
        chooseSubject(filter.dataset.siteSubject);
        resetResults();
      } else if (suggestion) {
        chooseSubject('all');
        input.value = suggestion.dataset.siteQuery;
        resetResults();
        input.focus();
      }
    }
  });
})();
