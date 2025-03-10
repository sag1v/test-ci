import{j as n}from"./jsx-runtime-SKoiH9zj.js";import{r as c,R as I}from"./index-DJO9vBfz.js";import{f as K}from"./index-cNkFZXRj.js";var Fe="gt3gyc1",Ge="gt3gyc5",Xe="gt3gyc5",Ye="gt3gyc0",Je="gt3gyc4",Ke="gt3gyc2",Qe="gt3gyc3";const Ue=({currentIndex:t,totalItems:e,itemsToShow:s,itemsToMove:r,circular:u})=>{if(!u){const i=Math.max(0,t-r),m=Math.min(e,t+s+r);return Array.from({length:m-i},(P,x)=>i+x)}const o=[],d=i=>(i%e+e)%e;for(let i=0;i<r;i++){const m=d(t-r+i);o.push(m)}for(let i=0;i<s;i++){const m=d(t+i);o.push(m)}for(let i=0;i<r;i++){const m=d(t+s+i);o.push(m)}return o},Ze=({currentIndex:t,totalItems:e,itemsToShow:s,itemsToMove:r,slideWidth:u,slideHeight:o=0,itemsToRenderCount:d,circular:i,animationOffset:m,isRTL:P,isVertical:x=!1})=>{const M=x?o:u;if(!M||M<=0)return 0;let y=0;i?y=-M*r:t===0?y=0:t>=e-s?y=-M*(d-s):y=-M*r;const O=y+m;return!x&&P?-O:O},et=(t,e,s)=>{if(!e||s===0)return t;const u=Object.keys(e).map(Number).sort((o,d)=>d-o).find(o=>s>=o);return u?{...t,...e[u]}:t},tt=(t,e,s)=>{const r=c.useRef(),u=c.useCallback(()=>{t&&(r.current=setInterval(s,e))},[t,e,s]),o=c.useCallback(()=>{r.current&&clearInterval(r.current)},[]);return c.useEffect(()=>(t&&u(),o),[t,u,o]),{startAutoPlay:u,stopAutoPlay:o}},z=({children:t,responsive:e,...s})=>{const[r,u]=c.useState({currentIndex:s.initialActiveIndex||0,trackOffset:0,isAnimating:!1,direction:null}),o=c.useRef(null),d=c.useRef(null),i=c.useRef(null),[m,P]=c.useState(0),[x,M]=c.useState(0),[y,O]=c.useState(0),[b]=c.useState(s.isRTL||!1),Q=t||[],p=I.Children.count(Q),U=I.Children.toArray(Q),Ee=c.useMemo(()=>et(s,e,y),[s,e,y]),{infinite:w=!1,itemsToShow:f=1,itemsToMove:h=1,enableAutoPlay:k=!1,autoPlaySpeed:Le=3e3,verticalMode:g=!1}=Ee,{onNext:Y,onPrev:J}=s,D=c.useMemo(()=>Ue({currentIndex:r.currentIndex,totalItems:p,itemsToShow:f,itemsToMove:h,circular:w}).map(l=>({index:l,content:U[l]})),[r.currentIndex,p,f,h,w,U]),Z=c.useCallback(()=>{if(r.isAnimating)return;Y&&Y();const a=g?-x:-m;u(l=>({...l,trackOffset:a*h,isAnimating:!0,direction:"next"}))},[r.isAnimating,Y,h,m,x,g]),Be=c.useCallback(()=>{if(r.isAnimating)return;J&&J();const a=g?x:m;u(l=>({...l,trackOffset:a*h,isAnimating:!0,direction:"prev"}))},[r.isAnimating,J,h,m,x,g]),{startAutoPlay:_,stopAutoPlay:ee}=tt(k,Le,Z),Ve=c.useCallback(()=>{k&&ee()},[k,ee]),He=c.useCallback(()=>{k&&_()},[k,_]);c.useEffect(()=>{if(!o.current||!d.current)return;const a=S=>{if(!d.current||!o.current)return;let C,v;if(S&&S.length>0){const T=S.find(q=>q.target===o.current),A=S.find(q=>q.target===d.current);T?C={width:T.contentRect.width,height:T.contentRect.height}:C=o.current.getBoundingClientRect(),A?v={width:A.contentRect.width,height:A.contentRect.height}:v=d.current.getBoundingClientRect()}else C=o.current.getBoundingClientRect(),v=d.current.getBoundingClientRect();if(O(C.width),!g&&v.width>0&&f>0){const T=Math.floor(v.width/f);P(T>0?T:0)}if(g&&i.current){const T=D.length;if(T===0)return;const A=i.current.style.cssText;i.current.style.cssText="position: absolute; transform: none; transition: none; visibility: visible; height: auto;";const ne=i.current.getBoundingClientRect().height;if(i.current.style.cssText=A,ne>0&&T>0){const re=Math.ceil(ne/T);M(re),d.current&&f>0&&(d.current.style.height=`${re*f}px`)}}};a();const l=new ResizeObserver(S=>{const C=S.find(v=>v.target===o.current);((C==null?void 0:C.contentRect.width)!==y||S.some(v=>v.target===d.current)&&!g)&&a(S)});return l.observe(o.current),l.observe(d.current),()=>{l.disconnect()}},[f,g,y,D.length]);const We=c.useCallback(()=>{r.isAnimating&&u(a=>{let l=a.currentIndex;return a.direction==="next"?(l=b?Math.max(0,a.currentIndex-h):Math.min(p-f,a.currentIndex+h),w&&(l=b?(a.currentIndex-h+p)%p:(a.currentIndex+h)%p)):a.direction==="prev"&&(l=b?Math.min(p-f,a.currentIndex+h):Math.max(0,a.currentIndex-h),w&&(l=b?(a.currentIndex+h)%p:(a.currentIndex-h+p)%p)),s.onChange&&l!==a.currentIndex&&s.onChange(l),{currentIndex:l,trackOffset:0,isAnimating:!1,direction:null}})},[h,p,b,s,w,f,r.isAnimating]),te=Ze({currentIndex:r.currentIndex,totalItems:p,itemsToShow:f,itemsToMove:h,slideWidth:m,slideHeight:x,itemsToRenderCount:D.length,circular:w,animationOffset:r.trackOffset,isRTL:b,isVertical:g});return c.useEffect(()=>{k&&_()},[k,_]),t?n.jsxs("div",{ref:o,className:Ye,dir:b?"rtl":"ltr",onMouseEnter:Ve,onMouseLeave:He,style:{height:"100%"},children:[n.jsx("button",{onClick:Be,className:Xe,disabled:!w&&(b?r.currentIndex>=p-f:r.currentIndex<=0),"aria-label":g?"Previous slide (up)":"Previous slide",children:g?"↑":"←"}),n.jsx("div",{className:Fe,ref:d,children:n.jsx("div",{ref:i,className:`${Ke} ${g?Qe:""}`,style:{transform:g?`translateY(${te}px)`:`translateX(${te}px)`,transition:r.isAnimating?"transform 0.3s ease-in-out":"none",width:"100%"},onTransitionEnd:We,children:D.map(({index:a,content:l},S)=>{const C=g?x>0?{height:`${x}px`}:{flex:`1 0 ${100/f}%`}:{width:m>0?`${m}px`:"auto"},v=`slide-${a}`;return n.jsx("div",{"data-renderindex":S,"data-key":v,className:`${Je}`,style:C,children:l},v)})})}),n.jsx("button",{onClick:Z,className:Ge,disabled:!w&&(b?r.currentIndex<=0:r.currentIndex>=p-f),"aria-label":g?"Next slide (down)":"Next slide",children:g?"↓":"→"})]}):(console.warn("Carousel component requires children"),null)};z.__docgenInfo={description:"",methods:[],displayName:"Carousel",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},infinite:{required:!1,tsType:{name:"boolean"},description:""},itemsToShow:{required:!1,tsType:{name:"number"},description:""},itemsToMove:{required:!1,tsType:{name:"number"},description:""},enableAutoPlay:{required:!1,tsType:{name:"boolean"},description:""},autoPlaySpeed:{required:!1,tsType:{name:"number"},description:""},initialActiveIndex:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isRTL:{required:!1,tsType:{name:"boolean"},description:""},responsive:{required:!1,tsType:{name:"Record",elements:[{name:"number"},{name:"Omit",elements:[{name:"CarouselProps"},{name:"union",raw:"'children' | 'responsive'",elements:[{name:"literal",value:"'children'"},{name:"literal",value:"'responsive'"}]}],raw:`Omit<
  CarouselProps,
  'children' | 'responsive'
>`}],raw:"Record<number, CarouselResponsiveProps>"},description:""},verticalMode:{required:!1,tsType:{name:"boolean"},description:""}}};const ot={title:"Components/Carousel",component:z,tags:["autodocs"],args:{onNext:K(),onPrev:K()}},_e=()=>{const[t,e]=I.useState(new Date().toLocaleTimeString());return I.useLayoutEffect(()=>{e(new Date().toLocaleTimeString())},[]),n.jsx("div",{children:`Generated at: ${t}`})},$=({color:t,title:e,details:s})=>n.jsxs("div",{className:"example-slide-content",style:{backgroundColor:t},children:[n.jsx("h2",{className:"example-slide-title",children:e}),n.jsx("div",{className:"example-slide-details",children:s})]}),qe=({children:t,direction:e})=>{const s={horizontal:"↔",vertical:"↕",both:"↔↕"};return n.jsxs("div",{style:{resize:e,overflow:"hidden",padding:"20px",border:"1px dashed #ccc",minWidth:"300px",maxWidth:"100%",position:"relative"},children:[t,n.jsx("div",{className:"resizable-hint",children:`${s[e]} Drag to resize`})]})},N=t=>`hsl(${t*20%360}, 70%, 80%)`,R={args:{children:Array.from({length:12},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsx(_e,{})},e))}},E={args:{...R.args,infinite:!0}},j={args:{infinite:!0,itemsToShow:3,children:Array.from({length:25},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsx(_e,{})},e))}},L={args:{...j.args,itemsToMove:3}},B={args:{...R.args,isRTL:!0}},V={render:t=>n.jsx(qe,{direction:"horizontal",children:n.jsx(z,{...t})}),args:{responsive:{300:{itemsToShow:1,itemsToMove:1,infinite:!0},600:{itemsToShow:2,itemsToMove:1,infinite:!0},900:{itemsToShow:3,itemsToMove:1},1200:{itemsToShow:4,itemsToMove:2}},children:Array.from({length:10},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:n.jsxs(n.Fragment,{children:[n.jsx("p",{children:"Resize container horizontally to see responsive behavior"}),n.jsxs("p",{children:[n.jsx("strong",{children:"Breakpoints:"})," 300px, 600px, 900px, 1200px"]})]})},e))},parameters:{docs:{description:{story:"Horizontal carousel with resizable container to demonstrate responsive behavior. Drag the right edge to resize."}}}},H={args:{...R.args,enableAutoPlay:!0,autoPlaySpeed:3e3,infinite:!0},parameters:{docs:{description:{story:"Carousel with auto-play enabled, advancing every 3 seconds"}}}},W={args:{...R.args,initialActiveIndex:5},parameters:{docs:{description:{story:"Carousel starting at slide 6 (index 5) instead of the first slide"}}}},nt=t=>{const[e,s]=I.useState(0);return n.jsxs("div",{children:[n.jsxs("div",{style:{marginBottom:"20px",padding:"10px",backgroundColor:"#f0f0f0",borderRadius:"4px"},children:[n.jsx("strong",{children:"Current Slide:"})," ",e+1]}),n.jsx(z,{...t,onChange:r=>{var u;s(r),(u=t.onChange)==null||u.call(t,r)}})]})},F={render:t=>n.jsx(nt,{...t}),args:{...R.args,onChange:K()},parameters:{docs:{description:{story:"Demonstrates the onChange callback that fires when the active slide changes"}}}},G={args:{verticalMode:!0,infinite:!0,itemsToShow:2,itemsToMove:1,children:Array.from({length:8},(t,e)=>n.jsx($,{color:N(e),title:`Slide ${e+1}`,details:"Vertical scrolling example"},e))},parameters:{docs:{description:{story:"Carousel in vertical mode, showing multiple slides at a time with vertical alignment"}}}},X={render:t=>n.jsx(qe,{direction:"vertical",children:n.jsx(z,{...t})}),args:{verticalMode:!0,responsive:{300:{itemsToShow:1,itemsToMove:1,verticalMode:!0,infinite:!0},500:{itemsToShow:2,itemsToMove:1,verticalMode:!0,infinite:!0},700:{itemsToShow:3,itemsToMove:1,verticalMode:!0}},children:Array.from({length:8},(t,e)=>n.jsx($,{title:`Slide ${e+1}`,color:N(e),details:n.jsxs(n.Fragment,{children:[n.jsx("p",{children:"Resize container to see responsive behavior"}),n.jsxs("p",{children:[n.jsx("strong",{children:"Breakpoints:"})," 300px, 500px, 700px"]})]})},e))},parameters:{docs:{description:{story:"Vertical carousel with resizable container to demonstrate responsive behavior. Drag the bottom-right corner to resize both width and height."}}}};var se,ie,oe;R.parameters={...R.parameters,docs:{...(se=R.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    children: Array.from({
      length: 12
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(oe=(ie=R.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var ae,ce,le;E.parameters={...E.parameters,docs:{...(ae=E.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    infinite: true
  }
}`,...(le=(ce=E.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var de,ue,me;j.parameters={...j.parameters,docs:{...(de=j.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    infinite: true,
    itemsToShow: 3,
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)} title={\`Slide \${i + 1}\`} details={<TimeStamp />} />)
  }
}`,...(me=(ue=j.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var he,ge,pe;L.parameters={...L.parameters,docs:{...(he=L.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3
  }
}`,...(pe=(ge=L.parameters)==null?void 0:ge.docs)==null?void 0:pe.source}}};var fe,xe,ve;B.parameters={...B.parameters,docs:{...(fe=B.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isRTL: true
  }
}`,...(ve=(xe=B.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var ye,Se,Ce;V.parameters={...V.parameters,docs:{...(ye=V.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(Ce=(Se=V.parameters)==null?void 0:Se.docs)==null?void 0:Ce.source}}};var Te,be,Re;H.parameters={...H.parameters,docs:{...(Te=H.parameters)==null?void 0:Te.docs,source:{originalSource:`{
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
}`,...(Re=(be=H.parameters)==null?void 0:be.docs)==null?void 0:Re.source}}};var we,Me,ke;W.parameters={...W.parameters,docs:{...(we=W.parameters)==null?void 0:we.docs,source:{originalSource:`{
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
}`,...(ke=(Me=W.parameters)==null?void 0:Me.docs)==null?void 0:ke.source}}};var Ae,je,Ie;F.parameters={...F.parameters,docs:{...(Ae=F.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
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
}`,...(Ie=(je=F.parameters)==null?void 0:je.docs)==null?void 0:Ie.source}}};var ze,$e,Ne;G.parameters={...G.parameters,docs:{...(ze=G.parameters)==null?void 0:ze.docs,source:{originalSource:`{
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
}`,...(Ne=($e=G.parameters)==null?void 0:$e.docs)==null?void 0:Ne.source}}};var Pe,Oe,De;X.parameters={...X.parameters,docs:{...(Pe=X.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
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
}`,...(De=(Oe=X.parameters)==null?void 0:Oe.docs)==null?void 0:De.source}}};const at=["Default","InfiniteScroll","MultipleSlides","MultipleScrolling","RTLCarousel","ResponsiveCarouselHorizontal","AutoPlayCarousel","InitialActiveIndex","WithOnChangeCallback","VerticalCarousel","ResponsiveCarouselVertical"];export{H as AutoPlayCarousel,R as Default,E as InfiniteScroll,W as InitialActiveIndex,L as MultipleScrolling,j as MultipleSlides,B as RTLCarousel,V as ResponsiveCarouselHorizontal,X as ResponsiveCarouselVertical,G as VerticalCarousel,F as WithOnChangeCallback,at as __namedExportsOrder,ot as default};
