(()=>{
'use strict';
const D=window.COURSE,B=window.GAOKAO_DATA;
// Each course topic is indexed; narrower entries are attached only when their concept occurs in a question.
const narrow=[
['1.1','元素与集合表示','元素|列举|描述|数集'],['1.2','子集与空集','子集|空集|包含'],['1.3','交集','交集|\\cap'],['1.3','并集','并集|\\cup'],['1.3','补集','补集|C_U|C_R|C_{|complement'],
['1.4','充分条件与必要条件','充分|必要'],['1.5','命题的否定','否定|不成立'],['2.2','最值与等号条件','最小|最大|等号'],['2.3','二次不等式与判别式','不等式|判别式|恒成立'],
['3.1','定义域','定义域|有意义'],['3.1','分段函数','分段|cases'],['3.2','单调性','单调|增函数|减函数'],['3.2','奇偶性','奇函数|偶函数|奇偶'],['3.2','函数最值与值域','最大|最小|值域'],
['4.3','对数运算与换底','换底|\\log|\\ln'],['4.4','对数函数的定义域与单调性','单调|真数|定义域|比较'],['4.5','函数零点','零点|实根|个根|交点'],['4.5','二分法','二分'],
['5.1','弧度、弧长与扇形','弧长|弧度|扇形'],['5.2','同角三角关系','sin|cos|tan'],['5.4','三角函数周期','周期'],['5.4','三角函数图象与单调性','图象|单调|对称'],['5.5','倍角与降幂','2x|2\\alpha|2A|二倍角|倍角|^2'],['5.6','振幅、周期与相位','周期|振幅|平移|omega|varphi|参数'],
['6.2','向量共线与数乘','共线|平行|lambda'],['6.2','向量数量积','数量积|\\cdot|投影|夹角'],['6.3','向量坐标与数量积','坐标|\\cdot|垂直|夹角'],['6.4','正弦定理','sin|正弦'],['6.4','余弦定理','cos|余弦'],['6.4','三角形面积','面积'],
['7.1','复数的模与共轭','共轭|模|绝对值|\\bar|\\lvert|\\vert'],['7.2','复数四则运算','i|运算|除'],
['8.3','几何体的体积','体积'],['8.3','表面积与球','面积|球|半径'],['8.5','线面平行与面面平行','平行|\\parallel'],['8.6','垂直关系的证明','垂直|\\perp'],['8.6','线面角与二面角','所成角|二面角|夹角'],
['9.1','分层抽样','分层'],['9.2','平均数与中位数','平均|中位|均值'],['9.2','方差与标准差','方差|标准差'],['9.2','百分位与频率分布','百分位|频率|直方图'],['10.1','古典概型','随机|概率|等可能'],['10.2','相互独立事件','独立|概率'],
['e1-1.4','平面法向量','法向量|向量|坐标系'],['e1-1.4','空间角','夹角|二面角|所成角|正弦|余弦'],['e1-1.4','空间距离','距离'],['e1-2.3','距离公式','距离|最短'],['e1-2.5','弦长与切线','弦|切线|相切'],
['e1-3.1','椭圆离心率','离心率'],['e1-3.1','直线与椭圆','直线|斜率|交于|弦|面积'],['e1-3.2','双曲线渐近线与离心率','渐近线|离心率'],['e1-3.3','抛物线焦点与准线','焦点|准线|焦半径'],
['e2-4.1','数列通项与递推','通项|递推|a_{n+1}|a_n'],['e2-4.2','等差数列求和','项和|S_n|S_{n}'],['e2-4.3','等比数列求和','前|和|S_n'],['e2-5.1','导数与切线','切线|斜率'],['e2-5.2','求导法则','导数|求导'],['e2-5.3','导数与单调性','单调|递增|递减'],['e2-5.3','导数与极值最值','极值|极大|极小|最大|最小|最值'],['e2-5.3','恒成立与参数范围','恒成立|取值范围|不等式|参数|证明'],
['e3-6.2','排列与组合的限制条件','至少|相邻|不同|分组|安排'],['e3-6.3','二项式指定项与系数','系数|常数项|展开'],['e3-7.1','条件概率','条件|已知|情况下'],['e3-7.1','全概率与贝叶斯','全概率|贝叶斯|来自'],['e3-7.3','数学期望','期望|均值|E('],['e3-7.3','随机变量的方差','方差|D('],['e3-7.4','二项分布','二项|独立|成功'],['e3-7.4','超几何分布','不放回|超几何|抽取'],['e3-8.2','线性回归与预测','回归|预测|最小二乘'],['e3-8.3','独立性检验','独立性|卡方|chi|列联表']
];
const points=D.lessons.map(l=>({id:'topic:'+l.id,title:l.title.replace('★ ',''),lessonIds:[l.id],bookId:l.bookId,chapterId:l.chapterId,broad:true,terms:[]}));
for(const [lid,title,terms] of narrow){let l=D.lessons.find(x=>x.id===lid);points.push({id:'kp:'+lid+':'+(points.filter(p=>!p.broad&&p.lessonIds[0]===lid).length+1),title,lessonIds:[lid],bookId:l.bookId,chapterId:l.chapterId,broad:false,terms:terms.split('|').filter(Boolean)});}
const pointById=new Map(points.map(p=>[p.id,p]));
function tags(q){const base=q.lessonIds.map(id=>'topic:'+id),t=String(q.searchText||q.q||'').toLowerCase();return [...base,...points.filter(p=>!p.broad&&p.lessonIds.some(id=>q.lessonIds.includes(id))&&p.terms.some(k=>t.includes(k.toLowerCase()))).map(p=>p.id)];}
for(const q of B.questions)q.pointIds=tags(q);
const diffWeight=d=>({'基础':1.4,'进阶':1,'挑战':.75}[d]||1);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function attemptList(r,max){if(!r||typeof r!=='object')return [];let h=Array.isArray(r.history)?r.history.filter(x=>x&&Number.isFinite(+x.earned)&&Number.isFinite(+x.max)&&+x.max>0):[];if(h.length)return h.slice(-3);if(typeof r.correct==='boolean')return [{earned:Number.isFinite(r.earned)?r.earned:r.correct?max:0,max,assisted:false,date:r.updated||''}];return [];}
function evidence(r,max,base){const h=attemptList(r,max);if(!h.length)return null;let sw=0,sv=0,wrong=0;h.slice().reverse().forEach((x,i)=>{let w=2**(-i),v=clamp(+x.earned/+x.max,0,1);if(x.assisted)v=Math.min(v,.75);sv+=v*w;sw+=w;if(+x.earned/+x.max<1)wrong++;});return {value:100*sv/sw,weight:base*(1+.15*Math.max(0,wrong-1)),wrong:clamp(1-(+h.at(-1).earned/+h.at(-1).max),0,1)*base,count:1,latest:h.at(-1)};}
function validRating(r){return r&&Number.isInteger(+r.value)&&+r.value>=1&&+r.value<=5?(+r.value-1)*25:null;}
function build(state){
 const accum=new Map(),lessons=new Map(),s=state||{};for(const l of D.lessons)lessons.set(l.id,[]);for(const p of points)accum.set(p.id,[]);
 const add=(q,e)=>{if(!e)return;for(const lid of q.lessonIds){if(lessons.has(lid))lessons.get(lid).push({...e,weight:e.weight/q.lessonIds.length,id:q.id});}for(const pid of q.pointIds||tags(q)){if(accum.has(pid))accum.get(pid).push({...e,id:q.id});}};
 for(const q of B.questions)if(!q.legacy)add(q,evidence(s.gaokao?.records?.[q.id],q.score,q.score*diffWeight(q.difficulty)));
 for(const l of D.lessons)l.quiz.forEach((q,i)=>{const m={...q,id:'quiz:'+l.id+':'+i,lessonIds:[l.id]};m.pointIds=tags(m);add(m,evidence(s.quiz?.[l.id]?.[i],1,2.5*1.4));});
 const score=(ev,rating,inferred=false)=>{let w=ev.reduce((n,x)=>n+x.weight,0),objective=w?ev.reduce((n,x)=>n+x.value*x.weight,0)/w:null,value=objective===null?rating:rating===null?objective:.7*objective+.3*rating;return {value:value===null?null:Math.round(value),objective:objective===null?null:Math.round(objective),self:rating,count:ev.length,lost:ev.reduce((n,x)=>n+x.wrong,0),inferred,evidence:ev,level:value===null?'待评估':value<50?'优先补强':value<75?'再巩固':'比较稳'};};
 const lessonStats=D.lessons.map(l=>({...l,...score(lessons.get(l.id),validRating(s.mastery?.ratings?.[l.id]))}));
 const pointStats=points.map(p=>{let direct=validRating(s.mastery?.pointRatings?.[p.id]),lr=validRating(s.mastery?.ratings?.[p.lessonIds[0]]);return {...p,...score(accum.get(p.id),direct===null?lr:direct,direct===null&&lr!==null&&!p.broad)};});
 return {lessons:lessonStats,points:pointStats,weak:lessonStats.filter(x=>x.value!==null).sort((a,b)=>a.value-b.value||b.lost-a.lost),weakPoints:pointStats.filter(x=>x.value!==null&&!x.broad).sort((a,b)=>a.value-b.value||b.lost-a.lost)};
}
function related(target){if(target==='weakest')return B.questions;let p=pointById.get(target);if(p)return B.questions.filter(q=>q.pointIds.includes(target));if(target.startsWith('lesson:'))return B.questions.filter(q=>q.lessonIds.includes(target.slice(7)));return [];}
function recommend(target,state,limit=8){if(target==='weakest'){const data=build(state),targets=[...data.weak.filter(x=>x.value<75).map(x=>({id:'lesson:'+x.id,value:x.value,lost:x.lost})),...data.weakPoints.filter(x=>x.value<75&&(x.count||validRating(state.mastery?.pointRatings?.[x.id])!==null)).map(x=>({id:x.id,value:x.value,lost:x.lost}))].sort((a,b)=>a.value-b.value||b.lost-a.lost).slice(0,4),pools=targets.map(x=>recommend(x.id,state,limit)),out=[];for(let i=0;i<limit;i++)for(const pool of pools){let q=pool[i];if(q&&!out.some(x=>x.id===q.id)&&out.length<limit)out.push(q);}return out;}let qs=related(target).filter(q=>!q.legacy);let rank={'基础':0,'进阶':1,'挑战':2};return qs.slice().sort((a,b)=>{let ra=state.gaokao?.records?.[a.id],rb=state.gaokao?.records?.[b.id],status=r=>r?.correct===false?0:typeof r?.correct!=='boolean'?1:2;return rank[a.difficulty]-rank[b.difficulty]||status(ra)-status(rb)||b.score-a.score||b.paperId.localeCompare(a.paperId)||a.number-b.number;}).slice(0,limit);}
window.MasteryCore={points,pointById,tags,diffWeight,evidence,build,related,recommend,validRating};
})();
