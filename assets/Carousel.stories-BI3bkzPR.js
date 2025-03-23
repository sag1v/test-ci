import{j as e}from"./jsx-runtime-SKoiH9zj.js";import{r as l,R as U}from"./index-DJO9vBfz.js";import{f as Me}from"./index-cNkFZXRj.js";var mt="gt3gyc2",ht="gt3gyc1",gt="gt3gyc8",pt="gt3gyc8",ft="gt3gyc0",vt="gt3gyc7",xt="gt3gyc5",Te="gt3gyc4",yt="gt3gyc3",wt="gt3gyc6";const Tt=({currentIndex:t,totalItems:n,itemsToShow:d,itemsToMove:s,circular:g})=>{if(!g){const o=Math.max(0,t-s),v=Math.min(n,t+d+s);return Array.from({length:v-o},(m,y)=>o+y)}const c=[],i=o=>(o%n+n)%n;for(let o=0;o<s;o++){const v=i(t-s+o);c.push(v)}for(let o=0;o<d;o++){const v=i(t+o);c.push(v)}for(let o=0;o<s;o++){const v=i(t+d+o);c.push(v)}return c},Mt=({currentIndex:t,totalItems:n,itemsToShow:d,itemsToMove:s,slideWidth:g,slideHeight:c=0,itemsToRenderCount:i,circular:o,animationOffset:v,isRTL:m,isVertical:y=!1})=>{const N=y?c:g;if(!N||N<=0)return 0;let b=0;return o?b=-N*s:t===0?b=0:t>=n-d?b=-N*(i-d):b=-N*s,b*(m?-1:1)+v},bt=(t,n,d)=>{if(!n||d===0)return t;const g=Object.keys(n).map(Number).sort((c,i)=>i-c).find(c=>d>=c);return g?{...t,...n[g]}:t},St=(t,n,d)=>{const s=l.useRef(),g=l.useCallback(()=>{t&&(s.current=setInterval(d,n))},[t,n,d]),c=l.useCallback(()=>{s.current&&clearInterval(s.current)},[]);return l.useEffect(()=>(t&&g(),c),[t,g,c]),{startAutoPlay:g,stopAutoPlay:c}},Ct=({element:t,onSwipeLeft:n,onSwipeRight:d,onSwipeUp:s,onSwipeDown:g,onSwipeRelease:c,threshold:i=50,preventDefault:o=!0,mouseSupport:v=!0})=>{var ne,A;const[m,y]=l.useState({startX:0,startY:0,isMouseDown:!1,currentX:0,currentY:0}),[N,b]=l.useState(null),O=l.useCallback(r=>{o&&r.preventDefault();const a=r.touches[0].clientX,p=r.touches[0].clientY;y({startX:a,startY:p,isMouseDown:!1,currentX:a,currentY:p}),b(null)},[o]),x=l.useCallback(r=>{o&&r.preventDefault(),y(a=>({...a,currentX:r.touches[0].clientX,currentY:r.touches[0].clientY}))},[o]),E=l.useCallback(r=>{var X,R,K,re;if(o&&r.preventDefault(),!r.changedTouches||!r.changedTouches[0]){const Y=m.currentX-m.startX,D=m.currentY-m.startY,se=Math.abs(Y)>Math.abs(D),ie=((X=t.current)==null?void 0:X.clientWidth)||i,we=((R=t.current)==null?void 0:R.clientHeight)||i,ae=Math.abs(Y)/ie,oe=Math.abs(D)/we,ce=Math.abs(Y)>5||Math.abs(D)>5;let F=null,u=0;se?(F=Y>0?"right":"left",u=ae,Y>i&&d?d():Y<-i&&n&&n()):(F=D>0?"down":"up",u=oe,D>i&&g?g():D<-i&&s&&s()),ce&&c&&setTimeout(()=>{c(u,F)},10),y(h=>({...h,isDragging:!1,startX:0,startY:0,currentX:0,currentY:0,dragDistanceX:0,dragDistanceY:0}));return}const a=r.changedTouches[0].clientX-m.startX,p=r.changedTouches[0].clientY-m.startY,W=Math.abs(a)>Math.abs(p),f=((K=t.current)==null?void 0:K.clientWidth)||i,P=((re=t.current)==null?void 0:re.clientHeight)||i,L=Math.abs(a)/f,$=Math.abs(p)/P,k=Math.abs(a)>5||Math.abs(p)>5;let S=null,j=0;W?(S=a>0?"right":"left",j=L,a>i&&d?d():a<-i&&n&&n()):(S=p>0?"down":"up",j=$,p>i&&g?g():p<-i&&s&&s()),c&&k?setTimeout(()=>{c(j,S)},10):c&&setTimeout(()=>{c(0,null)},10),y(Y=>({...Y,isMouseDown:!1}))},[m.startX,m.startY,n,d,s,g,c,i,t,o]),_=l.useCallback(r=>{y({startX:r.clientX,startY:r.clientY,isMouseDown:!0,currentX:r.clientX,currentY:r.clientY}),b(null)},[]),G=l.useCallback(r=>{m.isMouseDown&&(o&&m.isMouseDown&&r.preventDefault(),y(a=>({...a,currentX:r.clientX,currentY:r.clientY})))},[o,m.isMouseDown]),V=l.useCallback(r=>{var X,R;if(!m.isMouseDown)return;const a=r.clientX-m.startX,p=r.clientY-m.startY,W=Math.abs(a)>Math.abs(p),f=((X=t.current)==null?void 0:X.clientWidth)||i,P=((R=t.current)==null?void 0:R.clientHeight)||i,L=Math.abs(a)/f,$=Math.abs(p)/P,k=Math.abs(a)>5||Math.abs(p)>5;let S=null,j=0;W?(S=a>0?"right":"left",j=L,a>i&&d?d():a<-i&&n&&n()):(S=p>0?"down":"up",j=$,p>i&&g?g():p<-i&&s&&s()),c&&k?setTimeout(()=>{c(j,S)},10):c&&setTimeout(()=>{c(0,null)},10),y({startX:0,startY:0,isMouseDown:!1,currentX:0,currentY:0})},[m.startX,m.startY,m.isMouseDown,n,d,s,g,c,i,t]),q=l.useCallback(r=>{var j,X;if(!m.isMouseDown)return;const a=r.clientX-m.startX,p=r.clientY-m.startY,W=Math.abs(a)>Math.abs(p),f=((j=t.current)==null?void 0:j.clientWidth)||i,P=((X=t.current)==null?void 0:X.clientHeight)||i,L=Math.abs(a)/f,$=Math.abs(p)/P;let k=null,S=0;W?(k=a>0?"right":"left",S=L):(k=p>0?"down":"up",S=$),b(k),c&&setTimeout(()=>{c(S,k)},10),y(R=>({...R,isMouseDown:!1}))},[m,i,c]);l.useEffect(()=>{const r=t.current;if(r)return r.addEventListener("touchstart",O,{passive:!o}),r.addEventListener("touchmove",x,{passive:!o}),r.addEventListener("touchend",E),v&&(r.addEventListener("mousedown",_),window.addEventListener("mousemove",G),window.addEventListener("mouseup",V),r.addEventListener("mouseleave",q)),()=>{r.removeEventListener("touchstart",O),r.removeEventListener("touchmove",x),r.removeEventListener("touchend",E),v&&(r.removeEventListener("mousedown",_),window.removeEventListener("mousemove",G),window.removeEventListener("mouseup",V),r.removeEventListener("mouseleave",q))}},[t,O,x,E,_,G,V,q,v,o]);const T=m.currentX-m.startX,J=m.currentY-m.startY;return{isDragging:m.isMouseDown,dragDistanceX:T,dragDistanceY:J,dragPercentageX:T/(((ne=t.current)==null?void 0:ne.clientWidth)||1),dragPercentageY:J/(((A=t.current)==null?void 0:A.clientHeight)||1),releaseDirection:N}},ee=({children:t,responsive:n,...d})=>{const[s,g]=l.useState({currentIndex:d.initialActiveIndex||0,trackOffset:0,isAnimationAllowed:!1,direction:null}),c=l.useRef(null),i=l.useRef(null),o=l.useRef(null),[v,m]=l.useState(0),[y,N]=l.useState(0),[b,O]=l.useState(0),[x]=l.useState(d.isRTL||!1),[E,_]=l.useState(!1),[G,V]=l.useState(0),q=t||[],T=U.Children.count(q),J=U.Children.toArray(q),ne=l.useMemo(()=>bt(d,n,b),[d,n,b]),{infinite:A=!1,itemsToShow:r=1,itemsToMove:a=1,enableAutoPlay:p=!1,autoPlaySpeed:W=3e3,verticalMode:f=!1}=ne,{onNext:P,onPrev:L}=d,$=l.useMemo(()=>Tt({currentIndex:s.currentIndex,totalItems:T,itemsToShow:r,itemsToMove:a,circular:A}).map(h=>({index:h,content:J[h]})),[s.currentIndex,T,r,a,A,J]),k=l.useCallback(()=>{if(s.isAnimationAllowed)return;P&&P();const u=f?-y:-v;g(h=>({...h,trackOffset:u*a,isAnimationAllowed:!0,direction:"next"}))},[s.isAnimationAllowed,P,a,v,y,f]),S=l.useCallback(()=>{if(s.isAnimationAllowed)return;L&&L();const u=f?y:v;g(h=>({...h,trackOffset:u*a,isAnimationAllowed:!0,direction:"prev"}))},[s.isAnimationAllowed,L,a,v,y,f]),j=l.useCallback(()=>{k()},[k]),X=l.useCallback(()=>{S()},[S]),{startAutoPlay:R,stopAutoPlay:K}=St(p,W,j),re=l.useCallback(()=>{p&&K()},[p,K]),Y=l.useCallback(()=>{p&&R()},[p,R]),{isDragging:D,dragDistanceX:se,dragDistanceY:ie}=Ct({element:i,threshold:50,mouseSupport:!0,onSwipeRelease:(u,h)=>{const M=!A&&(x?s.currentIndex>=T-r:s.currentIndex<=0),C=!A&&(x?s.currentIndex<=0:s.currentIndex>=T-r);let w=!1,I=!1;f?(w=h==="up",I=h==="down"):x?(w=h==="right",I=h==="left"):(w=h==="left",I=h==="right"),M&&I||C&&w||u<.25?g({...s,trackOffset:0,isAnimationAllowed:!0,direction:null}):w?k():I&&S(),_(!1),V(0)}});l.useEffect(()=>{if(D&&!E&&(_(!0),s.isAnimationAllowed&&g(u=>({...u,isAnimationAllowed:!1}))),D){const u=f?ie:se;V(x&&!f?-u:u)}},[D,E,se,ie,f,x,s.isAnimationAllowed]),l.useEffect(()=>{if(!c.current||!i.current)return;const u=z=>{if(!i.current||!c.current)return;let M,C;if(z&&z.length>0){const w=z.find(Q=>Q.target===c.current),I=z.find(Q=>Q.target===i.current);w?M={width:w.contentRect.width,height:w.contentRect.height}:M=c.current.getBoundingClientRect(),I?C={width:I.contentRect.width,height:I.contentRect.height}:C=i.current.getBoundingClientRect()}else M=c.current.getBoundingClientRect(),C=i.current.getBoundingClientRect();if(O(f?M.height:M.width),!f&&C.width>0&&r>0){const w=Math.floor(C.width/r);m(w>0?w:0)}if(f&&o.current){const w=$.length;if(w===0)return;const I=o.current.style.cssText;o.current.style.cssText="position: absolute; transform: none; transition: none; visibility: visible; height: auto;";const be=o.current.getBoundingClientRect().height;if(o.current.style.cssText=I,be>0&&w>0){const Se=Math.ceil(be/w);N(Se),i.current&&r>0&&(i.current.style.height=`${Se*r}px`)}}};u();const h=new ResizeObserver(z=>{const M=z.find(w=>w.target===c.current),C=z.find(w=>w.target===i.current);f?((M==null?void 0:M.contentRect.height)!==b||C&&C.contentRect.height>0)&&u(z):((M==null?void 0:M.contentRect.width)!==b||C&&C.contentRect.width>0)&&u(z)});return h.observe(c.current),h.observe(i.current),()=>{h.disconnect()}},[r,f,b,$.length]);const we=l.useCallback(()=>{s.isAnimationAllowed&&g(u=>{let h=u.currentIndex;return u.direction==="next"?(h=x?Math.max(0,u.currentIndex-a):Math.min(T-r,u.currentIndex+a),A&&(h=x?(u.currentIndex-a+T)%T:(u.currentIndex+a)%T)):u.direction==="prev"&&(h=x?Math.min(T-r,u.currentIndex+a):Math.max(0,u.currentIndex-a),A&&(h=x?(u.currentIndex+a)%T:(u.currentIndex-a+T)%T)),d.onChange&&h!==u.currentIndex&&d.onChange(h),{currentIndex:h,trackOffset:0,isAnimationAllowed:!1,direction:null}})},[a,T,x,d,A,r,s.isAnimationAllowed]),ae=Mt({currentIndex:s.currentIndex,totalItems:T,itemsToShow:r,itemsToMove:a,slideWidth:v,slideHeight:y,itemsToRenderCount:$.length,circular:A,animationOffset:s.trackOffset,isRTL:x,isVertical:f});l.useEffect(()=>{p&&R()},[p,R]);const oe=E?ae+G:ae;if(l.useEffect(()=>{o.current&&(s.isAnimationAllowed?o.current.classList.add(Te):o.current.classList.remove(Te))},[s.isAnimationAllowed]),!t)return console.warn("Carousel component requires children"),null;const ce=e.jsx("button",{onClick:X,className:pt,disabled:!A&&(x?s.currentIndex>=T-r:s.currentIndex<=0),"aria-label":f?"Previous slide (up)":"Previous slide",children:f?"↑":"←"}),F=e.jsx("button",{onClick:j,className:gt,disabled:!A&&(x?s.currentIndex<=0:s.currentIndex>=T-r),"aria-label":f?"Next slide (down)":"Next slide",children:f?"↓":"→"});return e.jsxs("div",{ref:c,className:ft,onMouseEnter:re,onMouseLeave:Y,style:{direction:x?"rtl":"ltr",height:"100%"},children:[x?F:ce,e.jsx("div",{ref:i,className:`${ht} ${E?mt:""}`,style:{maxWidth:v>0?`${v*r}px`:"100%"},children:e.jsx("div",{ref:o,className:`${xt} ${f?wt:""} 
                    ${E?yt:""} 
                    ${s.isAnimationAllowed?Te:""}`,style:{direction:x?"rtl":"ltr",transform:f?`translateY(${oe}px)`:`translateX(${oe}px)`,width:"100%"},onTransitionEnd:we,children:$.map(({index:u,content:h},z)=>{const M=f?y>0?{height:`${y}px`}:{flex:`1 0 ${100/r}%`}:{width:v>0?`${v}px`:"auto"},C=`slide-${u}`;return e.jsx("div",{"data-renderindex":z,"data-key":C,className:`${vt}`,style:M,children:h},C)})})}),x?ce:F]})};ee.__docgenInfo={description:"",methods:[],displayName:"Carousel",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},infinite:{required:!1,tsType:{name:"boolean"},description:""},itemsToShow:{required:!1,tsType:{name:"number"},description:""},itemsToMove:{required:!1,tsType:{name:"number"},description:""},enableAutoPlay:{required:!1,tsType:{name:"boolean"},description:""},autoPlaySpeed:{required:!1,tsType:{name:"number"},description:""},initialActiveIndex:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isRTL:{required:!1,tsType:{name:"boolean"},description:""},responsive:{required:!1,tsType:{name:"Record",elements:[{name:"number"},{name:"Omit",elements:[{name:"CarouselProps"},{name:"union",raw:"'children' | 'responsive'",elements:[{name:"literal",value:"'children'"},{name:"literal",value:"'responsive'"}]}],raw:`Omit<
  CarouselProps,
  'children' | 'responsive'
>`}],raw:"Record<number, CarouselResponsiveProps>"},description:""},verticalMode:{required:!1,tsType:{name:"boolean"},description:""}}};const zt={title:"Components/Carousel",component:ee,tags:["autodocs"],args:{onNext:Me(),onPrev:Me()}},dt=()=>{const[t,n]=U.useState(new Date().toLocaleTimeString());return U.useLayoutEffect(()=>{n(new Date().toLocaleTimeString())},[]),e.jsx("div",{children:`Generated at: ${t}`})},B=({color:t,title:n,details:d})=>e.jsxs("div",{className:"example-slide-content",style:{backgroundColor:t},children:[e.jsx("h2",{className:"example-slide-title",children:n}),e.jsx("div",{className:"example-slide-details",children:d})]}),ut=({children:t,direction:n})=>{const d={horizontal:"↔",vertical:"↕",both:"↔↕"};return e.jsxs("div",{style:{resize:n,overflow:"hidden",padding:"20px",border:"1px dashed #ccc",minWidth:"300px",maxWidth:"100%",position:"relative"},children:[t,e.jsx("div",{className:"resizable-hint",children:`${d[n]} Drag to resize`})]})},te=t=>`hsl(${t*20%360}, 70%, 80%)`,H={args:{children:Array.from({length:12},(t,n)=>e.jsx(B,{color:te(n),title:`Slide ${n+1}`,details:e.jsx(dt,{})},n))}},le={args:{...H.args,infinite:!0}},Z={args:{infinite:!0,itemsToShow:3,children:Array.from({length:25},(t,n)=>e.jsx(B,{color:te(n),title:`Slide ${n+1}`,details:e.jsx(dt,{})},n))}},de={args:{...Z.args,itemsToMove:3}},ue={args:{...H.args,isRTL:!0}},me={render:t=>e.jsx(ut,{direction:"horizontal",children:e.jsx(ee,{...t})}),args:{responsive:{300:{itemsToShow:1,itemsToMove:1,infinite:!0},600:{itemsToShow:2,itemsToMove:1,infinite:!0},900:{itemsToShow:3,itemsToMove:1},1200:{itemsToShow:4,itemsToMove:2}},children:Array.from({length:10},(t,n)=>e.jsx(B,{color:te(n),title:`Slide ${n+1}`,details:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Resize container horizontally to see responsive behavior"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Breakpoints:"})," 300px, 600px, 900px, 1200px"]})]})},n))},parameters:{docs:{description:{story:"Horizontal carousel with resizable container to demonstrate responsive behavior. Drag the right edge to resize."}}}},he={args:{...H.args,enableAutoPlay:!0,autoPlaySpeed:3e3,infinite:!0},parameters:{docs:{description:{story:"Carousel with auto-play enabled, advancing every 3 seconds"}}}},ge={args:{...H.args,initialActiveIndex:5},parameters:{docs:{description:{story:"Carousel starting at slide 6 (index 5) instead of the first slide"}}}},At=t=>{const[n,d]=U.useState(0);return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"20px",padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"},children:[e.jsx("strong",{children:"Current Slide:"})," ",n+1]}),e.jsx(ee,{...t,onChange:s=>{var g;d(s),(g=t.onChange)==null||g.call(t,s)}})]})},pe={render:t=>e.jsx(At,{...t}),args:{...H.args,onChange:Me()},parameters:{docs:{description:{story:"Demonstrates the onChange callback that fires when the active slide changes"}}}},fe={args:{verticalMode:!0,infinite:!0,itemsToShow:2,itemsToMove:1,children:Array.from({length:8},(t,n)=>e.jsx(B,{color:te(n),title:`Slide ${n+1}`,details:"Vertical scrolling example"},n))},parameters:{docs:{description:{story:"Carousel in vertical mode, showing multiple slides at a time with vertical alignment"}}}},ve={render:t=>e.jsx(ut,{direction:"vertical",children:e.jsx(ee,{...t})}),args:{verticalMode:!0,responsive:{300:{itemsToShow:1,itemsToMove:1,verticalMode:!0,infinite:!0},500:{itemsToShow:2,itemsToMove:1,verticalMode:!0,infinite:!0},700:{itemsToShow:3,itemsToMove:1,verticalMode:!0}},children:Array.from({length:8},(t,n)=>e.jsx(B,{title:`Slide ${n+1}`,color:te(n),details:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Resize container to see responsive behavior"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Breakpoints:"})," 300px, 500px, 700px"]})]})},n))},parameters:{docs:{description:{story:"Vertical carousel with resizable container to demonstrate responsive behavior. Drag the bottom-right corner to resize both width and height."}}}},xe={name:"Swipe Support",args:{children:Array(9).fill(0).map((t,n)=>e.jsx(B,{color:`hsl(${n*360/5}, 70%, 70%)`,title:`Slide ${n+1}`,details:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Swipe left or right"}),e.jsxs("div",{className:"swipe-indicator",children:[e.jsx("span",{className:"swipe-arrow",children:"←"}),e.jsx("span",{children:"Next"}),e.jsx("span",{className:"swipe-arrow",style:{marginLeft:"20px"},children:"→"}),e.jsx("span",{children:"Previous"})]})]})},`slide-${n}`)),itemsToShow:3,itemsToMove:3},decorators:[t=>e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("h3",{children:"Touch/Mouse Swipe Demo"}),e.jsx("p",{children:"This carousel supports touch swipe and mouse drag navigation. Try clicking and dragging to navigate between slides."})]}),e.jsx(t,{})]})]},ye={name:"Vertical Swipe Support",args:{children:Array(9).fill(0).map((t,n)=>e.jsx(B,{color:`hsl(${n*360/5}, 70%, 70%)`,title:`Slide ${n+1}`,details:e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Swipe up or down"}),e.jsxs("div",{className:"swipe-indicator vertical",children:[e.jsx("span",{className:"swipe-arrow",children:"↑"}),e.jsx("span",{children:"Next"}),e.jsx("span",{className:"swipe-arrow",style:{marginTop:"20px"},children:"↓"}),e.jsx("span",{children:"Previous"})]})]})},`slide-${n}`)),itemsToShow:3,itemsToMove:3,verticalMode:!0},decorators:[t=>e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"20px"},children:[e.jsx("h3",{children:"Vertical Touch/Mouse Swipe Demo"}),e.jsx("p",{children:"This carousel supports vertical touch swipe and mouse drag navigation. Try clicking and dragging up or down to navigate between slides."})]}),e.jsx(t,{})]})]};var Ce,Ae,je;H.parameters={...H.parameters,docs:{...(Ce=H.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
  args: {
    children: Array.from({
      length: 12
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(je=(Ae=H.parameters)==null?void 0:Ae.docs)==null?void 0:je.source}}};var ke,Re,ze;le.parameters={...le.parameters,docs:{...(ke=le.parameters)==null?void 0:ke.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    infinite: true
  }
}`,...(ze=(Re=le.parameters)==null?void 0:Re.docs)==null?void 0:ze.source}}};var Ie,$e,Xe;Z.parameters={...Z.parameters,docs:{...(Ie=Z.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  args: {
    infinite: true,
    itemsToShow: 3,
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(Xe=($e=Z.parameters)==null?void 0:$e.docs)==null?void 0:Xe.source}}};var Ye,De,Ne;de.parameters={...de.parameters,docs:{...(Ye=de.parameters)==null?void 0:Ye.docs,source:{originalSource:`{
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3
  }
}`,...(Ne=(De=de.parameters)==null?void 0:De.docs)==null?void 0:Ne.source}}};var Ee,Pe,Le;ue.parameters={...ue.parameters,docs:{...(Ee=ue.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isRTL: true
  }
}`,...(Le=(Pe=ue.parameters)==null?void 0:Pe.docs)==null?void 0:Le.source}}};var He,Oe,We;me.parameters={...me.parameters,docs:{...(He=me.parameters)==null?void 0:He.docs,source:{originalSource:`{
  render: args => <ResizeContainer direction="horizontal">
      <Carousel {...args} />
    </ResizeContainer>,
  args: {
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        infinite: true
      },
      600: {
        itemsToShow: 2,
        itemsToMove: 1,
        infinite: true
      },
      900: {
        itemsToShow: 3,
        itemsToMove: 1
      },
      1200: {
        itemsToShow: 4,
        itemsToMove: 2
      }
    },
    children: Array.from({
      length: 10
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<>
            <p>Resize container horizontally to see responsive behavior</p>
            <p>
              <strong>Breakpoints:</strong> 300px, 600px, 900px, 1200px
            </p>
          </>} />)
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal carousel with resizable container to demonstrate responsive behavior. Drag the right edge to resize.'
      }
    }
  }
}`,...(We=(Oe=me.parameters)==null?void 0:Oe.docs)==null?void 0:We.source}}};var Be,_e,Ve;he.parameters={...he.parameters,docs:{...(Be=he.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    enableAutoPlay: true,
    autoPlaySpeed: 3000,
    infinite: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel with auto-play enabled, advancing every 3 seconds'
      }
    }
  }
}`,...(Ve=(_e=he.parameters)==null?void 0:_e.docs)==null?void 0:Ve.source}}};var qe,Fe,Ge;ge.parameters={...ge.parameters,docs:{...(qe=ge.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    initialActiveIndex: 5
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel starting at slide 6 (index 5) instead of the first slide'
      }
    }
  }
}`,...(Ge=(Fe=ge.parameters)==null?void 0:Fe.docs)==null?void 0:Ge.source}}};var Je,Ke,Qe;pe.parameters={...pe.parameters,docs:{...(Je=pe.parameters)==null?void 0:Je.docs,source:{originalSource:`{
  render: args => <OnChangeExample {...args} />,
  args: {
    ...Default.args,
    onChange: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the onChange callback that fires when the active slide changes'
      }
    }
  }
}`,...(Qe=(Ke=pe.parameters)==null?void 0:Ke.docs)==null?void 0:Qe.source}}};var Ze,Ue,et;fe.parameters={...fe.parameters,docs:{...(Ze=fe.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  args: {
    verticalMode: true,
    infinite: true,
    itemsToShow: 2,
    itemsToMove: 1,
    children: Array.from({
      length: 8
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details="Vertical scrolling example" />)
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel in vertical mode, showing multiple slides at a time with vertical alignment'
      }
    }
  }
}`,...(et=(Ue=fe.parameters)==null?void 0:Ue.docs)==null?void 0:et.source}}};var tt,nt,rt;ve.parameters={...ve.parameters,docs:{...(tt=ve.parameters)==null?void 0:tt.docs,source:{originalSource:`{
  render: args => <ResizeContainer direction="vertical">
      <Carousel {...args} />
    </ResizeContainer>,
  args: {
    verticalMode: true,
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        verticalMode: true,
        infinite: true
      },
      500: {
        itemsToShow: 2,
        itemsToMove: 1,
        verticalMode: true,
        infinite: true
      },
      700: {
        itemsToShow: 3,
        itemsToMove: 1,
        verticalMode: true
      }
    },
    children: Array.from({
      length: 8
    }, (_, i) => <Slide key={i} title={\`Slide \${i + 1}\`} color={generateColor(i)} details={<>
            <p>Resize container to see responsive behavior</p>
            <p>
              <strong>Breakpoints:</strong> 300px, 500px, 700px
            </p>
          </>} />)
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical carousel with resizable container to demonstrate responsive behavior. Drag the bottom-right corner to resize both width and height.'
      }
    }
  }
}`,...(rt=(nt=ve.parameters)==null?void 0:nt.docs)==null?void 0:rt.source}}};var st,it,at;xe.parameters={...xe.parameters,docs:{...(st=xe.parameters)==null?void 0:st.docs,source:{originalSource:`{
  name: 'Swipe Support',
  args: {
    children: Array(9).fill(0).map((_, i) => <Slide key={\`slide-\${i}\`} color={\`hsl(\${i * 360 / 5}, 70%, 70%)\`} title={\`Slide \${i + 1}\`} details={<>
              <p>Swipe left or right</p>
              <div className="swipe-indicator">
                <span className="swipe-arrow">←</span>
                <span>Next</span>
                <span className="swipe-arrow" style={{
          marginLeft: '20px'
        }}>
                  →
                </span>
                <span>Previous</span>
              </div>
            </>} />),
    itemsToShow: 3,
    itemsToMove: 3
  },
  decorators: [Story => <div>
        <div style={{
      marginBottom: '20px'
    }}>
          <h3>Touch/Mouse Swipe Demo</h3>
          <p>
            This carousel supports touch swipe and mouse drag navigation. Try
            clicking and dragging to navigate between slides.
          </p>
        </div>
        <Story />
      </div>]
}`,...(at=(it=xe.parameters)==null?void 0:it.docs)==null?void 0:at.source}}};var ot,ct,lt;ye.parameters={...ye.parameters,docs:{...(ot=ye.parameters)==null?void 0:ot.docs,source:{originalSource:`{
  name: 'Vertical Swipe Support',
  args: {
    children: Array(9).fill(0).map((_, i) => <Slide key={\`slide-\${i}\`} color={\`hsl(\${i * 360 / 5}, 70%, 70%)\`} title={\`Slide \${i + 1}\`} details={<>
              <p>Swipe up or down</p>
              <div className="swipe-indicator vertical">
                <span className="swipe-arrow">↑</span>
                <span>Next</span>
                <span className="swipe-arrow" style={{
          marginTop: '20px'
        }}>
                  ↓
                </span>
                <span>Previous</span>
              </div>
            </>} />),
    itemsToShow: 3,
    itemsToMove: 3,
    verticalMode: true
  },
  decorators: [Story => <div>
        <div style={{
      marginBottom: '20px'
    }}>
          <h3>Vertical Touch/Mouse Swipe Demo</h3>
          <p>
            This carousel supports vertical touch swipe and mouse drag
            navigation. Try clicking and dragging up or down to navigate between
            slides.
          </p>
        </div>
        <Story />
      </div>]
}`,...(lt=(ct=ye.parameters)==null?void 0:ct.docs)==null?void 0:lt.source}}};const It=["Default","InfiniteScroll","MultipleSlides","MultipleScrolling","RTLCarousel","ResponsiveCarouselHorizontal","AutoPlayCarousel","InitialActiveIndex","WithOnChangeCallback","VerticalCarousel","ResponsiveCarouselVertical","WithSwipeSupport","VerticalWithSwipeSupport"];export{he as AutoPlayCarousel,H as Default,le as InfiniteScroll,ge as InitialActiveIndex,de as MultipleScrolling,Z as MultipleSlides,ue as RTLCarousel,me as ResponsiveCarouselHorizontal,ve as ResponsiveCarouselVertical,fe as VerticalCarousel,ye as VerticalWithSwipeSupport,pe as WithOnChangeCallback,xe as WithSwipeSupport,It as __namedExportsOrder,zt as default};
