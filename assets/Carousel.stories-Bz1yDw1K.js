import{j as o}from"./jsx-runtime-SKoiH9zj.js";import{f as E}from"./index-cNkFZXRj.js";import{r as l,R as $}from"./index-DJO9vBfz.js";var he="gt3gyc5 gt3gyc3",fe="gt3gyc4 gt3gyc3",G="gt3gyc0",B="gt3gyc2",xe="gt3gyc1";const ve=({currentIndex:t,totalItems:n,itemsToShow:s,itemsToMove:e,circular:m})=>{if(!m){const r=Math.max(0,t-e),f=Math.min(n,t+s+e);return Array.from({length:f-r},(x,k)=>r+k)}const c=[],h=r=>(r%n+n)%n;for(let r=0;r<e;r++){const f=h(t-e+r);c.push(f)}for(let r=0;r<s;r++){const f=h(t+r);c.push(f)}for(let r=0;r<e;r++){const f=h(t+s+r);c.push(f)}return c},Se=({currentIndex:t,totalItems:n,itemsToShow:s,itemsToMove:e,slideWidth:m,itemsToRenderCount:c,circular:h,animationOffset:r,isRTL:f})=>{let x=0;return h?x=-m*e:t===0?x=0:t>=n-s?x=-m*(c-s):x=-m*e,f?-(x+r):x+r},ye=(t,n,s)=>{if(!n||s===0)return t;const m=Object.keys(n).map(Number).sort((c,h)=>h-c).find(c=>s>=c);return m?{...t,...n[m]}:t},O=({children:t,responsive:n,...s})=>{const[e,m]=l.useState({currentIndex:s.initialActiveIndex||0,trackOffset:0,isAnimating:!1,direction:null}),c=l.useRef(null),h=l.useRef(null),[r,f]=l.useState(0),[x,k]=l.useState(0),[A,de]=l.useState(0),[p]=l.useState(s.isRTL||!1),D=t||[],a=$.Children.count(D),_=$.Children.toArray(D),le=l.useMemo(()=>ye(s,n,A),[s,n,A]),{itemsToShow:g=1,itemsToMove:u=1,infinite:v=!1}=le,T=l.useCallback(i=>p?-i:i,[p]),ue=l.useCallback(()=>{var i;e.isAnimating||!v&&(p?e.currentIndex===0:e.currentIndex>=a-g)||(m(d=>({...d,direction:"next",isAnimating:!0,trackOffset:T(-r*u)})),(i=s.onNext)==null||i.call(s))},[e.isAnimating,e.currentIndex,r,u,v,a,g,s,T,p]),me=l.useCallback(()=>{var i;e.isAnimating||!v&&(p?e.currentIndex>=a-g:e.currentIndex===0)||(m(d=>({...d,direction:"prev",isAnimating:!0,trackOffset:T(r*u)})),(i=s.onPrev)==null||i.call(s))},[e.isAnimating,e.currentIndex,r,u,v,a,g,s,T,p]);l.useEffect(()=>{if(!c.current||!h.current)return;const i=new ResizeObserver(d=>{d.forEach(S=>{const N=S.target;if(N.classList.contains(G)&&(f(S.contentRect.width/g),de(S.contentRect.width)),N.classList.contains(B)){const L=N.firstElementChild;L&&k(Math.ceil(L.getBoundingClientRect().height))}})});return i.observe(c.current),i.observe(h.current),()=>i.disconnect()},[g,A]);const z=l.useMemo(()=>ve({currentIndex:e.currentIndex,totalItems:a,itemsToShow:g,itemsToMove:u,circular:v}).map(d=>({index:d,content:_[d]})),[e.currentIndex,a,g,u,v,_]),pe=l.useCallback(()=>{m(i=>{let d;return p?d=i.direction==="next"?(i.currentIndex-u+a)%a:(i.currentIndex+u)%a:d=i.direction==="next"?(i.currentIndex+u)%a:(i.currentIndex-u+a)%a,{currentIndex:d,trackOffset:0,isAnimating:!1,direction:null}})},[u,a,p]),ge=Se({currentIndex:e.currentIndex,totalItems:a,itemsToShow:g,itemsToMove:u,slideWidth:r,itemsToRenderCount:z.length,circular:v,animationOffset:e.trackOffset,isRTL:p});return t?o.jsxs("div",{ref:c,className:G,dir:p?"rtl":"ltr",children:[o.jsx("button",{onClick:me,className:fe,disabled:!v&&(p?e.currentIndex>=a-g:e.currentIndex===0),children:"←"}),o.jsx("div",{className:xe,style:{transform:`translate3d(${ge}px, 0, 0)`,transition:e.isAnimating?"transform 0.3s ease-in-out":"none",width:r?`${r*(g+2*u)}px`:"auto",height:x?`${x}px`:"auto"},onTransitionEnd:pe,children:z.map(({index:i,content:d},S)=>o.jsx("div",{ref:S===0?h:void 0,className:B,style:{width:`${r}px`},children:d},`slide-${i}-${S}`))}),o.jsx("button",{onClick:ue,className:he,disabled:!v&&(p?e.currentIndex===0:e.currentIndex>=a-g),children:"→"})]}):(console.warn("Carousel component requires children"),null)};O.__docgenInfo={description:"",methods:[],displayName:"Carousel",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},infinite:{required:!1,tsType:{name:"boolean"},description:""},itemsToShow:{required:!1,tsType:{name:"number"},description:""},itemsToMove:{required:!1,tsType:{name:"number"},description:""},enableAutoPlay:{required:!1,tsType:{name:"boolean"},description:""},autoPlaySpeed:{required:!1,tsType:{name:"number"},description:""},initialActiveIndex:{required:!1,tsType:{name:"number"},description:""},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(index: number) => void",signature:{arguments:[{type:{name:"number"},name:"index"}],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onPrev:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},isRTL:{required:!1,tsType:{name:"boolean"},description:""},responsive:{required:!1,tsType:{name:"Record",elements:[{name:"number"},{name:"Omit",elements:[{name:"CarouselProps"},{name:"union",raw:"'children' | 'responsive'",elements:[{name:"literal",value:"'children'"},{name:"literal",value:"'responsive'"}]}],raw:`Omit<
  CarouselProps,
  'children' | 'responsive'
