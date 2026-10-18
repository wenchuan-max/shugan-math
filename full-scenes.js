/* 数感：数学图形原语。无外部依赖；所有函数仅返回 SVG 字符串。 */
(function(global){
'use strict';
const C={mint:'#A9DFB7',orange:'#EFB16F',blue:'#A6B3EE',grid:'#416455',muted:'#78998B'};
let serial=0;
const esc=v=>String(v===undefined?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const n=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const positive=(v,f=1)=>{let x=n(v,f);return x>0?x:f;};
const fmt=v=>Math.abs(v)<1e-9?'0':String(Number(v.toFixed(3)));
const color=(v,f=C.mint)=>esc(v||f);
const xy=p=>p.map(v=>fmt(v)).join(' ');
const vec=v=>Array.isArray(v)&&v.length>=3&&v.slice(0,3).every(q=>Number.isFinite(Number(q)))?v.slice(0,3).map(Number):null;
const label=(x,y,s,c=C.mint,size=20,anchor='middle')=>`<text x="${fmt(x)}" y="${fmt(y)}" fill="${color(c)}" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-size="${Math.max(18,size)}" text-anchor="${esc(anchor)}">${esc(s)}</text>`;
const dot=(p,c=C.orange,r=5)=>`<circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="${r}" fill="${color(c)}"/>`;
function stroke(a,b,c=C.mint,width=2.5,dash=false,arrow=false){
  let out=`<path d="M${xy(a)} L${xy(b)}" fill="none" stroke="${color(c)}" stroke-width="${width}"${dash?' stroke-dasharray="7 6"':''} stroke-linecap="round"/>`;
  if(arrow&&Math.hypot(b[0]-a[0],b[1]-a[1])>1){let t=Math.atan2(b[1]-a[1],b[0]-a[0]),len=10;out+=`<path d="M${fmt(b[0]-len*Math.cos(t-.42))} ${fmt(b[1]-len*Math.sin(t-.42))} L${xy(b)} L${fmt(b[0]-len*Math.cos(t+.42))} ${fmt(b[1]-len*Math.sin(t+.42))}" fill="none" stroke="${color(c)}" stroke-width="${width}" stroke-linecap="round"/>`;}
  return out;
}
const poly=(points,c=C.mint,width=2.5,fill='none',close=false)=>points.length?`<path d="M${points.map(xy).join(' L')}${close?' Z':''}" fill="${color(fill,'none')}" stroke="${color(c)}" stroke-width="${width}" stroke-linejoin="round"/>`:'';
const svg=(body,description='数学示意图')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title>${body}</svg>`;
const heading=s=>label(320,29,s,C.mint,23);
function niceStep(raw){const p=10**Math.floor(Math.log10(raw));for(let q of[1,2,5,10])if(q*p>=raw)return q*p;return 10*p;}
function cartesian(o={}){
  const bound=positive(o.bound,5),box={x:60,y:28,w:552,h:324},unit=box.h/(2*bound),xBound=box.w/(2*unit),X=x=>box.x+box.w/2+x*unit,Y=y=>box.y+box.h/2-y*unit;
  const valid=p=>p&&Number.isFinite(Number(p.x))&&Number.isFinite(Number(p.y));
  const id='full-scene-clip-'+(++serial),step=niceStep(bound/5);
  let out=`<defs><clipPath id="${id}"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"/></clipPath></defs>`;
  for(let k=Math.ceil(-xBound/step);k<=Math.floor(xBound/step);k++){let v=k*step;if(!k)continue;out+=stroke([X(v),box.y],[X(v),box.y+box.h],C.grid,1)+label(X(v),Y(0)+24,fmt(v),C.muted,18);}
  for(let k=Math.ceil(-bound/step);k<=Math.floor(bound/step);k++){let v=k*step;if(!k)continue;out+=stroke([box.x,Y(v)],[box.x+box.w,Y(v)],C.grid,1)+label(X(0)-12,Y(v)+6,fmt(v),C.muted,18,'end');}
  out+=stroke([box.x,Y(0)],[box.x+box.w,Y(0)],C.muted,1.7,false,true)+stroke([X(0),box.y+box.h],[X(0),box.y],C.muted,1.7,false,true)+label(X(0)-13,Y(0)+24,'0',C.muted,18)+label(box.x+box.w+12,Y(0)+7,'x',C.mint,20)+label(X(0)+17,box.y+8,'y',C.mint,20);
  let ink='';
  for(const s of o.series||[]){if(typeof s.fn!=='function')continue;let parts=[],active=[],prev=null;const count=900,safe=x=>{try{const y=s.fn(x);return typeof y==='number'&&Number.isFinite(y)?y:NaN;}catch(_){return NaN;}};
    function flush(){if(active.length>1)parts.push(active);active=[];prev=null;}
    for(let i=0;i<=count;i++){let x=-xBound+2*xBound*i/count,y=safe(x);if(!Number.isFinite(y)||Math.abs(y)>bound*1.5){flush();continue;}
      if(prev){let mid=safe((prev.x+x)/2),jump=Math.abs(y-prev.y)>bound*1.7;if(!Number.isFinite(mid)||Math.abs(mid)>bound*1.7||jump){flush();}}
      active.push([X(x),Y(y)]);prev={x,y};
    }flush();
    for(const p of parts)ink+=`<path d="M${p.map(xy).join(' L')}" fill="none" stroke="${color(s.color)}" stroke-width="3"${s.dash?' stroke-dasharray="8 6"':''} stroke-linejoin="round"/>`;
  }
  for(const c of o.circles||[])if(valid(c)&&positive(c.r,0)>0)ink+=`<circle cx="${fmt(X(n(c.x)))}" cy="${fmt(Y(n(c.y)))}" r="${fmt(positive(c.r,1)*unit)}" fill="none" stroke="${color(c.color)}" stroke-width="2.8"/>`;
  for(const e of o.ellipses||[])if(valid(e)&&positive(e.rx,0)>0&&positive(e.ry,0)>0)ink+=`<ellipse cx="${fmt(X(n(e.x)))}" cy="${fmt(Y(n(e.y)))}" rx="${fmt(positive(e.rx,1)*unit)}" ry="${fmt(positive(e.ry,1)*unit)}" fill="none" stroke="${color(e.color)}" stroke-width="2.8"/>`;
  for(const s of o.segments||[])if([s.x1,s.y1,s.x2,s.y2].every(q=>Number.isFinite(Number(q))))ink+=stroke([X(n(s.x1)),Y(n(s.y1))],[X(n(s.x2)),Y(n(s.y2))],s.color,2.8,s.dash,s.arrow);
  for(const p of o.points||[])if(valid(p))ink+=dot([X(n(p.x)),Y(n(p.y))],p.color||C.orange,5.5);
  out+=`<g clip-path="url(#${id})">${ink}</g>`;
  for(const p of o.points||[])if(valid(p)&&p.label!==undefined){let px=X(n(p.x)),py=Y(n(p.y));if(px>=box.x&&px<=box.x+box.w&&py>=box.y&&py<=box.y+box.h)out+=label(px+9,py-12,p.label,p.color||C.orange,20,'start');}
  for(const p of o.labels||[])if(valid(p))out+=label(X(n(p.x)),Y(n(p.y)),p.text,p.color,20);
  return svg(out,'等比例直角坐标图');
}
// right 与 up 两个基向量正交且模长为1；点积得到真正的正交投影。
function camera(yaw=35,pitch=25){const a=n(yaw,35)*Math.PI/180,b=n(pitch,25)*Math.PI/180,right=[Math.cos(a),-Math.sin(a),0],up=[Math.sin(a)*Math.sin(b),Math.cos(a)*Math.sin(b),Math.cos(b)],depth=[-Math.sin(a)*Math.cos(b),-Math.cos(a)*Math.cos(b),Math.sin(b)],dot3=(a,b)=>a.reduce((s,q,i)=>s+q*b[i],0);return{project:p=>[dot3(p,right),dot3(p,up)],depth:p=>dot3(p,depth)};}
function projectFit(points,cam,box={cx:320,cy:205,w:460,h:255}){let pp=points.map(cam.project),xs=pp.map(p=>p[0]),ys=pp.map(p=>p[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),scale=Math.min(box.w/Math.max(xmax-xmin,.2),box.h/Math.max(ymax-ymin,.2));return p=>{let q=cam.project(p);return[box.cx+(q[0]-(xmin+xmax)/2)*scale,box.cy-(q[1]-(ymin+ymax)/2)*scale];};}
function spatial(o={}){
  const bound=positive(o.bound,5),unit=152/bound,cam=camera(o.yaw,o.pitch),P=p=>{let q=cam.project(p);return[320+q[0]*unit,210-q[1]*unit];};
  let out='';
  for(const f of [...(o.faces||[])].sort((a,b)=>{const av=f=>(f.points||[]).map(vec).filter(Boolean).reduce((sum,p)=>sum+cam.depth(p),0)/Math.max(1,(f.points||[]).length);return av(a)-av(b);})){let points=(f.points||[]).map(vec).filter(Boolean);if(points.length>=3)out+=poly(points.map(P),C.grid,1.3,f.fill||'#A9DFB714',true);}
  if(o.axes!==false){const len=bound*.85,origin=P([0,0,0]);[[len,0,0],[0,len,0],[0,0,len]].forEach((p,i)=>{let end=P(p);out+=stroke(origin,end,[C.mint,C.blue,C.orange][i],2,false,true)+label(end[0]+(i===2?14:13),end[1]+(i===2?0:7),['x','y','z'][i],[C.mint,C.blue,C.orange][i],20);});out+=label(origin[0]-12,origin[1]+23,'O',C.muted,18);}
  for(const e of o.edges||[]){let a=vec(e.a),b=vec(e.b);if(a&&b)out+=stroke(P(a),P(b),e.color,2.7,e.dash,e.arrow);}
  for(const p of o.points||[]){let v=vec(p.p);if(!v)continue;let q=P(v);out+=dot(q,p.color||C.orange,5);if(p.label!==undefined)out+=label(q[0]+10,q[1]-11,p.label,p.color||C.orange,20,'start');}
  return svg(out,'空间正交投影图');
}
function ring(r,z,steps=80){return Array.from({length:steps+1},(_,i)=>[r*Math.cos(i*2*Math.PI/steps),r*Math.sin(i*2*Math.PI/steps),z]);}
function dimension(P,a,b,s,c=C.orange,offset=16){let p=P(a),q=P(b),dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1;return stroke(p,q,c,2)+label((p[0]+q[0])/2-dy/len*offset,(p[1]+q[1])/2+dx/len*offset+6,s,c,20);}
function solid(o={}){
  const kind=['cuboid','pyramid','frustum','cylinder','cone','sphere'].includes(o.kind)?o.kind:'cuboid',w=positive(o.w,3),d=positive(o.d,2),h=positive(o.h,4),r=positive(o.r,2),R=positive(o.R,3),cam=camera(o.yaw,25),titles={cuboid:'长方体',pyramid:'棱锥',frustum:'圆台',cylinder:'圆柱',cone:'圆锥',sphere:'球'};
  let vertices=[],edges=[],loops=[],dims=[];
  if(kind==='cuboid'||kind==='pyramid'){
    let base=[[-w/2,-d/2,0],[w/2,-d/2,0],[w/2,d/2,0],[-w/2,d/2,0]];vertices.push(...base);loops.push(base.concat([base[0]]));
    if(kind==='cuboid'){let top=base.map(p=>[p[0],p[1],h]);vertices.push(...top);loops.push(top.concat([top[0]]));base.forEach((p,i)=>edges.push([p,top[i]]));dims.push([base[0],base[1],'w='+fmt(w),C.mint,-19],[base[1],base[2],'d='+fmt(d),C.blue,-21],[base[1],top[1],'h='+fmt(h),C.orange,22]);}
    else{let top=[0,0,h];vertices.push(top);base.forEach(p=>edges.push([p,top]));dims.push([base[0],base[1],'w='+fmt(w),C.mint,-20],[base[1],base[2],'d='+fmt(d),C.blue,-22],[[0,0,0],top,'h='+fmt(h),C.orange,20]);}
  }else if(kind==='sphere'){
    for(let plane=0;plane<3;plane++){let loop=Array.from({length:101},(_,i)=>{let t=i*2*Math.PI/100;return plane===0?[r*Math.cos(t),r*Math.sin(t),0]:plane===1?[r*Math.cos(t),0,r*Math.sin(t)]:[0,r*Math.cos(t),r*Math.sin(t)];});loops.push(loop);vertices.push(...loop);}
    dims.push([[0,0,0],[r,0,0],'r='+fmt(r),C.orange,-20]);
  }else{
    const lower=kind==='frustum'?R:r,upper=kind==='cone'?0:kind==='frustum'?r:r,bottom=ring(lower,0);loops.push(bottom);vertices.push(...bottom);
    if(upper){let top=ring(upper,h);loops.push(top);vertices.push(...top);}else vertices.push([0,0,h]);
    for(let t of[-n(o.yaw,35)*Math.PI/180,Math.PI-n(o.yaw,35)*Math.PI/180])edges.push([[lower*Math.cos(t),lower*Math.sin(t),0],[upper*Math.cos(t),upper*Math.sin(t),h]]);
    dims.push([[0,0,0],[0,0,h],'h='+fmt(h),C.orange,21],[[0,0,0],[lower,0,0],(kind==='frustum'?'R=':'r=')+fmt(lower),C.blue,-18]);
    if(kind==='frustum')dims.push([[0,0,h],[r,0,h],'r='+fmt(r),C.mint,-18]);
  }
  const P=kind==='sphere'?p=>{let q=cam.project(p),s=118/r;return[320+q[0]*s,202-q[1]*s];}:projectFit(vertices,cam);
  let out=heading(titles[kind]);
  for(const p of loops)out+=poly(p.map(P),C.mint,2.5);
  for(const [a,b] of edges)out+=stroke(P(a),P(b),C.mint,2.5);
  if(kind==='sphere')out+=`<circle cx="320" cy="202" r="118" fill="none" stroke="${C.mint}" stroke-width="2.8"/>`;
  for(const [a,b,s,c,off] of dims)out+=dimension(P,a,b,s,c,off);
  if(kind!=='cuboid')out+=dot(P([0,0,0]),C.orange,4);
  out+=label(320,380,kind==='sphere'?'球的半径为 '+fmt(r):'高度 h='+fmt(h)+(kind==='cuboid'||kind==='pyramid'?'；底面 '+fmt(w)+' × '+fmt(d):kind==='frustum'?'；下半径 '+fmt(R)+'，上半径 '+fmt(r):'；底面半径 '+fmt(r)),C.muted,20);
  return svg(out,titles[kind]+'线框与尺寸');
}
function oblique(o={}){
  const w=positive(o.w,4),d=positive(o.d,3),h=positive(o.h,2),k=1/(2*Math.sqrt(2)),points=[[0,0,0],[w,0,0],[w,d,0],[0,d,0],[0,0,h],[w,0,h],[w,d,h],[0,d,h]],cam={project:p=>[p[0]+k*p[1],p[2]+k*p[1]]},P=projectFit(points,cam,{cx:320,cy:205,w:430,h:235});
  let out=heading('斜二测：x、z原长，y方向缩半');
  for(const [a,b] of[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])out+=stroke(P(points[a]),P(points[b]),C.mint,2.5);
  out+=dimension(P,points[0],points[1],'w='+fmt(w),C.mint,20)+dimension(P,points[1],points[2],'d='+fmt(d),C.blue,22)+dimension(P,points[1],points[5],'h='+fmt(h),C.orange,22);
  let a=P(points[0]),r=34;out+=`<path d="M${fmt(a[0]+r)} ${fmt(a[1])} A${r} ${r} 0 0 0 ${fmt(a[0]+r/Math.sqrt(2))} ${fmt(a[1]-r/Math.sqrt(2))}" fill="none" stroke="${C.blue}" stroke-width="2"/>`+label(a[0]+69,a[1]-15,'45°',C.blue,20)+label(320,378,'图上y向边长 = '+fmt(d)+' ÷ 2 = '+fmt(d/2)+'；与x方向夹角45°',C.muted,20);
  return svg(out,'斜二测画法的长方体');
}
function triangle(o={}){
  const b=positive(o.b,3),c=positive(o.c,4),A=Math.min(179.9,Math.max(.1,n(o.A,60))),theta=A*Math.PI/180,points=[[0,0,0],[c,0,0],[b*Math.cos(theta),b*Math.sin(theta),0]],a=Math.sqrt(b*b+c*c-2*b*c*Math.cos(theta)),cam={project:p=>[p[0],p[1]]},P=projectFit(points,cam,{cx:320,cy:195,w:430,h:230}),[pa,pb,pc]=points.map(P);
  let out=heading('三角形：两条边和它们夹着的角')+poly([pa,pb,pc,pa],C.mint,3);
  function side(i,j,s,off){out+=dimension(P,points[i],points[j],s,C.mint,off);}
  side(0,1,'c='+fmt(c),23);side(0,2,'b='+fmt(b),-21);side(1,2,'a='+fmt(a),21);
  out+=label(pa[0]-14,pa[1]+24,'A',C.orange,22)+label(pb[0]+14,pb[1]+24,'B',C.mint,22)+label(pc[0],pc[1]-13,'C',C.mint,22);
  const rad=Math.min(34,Math.hypot(pb[0]-pa[0],pb[1]-pa[1])*.22,Math.hypot(pc[0]-pa[0],pc[1]-pa[1])*.22),end=[pa[0]+rad*Math.cos(theta),pa[1]-rad*Math.sin(theta)];
  out+=`<path d="M${fmt(pa[0]+rad)} ${fmt(pa[1])} A${fmt(rad)} ${fmt(rad)} 0 0 0 ${xy(end)}" fill="none" stroke="${C.orange}" stroke-width="2"/>`+label(pa[0]+(rad+27)*Math.cos(theta/2),pa[1]-(rad+27)*Math.sin(theta/2)+5,fmt(A)+'°',C.orange,20);
  if(o.centroid){let mids=points.map((_,i)=>points[(i+1)%3].map((v,j)=>(v+points[(i+2)%3][j])/2)),g=points[0].map((_,j)=>points.reduce((s,p)=>s+p[j],0)/3);mids.forEach((m,i)=>{out+=stroke(P(points[i]),P(m),C.blue,1.8)+dot(P(m),C.blue,3.5);});let pg=P(g),pm=P(mids[0]);out+=dot(pg,C.orange,6)+label(pg[0]+15,pg[1]-9,'G',C.orange,22)+label(pm[0]+12,pm[1]-10,'M',C.blue,20)+label(320,377,'G是三条中线的交点；AG:GM = 2:1',C.muted,20);}
  else out+=label(320,377,'余弦定理：a² = b² + c² − 2bc cosA',C.muted,20);
  return svg(out,o.centroid?'三角形的三条中线与重心':'按边角数据绘制的三角形');
}
global.FullScenes={cartesian,spatial,solid,oblique,triangle};
})(window);
