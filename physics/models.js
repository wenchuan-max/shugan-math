(() => {
  'use strict';
  const models = {};
  function model(id,title,x,y,range,calc,predict,why) {
    models[id] = {title,x,y,range,calc,predict,why};
  }
  model('kinematics','走过去，再掉头','时间 t / s','位置 x / m',[0,8,.1],t=>t<=4?2*t:16-2*t,
    '第 6 秒时位置是正数。此时是往正方向走，还是往负方向走？','看斜率而不是纵坐标。4 s 以后位置在变小，速度为 −2 m/s；8 s 回到起点。');
  model('accelerate','速度图怎样长出位移','时间 t / s','速度 v / m/s',[0,6,.1],t=>2+1.5*t,
    '初速度是 2 m/s。到 4 s 时，速度是几？前 4 s 的位移又是多少？','图上读得 8 m/s。图下的梯形面积为 (2＋8)×4÷2＝20 m，面积与斜率是两回事。');
  model('forces','两股拉力夹角多大','两力夹角 θ / °','合力大小 / N',[0,180,1],a=>20*Math.cos(a*Math.PI/360),
    '两股力都是 10 N。把夹角从 0° 拖到 180°，合力会怎样变？','同向时合力 20 N，反向时 0 N。等大两力合成的方向平分夹角，大小 20 cos(θ/2)。');
  model('newton','同样的力推轻车和重车','质量 m / kg','加速度 a / m/s²',[1,10,.1],m=>6/m,
    '合力固定为 6 N，质量从 2 kg 变到 4 kg，加速度会减多少？','质量从 2 加到 4 kg 后，a 从 3 降到 1.5 m/s²。把 a 对 1/m 作图，才是一条直线。');
  model('projectile','从桌边飞出去','水平位移 x / m','向下位移 y / m',[0,8,.1],x=>5*(x/4)**2,
    '小球水平速度为 4 m/s，取 g＝10 m/s²。水平走 4 m 和 8 m 时，向下落了多少？','先由 t＝x/4 得 1 s、2 s，再用 y＝5t²，得到 5 m、20 m。图上的纵坐标向下增加。');
  model('circle','同一弯道越快越难转','速率 v / m/s','向心加速度 / m/s²',[0,20,.2],v=>v*v/20,
    '弯道半径固定 20 m。车速从 5 增到 10 m/s，向心加速度变几倍？','从 1.25 到 5 m/s²，是 4 倍。路面可提供的向心力有限，车速太高就会侧滑。');
  model('gravity','离开地面后的重力','距地心 r / 地球半径','重力加速度 / m/s²',[1,5,.05],r=>9.8/r**2,
    '升到离地一个地球半径的位置，重力加速度还剩多少？','离地高度是 R，距地心是 2R。按反平方关系，重力加速度剩地表的 1/4，约 2.45 m/s²。');
  model('energy','自由落体的能量账','下降高度 / m','动能 / J',[0,6,.1],h=>20*h,
    '2 kg 物体从静止下落。取 g＝10 m/s²，下降 3 m 后动能是多少？','重力势能减少 60 J；忽略阻力时动能正好增加 60 J。下降高度相同，能量变化与路径无关。');
  model('coulomb','两个小电荷逐渐离远','距离 r / m','静电力大小 / N',[.1,1,.01],r=>.009/r**2,
    '两个电荷的电荷量大小都是 1 μC。把距离从 0.2 m 变到 0.4 m，力还剩几成？','距离加倍使力只剩 1/4。图上显示大小，吸引还是排斥还要看电荷符号。');
  model('capacitor','拔掉电源再拉开电容板','板间距 / mm','两板电压 / V',[1,8,.1],d=>2*d,
    '电容器已断开电源，1 mm 时电压为 2 V。板间距拖到 4 mm，电压是几伏？','电荷量保持不变，C∝1/d，U＝Q/C∝d，所以 4 mm 时为 8 V。接着电源时，固定的反而是 U。');
  model('resistors','并联的另一条路','第二条支路 R₂ / Ω','总电阻 / Ω',[1,30,.1],r=>6*r/(6+r),
    '第一条支路固定为 6 Ω。把第二条也调成 6 Ω，总电阻比哪条支路小？','总电阻为 3 Ω，比任一支路都小。第二条支路阻值很大时，总电阻逐渐接近 6 Ω。');
  model('battery','带负载时电池端电压下降','电流 I / A','路端电压 U / V',[0,2.5,.05],i=>3-i,
    '电源 ε＝3 V、r＝1 Ω。负载使电流从 0.5 增到 2 A，路端电压怎样变？','U＝3−I，电压从 2.5 V 降到 1 V。直线在纵轴上的截距是电动势。');
  model('flux','转动线圈，看磁通量','磁场与面积法线夹角 / °','磁通量 Φ / Wb',[0,180,1],a=>.2*Math.cos(a*Math.PI/180),
    '线圈转到哪一角度时磁通量为零？这时线圈平面和磁场是什么关系？','法线与场方向夹角 90° 时磁通量为零，线圈平面与磁场平行。负值表示磁通方向与选定法线相反。');
  model('collision','撞上去，粘在一起','被撞小车质量 / kg','碰后共同速度 / m/s',[.5,6,.1],m=>6/(1+m),
    '1 kg 小车以 6 m/s 撞静止小车，两车粘住。被撞小车越重，碰后怎样？','原动量固定为 6 kg·m/s，分给越来越大的总质量，共同速度越小。动能没有守恒。');
  model('pendulum','把摆绳一点点加长','摆长 L / m','周期 T / s',[.25,4,.05],l=>2*Math.PI*Math.sqrt(l/9.8),
    '摆长从 0.5 m 加到 2 m，小摆角下周期变几倍？','摆长是原来的 4 倍，周期是原来的 2 倍。公式中没有摆球质量。');
  model('wave','用波峰之间的间距读波长','位置 x / m','介质位移 y / cm',[0,12,.1],x=>2*Math.sin(Math.PI*x/2),
    '这是某一瞬间的波形。相邻两个波峰之间隔了几米？','波峰出现在 1、5、9 m 等位置，间距 4 m 是波长。当前横轴是位置，所以这不是一个质点的振动图。');
  model('refraction','光从空气进入玻璃','空气侧入射角 / °','玻璃侧折射角 / °',[0,80,1],a=>180/Math.PI*Math.asin(Math.sin(a*Math.PI/180)/1.5),
    '玻璃折射率取 1.5。入射角 30° 时，折射角比 30° 大还是小？','代入 sinθ₂＝sin30°/1.5，可得约 19.5°。两角都从法线量。');
  model('lorentz','磁场越强，粒子的圆弧越紧','磁感应强度 B / T','轨迹半径 / m',[.1,2,.02],b=>.2/b,
    '速度垂直磁场，mv/电荷量大小固定为 0.2 T·m。B 从 0.5 T 变到 1 T，半径怎样？','r 由 0.4 m 变为 0.2 m。磁场增大只改变转弯快慢，洛伦兹磁力不改变速率。');
  model('faraday','同样的磁通变化，快一点','变化用时 Δt / s','平均感应电动势 / V',[.1,2,.02],t=>2/t,
    '线圈 50 匝，每匝磁通量改变量大小是 0.04 Wb。用时从 0.4 s 缩到 0.2 s，电动势怎样？','匝数乘磁通变化率：50×0.04÷0.2＝10 V，是原来的两倍。方向需另外用楞次定律。');
  model('transformer','为理想变压器换副线圈','副线圈匝数','输出电压 / V',[0,1000,10],n=>.22*n,
    '输入 220 V，原线圈 1000 匝。想要 22 V 输出，副线圈应有多少匝？','电压比等于匝数比，22 V 是输入的 1/10，所以副线圈为 100 匝。0 匝端点表示没有感应输出。');
  model('lc','LC 电路中电荷的往返','时间 / 周期 T','电容电荷 / 最大电荷',[0,2,.02],t=>Math.cos(2*Math.PI*t),
    '电荷量在 0.25T 第一次经过零。这一刻电流大小如何？','电荷曲线在过零时最陡，表示电荷变化最快，电流最大。到 0.5T 电荷为反向最大值，电流又为零。');
  model('sensor','温控开关的工作区','测得温度 / ℃','风扇状态（0 关，1 开）',[20,50,1],t=>t>35?1:0,
    '规则是超过 35 ℃ 开风扇。拖到 35 ℃ 和 36 ℃ 时，输出分别是什么？','严格超过才开启，所以 35 ℃ 仍关、36 ℃ 开启。实际电路常设置两个阈值来减少反复开关。');
  model('oil','油膜面积量错会怎样','估计面积 / cm²','估计膜厚 / nm',[40,180,1],s=>100/s,
    '纯油酸体积为 10⁻⁵ cm³。面积从 100 cm² 被低估为 50 cm²，估出的厚度怎样？','d＝V/S，面积低估一半会让厚度翻倍。1 cm＝10⁷ nm；面积估为 100 cm² 时厚度为 1 nm。');
  model('gas','用活塞等温压缩气体','体积 V / L','绝对压强 p / kPa',[.5,4,.05],v=>100/v,
    '体积 1 L 时压强 100 kPa。缓慢压到 0.5 L，温度不变，压强是多少？','等温、同一份理想气体有 pV＝100 kPa·L，体积减半，压强加倍到 200 kPa。');
  model('thermal','吸热固定，改变对外做功','气体对外做功 / J','气体内能增量 / J',[0,90,1],w=>50-w,
    '气体吸热 50 J，如果它同时对外做功 60 J，内能升还是降？','支出大于收入，ΔU＝50−60＝−10 J。曲线与横轴交在 50 J，说明收入支出恰好相等。');
  model('photon','用频率跨过光电门槛','频率 / 10¹⁴ Hz','出射电子最大初动能 / eV',[2,12,.1],f=>f<5?null:.41356677*(f-5),
    '此材料截止频率为 5×10¹⁴ Hz。门槛下方为何没有曲线？','门槛下没有普通光电子，最大初动能无定义。超过门槛后 Eₖmax＝hf−W₀，随频率线性增大。');
  model('decay','看两轮半衰期还剩多少','时间 / 半衰期','未衰变原子核比例 / %',[0,5,.05],t=>100*.5**t,
    '当滑块从 1 个半衰期移到 2 个半衰期，未衰变比例如何变化？','从 50% 变为 25%。每一轮是把当时剩余的数量减半，百分数不会每轮减去固定的量。');

  const format = value => Number(value.toFixed(2)).toString();
  function chart(key, value) {
    const m = models[key], [lo,hi] = m.range;
    const sample = key=== 'sensor' ? [[lo,0],[35,0],[35,1],[hi,1]] : Array.from({length:101},(_,i)=>{
      const x=lo+(hi-lo)*i/100;
      return [x,m.calc(x)];
    }).filter(([,y])=>Number.isFinite(y));
    const yMin=Math.min(0,...sample.map(point=>point[1])), yMax=Math.max(0,...sample.map(point=>point[1]));
    const left=64,right=505,top=20,bottom=218;
    const sx=x=>left+(right-left)*(x-lo)/(hi-lo);
    const sy=y=>key==='projectile'?top+(bottom-top)*(y-yMin)/(yMax-yMin||1):bottom-(bottom-top)*(y-yMin)/(yMax-yMin||1);
    const baseline=key==='projectile'?top:sy(0);
    const tick=(x,y,text,anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
    const yValue=m.calc(value);
    const curve=sample.map(([x,y])=>sx(x).toFixed(2)+','+sy(y).toFixed(2)).join(' ');
    const grids=[yMin,(yMin+yMax)/2,yMax].map(y=>'<path d="M '+left+' '+sy(y)+' H '+right+'"/>'+tick(left-7,sy(y)+4,format(y),'end')).join('');
    const dots=Number.isFinite(yValue)?'<line class="ph-marker" x1="'+sx(value)+'" x2="'+sx(value)+'" y1="'+sy(yValue)+'" y2="'+baseline+'"/><circle class="ph-marker-dot" cx="'+sx(value)+'" cy="'+sy(yValue)+'" r="6"/>':'';
    return '<svg class="ph-chart" viewBox="0 0 525 252" role="img" aria-label="'+m.title+'。横轴：'+m.x+'；纵轴：'+m.y+'。">'+
      '<g class="ph-chart-grid">'+grids+'</g><path class="ph-axis" d="M '+left+' '+top+' V '+bottom+' M '+left+' '+baseline+' H '+right+'"/>'+
      '<polyline class="ph-curve" fill="none" points="'+curve+'"/>'+dots+
      tick(left,238,format(lo))+tick(sx((lo+hi)/2),238,format((lo+hi)/2))+tick(right,238,format(hi))+'</svg>';
  }
  window.PhysicsModels={models,chart,format};
})();
