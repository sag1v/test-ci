import{j as n}from"./jsx-runtime-SKoiH9zj.js";import{r as c,R as I}from"./index-DJO9vBfz.js";import{f as J}from"./index-cNkFZXRj.js";var Xe="gt3gyc1",Ye="gt3gyc5",Je="gt3gyc5",Ke="gt3gyc0",Qe="gt3gyc4",Ue="gt3gyc2",Ze="gt3gyc3";const et=({currentIndex:t,totalItems:e,itemsToShow:s,itemsToMove:r,circular:m})=>{if(!m){const i=Math.max(0,t-r),d=Math.min(e,t+s+r);return Array.from({length:d-i},(P,y)=>i+y)}const o=[],u=i=>(i%e+e)%e;for(let i=0;i<r;i++){const d=u(t-r+i);o.push(d)}for(let i=0;i<s;i++){const d=u(t+i);o.push(d)}for(let i=0;i<r;i++){const d=u(t+s+i);o.push(d)}return o},tt=({currentIndex:t,totalItems:e,itemsToShow:s,itemsToMove:r,slideWidth:m,slideHeight:o=0,itemsToRenderCount:u,circular:i,animationOffset:d,isRTL:P,isVertical:y=!1})=>{const M=y?o:m;if(!M||M<=0)return 0;let S=0;return i?S=-M*r:t===0?S=0:t>=e-s?S=-M*(u-s):S=-M*r,S*(P?-1:1)+d},nt=(t,e,s)=>{if(!e||s===0)return t;const m=Object.keys(e).map(Number).sort((o,u)=>u-o).find(o=>s>=o);return m?{...t,...e[m]}:t},rt=(t,e,s)=>{const r=c.useRef(),m=c.useCallback(()=>{t&&(r.current=setInterval(s,e))},[t,e,s]),o=c.useCallback(()=>{r.current&&clearInterval(r.current)},[]);return c.useEffect(()=>(t&&m(),o),[t,m,o]),{startAutoPlay:m,stopAutoPlay:o}},z=({children:t,responsive:e,...s})=>{const[r,m]=c.useState({currentIndex:s.initialActiveIndex||0,trackOffset:0,isAnimating:!1,direction:null}),o=c.useRef(null),u=c.useRef(null),i=c.useRef(null),[d,P]=c.useState(0),[y,M]=c.useState(0),[S,K]=c.useState(0),[x]=c.useState(s.isRTL||!1),Q=t||[],f=I.Children.count(Q),U=I.Children.toArray(Q),Le=c.useMemo(()=>nt(s,e,S),[s,e,S]),{infinite:w=!1,itemsToShow:p=1,itemsToMove:h=1,enableAutoPlay:k=!1,autoPlaySpeed:Ve=3e3,verticalMode:g=!1}=Le,{onNext:X,onPrev:Y}=s,O=c.useMemo(()=>et({currentIndex:r.currentIndex,totalItems:f,itemsToShow:p,itemsToMove:h,circular:w}).map(l=>({index:l,content:U[l]})),[r.currentIndex,f,p,h,w,U]),Z=c.useCallback(()=>{if(r.isAnimating)return;X&&X();const a=g?-y:-d;m(l=>({...l,trackOffset:a*h,isAnimating:!0,direction:"next"}))},[r.isAnimating,X,h,d,y,g]),We=c.useCallback(()=>{if(r.isAnimating)return;Y&&Y();const a=g?y:d;m(l=>({...l,trackOffset:a*h,isAnimating:!0,direction:"prev"}))},[r.isAnimating,Y,h,d,y,g]),{startAutoPlay:D,stopAutoPlay:ee}=rt(k,Ve,Z),He=c.useCallback(()=>{k&&ee()},[k,ee]),Fe=c.useCallback(()=>{k&&D()},[k,D]);c.useEffect(()=>{if(!o.current||!u.current)return;const a=C=>{if(!u.current||!o.current)return;let T,v;if(C&&C.length>0){const b=C.find(_=>_.target===o.current),A=C.find(_=>_.target===u.current);b?T={width:b.contentRect.width,height:b.contentRect.height}:T=o.current.getBoundingClientRect(),A?v={width:A.contentRect.width,height:A.contentRect.height}:v=u.current.getBoundingClientRect()}else T=o.current.getBoundingClientRect(),v=u.current.getBoundingClientRect();if(K(T.width),!g&&v.width>0&&p>0){const b=Math.floor(v.width/p);P(b>0?b:0)}if(g&&i.current){const b=O.length;if(b===0)return;const A=i.current.style.cssText;i.current.style.cssText="position: absolute; transform: none; transition: none; visibility: visible; height: auto;";const se=i.current.getBoundingClientRect().height;if(i.current.style.cssText=A,se>0&&b>0){const ie=Math.ceil(se/b);M(ie),u.current&&p>0&&(u.current.style.height=`${ie*p}px`)}}};a();const l=new ResizeObserver(C=>{const T=C.find(v=>v.target===o.current);((T==null?void 0:T.contentRect.width)!==S||C.some(v=>v.target===u.current)&&!g)&&a(C)});return l.observe(o.current),l.observe(u.current),()=>{l.disconnect()}},[p,g,S,O.length]);const Ge=c.useCallback(()=>{r.isAnimating&&m(a=>{let l=a.currentIndex;return a.direction==="next"?(l=x?Math.max(0,a.currentIndex-h):Math.min(f-p,a.currentIndex+h),w&&(l=x?(a.currentIndex-h+f)%f:(a.currentIndex+h)%f)):a.direction==="prev"&&(l=x?Math.min(f-p,a.currentIndex+h):Math.max(0,a.currentIndex-h),w&&(l=x?(a.currentIndex+h)%f:(a.currentIndex-h+f)%f)),s.onChange&&l!==a.currentIndex&&s.onChange(l),{currentIndex:l,trackOffset:0,isAnimating:!1,direction:null}})},[h,f,x,s,w,p,r.isAnimating]),te=tt({currentIndex:r.currentIndex,totalItems:f,itemsToShow:p,itemsToMove:h,slideWidth:d,slideHeight:y,itemsToRenderCount:O.length,circular:w,animationOffset:r.trackOffset,isRTL:x,isVertical:g});if(c.useEffect(()=>{k&&D()},[k,D]),!t)return console.warn("Carousel component requires children"),null;const ne=n.jsx("button",{onClick:We,className:Je,disabled:!w&&(x?r.currentIndex>=f-p:r.currentIndex<=0),"aria-label":g?"Previous slide (up)":"Previous slide",children:g?"↑":"←"}),re=n.jsx("button",{onClick:Z,className:Ye,disabled:!w&&(x?r.currentIndex<=0:r.currentIndex>=f-p),"aria-label":g?"Next slide (down)":"Next slide",children:g?"↓":"→"});return n.jsxs("div",{ref:o,className:Ke,onMouseEnter:He,onMouseLeave:Fe,style:{direction:x?"rtl":"ltr",height:"100%"},children:[x?re:ne,n.jsx("div",{ref:u,className:Xe,style:{maxWidth:d>0?`${d*p}px`:"100%"},children:n.jsx("div",{ref:i,className:`${Ue} ${g?Ze:""}`,style:{direction:x?"rtl":"ltr",transform:g?`translateY(${te}px)`:`translateX(${te}px)`,transition:r.isAnimating?"transform 0.3s ease-in-out":"none",width:"100%"},onTransitionEnd:Ge,children:O.map(({index:a,content:l},C)=>{const T=g?y>0?{height:`${y}px`}:{flex:`1 0 ${100/p}%`}:{width:d>0?`${d}px`:"auto"},v=`slide-${a}`;return n.jsx("div",{"data-renderindex":C,"data-key":v,className:`${Qe}`,style:T,children:l},v)})})}),x?ne:re]})};z.__docgenInfo={description:"",methods:[],displayName:"Carousel",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},infinite:{required:!1,tsType:{name:"boolean"},description:""},itemsToShow:{required:!1,tsType:{name:"number"},description:""},itemsToMove:{required:!1,tsType:{name:"number"},description:""},enableAutoPlay:{required:!1,tsType:{name:"boolean"},description:""},autoPlaySpeed:{required:!1,tsType:{name:"number"},description:""},initialActiveIndex:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isRTL:{required:!1,tsType:{name:"boolean"},description:""},responsive:{required:!1,tsType:{name:"Record",elements:[{name:"number"},{name:"Omit",elements:[{name:"CarouselProps"},{name:"union",raw:"'children' | 'responsive'",elements:[{name:"literal",value:"'children'"},{name:"literal",value:"'responsive'"}]}],raw:`Omit<
  CarouselProps,
  'children' | 'responsive'
>`}],raw:"Record<number, CarouselResponsiveProps>"},description:""},verticalMode:{required:!1,tsType:{name:"boolean"},description:""}}};const ct={title:"Components/Carousel",component:z,tags:["autodocs"],args:{onNext:J(),onPrev:J()}},Ee=()=>{const[t,e]=I.useState(new Date().toLocaleTimeString());return I.useLayoutEffect(()=>{e(new Date().toLocaleTimeString())},[]),n.jsx("div",{children:`Generated at: ${t}`})},$=({color:t,title:e,details:s})=>n.jsxs("div",{className:"example-slide-content",style:{backgroundColor:t},children:[n.jsx("h2",{className:"example-slide-title",children:e}),n.jsx("div",{className:"example-slide-details",children:s})]}),Be=({children:t,direction:e})=>{const s={horizontal:"↔",vertical:"↕",both:"↔↕"};return n.jsxs("div",{style:{resize:e,overflow:"hidden",padding:"20px",border:"1px dashed #ccc",minWidth:"300px",maxWidth:"100%",position:"relative"},children:[t,n.jsx("div",{className:"resizable-hint",children:`${s[e]} Drag to resize`})]})},N=t=>`hsl(${t*20%360}, 70%, 80%)`,R={args:{children:Array.from({length:12},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsx(Ee,{})},e))}},q={args:{...R.args,infinite:!0}},j={args:{infinite:!0,itemsToShow:3,children:Array.from({length:25},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsx(Ee,{})},e))}},E={args:{...j.args,itemsToMove:3}},B={args:{...R.args,isRTL:!0}},L={render:t=>n.jsx(Be,{direction:"horizontal",children:n.jsx(z,{...t})}),args:{responsive:{300:{itemsToShow:1,itemsToMove:1,infinite:!0},600:{itemsToShow:2,itemsToMove:1,infinite:!0},900:{itemsToShow:3,itemsToMove:1},1200:{itemsToShow:4,itemsToMove:2}},children:Array.from({length:10},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsxs(n.Fragment,{children:[n.jsx("p",{children:"Resize container horizontally to see responsive behavior"}),n.jsxs("p",{children:[n.jsx("strong",{children:"Breakpoints:"})," 300px, 600px, 900px, 1200px"]})]})},e))},parameters:{docs:{description:{story:"Horizontal carousel with resizable container to demonstrate responsive behavior. Drag the right edge to resize."}}}},V={args:{...R.args,enableAutoPlay:!0,autoPlaySpeed:3e3,infinite:!0},parameters:{docs:{description:{story:"Carousel with auto-play enabled, advancing every 3 seconds"}}}},W={args:{...R.args,initialActiveIndex:5},parameters:{docs:{description:{story:"Carousel starting at slide 6 (index 5) instead of the first slide"}}}},st=t=>{const[e,s]=I.useState(0);return n.jsxs("div",{children:[n.jsxs("div",{style:{marginBottom:"20px",padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"},children:[n.jsx("strong",{children:"Current Slide:"})," ",e+1]}),n.jsx(z,{...t,onChange:r=>{var m;s(r),(m=t.onChange)==null||m.call(t,r)}})]})},H={render:t=>n.jsx(st,{...t}),args:{...R.args,onChange:J()},parameters:{docs:{description:{story:"Demonstrates the onChange callback that fires when the active slide changes"}}}},F={args:{verticalMode:!0,infinite:!0,itemsToShow:2,itemsToMove:1,children:Array.from({length:8},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:"Vertical scrolling example"},e))},parameters:{docs:{description:{story:"Carousel in vertical mode, showing multiple slides at a time with vertical alignment"}}}},G={render:t=>n.jsx(Be,{direction:"vertical",children:n.jsx(z,{...t})}),args:{verticalMode:!0,responsive:{300:{itemsToShow:1,itemsToMove:1,verticalMode:!0,infinite:!0},500:{itemsToShow:2,itemsToMove:1,verticalMode:!0,infinite:!0},700:{itemsToShow:3,itemsToMove:1,verticalMode:!0}},children:Array.from({length:8},(t,e)=>n.jsx($,{title:`Slide ${e+1}`,color:N(e),details:n.jsxs(n.Fragment,{children:[n.jsx("p",{children:"Resize container to see responsive behavior"}),n.jsxs("p",{children:[n.jsx("strong",{children:"Breakpoints:"})," 300px, 500px, 700px"]})]})},e))},parameters:{docs:{description:{story:"Vertical carousel with resizable container to demonstrate responsive behavior. Drag the bottom-right corner to resize both width and height."}}}};var oe,ae,ce;R.parameters={...R.parameters,docs:{...(oe=R.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    children: Array.from({
      length: 12
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(ce=(ae=R.parameters)==null?void 0:ae.docs)==null?void 0:ce.source}}};var le,de,ue;q.parameters={...q.parameters,docs:{...(le=q.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    infinite: true
  }
}`,...(ue=(de=q.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,he,ge;j.parameters={...j.parameters,docs:{...(me=j.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    infinite: true,
    itemsToShow: 3,
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(ge=(he=j.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};var pe,fe,xe;E.parameters={...E.parameters,docs:{...(pe=E.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3
  }
}`,...(xe=(fe=E.parameters)==null?void 0:fe.docs)==null?void 0:xe.source}}};var ve,ye,Se;B.parameters={...B.parameters,docs:{...(ve=B.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isRTL: true
  }
}`,...(Se=(ye=B.parameters)==null?void 0:ye.docs)==null?void 0:Se.source}}};var Ce,Te,be;L.parameters={...L.parameters,docs:{...(Ce=L.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
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
}`,...(be=(Te=L.parameters)==null?void 0:Te.docs)==null?void 0:be.source}}};var Re,we,Me;V.parameters={...V.parameters,docs:{...(Re=V.parameters)==null?void 0:Re.docs,source:{originalSource:`{
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
}`,...(Me=(we=V.parameters)==null?void 0:we.docs)==null?void 0:Me.source}}};var ke,Ae,je;W.parameters={...W.parameters,docs:{...(ke=W.parameters)==null?void 0:ke.docs,source:{originalSource:`{
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
}`,...(je=(Ae=W.parameters)==null?void 0:Ae.docs)==null?void 0:je.source}}};var Ie,ze,$e;H.parameters={...H.parameters,docs:{...(Ie=H.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
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
}`,...($e=(ze=H.parameters)==null?void 0:ze.docs)==null?void 0:$e.source}}};var Ne,Pe,Oe;F.parameters={...F.parameters,docs:{...(Ne=F.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
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
}`,...(Oe=(Pe=F.parameters)==null?void 0:Pe.docs)==null?void 0:Oe.source}}};var De,_e,qe;G.parameters={...G.parameters,docs:{...(De=G.parameters)==null?void 0:De.docs,source:{originalSource:`{
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
}`,...(qe=(_e=G.parameters)==null?void 0:_e.docs)==null?void 0:qe.source}}};const lt=["Default","InfiniteScroll","MultipleSlides","MultipleScrolling","RTLCarousel","ResponsiveCarouselHorizontal","AutoPlayCarousel","InitialActiveIndex","WithOnChangeCallback","VerticalCarousel","ResponsiveCarouselVertical"];export{V as AutoPlayCarousel,R as Default,q as InfiniteScroll,W as InitialActiveIndex,E as MultipleScrolling,j as MultipleSlides,B as RTLCarousel,L as ResponsiveCarouselHorizontal,G as ResponsiveCarouselVertical,F as VerticalCarousel,H as WithOnChangeCallback,lt as __namedExportsOrder,ct as default};
