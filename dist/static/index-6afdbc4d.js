import{l as P,r as c,aP as f,j as t,Y as h,aQ as j,aR as B,h as E,Z as H,aS as k,W as I,F as C,aT as R,U as S}from"./sanity-7cc66208.js";const T=P(S)`
  position: relative;
`;function U(a){const{children:o}=a,{collapsed:n}=B();return t.jsx(T,{hidden:n,height:"fill",overflow:"auto",children:o})}function b(a){const{actionHandlers:o,index:n,menuItems:e,menuItemGroups:r,title:i}=a,{features:s}=E();return!(e!=null&&e.length)&&!i?null:t.jsx(H,{actions:t.jsx(k,{menuItems:e,menuItemGroups:r,actionHandlers:o}),backButton:s.backButton&&n>0&&t.jsx(I,{as:C,"data-as":"a",icon:R,mode:"bleed",tooltipProps:{content:"Back"}}),title:i})}function v(a){const{index:o,pane:n,paneKey:e,...r}=a,{child:i,component:s,menuItems:d,menuItemGroups:u,type:y,...p}=n,[l,m]=c.useState(null),{title:x=""}=f(n);return t.jsxs(h,{id:e,minWidth:320,selected:r.isSelected,children:[t.jsx(b,{actionHandlers:l==null?void 0:l.actionHandlers,index:o,menuItems:d,menuItemGroups:u,title:x}),t.jsxs(U,{children:[j.isValidElementType(s)&&c.createElement(s,{...r,...p,ref:m,child:i,paneKey:e}),c.isValidElement(s)&&s]})]})}export{v as default};
