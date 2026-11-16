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
const diagram = (title,content) => '<svg class="ph-chart ph-diagram" viewBox="0 0 525 252" role="img" aria-label="'+title+'">'+content+'</svg>';
  const text = (x,y,label,anchor='middle') => '<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+label+'</text>';
  const dot = (x,y,r=5) => '<circle class="ph-marker-dot" cx="'+x+'" cy="'+y+'" r="'+r+'"/>';
  const line = (x1,y1,x2,y2,kind='ph-axis') => '<line class="'+kind+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
  function arrow(x1,y1,x2,y2,style) {
    const length = Math.hypot(x2-x1,y2-y1);
    if (length < 2) return '';
    const dx=(x2-x1)/length, dy=(y2-y1)/length, tip=Math.min(10,length*.55);
    const x=x2-dx*tip, y=y2-dy*tip;
    return '<path class="'+style+'" fill="none" d="M'+x1+' '+y1+'L'+x2+' '+y2+'M'+(x+dy*tip*.5)+' '+(y-dx*tip*.5)+
      'L'+x2+' '+y2+'L'+(x-dy*tip*.5)+' '+(y+dx*tip*.5)+'"/>';
  }
  function schematic(id,draw,readout,initial) {
    Object.assign(models[id],{kind:'diagram',diagram:draw,readout,initial});
  }

  const dotPosition = index => 1.2*(index/10)+.8*(index/10)**2;
  model('paper-dots','移动估速用的两枚端点','中间计数点（编号）','',[1,7,1],
    n=>(dotPosition(n+1)-dotPosition(n-1))/.2,
    '相邻计数点相隔 0.10 s。把中间点向后挪，观察前后两点间的距离和算出的速度。','总时间一直为 0.20 s。越往后，两个端点相距越远，算出的速度越大。');
  schematic('paper-dots', n=>{
    const x=i=>49+dotPosition(i)*273;
    const tape='<rect class="ph-diagram-paper" x="30" y="93" width="460" height="64" rx="9"/>';
    const points=Array.from({length:9},(_,i)=>(i===n?dot(x(i),122,7):'<circle cx="'+x(i)+'" cy="122" r="4" class="ph-diagram-dot"/>')+text(x(i),148,i)).join('');
    const bracket=line(x(n-1),174,x(n+1),174,'ph-diagram-dash')+line(x(n-1),160,x(n-1),182)+line(x(n+1),160,x(n+1),182);
    return diagram('打点纸带。当前计数点 '+n+'，取它前后相邻的点估计速度。',text(260,70,'等时间打点')+tape+points+bracket+text((x(n-1)+x(n+1))/2,207,'0.20 s'));
  },(n,v)=>'第 '+n+' 点 · 两端相距 '+format((dotPosition(n+1)-dotPosition(n-1))*100)+' cm · 速率约 '+format(v)+' m/s',4);

  model('force-vector','两股力的箭头怎样相加','两股力的夹角 / °','',[0,180,1],models.forces.calc,
    '两股力各是 10 N。拖大夹角，观察平行四边形的对角线怎样缩短。','蓝色两条箭头是分力，橙色箭头是合力。等大两力的合力沿角平分线。两力反向时合力为零。');
  schematic('force-vector', a=>{
    const half=a*Math.PI/360;
    const x=146+100*Math.cos(half), delta=100*Math.sin(half), end=2*x-146;
    return diagram('两个等大分力的夹角 '+a+' 度。橙色为合力。',text(262,19,'两股力各 10 N')+
      line(x,127-delta,end,127,'ph-diagram-dash')+line(x,127+delta,end,127,'ph-diagram-dash')+
      arrow(146,127,x,127-delta,'ph-diagram-vector')+arrow(146,127,x,127+delta,'ph-diagram-vector')+
      arrow(146,127,end,127,'ph-diagram-result')+dot(146,127,4)+text(267,239,'蓝色：分力　　橙色：合力'));
  },(a,f)=>'夹角 '+a+'° · 合力 '+format(f)+' N',60);

  model('weight-scale','电梯加速度改变秤的读数','向上为正的加速度 / m/s²','秤的支持力 / N',[-9.8,4.2,.1],a=>50*(9.8+a),
    '一个 50 kg 的人站在电梯里的秤上。试试加速度为零、向下 2 m/s² 和向下 9.8 m/s² 时的读数。','重力始终是 490 N。支持力 N＝m(g+a)，向下加速时小于重力，自由下落时降为零。');
  Object.assign(models['weight-scale'],{initial:0,readout:(a,n)=>'加速度 '+format(a)+' m/s² · 秤的支持力 '+format(n)+' N'});

  model('drop-pair','同一高度，两球一起下落','释放后时间 / s','',[0,.5,.01],t=>4.9*t*t,
    '让 A 球以 3.0 m/s 水平飞出，B 球同时由静止下落。把时间拖到 0.50 s，比较两球高度。','每一时刻两球下落高度相同，起点离地面 1.225 m，因此同时落地。水平速度改变的是 A 球的位置。');
  schematic('drop-pair', t=>{
    const y=seconds=>49+132*(seconds/.5)**2;
    const trajectory=Array.from({length:21},(_,i)=>(171+i*10)+','+y(i/40)).join(' ');
    const aX=171+400*t, bX=83, height=y(t);
    return diagram('A 球做平抛，B 球自由下落。当前两球中心等高。',text(83,26,'B 自由落下')+text(195,26,'A 平抛')+
      line(50,191,475,191)+text(471,218,'地面','end')+line(bX,y(0),bX,y(.5),'ph-diagram-dash')+
      '<polyline class="ph-diagram-dash" fill="none" points="'+trajectory+'"/>'+line(bX,height,aX,height,'ph-diagram-alt')+
      dot(bX,height,9)+dot(aX,height,9));
  },(t,h)=>format(t)+' s · 两球都下降 '+Number(h.toFixed(3))+' m · A 球水平走了 '+format(t*3)+' m',.25);

  model('fall-energy','把下落中的两种能量画在一起','重物下落的高度 / m','能量 / J',[0,3,.05],h=>19.6*h,
    '重物质量 2.0 kg，从距参考面 3.0 m 处由静止下落。比较两条曲线，判断各自增减。','理想情况下，增加的动能等于减少的重力势能。检验真实数据时，用纸带求速度，并留意摩擦。');
  Object.assign(models['fall-energy'],{comparison:h=>19.6*(3-h),caption:'实线是动能，虚线是重力势能。',
    readout:(h,k)=>'下落 '+format(h)+' m · 动能 '+format(k)+' J · 重力势能 '+format(58.8-k)+' J · 合计 58.8 J'});

  model('wire-diameter','量错一点直径，电阻率差多少','直径读数偏差 / %','估算的电阻率偏差 / %',[-20,20,1],
    error=>100*((1+error/100)**2-1),
    '固定电阻和长度。先把直径读数向右拖到 +10%，再向左拖到 −10%，比较估得的电阻率。','电阻率和直径平方成正比。多读 10% 会高估 21%；少读 10% 会低估 19%。');
  Object.assign(models['wire-diameter'],{initial:10,readout:(d,r)=>'直径偏差 '+format(d)+'% · 电阻率偏差 '+format(r)+'%'});

  model('meter-dial','在指针表上读一次电阻','指针位置 / 满偏的 %','',[0,100,1],percent=>percent===0?null:20*(100/percent-1),
    '量程旋钮固定在 ×100 Ω。试着把针拖到表盘的 20，再想好实际被测阻值。','实际阻值是表盘上的欧姆数乘倍率。指针在正中间时表盘显示 20，×100 档对应 2000 Ω。');
  schematic('meter-dial', percent=>{
    const polar=(fraction,r)=>{
      const angle=(200+140*fraction)*Math.PI/180;
      return [260+r*Math.cos(angle),209+r*Math.sin(angle)];
    };
    const start=polar(0,153), end=polar(1,153);
    const marks=[Infinity,100,50,20,10,5,0].map(r=>{
      const fraction=20/(20+r), p=polar(fraction,142), q=polar(fraction,153), label=polar(fraction,175);
      return line(...p,...q)+text(label[0],label[1]+5,Number.isFinite(r)?r:'∞');
    }).join('');
    return diagram('指针式多用表的欧姆刻度，左端为无穷大，右端为零。量程倍率为一百。','<path class="ph-axis" fill="none" d="M'+start.join(' ')+
      ' A153 153 0 0 1 '+end.join(' ')+'"/>'+marks+arrow(260,209,...polar(percent/100,138),'ph-diagram-result')+dot(260,209,5)+text(260,240,'欧姆刻度 · ×100 Ω'));
  },(percent,r)=>'表盘 '+(r===null?'∞':format(r))+' · 实际阻值 '+(r===null?'∞ Ω':format(100*r)+' Ω'),50);

  model('vibration','把原书振子画成一条位移曲线','时间 / s','相对平衡位置的位移 / cm',[0,1,.01],t=>10*Math.cos(2*Math.PI*t),
    '拖到 0.25 s、0.50 s 和 1.00 s，分别看看小球在哪。','0.25 s 过平衡位置，0.50 s 到另一端，1.00 s 回原端。两个最远端之间只经过半个周期。');
  Object.assign(models.vibration,{initial:0,readout:(t,x)=>format(t)+' s · 位移 '+format(x)+' cm'});

  model('resonance','扫过秋千的共振区','驱动频率 / 固有频率','稳态振幅 / 低频振幅',[.2,1.8,.02],
    f=>1/Math.hypot(1-f*f,.18*f),
    '推力保持相同。慢慢拖动推动频率，找出摆幅最大的区域。','频率接近固有频率时，外力连续把能量送入振动。在阻尼较弱时，最大振幅出现在比值接近 1 的位置。');
  Object.assign(models.resonance,{initial:.5,readout:(f,a)=>'频率比 '+format(f)+' · 相对振幅 '+format(a)});

  model('fringes','屏上的亮纹会拉开吗','光的波长 / nm','',[400,700,5],wavelength=>wavelength*.0025,
    '双缝间距固定为 0.30 mm，到屏距离为 0.75 m。把波长从 400 nm 拖到 700 nm，观察亮纹间距。','相邻亮纹间距等于 Lλ/d。量两条不相邻的亮纹时，读数差要除以它们之间的间隔数。');
  schematic('fringes', wavelength=>{
    const spacing=models.fringes.calc(wavelength), gap=spacing*43, center=262;
    const stripes=Array.from({length:108},(_,i)=>{
      const x=46+i*4, opacity=.06+.94*Math.cos(Math.PI*(x+2-center)/gap)**2;
      return '<rect class="ph-light-fringe" x="'+x+'" y="70" width="4" height="81" opacity="'+opacity.toFixed(2)+'"/>';
    }).join('');
    return diagram('双缝干涉屏。波长 '+wavelength+' 纳米，相邻亮纹间距 '+format(spacing)+' 毫米。',text(center,42,'屏上亮纹')+
      '<rect x="46" y="70" width="432" height="81" class="ph-fringe-screen"/>'+stripes+
      line(center,155,center,192)+line(center+gap,155,center+gap,192)+line(center,184,center+gap,184,'ph-diagram-result')+
      text(center+gap/2,219,format(spacing)+' mm'));
  },(wavelength,spacing)=>wavelength+' nm · 相邻亮纹 '+format(spacing)+' mm · 5 个间隔约 '+format(spacing*5)+' mm',550);

  model('alternator','磁通量最大时，电压正好怎样','线圈转角 / °','相对于各自峰值',[0,360,1],a=>Math.cos(a*Math.PI/180),
    '让一匝线圈从面积法线正对磁场的姿态转一圈。观察哪条曲线先达到峰值。','磁通量与余弦成正比。感应电动势来自磁通量的变化率，与正弦成正比，两者相差四分之一周期。');
  Object.assign(models.alternator,{initial:0,comparison:a=>Math.sin(a*Math.PI/180),caption:'实线是磁通量，虚线是感应电动势。',
    readout:(a,flux)=>'转角 '+a+'° · 磁通量/峰值 '+format(flux)+' · 电动势/峰值 '+format(Math.sin(a*Math.PI/180))});

  model('reed-switch','让门边的磁体远离开关','磁体到干簧管的距离 / cm','',[0,5,.1],d=>Number(d>1),
    '小磁体和门一起移动。改变磁体到干簧管的距离，观察指示灯和蜂鸣器何时切换。','这个示意设定 1 cm 为切换点。磁体靠近时指示灯亮；磁体移开，干簧管状态变化，继电器改为驱动蜂鸣器。');
  schematic('reed-switch', distance=>{
    const start=153+distance*52, alarm=models['reed-switch'].calc(distance);
    return diagram('门窗报警示意。'+(alarm?'磁体远离，蜂鸣器响。':'磁体靠近，指示灯亮。'),text(98,65,'门框上的干簧管')+
      '<rect class="ph-diagram-paper" x="45" y="92" width="105" height="49" rx="22"/>'+line(65,115,129,alarm?115:121)+line(65,126,129,126)+
      text(start+34,65,'门上的磁体')+'<rect class="ph-diagram-magnet" x="'+start+'" y="95" width="69" height="44" rx="5"/>'+
      line(start+34,96,start+34,137)+text(start+17,123,'N')+text(start+51,123,'S')+
      line(150,164,start,164,'ph-diagram-dash')+text(260,215,alarm?'指示灯灭　／　蜂鸣器响':'指示灯亮　／　蜂鸣器静音'));
  },(d,alarm)=>format(d)+' cm · '+(alarm?'蜂鸣器响':'指示灯亮'),.5);

  model('energy-levels','氢原子从不同高度落到第二能级','初始能级 n','',[3,5,1],n=>13.6*(1/4-1/n**2),
    '把初态依次换成 n＝3、4、5，终态固定为 n＝2。哪次释放的光子能量更高？','初态越高，和同一个终态的能量差越大。光子的频率越高，真空波长越短。');
  schematic('energy-levels', n=>{
    const y=i=>32+175/i**2, selectedEnergy=-13.6/n**2;
    const levels=Array.from({length:5},(_,i)=>line(92,y(i+1),423,y(i+1),'ph-diagram-dash')).join('');
    return diagram('氢原子从第 '+n+' 能级跃迁到第二能级，向外放出光子。',levels+
      line(92,y(2),423,y(2),'ph-diagram-vector')+line(92,y(n),423,y(n),'ph-diagram-result')+
      arrow(238,y(n),238,y(2),'ph-diagram-result')+
      text(93,y(n)-8,'n＝'+n+'（'+format(selectedEnergy)+' eV）','start')+
      text(93,y(2)+24,'n＝2（−3.40 eV）','start')+text(93,y(1)+22,'n＝1（−13.60 eV）','start'));
  },(n,energy)=>'n＝'+n+' 到 n＝2 · 光子能量 '+format(energy)+' eV · 波长约 '+Math.round(1239.84/energy)+' nm',3);

  function chart(key, value) {
    const m = models[key], [lo,hi] = m.range;
    if (m.diagram) return m.diagram(value);
    const samples = calc => Array.from({length:101},(_,i)=>{
      const x=lo+(hi-lo)*i/100;
      return [x,calc(x)];
    }).filter(([,y])=>Number.isFinite(y));
    const sample = key==='sensor' ? [[lo,0],[35,0],[35,1],[hi,1]] : samples(m.calc);
    const comparison = m.comparison ? samples(m.comparison) : [];
    const values = [...sample,...comparison].map(([,y])=>y);
    const yMin=Math.min(0,...values), yMax=Math.max(0,...values);
    const left=64,right=505,top=20,bottom=218;
    const sx=x=>left+(right-left)*(x-lo)/(hi-lo);
    const sy=y=>key==='projectile'?top+(bottom-top)*(y-yMin)/(yMax-yMin||1):bottom-(bottom-top)*(y-yMin)/(yMax-yMin||1);
    const baseline=key==='projectile'?top:sy(0);
    const tick=(x,y,text,anchor='middle')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'">'+text+'</text>';
    const yValue=m.calc(value);
    const polyline=(points,kind)=>'<polyline class="'+kind+'" fill="none" points="'+
      points.map(([x,y])=>sx(x).toFixed(2)+','+sy(y).toFixed(2)).join(' ')+'"/>';
    const comparisonMark=m.comparison?'<circle class="ph-comparison-dot" cx="'+sx(value)+'" cy="'+sy(m.comparison(value))+'" r="5"/>':'';
    const grids=[yMin,(yMin+yMax)/2,yMax].map(y=>'<path d="M '+left+' '+sy(y)+' H '+right+'"/>'+tick(left-7,sy(y)+4,format(y),'end')).join('');
    const dots=Number.isFinite(yValue)?'<line class="ph-marker" x1="'+sx(value)+'" x2="'+sx(value)+'" y1="'+sy(yValue)+'" y2="'+baseline+'"/><circle class="ph-marker-dot" cx="'+sx(value)+'" cy="'+sy(yValue)+'" r="6"/>':'';
    return '<svg class="ph-chart" viewBox="0 0 525 252" role="img" aria-label="'+m.title+'。横轴：'+m.x+'；纵轴：'+m.y+'。">'+
      '<g class="ph-chart-grid">'+grids+'</g><path class="ph-axis" d="M '+left+' '+top+' V '+bottom+' M '+left+' '+baseline+' H '+right+'"/>'+
      polyline(sample,'ph-curve')+(comparison.length?polyline(comparison,'ph-diagram-alt'):'')+dots+comparisonMark+
      tick(left,238,format(lo))+tick(sx((lo+hi)/2),238,format((lo+hi)/2))+tick(right,238,format(hi))+'</svg>';
  }
  window.PhysicsModels={models,chart,format};
})();
