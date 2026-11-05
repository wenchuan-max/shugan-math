(() => {
  'use strict';
  const E=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const format=value=>Number(value.toFixed(3)).toString();
  function sequence(title,predict,why,frames){
    return {title,predict,why,frames,kind:'stages',x:'步骤',y:'阶段示意',range:[0,frames.length-1,1],initial:0,
      calc:value=>value,readout:value=>frames[value][0]};
  }
  function quantity(title,x,y,range,calc,predict,why){
    return {title,x,y,range,calc,predict,why,
      readout:(value,result)=>x+'：'+format(value)+'；'+y+'：'+format(result)};
  }
  function create(models){
    function chart(id,value){
      const model=models[id];
      if(model.kind==='stages'){
        const [title,description,nodes]=model.frames[Math.round(value)];
        const columns=Math.min(3,nodes.length),rows=Math.ceil(nodes.length/columns);
        const width=510,height=rows*86+20,cell=width/columns;
        const positions=nodes.map((node,index)=>({node,x:cell*(index%columns)+cell/2,y:52+86*Math.floor(index/columns)}));
        const arrows=positions.slice(0,-1).map((p,index)=>{
          const n=positions[index+1];
          if(p.y!==n.y)return '';
          return '<path d="M '+(p.x+cell*.38)+' '+p.y+' H '+(n.x-cell*.38)+'" stroke="#537189" stroke-width="2" marker-end="url(#sc-arrow)"/>';
        }).join('');
        const diagram=positions.map(({node,x,y})=>'<g><rect x="'+(x-cell*.36)+'" y="'+(y-29)+'" width="'+(cell*.72)+'" height="58" rx="12" fill="#eef4ef" stroke="#638e78"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="15" fill="#214a36">'+E(node)+'</text></g>').join('');
        return '<div class="sc-stage"><strong>'+E(title)+'</strong><svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+E(title+'，'+nodes.join('，'))+'"><defs><marker id="sc-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#537189"/></marker></defs>'+arrows+diagram+'</svg><ol class="sc-mobile-flow">'+nodes.map(node=>'<li>'+E(node)+'</li>').join('')+'</ol><p>'+E(description)+'</p></div>';
      }
      const [low,high]=model.range;
      const points=Array.from({length:101},(_,i)=>{const x=low+(high-low)*i/100;return [x,model.calc(x)];});
      const min=Math.min(0,...points.map(p=>p[1])),max=Math.max(0,...points.map(p=>p[1]));
      const left=65,right=495,top=24,bottom=214;
      const sx=x=>left+(right-left)*(x-low)/(high-low),sy=y=>bottom-(bottom-top)*(y-min)/(max-min||1);
      const ticks=[min,(min+max)/2,max].map(y=>'<path d="M '+left+' '+sy(y)+' H '+right+'" stroke="#c8d8d1"/><text x="'+(left-8)+'" y="'+(sy(y)+5)+'" text-anchor="end">'+format(y)+'</text>').join('');
      const line=points.map(([x,y])=>sx(x)+','+sy(y)).join(' ');
      return '<svg class="ph-chart" viewBox="0 0 520 250" role="img" aria-label="'+E(model.title+'，横轴 '+model.x+'，纵轴 '+model.y)+'">'+ticks+
        '<path class="ph-axis" d="M '+left+' '+top+' V '+bottom+' H '+right+'"/><polyline class="ph-curve" fill="none" points="'+line+'"/>'+
        '<circle class="ph-marker-dot" cx="'+sx(value)+'" cy="'+sy(model.calc(value))+'" r="6"/>'+
        '<text x="'+left+'" y="239">'+format(low)+'</text><text x="'+right+'" y="239" text-anchor="end">'+format(high)+'</text></svg>';
    }
    return {models,chart,format};
  }
  window.ScienceVisuals={create,quantity,sequence};
})();
