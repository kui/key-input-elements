(function(a){function b(e){if(c[e])return c[e].exports;var k=c[e]={exports:{},id:e,loaded:!1};return a[e].call(k.exports,k,k.exports,b),k.loaded=!0,k.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)})([function(a,b,c){"use strict";var e=c(1),k=function(m){if(m&&m.__esModule)return m;var n={};if(null!=m)for(var o in m)Object.prototype.hasOwnProperty.call(m,o)&&(n[o]=m[o]);return n.default=m,n}(e);k.register()},function(a,b){"use strict";function c(v){return class extends v{get allowModOnly(){return this.hasAttribute("allow-mod-only")}set allowModOnly(w){p(this,"allow-mod-only",w)}get noMod(){return this.hasAttribute("no-mod")}set noMod(w){p(this,"no-mod",w)}get ignore(){var w=this.getAttribute("ignore");return null==w?null:new RegExp(w)}set ignore(w){null!=w&&this.setAttribute("ignore",w.toString())}get value(){return super.value}set value(w){super.value=w,this.select()}constructor(){super()}createdCallback(){this.type="text",this.addEventListener("keypress",w=>w.preventDefault(),!0),this.addEventListener("focus",()=>this.select())}attachedCallback(){}static get observedAttributes(){return["type"]}attributeChangedCallback(w){"type"===w?this.type="text":void 0}buildMatcher(){return new t(this.value,l(this))}}}function e(v){return class extends c(v){constructor(){super()}createdCallback(){super.createdCallback(),this.addEventListener("keydown",w=>m(this,w))}}}function k(v){return class extends c(v){constructor(){super()}createdCallback(){super.createdCallback(),this.addEventListener("keyup",w=>m(this,w))}}}function l(v){var w={};for(var x=Object.entries(s),y=Array.isArray(x),z=0,x=y?x:x[Symbol.iterator]();;){var A;if(y){if(z>=x.length)break;A=x[z++]}else{if(z=x.next(),z.done)break;A=z.value}var B=A,C=B[0],D=B[1],E=v[C];w[C]=null==E?D:E}return w}function m(v,w){if(!v.readOnly){var x=n(w,v);console.log(w),null!=x&&(v.value=x),x&&w.preventDefault()}}function n(v,w){var x=v.code;if(!w.allowModOnly&&o(v.key))return null;var y=void 0;if(w.noMod)y=x;else{var z=[x];v.shiftKey&&!x.startsWith("Shift")&&z.unshift("Shift"),v.altKey&&!x.startsWith("Alt")&&z.unshift("Alt"),v.ctrlKey&&!x.startsWith("Control")&&z.unshift("Control"),v.metaKey&&!x.startsWith("Meta")&&z.unshift("Meta"),y=z.join(" + ")}var A=w.ignore;return A&&A.test(y)?null:y}function o(v){return u.has(v)}function p(v,w,x){x?v.setAttribute(w,""):v.removeAttribute(w)}b.__esModule=!0,b.mixinKeydownInput=e,b.mixinKeyupInput=k,b.register=function(){document.registerElement("keydown-input",q),document.registerElement("keyup-input",r)};class q extends e(HTMLInputElement){static get extends(){return"input"}}b.KeydownInputElement=q;class r extends k(HTMLInputElement){static get extends(){return"input"}}b.KeyupInputElement=r;var s={allowModOnly:!1,noMod:!1,ignore:void 0};class t{constructor(v){var w=1<arguments.length&&void 0!==arguments[1]?arguments[1]:s;this.pattern=v,this.options=w}test(v){if(!(v instanceof KeyboardEvent))return!1;if(0===this.pattern.length)return!1;var w=n(v,this.options);return this.pattern===w}}var u=new Set(["Shift","Alt","Control","Meta"])}]);
//# sourceMappingURL=key-input-elements.js.map