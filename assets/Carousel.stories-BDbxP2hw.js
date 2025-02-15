import{j as o}from"./jsx-runtime-SKoiH9zj.js";import{f as z}from"./index-cNkFZXRj.js";import{r as d,R as E}from"./index-DJO9vBfz.js";var ge="gt3gyc5 gt3gyc3",he="gt3gyc4 gt3gyc3",L="gt3gyc0",$="gt3gyc2",fe="gt3gyc1";const xe=({currentIndex:t,totalItems:n,itemsToShow:a,itemsToMove:e,circular:p})=>{if(!p){const s=Math.max(0,t-e),u=Math.min(n,t+a+e);return Array.from({length:u-s},(c,k)=>s+k)}const r=[],f=s=>(s%n+n)%n;for(let s=0;s<e;s++){const u=f(t-e+s);r.push(u)}for(let s=0;s<a;s++){const u=f(t+s);r.push(u)}for(let s=0;s<e;s++){const u=f(t+a+s);r.push(u)}return r},ve=({currentIndex:t,totalItems:n,itemsToShow:a,itemsToMove:e,slideWidth:p,itemsToRenderCount:r,circular:f,animationOffset:s,isRTL:u})=>{let c=0;return f?c=-p*e:t===0?c=0:t>=n-a?c=-p*(r-a):c=-p*e,u?-(c+s):c+s},Se=(t,n,a)=>{if(!n||a===0)return t;const p=Object.keys(n).map(Number).sort((r,f)=>f-r).find(r=>a>=r);return p?{...t,...n[p]}:t},N=({children:t,responsive:n,...a})=>{if(!t)return console.warn("Carousel: children must be provided"),null;const[e,p]=d.useState({currentIndex:a.initialActiveIndex||0,trackOffset:0,isAnimating:!1,direction:null}),r=E.Children.count(t),f=E.Children.toArray(t),s=d.useRef(null),u=d.useRef(null),[c,k]=d.useState(0),[D,oe]=d.useState(0),[A,ce]=d.useState(0),[ye,be]=d.useState(null),le=d.useMemo(()=>Se(a,n,A),[a,n,A]),{itemsToShow:g=1,itemsToMove:m=1,infinite:x=!1,enableAutoPlay:Re=!1,autoPlaySpeed:Te=3e3,isRTL:h=!1}=le;d.useEffect(()=>{if(!s.current||!u.current)return;const i=new ResizeObserver(l=>{l.forEach(v=>{const j=v.target;if(j.classList.contains(L)&&(k(v.contentRect.width/g),ce(v.contentRect.width)),j.classList.contains($)){const _=j.firstElementChild;_&&oe(Math.ceil(_.getBoundingClientRect().height))}})});return i.observe(s.current),i.observe(u.current),()=>i.disconnect()},[g,A]);const q=d.useMemo(()=>xe({currentIndex:e.currentIndex,totalItems:r,itemsToShow:g,itemsToMove:m,circular:x}).map(l=>({index:l,content:f[l]})),[e.currentIndex,r,g,m,x,f]),R=d.useCallback(i=>h?-i:i,[h]),de=d.useCallback(()=>{var i;e.isAnimating||!x&&(h?e.currentIndex===0:e.currentIndex>=r-g)||(p(l=>({...l,direction:"next",isAnimating:!0,trackOffset:R(-c*m)})),(i=a.onNext)==null||i.call(a))},[e.isAnimating,e.currentIndex,c,m,x,r,g,a.onNext,R,h]),ue=d.useCallback(()=>{var i;e.isAnimating||!x&&(h?e.currentIndex>=r-g:e.currentIndex===0)||(p(l=>({...l,direction:"prev",isAnimating:!0,trackOffset:R(c*m)})),(i=a.onPrev)==null||i.call(a))},[e.isAnimating,e.currentIndex,c,m,x,a.onPrev,R,r,g,h]),me=d.useCallback(()=>{p(i=>{let l;return h?l=i.direction==="next"?(i.currentIndex-m+r)%r:(i.currentIndex+m)%r:l=i.direction==="next"?(i.currentIndex+m)%r:(i.currentIndex-m+r)%r,{currentIndex:l,trackOffset:0,isAnimating:!1,direction:null}})},[m,r,h]),pe=ve({currentIndex:e.currentIndex,totalItems:r,itemsToShow:g,itemsToMove:m,slideWidth:c,itemsToRenderCount:q.length,circular:x,animationOffset:e.trackOffset,isRTL:h});return o.jsxs("div",{ref:s,className:L,dir:h?"rtl":"ltr",children:[o.jsx("button",{onClick:ue,className:he,disabled:!x&&(h?e.currentIndex>=r-g:e.currentIndex===0),children:"←"}),o.jsx("div",{className:fe,style:{transform:`translate3d(${pe}px, 0, 0)`,transition:e.isAnimating?"transform 0.3s ease-in-out":"none",width:c?`${c*(g+2*m)}px`:"auto",height:D?`${D}px`:"auto"},onTransitionEnd:me,children:q.map(({index:i,content:l},v)=>o.jsx("div",{ref:v===0?u:void 0,className:$,style:{width:`${c}px`},children:l},`slide-${i}-${v}`))}),o.jsx("button",{onClick:de,className:ge,disabled:!x&&(h?e.currentIndex===0:e.currentIndex>=r-g),children:"→"})]})};N.__docgenInfo={description:"",methods:[],displayName:"Carousel",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},infinite:{required:!1,tsType:{name:"boolean"},description:""},itemsToShow:{required:!1,tsType:{name:"number"},description:""},itemsToMove:{required:!1,tsType:{name:"number"},description:""},enableAutoPlay:{required:!1,tsType:{name:"boolean"},description:""},autoPlaySpeed:{required:!1,tsType:{name:"number"},description:""},initialActiveIndex:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isRTL:{required:!1,tsType:{name:"boolean"},description:""},responsive:{required:!1,tsType:{name:"Record",elements:[{name:"number"},{name:"Omit",elements:[{name:"CarouselProps"},{name:"union",raw:"'children' | 'responsive'",elements:[{name:"literal",value:"'children'"},{name:"literal",value:"'responsive'"}]}],raw:`Omit<
  CarouselProps,
  'children' | 'responsive'
>`}],raw:"Record<number, CarouselResponsiveProps>"},description:""}}};const ke={title:"Components/Carousel",component:N,tags:["autodocs"],args:{onNext:z(),onPrev:z()}},O=({color:t,children:n})=>o.jsx("div",{className:"slide-content",style:{backgroundColor:t},children:n}),M=t=>`hsl(${t*20%360}, 70%, 80%)`,S={args:{children:Array.from({length:25},(t,n)=>o.jsxs(O,{color:M(n),children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsxs("p",{children:["Generated at: ",new Date().toISOString()]})]},n))}},T={args:{...S.args,infinite:!0}},y={args:{infinite:!0,itemsToShow:3,children:Array.from({length:25},(t,n)=>o.jsx(O,{color:M(n),children:o.jsxs("div",{className:"slide-content",children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsxs("div",{className:"slide-details",children:[o.jsxs("p",{children:["Slide ID: ",Math.random().toString(36).substring(7)]}),o.jsxs("p",{children:["Generated at: ",new Date().toISOString()]})]})]})},n))}},C={args:{...y.args,itemsToMove:3}},w={args:{...S.args,isRTL:!0}},b={args:{responsive:{300:{itemsToShow:1,itemsToMove:1,infinite:!0},800:{itemsToShow:2,itemsToMove:2,infinite:!0},1200:{itemsToShow:4}},children:Array.from({length:10},(t,n)=>o.jsxs(O,{color:M(n),children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsx("p",{children:"Resize container to see responsive behavior"})]},n))},parameters:{docs:{description:{story:"Demonstrates responsive behavior based on container width"}}}},I={render:t=>o.jsx("div",{style:{resize:"horizontal",overflow:"hidden",padding:"20px",border:"1px dashed #ccc"},children:o.jsx(N,{...t})}),args:{...b.args}};var B,G,H;S.parameters={...S.parameters,docs:{...(B=S.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)}>
        <h2>Slide {i + 1}</h2>
        <p>Generated at: {new Date().toISOString()}</p>
      </Slide>)
  }
}`,...(H=(G=S.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var W,F,J;T.parameters={...T.parameters,docs:{...(W=T.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    infinite: true
  }
}`,...(J=(F=T.parameters)==null?void 0:F.docs)==null?void 0:J.source}}};var K,P,Q;y.parameters={...y.parameters,docs:{...(K=y.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    infinite: true,
    itemsToShow: 3,
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)}>
        <div className="slide-content">
          <h2>Slide {i + 1}</h2>
          <div className="slide-details">
            <p>Slide ID: {Math.random().toString(36).substring(7)}</p>
            <p>Generated at: {new Date().toISOString()}</p>
          </div>
        </div>
      </Slide>)
  }
}`,...(Q=(P=y.parameters)==null?void 0:P.docs)==null?void 0:Q.source}}};var U,V,X;C.parameters={...C.parameters,docs:{...(U=C.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3
  }
}`,...(X=(V=C.parameters)==null?void 0:V.docs)==null?void 0:X.source}}};var Y,Z,ee;w.parameters={...w.parameters,docs:{...(Y=w.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isRTL: true
  }
}`,...(ee=(Z=w.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ne,re,te;b.parameters={...b.parameters,docs:{...(ne=b.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    responsive: {
      300: {
        itemsToShow: 1,
        itemsToMove: 1,
        infinite: true
      },
      800: {
        itemsToShow: 2,
        itemsToMove: 2,
        infinite: true
      },
      1200: {
        itemsToShow: 4
      }
    },
    children: Array.from({
      length: 10
    }, (_, i) => <Slide key={i} color={generateColor(i)}>
        <h2>Slide {i + 1}</h2>
        <p>Resize container to see responsive behavior</p>
      </Slide>)
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates responsive behavior based on container width'
      }
    }
  }
}`,...(te=(re=b.parameters)==null?void 0:re.docs)==null?void 0:te.source}}};var se,ie,ae;I.parameters={...I.parameters,docs:{...(se=I.parameters)==null?void 0:se.docs,source:{originalSource:`{
  render: args => <div style={{
    resize: 'horizontal',
    overflow: 'hidden',
    padding: '20px',
    border: '1px dashed #ccc'
  }}>
      <Carousel {...args} />
    </div>,
  args: {
    ...ResponsiveCarousel.args
  }
}`,...(ae=(ie=I.parameters)==null?void 0:ie.docs)==null?void 0:ae.source}}};const Ae=["Default","InfiniteScroll","MultipleSlides","MultipleScrolling","RTLCarousel","ResponsiveCarousel","ResizableContainer"];export{S as Default,T as InfiniteScroll,C as MultipleScrolling,y as MultipleSlides,w as RTLCarousel,I as ResizableContainer,b as ResponsiveCarousel,Ae as __namedExportsOrder,ke as default};
