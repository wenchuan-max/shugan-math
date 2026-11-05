(() => {
  'use strict';
  const S=window.ScienceSubject, C=S.core, M=S.visuals;
  const subject=S.name, booksText=C.books.length===6?'六册':'五册';
  const [headlineA,headlineB]=S.headline;
  const $=selector=>document.querySelector(selector);
  const E=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[character]);
  const B=id=>C.bookById.get(id), H=id=>C.chapterById.get(id), L=id=>C.lessonById.get(id), Q=id=>C.questionById.get(id);
  const key='shugan.'+S.id+'.progress.v1:'+new URL('../',location.href).pathname+
    (new URLSearchParams(location.search).get('qa')==='1'?':qa':'');
  let state=C.empty(), timer, toastTimer;
  const retry=new Set();
  try { state=C.clean(JSON.parse(localStorage.getItem(key)||'{}')); }
  catch { $('#ph-save').textContent='上次记录未能读取。'; }

  function save() {
    try { localStorage.setItem(key,JSON.stringify(state)); $('#ph-save').textContent='记录保存在此浏览器'; }
    catch { $('#ph-save').textContent='浏览器未能保存，可在「错题与笔记」导出备份。'; }
  }
  function toast(message) {
    const box=$('#toast');
    box.textContent=message;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>box.classList.remove('show'),2600);
  }
  function route() {
    const [path,query]=location.hash.slice(1).split('?');
    const [view,id]=path.split('/');
    return {view:view||'home',id,p:new URLSearchParams(query)};
  }
  const href=(view,p)=>'#'+view+(p?.size?'?'+p:'');
  const btn=(url,text,kind='primary')=>'<a class="btn '+kind+'" href="'+E(url)+'">'+E(text)+'</a>';
  const heading=(eyebrow,title,subtitle='')=>'<header class="ph-heading"><span class="eyebrow">'+E(eyebrow)+'</span><h1>'+E(title)+'</h1>'+(subtitle?'<p>'+E(subtitle)+'</p>':'')+'</header>';
  const page=(body,extra='')=>'<main class="container ph-page '+extra+'" id="main" tabindex="-1">'+body+'</main>';
  const locationOf=lesson=>B(lesson.bookId).title+' · 第 '+H(lesson.chapterId).code+' 章';
  const searchForm=(view,p,fields)=>'<form class="ph-filter" data-ph-filter="'+view+'">'+
    fields.map(([name,label,options])=>'<label>'+label+'<select name="'+name+'"><option value="">全部</option>'+
      options.map(([value,title])=>'<option value="'+E(value)+'" '+(p.get(name)===value?'selected':'')+'>'+E(title)+'</option>').join('')+'</select></label>').join('')+
    '<label class="ph-query">关键词<input type="search" name="search" value="'+E(p.get('search'))+'" maxlength="80" placeholder="试试：'+(view==='papers'?'广东、2025':E(S.keywords))+'"></label><button class="btn primary" type="submit">查找</button><a href="#'+view+'">清空</a></form>';
  const compact=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
  const found=(p,text)=>compact(text).includes(compact(p.get('search')));
  const emptyMessage=(text,link)=>'<div class="ph-panel"><p>'+E(text)+'</p>'+(link||'')+'</div>';

  function chapterCard(chapter) {
    const count=chapter.lessons.filter(lesson=>C.evidence(state,lesson.id).value!==null).length;
    return '<a class="ph-link-card" href="#chapter/'+chapter.id+'"><span class="small-label">第 '+chapter.code+' 章 · '+
      count+'/'+chapter.lessons.length+' 节已有记录</span><h3>'+E(chapter.name)+'</h3><p>'+E(chapter.summary)+'</p><span>打开章节 ↗</span></a>';
  }

  function home() {
    const last=L(state.last)||C.lessons[0];
    const studied=C.lessons.filter(lesson=>C.evidence(state,lesson.id).value!==null).length;
    return page('<section class="ph-hero"><div><span class="eyebrow">'+E('高中'+subject+' · 人教版'+booksText)+'</span><h1>'+E(headlineA)+'<br><em>'+E(headlineB)+'</em></h1>'+
      '<p>'+E(S.intro)+'</p><div class="ph-actions">'+
      btn('#lesson/'+last.id,state.last?'继续：'+last.title:'从'+last.title+'开始')+btn('#bank','进入题库','ghost')+'</div>'+
      '<div class="ph-hero-stats"><span><strong>'+C.chapters.length+'</strong> 章</span><span><strong>'+C.lessons.length+'</strong> 节</span><span><strong>'+studied+'</strong> 节已有记录</span></div></div>'+
      '<a class="ph-hero-figure" href="#chapter/'+S.hero.chapter+'"><span class="small-label">01 / 动手观察</span><strong>'+E(S.hero.title)+'</strong>'+
      M.chart(H(S.hero.chapter).model,S.hero.value)+(M.models[H(S.hero.chapter).model].kind==='stages'?'':'<small>'+E('横轴：'+M.models[H(S.hero.chapter).model].x+'；纵轴：'+M.models[H(S.hero.chapter).model].y)+'</small>')+'<span>'+E(S.hero.link)+'</span></a></section>'+
      '<section class="ph-section" aria-label="'+E(subject)+'教材"><h2>'+booksText+'学习路线</h2><div class="ph-books">'+C.books.map((book,index)=>
      '<a class="ph-book" href="#book/'+book.id+'"><span class="small-label">'+(book.id.startsWith("b")?'必修':'选择性必修')+'</span>'+
      '<strong>0'+(index+1)+'</strong><h3>'+E(book.title)+'</h3><p>'+E(book.caption)+'</p></a>').join('')+'</div></section>'+
      '<div class="ph-grid"><a class="ph-link-card" href="#mastery"><h3>找到薄弱点</h3><p>结合自评和错题权重，抽出更需要练的题。</p></a>'+
      '<a class="ph-link-card" href="#papers"><h3>按地区找原卷</h3><p>2022—2026，广东卷优先，另有全国及地区卷。</p></a></div>');
  }

  function bookPage(book) {
    return page(btn('#home','← '+booksText+'路线','ghost')+heading('人教版 · 学习路线',book.title,book.caption)+
      '<div class="ph-grid">'+book.chapters.map(chapterCard).join('')+'</div>');
  }

  function experiment(chapter) {
    const m=M.models[chapter.model], [min,max,step]=m.range;
    const initial=m.initial??Number((min+step*Math.floor((max-min)/step/2)).toFixed(3));
    return '<section class="ph-panel ph-experiment" aria-label="交互实验"><span class="small-label">先猜 → 拖动 → 解释</span>'+
      '<h2>'+E(m.title)+'</h2><p>'+E(m.predict)+'</p><div class="ph-chart-frame"><p>'+E(m.kind==='stages'?'拖动滑块，按顺序比较':'纵轴：'+m.y)+'</p>'+
      '<div id="ph-chart">'+M.chart(chapter.model,initial)+'</div><p>'+E(m.kind==='stages'?'':'横轴：'+m.x)+'</p></div>'+
      '<label class="ph-range" for="ph-slider">'+E(m.x)+'</label><input id="ph-slider" type="range" data-model="'+chapter.model+'" min="'+min+'" max="'+max+'" step="'+step+'" value="'+initial+'">'+
      '<output id="ph-measure" for="ph-slider">'+E(measurement(m,initial))+'</output><details><summary>看现象怎么解释</summary><p>'+E(m.why)+'</p></details></section>';
  }

  function measurement(model,value) {
    const result=model.calc(value);
    return model.readout?model.readout(value,result):M.format(value)+' → '+(Number.isFinite(result)?M.format(result):'没有出射电子');
  }

  function chapterPage(chapter) {
    return page(btn('#book/'+chapter.bookId,'← '+B(chapter.bookId).title,'ghost')+
      heading('第 '+chapter.code+' 章',chapter.name,chapter.summary)+
      '<div class="ph-grid ph-chapter-grid"><section class="ph-panel"><h2>逐节学</h2><ol class="ph-lesson-list">'+
      chapter.lessons.map(lesson=>'<li><a href="#lesson/'+lesson.id+'">'+E(lesson.title)+'</a><small>'+
      (C.evidence(state,lesson.id).value===null?'待学':'已有记录')+'</small></li>').join('')+'</ol>'+
      '<div class="ph-actions"><button class="btn primary" data-ph-start="'+chapter.id+'">抽题练本章</button>'+btn('#bank?chapter='+chapter.id,'本章题库','ghost')+'</div></section>'+
      experiment(chapter)+'</div>');
  }

  function answerBox(question,mode,selected) {
    const done=selected!==undefined;
    return '<section class="ph-panel ph-question" id="ph-question" aria-label="作答">'+
      '<span class="small-label">'+(question.kind==='guide'?'真题导练 · 权重 4':'随堂自测 · 权重 '+question.weight)+'</span>'+
      '<h2>'+E(question.prompt)+'</h2><form data-ph-answer="'+question.id+'" data-mode="'+mode+'">'+
      '<fieldset '+(done?'disabled':'')+'><legend class="sr-only">选一个答案</legend>'+
      question.options.map((option,index)=>'<label class="ph-option'+(done&&option===question.answer?' right':'')+
        (done&&option===selected&&selected!==question.answer?' wrong':'')+'"><input type="radio" name="answer" value="'+index+'" required '+
        (option===selected?'checked':'')+'><span>'+E(option)+'</span></label>').join('')+'</fieldset>'+
      (done?'':'<button class="btn primary">核对答案</button>')+'</form>'+
      (done?'<div class="ph-feedback '+(selected===question.answer?'right':'wrong')+'" tabindex="-1"><strong>'+
        (selected===question.answer?'答对了':'再看一步')+'</strong><p>'+E(question.solution)+'</p></div>'+
        (mode==='round'?'':'<button class="btn ghost" data-ph-retry="'+question.id+'">再做一次</button>'):'')+
      (question.kind==='guide'?guideSource(question):'')+'</section>';
  }

  function guideSource(question) {
    const paper=C.paperById.get(question.paperId);
    return '<p class="ph-reference">对应 <a target="_blank" rel="noopener" href="'+E(paper.url)+'">'+E(paper.title)+
      '卷第 '+question.number+' 题 ↗</a>'+(question.page?' · PDF 第 '+question.page+' 页':'')+'</p>';
  }

  function lessonPage(lesson) {
    const chapter=H(lesson.chapterId), index=chapter.lessons.indexOf(lesson), question=Q(lesson.id);
    const selected=retry.has(question.id)?undefined:C.latest(state,question);
    const guide=C.questions.filter(item=>item.kind==='guide'&&item.lessonId===lesson.id);
    const next=chapter.lessons[index+1];
    if(state.last!==lesson.id) { state.last=lesson.id; save(); }
    return page(btn('#chapter/'+chapter.id,'← '+chapter.name,'ghost')+heading(locationOf(lesson)+' · 第 '+(index+1)+' 节',lesson.title)+
      '<section class="ph-panel ph-concept"><div><span class="small-label">01 先想一个画面</span><h2>先看发生了什么</h2><p>'+E(lesson.scene)+'</p></div>'+
      '<div class="ph-rule"><span class="small-label">02 把关系写下来</span><h2>记住这一步</h2><p>'+E(lesson.rule)+'</p></div></section>'+
      '<div class="ph-actions ph-spacer">'+btn('#chapter/'+chapter.id,'打开本章交互实验 ↗','ghost')+'</div>'+
      answerBox(question,'lesson',selected)+
      (guide.length?'<section class="ph-panel"><h2>这个考点怎么考</h2><ul>'+guide.map(item=>
        '<li><a href="#question/'+item.id+'">'+E(item.title)+'</a></li>').join('')+'</ul></section>':'')+
      '<section class="ph-panel"><h2>给这节打个分</h2><p>1 是还没懂，5 是能自己讲清并做对。</p><div class="ph-rating" role="group" aria-label="理解自评">'+
      [1,2,3,4,5].map(n=>'<button type="button" data-ph-rate="'+lesson.id+'" data-value="'+n+'" aria-pressed="'+(state.ratings[lesson.id]===n)+'">'+n+'</button>').join('')+'</div>'+
      '<label class="ph-note">用自己的话写一句，或记下还卡在哪里<textarea data-ph-note="'+lesson.id+'" maxlength="3000">'+E(state.notes[lesson.id])+'</textarea></label></section>'+
      '<div class="ph-actions">'+(next?btn('#lesson/'+next.id,'下一节：'+next.title):btn('#chapter/'+chapter.id,'回到本章'))+'</div>','ph-narrow');
  }

  function bank(p) {
    const visible=C.questions.filter(question=>{
      const lesson=L(question.lessonId), chapter=H(lesson.chapterId);
      return (!p.get('book')||lesson.bookId===p.get('book'))&&(!p.get('chapter')||chapter.id===p.get('chapter'))&&
        (!p.get('kind')||p.get('kind')===question.kind)&&found(p,[question.title,question.prompt,lesson.title,chapter.name].join(' '));
    });
    const pages=Math.max(1,Math.ceil(visible.length/18)), current=Math.max(1,Math.min(pages,Math.trunc(Number(p.get('page')))||1));
    const subset=visible.slice((current-1)*18,current*18);
    const withPage=value=>{const query=new URLSearchParams(p);query.set('page',value);return href('bank',query);};
    return page(heading('随堂自测 · 广东卷导练',subject+'题库','按教材、章节或关键词找题。')+
      '<div class="ph-actions">'+btn('#papers','浏览各地试卷资料 ↗','ghost')+btn('#review','查看我的错题','ghost')+'</div>'+
      searchForm('bank',p,[['book','教材',C.books.map(book=>[book.id,book.title])],
      ['chapter','章节',C.chapters.map(chapter=>[chapter.id,B(chapter.bookId).title+' · '+chapter.name])],
      ['kind','题目类型',[['practice','随堂自测'],['guide','广东真题导练']]]])+
      '<p role="status">找到 '+visible.length+' 道 · 第 '+current+' / '+pages+' 页</p>'+
      (subset.length?'<div class="ph-grid">'+subset.map(question=>{
        const lesson=L(question.lessonId);
        return '<a class="ph-link-card" href="#question/'+question.id+'"><span class="small-label">'+
          (question.kind==='guide'?'广东 '+question.paperId.slice(0,4)+' · 第 '+question.number+' 题导练':E(locationOf(lesson))+' · 自测')+
          '</span><h3>'+E(question.title)+'</h3><p>'+E(question.prompt)+'</p></a>';
      }).join('')+'</div>':emptyMessage('这个范围暂时没有题，试试只保留一个条件。'))+
      '<div class="ph-actions ph-spacer">'+(current>1?btn(withPage(current-1),'← 上一页','ghost'):'')+(current<pages?btn(withPage(current+1),'下一页 →'):'')+'</div>');
  }

  function questionPage(question) {
    const selected=retry.has(question.id)?undefined:C.latest(state,question);
    return page(btn('#bank','← 返回题库','ghost')+heading(locationOf(L(question.lessonId)),question.title)+
      answerBox(question,'bank',selected)+btn('#lesson/'+question.lessonId,'回课上看看这个知识点','ghost'),'ph-narrow');
  }

  function papersPage(p) {
    const years=[...new Set(C.papers.map(paper=>paper.year))].sort((a,b)=>b-a);
    const regions=[...new Set(C.papers.map(paper=>paper.region))];
    const papers=C.papers.filter(paper=>(!p.get('year')||String(paper.year)===p.get('year'))&&
      (!p.get('region')||paper.region===p.get('region'))&&found(p,paper.title+' '+paper.region));
    return page(heading('2022—2026 · 原卷资料','各地高考'+subject+'试卷','广东卷排在前面。原卷 PDF 与试题解析页面分别标明。')+
      searchForm('papers',p,[['year','年份',years.map(year=>[String(year),year])],['region','地区',regions.map(region=>[region,region])]])+
      '<p role="status">找到 '+papers.length+' 套</p>'+(papers.length?'<div class="ph-grid">'+papers.map(paper=>{
        const guides=C.questions.filter(question=>question.paperId===paper.id);
        return '<article class="ph-panel ph-paper"><span class="small-label">'+E(paper.region)+' · '+paper.year+'</span><h3>'+
          E(paper.title)+'</h3><a target="_blank" rel="noopener" href="'+E(paper.url)+'">'+(paper.format==='page'?'打开试题与解析页 ↗':'打开原卷 PDF ↗')+'</a>'+
          (guides.length?'<p>'+guides.map(question=>'<a href="#question/'+question.id+'">第 '+question.number+' 题导练</a>').join(' · ')+'</p>':'')+'</article>';
      }).join('')+'</div>':emptyMessage('这一年和地区的组合暂无收录。')));
  }


  function mastery() {
    const scored=C.chapters.map(chapter=>{
      const rows=chapter.lessons.map(lesson=>({lesson,...C.evidence(state,lesson.id)})).filter(row=>row.value!==null);
      const value=rows.length?Math.round(rows.reduce((sum,row)=>sum+row.value,0)/rows.length):null;
      return {chapter, rows, value, wrong:rows.reduce((sum,row)=>sum+row.wrong,0)};
    }).sort((a,b)=>(a.value??101)-(b.value??101)||b.wrong-a.wrong);
    return page(heading('自评 + 作答','找到最需要补的一点','有记录的章节按掌握情况排序。章节分数只平均已有记录的小节。')+
      '<div class="ph-actions"><button class="btn primary" data-ph-start="weak">抽题强化薄弱点</button>'+btn('#review','先看错题','ghost')+'</div>'+
      '<details class="ph-panel"><summary>分数怎么算</summary><p>只做过题或只填过自评时，用已有的一项。两项齐全时，作答占 65%，自评占 35%。'+
      '普通自测权重 1，实验自测 2，广东真题导练 4。最近三次作答越新权重越高；强化先抽权重较高的错题，再补掌握分低的考点。</p></details>'+
      '<div class="ph-mastery">'+scored.map(({chapter,rows,value,wrong})=>'<details class="ph-panel"><summary><span>'+
      E(B(chapter.bookId).title+' · '+chapter.name)+'</span><strong>'+ (value===null?'待评估':value+' / 100')+
      '</strong></summary><p>'+rows.length+' / '+chapter.lessons.length+' 节有记录 · 当前错题权重 '+wrong+'</p>'+
      '<ol class="ph-lesson-list">'+chapter.lessons.map(lesson=>{
        const {value,self,count}=C.evidence(state,lesson.id);
        return '<li><a href="#lesson/'+lesson.id+'">'+E(lesson.title)+'</a><small>'+
          (value===null?'待评估':value+' 分 · '+count+' 道有作答'+(self===null?'':' · 自评 '+state.ratings[lesson.id]+'/5'))+'</small></li>';
      }).join('')+'</ol><button class="btn ghost" data-ph-start="'+chapter.id+'">定向强化本章 →</button></details>').join('')+'</div>');
  }

  function review() {
    const wrong=C.questions.filter(question=>C.missed(state,question)).sort((a,b)=>b.weight-a.weight);
    const notes=C.lessons.filter(lesson=>state.notes[lesson.id]?.trim());
    return page(heading('回头补一遍','错题与笔记','错题重新独立做对后，会移出当前错题列表。')+
      '<div class="ph-actions"><button class="btn primary" data-ph-start="wrong">抽取我的错题</button>'+
      (state.round&&state.round.answers.length<state.round.ids.length?btn('#practice','继续上轮强化','ghost'):'')+'</div>'+
      '<section class="ph-section"><h2>当前错题 · '+wrong.length+' 道</h2>'+
      (wrong.length?'<div class="ph-grid">'+wrong.map(question=>'<a class="ph-link-card" href="#question/'+question.id+
      '"><span class="small-label">权重 '+question.weight+'</span><h3>'+E(question.title)+'</h3></a>').join('')+'</div>':emptyMessage('这里还没有错题。',btn('#bank','去'+subject+'题库','ghost')))+'</section>'+
      '<section class="ph-section"><h2>我的笔记 · '+notes.length+' 条</h2>'+
      (notes.length?notes.map(lesson=>'<article class="ph-panel"><a href="#lesson/'+lesson.id+'">'+E(lesson.title)+'</a><p class="ph-note-text">'+E(state.notes[lesson.id])+'</p></article>').join(''):emptyMessage('在任意小节底部写下你自己的理解。'))+'</section>'+
      '<section class="ph-panel"><h2>学习备份</h2><div class="ph-actions"><button class="btn ghost" data-ph-export>导出'+E(subject)+'记录</button>'+
      '<label class="ph-import">合并'+E(subject)+'备份<input type="file" id="ph-import" accept=".json,application/json"></label></div></section>');
  }

  function practice() {
    const round=state.round;
    if(!round) return page(heading('定向强化','这轮还没开始')+btn('#mastery','查看掌握情况'));
    const index=round.answers.length;
    const title=round.scope==='wrong'?'我的错题':H(round.scope)?.name||'薄弱知识点';
    if(index===round.ids.length){
      const right=round.ids.filter((id,i)=>round.answers[i]===Q(id).answer).length;
      return page(heading('强化完成',title,'答对 '+right+' / '+round.ids.length+' 道')+
        '<ol class="ph-lesson-list">'+round.ids.map((id,i)=>'<li><a href="#question/'+id+'">'+E(Q(id).title)+'</a><small>'+
          (round.answers[i]===Q(id).answer?'已答对':'建议回看')+'</small></li>').join('')+'</ol>'+
        '<div class="ph-actions ph-spacer"><button class="btn primary" data-ph-start="wrong">重练当前错题</button>'+
        btn('#mastery','回掌握情况','ghost')+'</div>','ph-narrow');
    }
    const question=Q(round.ids[index]);
    return page(heading('强化 · 第 '+(index+1)+' / '+round.ids.length+' 题',title,question.title)+
      '<div id="ph-round-question">'+answerBox(question,'round')+'</div>','ph-narrow');
  }

  function sourcePage(){
    const references=S.references;
    return page(heading('教材与试卷','资料来源')+'<section class="ph-panel"><p>课程按人教版教材目录组织。情境讲解和随堂自测为本站编写。广东卷导练从原题拆出一个步骤，题旁保留年份、题号和原卷入口。</p><ul class="ph-lesson-list">'+
      references.map(([title,url])=>'<li><a href="'+E(url)+'" target="_blank" rel="noopener">'+E(title)+' ↗</a></li>').join('')+'</ul></section>');
  }

  function render() {
    const {view,id,p}=route();
    let html;
    switch(view){
      case 'home': html=home(); break;
      case 'book': if(B(id)) html=bookPage(B(id)); break;
      case 'chapter': if(H(id)) html=chapterPage(H(id)); break;
      case 'lesson': if(L(id)) html=lessonPage(L(id)); break;
      case 'bank': html=bank(p); break;
      case 'question': if(Q(id)) html=questionPage(Q(id)); break;
      case 'papers': html=papersPage(p); break;
      case 'mastery': html=mastery(); break;
      case 'review': html=review(); break;
      case 'practice': html=practice(); break;
      case 'sources': html=sourcePage(); break;
    }
    $('#app').innerHTML=html||page(heading(subject,'没有找到这一页')+btn('#home','回'+booksText+'课程'));
    document.querySelectorAll('[data-nav]').forEach(link=>{
      const group=['book','chapter','lesson'].includes(view)?'home':view==='question'?'bank':view==='practice'?'mastery':view;
      link.classList.toggle('active',link.dataset.nav===group);
    });
    const name=$('#main h1')?.textContent;
    document.title=(name?name+' · ':'')+subject;
  }

  function renderRoute(){
    $('.topbar nav').classList.remove('open');
    $('#ph-menu').setAttribute('aria-expanded','false');
    render();
    window.scrollTo(0,0);
  }

  function start(scope) {
    const ids=C.priorities(state,scope);
    if(!ids.length) {
      toast(scope==='wrong'?'当前还没有错题。':'先做一道题或给课程自评，再抽取薄弱点。');
      return;
    }
    state.round={ids,answers:[],scope};
    save();
    if(route().view==='practice'){render();window.scrollTo(0,0);}
    else location.hash='practice';
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('.skip')){
      event.preventDefault();
      $('#main')?.focus();
      return;
    }
    const button=event.target.closest('button');
    if(!button) return;
    if(button.id==='ph-menu'){
      const opened=$('.topbar nav').classList.toggle('open');
      button.setAttribute('aria-expanded',String(opened));
    }
    if(button.dataset.phStart) start(button.dataset.phStart);
    if(button.dataset.phRate){
      state.ratings[button.dataset.phRate]=Number(button.dataset.value);
      button.parentElement.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      save();
      toast('自评已更新');
    }
    if(button.dataset.phRetry){
      retry.add(button.dataset.phRetry);
      render();
      $('#ph-question input')?.focus();
    }
    if(button.hasAttribute('data-ph-next')){
      render();
      window.scrollTo(0,0);
    }
    if(button.hasAttribute('data-ph-export')){
      const url=URL.createObjectURL(new Blob([JSON.stringify({subject:S.id,state},null,2)],{type:'application/json;charset=utf-8'}));
      const link=document.createElement('a');
      link.href=url;
      link.download=subject+'学习记录.json';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });

  document.addEventListener('input',event=>{
    const field=event.target;
    if(field.id==='ph-slider'){
      const value=Number(field.value), model=field.dataset.model;
      $('#ph-chart').innerHTML=M.chart(model,value);
      $('#ph-measure').textContent=measurement(M.models[model],value);
    }
    if(field.dataset.phNote){
      state.notes[field.dataset.phNote]=field.value;
      clearTimeout(timer);
      timer=setTimeout(save,250);
    }
  });

  document.addEventListener('change',async event=>{
    const field=event.target;
    if(field.id!=='ph-import'||!field.files[0]) return;
    try {
      const backup=JSON.parse(await field.files[0].text());
      if(backup?.subject!==S.id||!backup.state) throw Error();
      const incoming=C.clean(backup.state);
      for(const [id,list] of Object.entries(incoming.attempts)){
        const combined=[...list,...(state.attempts[id]||[])].sort((a,b)=>a.time-b.time);
        state.attempts[id]=combined.filter((entry,index)=>!index||entry.time!==combined[index-1].time||entry.option!==combined[index-1].option).slice(-3);
      }
      state.notes={...incoming.notes,...state.notes};
      state.ratings={...incoming.ratings,...state.ratings};
      state.last||=incoming.last;
      state.round??=incoming.round;
      save();
      render();
      toast(subject+'记录已合并');
    }catch{toast('请选择本站导出的'+subject+'备份');}
  });

  document.addEventListener('submit',event=>{
    const form=event.target;
    if(form.dataset.phFilter){
      event.preventDefault();
      const query=new URLSearchParams();
      for(const [name,value] of new FormData(form)) if(value.trim()) query.set(name,value.trim());
      location.hash=href(form.dataset.phFilter,query);
    }
    if(form.dataset.phAnswer){
      event.preventDefault();
      const question=Q(form.dataset.phAnswer), choice=new FormData(form).get('answer');
      if(choice===null||!question) return;
      const option=question.options[Number(choice)], round=state.round;
      if(form.dataset.mode==='round'&&round?.ids[round.answers.length]!==question.id) return;
      if(!C.record(state,question,option)) return;
      retry.delete(question.id);
      if(form.dataset.mode==='round'){
        round.answers.push(option);
        $('#ph-round-question').innerHTML=answerBox(question,'round',option)+
          '<button class="btn primary" data-ph-next>'+ (round.answers.length===round.ids.length?'查看本轮结果':'下一道')+' →</button>';
      }else render();
      save();
      $('.ph-feedback')?.focus();
    }
  });

  window.addEventListener('hashchange',renderRoute);
  window.addEventListener('pagehide',save);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) save();});
  renderRoute();
})();