>`}],raw:"Record<number, CarouselResponsiveProps>"},description:""}}};const Ce={title:"Components/Carousel",component:O,tags:["autodocs"],args:{onNext:E(),onPrev:E()}},M=({color:t,children:n})=>o.jsx("div",{className:"slide-content",style:{backgroundColor:t},children:n}),q=t=>`hsl(${t*20%360}, 70%, 80%)`,y={args:{children:Array.from({length:25},(t,n)=>o.jsxs(M,{color:q(n),children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsxs("p",{children:["Generated at: ",new Date().toISOString()]})]},n))}},C={args:{...y.args,infinite:!0}},b={args:{infinite:!0,itemsToShow:3,children:Array.from({length:25},(t,n)=>o.jsx(M,{color:q(n),children:o.jsxs("div",{className:"slide-content",children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsxs("div",{className:"slide-details",children:[o.jsxs("p",{children:["Slide ID: ",Math.random().toString(36).substring(7)]}),o.jsxs("p",{children:["Generated at: ",new Date().toISOString()]})]})]})},n))}},w={args:{...b.args,itemsToMove:3}},I={args:{...y.args,isRTL:!0}},R={args:{responsive:{300:{itemsToShow:1,itemsToMove:1,infinite:!0},800:{itemsToShow:2,itemsToMove:2,infinite:!0},1200:{itemsToShow:4}},children:Array.from({length:10},(t,n)=>o.jsxs(M,{color:q(n),children:[o.jsxs("h2",{children:["Slide ",n+1]}),o.jsx("p",{children:"Resize container to see responsive behavior"})]},n))},parameters:{docs:{description:{story:"Demonstrates responsive behavior based on container width"}}}},j={render:t=>o.jsx("div",{style:{resize:"horizontal",overflow:"hidden",padding:"20px",border:"1px dashed #ccc"},children:o.jsx(O,{...t})}),args:{...R.args}};var H,W,F;y.parameters={...y.parameters,docs:{...(H=y.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    children: Array.from({
      length: 25
    }, (_, i) => <Slide key={i} color={generateColor(i)}>
        <h2>Slide {i + 1}</h2>
        <p>Generated at: {new Date().toISOString()}</p>
      </Slide>)
  }
}`,...(F=(W=y.parameters)==null?void 0:W.docs)==null?void 0:F.source}}};var J,K,Q;C.parameters={...C.parameters,docs:{...(J=C.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    infinite: true
  }
}`,...(Q=(K=C.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,V,X;b.parameters={...b.parameters,docs:{...(U=b.parameters)==null?void 0:U.docs,source:{originalSource:`{
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
}`,...(X=(V=b.parameters)==null?void 0:V.docs)==null?void 0:X.source}}};var Y,Z,P;w.parameters={...w.parameters,docs:{...(Y=w.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    ...MultipleSlides.args,
    itemsToMove: 3
  }
}`,...(P=(Z=w.parameters)==null?void 0:Z.docs)==null?void 0:P.source}}};var ee,ne,re;I.parameters={...I.parameters,docs:{...(ee=I.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    isRTL: true
  }
}`,...(re=(ne=I.parameters)==null?void 0:ne.docs)==null?void 0:re.source}}};var te,se,ie;R.parameters={...R.parameters,docs:{...(te=R.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ie=(se=R.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var oe,ae,ce;j.parameters={...j.parameters,docs:{...(oe=j.parameters)==null?void 0:oe.docs,source:{originalSource:`{
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
}`,...(ce=(ae=j.parameters)==null?void 0:ae.docs)==null?void 0:ce.source}}};const we=["Default","InfiniteScroll","MultipleSlides","MultipleScrolling","RTLCarousel","ResponsiveCarousel","ResizableContainer"];export{y as Default,C as InfiniteScroll,w as MultipleScrolling,b as MultipleSlides,I as RTLCarousel,j as ResizableContainer,R as ResponsiveCarousel,we as __namedExportsOrder,Ce as default};
