(() => {
  'use strict';
  const {books,chapters}=window.PhysicsCurriculum;
  const lessons=chapters.flatMap(chapter=>chapter.lessons);
  const byId=items=>new Map(items.map(item=>[item.id,item]));
  const bookById=byId(books), chapterById=byId(chapters), lessonById=byId(lessons);
  const papers=window.PhysicsPapers, paperById=byId(papers);
  const questions=[
    ...lessons.map(lesson=>({...lesson,lessonId:lesson.id,kind:'practice',weight:/^实验/.test(lesson.title)?2:1})),
    ...window.PhysicsExamGuides
  ];
  const questionById=byId(questions);
  const empty=()=>({ratings:{},attempts:{},notes:{},last:'',round:null});
  const object=source=>source&&typeof source==='object'&&!Array.isArray(source)?source:{};
  const validGrade=value=>Number.isInteger(value)&&value>=1&&value<=5;
  const validOption=(question,value)=>question?.options.includes(value);

  function clean(source) {
    source=object(source);
    const state=empty();
    for(const [id,value] of Object.entries(object(source.ratings))) {
      if(lessonById.has(id)&&validGrade(value)) state.ratings[id]=value;
    }
    for(const [id,value] of Object.entries(object(source.notes))) {
      if(lessonById.has(id)&&typeof value==='string') state.notes[id]=value.slice(0,3000);
    }
    for(const [id,items] of Object.entries(object(source.attempts))) {
      const question=questionById.get(id);
      if(!question||!Array.isArray(items)) continue;
      const list=items.filter(item=>item&&Number.isFinite(item.time)&&validOption(question,item.option)).slice(-3);
      if(list.length) state.attempts[id]=list.map(item=>({time:item.time,option:item.option}));
    }
    if(lessonById.has(source.last)) state.last=source.last;
    const {ids,answers,scope}=object(source.round);
    if(Array.isArray(ids)&&ids.length>0&&ids.length<=8&&ids.every(id=>questionById.has(id))&&
        new Set(ids).size===ids.length&&Array.isArray(answers)&&answers.length<=ids.length&&
        answers.every((value,index)=>validOption(questionById.get(ids[index]),value))) {
      state.round={ids,answers,scope:chapterById.has(scope)||scope==='wrong'?scope:'weak'};
    }
    return state;
  }

  function record(state,question,option,time=Date.now()) {
    if(!validOption(question,option)) return false;
    state.attempts[question.id]=[...(state.attempts[question.id]||[]),{option,time}].slice(-3);
    return true;
  }

  const latest=(state,question)=>state.attempts[question.id]?.at(-1)?.option;
  const missed=(state,question)=>latest(state,question)!==undefined&&latest(state,question)!==question.answer;
  const byLesson=new Map(lessons.map(lesson=>[lesson.id,[]]));
  for(const question of questions) byLesson.get(question.lessonId).push(question);

  function evidence(state,lessonId) {
    let earned=0, weight=0, wrong=0, count=0;
    for(const question of byLesson.get(lessonId)) {
      const attempts=state.attempts[question.id];
      if(!attempts?.length) continue;
      count++;
      if(missed(state,question)) wrong+=question.weight;
      attempts.slice().reverse().forEach((attempt,index)=>{
        const value=question.weight*.5**index;
        weight+=value;
        if(attempt.option===question.answer) earned+=value;
      });
    }
    const rating=state.ratings[lessonId];
    const self=rating===undefined?null:(rating-1)*25;
    const objective=weight?earned/weight*100:null;
    const combined=objective===null?self:self===null?objective:.65*objective+.35*self;
    return {value:combined===null?null:Math.round(combined),wrong,count,self};
  }

  function priorities(state,scope='weak') {
    const entries=questions.map(question=>({question, lesson:lessonById.get(question.lessonId)}));
    const scores=new Map(lessons.map(lesson=>[lesson.id,evidence(state,lesson.id).value]));
    return entries.filter(({question,lesson})=>{
      if(scope==='wrong') return missed(state,question);
      if(scope!=='weak') return lesson.chapterId===scope;
      return missed(state,question)||(scores.get(lesson.id)!==null&&scores.get(lesson.id)<75);
    }).sort((a,b)=>{
      const weight=entry=>missed(state,entry.question)?entry.question.weight:0;
      return weight(b)-weight(a)||(scores.get(a.lesson.id)??100)-(scores.get(b.lesson.id)??100)||
        Number(latest(state,a.question)!==undefined)-Number(latest(state,b.question)!==undefined);
    }).slice(0,8).map(({question})=>question.id);
  }

  window.PhysicsCore={books,chapters,lessons,papers,questions,bookById,chapterById,lessonById,paperById,questionById,
    empty,clean,record,latest,missed,evidence,priorities};
})();
