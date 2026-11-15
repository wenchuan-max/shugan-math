(() => {
  'use strict';

  const script = new URL(document.currentScript.src);
  const version = script.searchParams.get('v');
  const subject = document.body.dataset.subject || 'math';
  const subjects = [
    {id:'math', name:'数学', mark:'∿', description:'人教A版 · 五册课程', file:'index.html'},
    {id:'english', name:'英语', mark:'Aa', description:'七册单元 · 语法与读写', file:'english/index.html'},
    {id:'chinese', name:'语文', mark:'文', description:'古诗文 · 背诵与课外阅读', file:'chinese/index.html'},
    {id:'physics', name:'物理', mark:'φ', description:'六册课程 · 交互实验与高考题', file:'physics/index.html'},
    {id:'chemistry', name:'化学', mark:'⚗', description:'五册课程 · 粒子与反应', file:'chemistry/index.html'},
    {id:'biology', name:'生物', mark:'叶', description:'五册课程 · 结构与过程', file:'biology/index.html'}
  ];

  const landing = document.getElementById('subject-landing');
  if (landing) {
    const updateLanding = () => {
      const route = location.hash.slice(1).split(/[/?]/,1)[0];
      landing.hidden = Boolean(route && route !== 'home');
    };
    updateLanding();
    window.addEventListener('hashchange', updateLanding);
    landing.querySelector('a[href="#home"]').addEventListener('click', event => {
      if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const main = document.getElementById('main');
      if (!main) return;
      event.preventDefault();
      main.tabIndex = -1;
      main.focus({preventScroll:true});
      main.scrollIntoView({block:'start',behavior:'instant'});
    });
  }

  const brand = document.querySelector('.brand');
  if (!brand) return;
  const currentName = subjects.find(item => item.id === subject)?.name || '数学';
  const shell = document.createElement('div');
  shell.className = 'subject-shell';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'brand subject-toggle';
  button.setAttribute('aria-label', '切换科目，当前' + currentName);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'subject-menu');
  button.innerHTML = brand.innerHTML + '<span class="subject-current">切换科目 <span aria-hidden="true">⌄</span></span>';

  const menu = document.createElement('div');
  menu.id = 'subject-menu';
  menu.className = 'subject-menu';
  menu.hidden = true;
  menu.setAttribute('aria-label', '选择学习科目');
  menu.innerHTML = '<span class="subject-menu-label">选择学习科目</span>' + subjects.map(item => {
    const url = new URL(item.file, script);
    if (version) url.searchParams.set('v',version);
    url.hash = 'home';
    const current = subject === item.id;
    return '<a href="' + url.href + '"' + (current ? ' aria-current="page"' : '') + '>' +
      '<span class="subject-icon" aria-hidden="true">' + item.mark + '</span><span><strong>' + item.name +
      '</strong><small>' + item.description + '</small></span><span class="subject-check" aria-hidden="true">' +
      (current ? '✓' : '↗') + '</span></a>';
  }).join('');

  function setExpanded(expanded) {
    menu.hidden = !expanded;
    button.setAttribute('aria-expanded', String(expanded));
  }

  shell.append(button,menu);
  brand.replaceWith(shell);
  button.addEventListener('click', () => setExpanded(menu.hidden));
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) setExpanded(false);
  });
  document.addEventListener('click', event => {
    if (!shell.contains(event.target)) setExpanded(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setExpanded(false);
      button.focus();
    }
    if (event.key === 'ArrowDown' && document.activeElement === button) {
      event.preventDefault();
      setExpanded(true);
      menu.querySelector('a')?.focus();
    }
  });
})();
