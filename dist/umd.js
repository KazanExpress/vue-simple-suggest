!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.VueSimpleSuggest=e()}(this,function(){"use strict";var t={selectionUp:[38],selectionDown:[40],select:[13],hideList:[27],autocomplete:[32,13]},e={input:String,select:Object},i={type:String},n={type:i,accesskey:i,autocomplete:i,form:i,formaction:i,formenctype:i,formmethod:i,formtarget:i,height:i,width:i,inputmode:i,max:i,min:i,minlength:i,maxlength:i,name:i,pattern:i,placeholder:i,selectionDirection:i,selectionEnd:i,selectionStart:i,size:i,src:i,step:i,tabindex:i,title:i,spellcheck:{},readonly:{},required:{},multiple:{},formnovalidate:{},autofocus:{},checked:{},disabled:{}};function s(t,e){return e.split(".").reduce(function(t,e){return t===Object(t)?t[e]:t},t)}function o(t,e){if(t.length<=0)return!1;var i=function(t){return t.some(function(t){return t===e.keyCode})};return Array.isArray(t[0])?t.some(function(t){return i(t)}):i(t)}var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function r(t,e){try{var i=t()}catch(t){return e()}return i&&i.then?i.then(e,e):e()}function l(t,e){try{var i=t()}catch(t){return e(t)}return i&&i.then?i.then(void 0,e):i}function c(t,e,i){return i?e?e(t):t:(t=Promise.resolve(t),e?t.then(e):t)}var h=function(){try{if(isNaN.apply(null,{}))return function(t){return function(){try{return Promise.resolve(t.apply(this,arguments))}catch(t){return Promise.reject(t)}}}}catch(t){}return function(t){return function(){try{return Promise.resolve(t.apply(this,Array.prototype.slice.call(arguments)))}catch(t){return Promise.reject(t)}}}}();function a(t,e){var i=t();return i&&i.then?i.then(e):e(i)}function f(){}var p="input",g={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"vue-simple-suggest",class:{designed:!t.destyled,focus:t.isInFocus},on:{keydown:function(e){if(!("button"in e)&&t._k(e.keyCode,"tab",9,e.key,"Tab"))return null;t.isTabbed=!0}}},[i("div",{ref:"inputSlot",staticClass:"input-wrapper",on:{click:t.showSuggestions,input:t.onInput,keydown:function(e){t.moveSelection(e),t.onAutocomplete(e)},keyup:t.onListKeyUp}},[t._t("default",[i("input",t._b({staticClass:"default-input",domProps:{value:t.text||""}},"input",t.$props,!1))])],2),t._v(" "),t.listShown&&!t.removeList?i("div",{staticClass:"suggestions",on:{mouseenter:function(e){t.hoverList(!0)},mouseleave:function(e){t.hoverList(!1)}}},[t._t("misc-item-above",null,{suggestions:t.suggestions,query:t.text}),t._v(" "),t._l(t.suggestions,function(e,n){return i("div",{key:t.isPlainSuggestion?"suggestion-"+n:t.valueProperty(e),staticClass:"suggest-item",class:{selected:t.selected&&t.valueProperty(e)==t.valueProperty(t.selected),hover:t.hovered&&t.valueProperty(t.hovered)==t.valueProperty(e)},on:{mouseenter:function(i){t.hover(e,i.target)},mouseleave:function(e){t.hover(null,e.target)},click:function(i){t.suggestionClick(e,i)}}},[t._t("suggestion-item",[i("span",[t._v(t._s(t.displayProperty(e)))])],{autocomplete:function(){return t.autocompleteText(e)},suggestion:e,query:t.text})],2)}),t._v(" "),t._t("misc-item-below",null,{suggestions:t.suggestions,query:t.text})],2):t._e()])},staticRenderFns:[],name:"vue-simple-suggest",model:{prop:"value",get event(){return p}},props:Object.assign({},n,{controls:{type:Object,default:function(){return t}},minLength:{type:Number,default:1},maxSuggestions:{type:Number,default:10},displayAttribute:{type:String,default:"title"},valueAttribute:{type:String,default:"id"},list:{type:[Function,Array],default:function(){return[]}},removeList:{type:Boolean,default:!1},destyled:{type:Boolean,default:!1},filterByQuery:{type:Boolean,default:!1},filter:{type:Function,default:function(t,e){return!e||~this.displayProperty(t).toLowerCase().indexOf(e.toLowerCase())}},debounce:{type:Number,default:0},value:{},mode:{type:String,default:p,validator:function(t){return!!~Object.keys(e).indexOf(t.toLowerCase())}}}),watch:{mode:function(t){return p=t}},data:function(){return{selected:null,hovered:null,suggestions:[],listShown:!1,inputElement:null,canSend:!0,timeoutInstance:null,text:this.value,isPlainSuggestion:!1,isClicking:!1,isOverList:!1,isInFocus:!1,isTabbed:!1,controlScheme:{}}},computed:{listIsRequest:function(){return"function"==typeof this.list},inputIsComponent:function(){return this.$slots.default&&this.$slots.default.length>0&&!!this.$slots.default[0].componentInstance},input:function(){return this.inputIsComponent?this.$slots.default[0].componentInstance:this.inputElement},on:function(){return this.inputIsComponent?"$on":"addEventListener"},off:function(){return this.inputIsComponent?"$off":"removeEventListener"},hoveredIndex:function(){var t=this;return this.suggestions.findIndex(function(e){return t.hovered&&t.valueProperty(t.hovered)==t.valueProperty(e)})}},created:function(){this.controlScheme=Object.assign({},t,this.controls),p=this.mode},mounted:function(){this.inputElement=this.$refs.inputSlot.querySelector("input"),this.input[this.on]("blur",this.onBlur),this.input[this.on]("focus",this.onFocus)},beforeDestroy:function(){this.input[this.off]("blur",this.onBlur),this.input[this.off]("focus",this.onFocus)},methods:{isScopedSlotEmpty:function(t){return t&&"function"==typeof t?!t(this):!t},miscSlotsAreEmpty:function(){var t=this;return["above","below"].some(function(e){return t.isScopedSlotEmpty(t.$scopedSlots["misc-item-"+e])})},displayProperty:function(t){return(this.isPlainSuggestion?t:s(t,this.displayAttribute))+""},valueProperty:function(t){return this.isPlainSuggestion?t:s(t,this.valueAttribute)},autocompleteText:function(t){this.$emit("input",t),this.inputElement.value=t,this.text=t},select:function(t){this.hovered=null,this.selected=t,this.$emit("select",t),this.autocompleteText(this.displayProperty(t))},hover:function(t,e){this.hovered=t,null!=this.hovered&&this.$emit("hover",t,e)},hoverList:function(t){this.isOverList=t},hideList:function(){this.listShown&&(this.listShown=!1,this.$emit("hide-list"))},showList:function(){this.listShown||(this.text&&this.text.length||0)>=this.minLength&&(this.suggestions.length>0||!this.miscSlotsAreEmpty())&&(this.listShown=!0,this.$emit("show-list"))},showSuggestions:h(function(){var t=this;return a(function(){if(0===t.suggestions.length&&0===t.minLength&&!t.text)return function(t,e){if(!e)return Promise.resolve(t).then(f)}(t.research())},function(){t.showList()})}),moveSelection:function(t){if(o([this.controlScheme.selectionUp,this.controlScheme.selectionDown],t)){t.preventDefault(),this.showSuggestions();var e=o(this.controlScheme.selectionDown,t),i=2*e-1,n=e?0:this.suggestions.length-1,s=e?this.hoveredIndex<this.suggestions.length-1:this.hoveredIndex>0,u=null;u=this.hovered?s?this.suggestions[this.hoveredIndex+i]:this.suggestions[n]:this.selected||this.suggestions[n],this.hover(u)}},onListKeyUp:function(t){var e=this.controlScheme.select;o([e,this.controlScheme.hideList],t)&&(t.preventDefault(),this.listShown?(o(e,t)&&this.hovered&&this.select(this.hovered),this.hideList()):o(e,t)&&this.research())},onAutocomplete:function(t){o(this.controlScheme.autocomplete,t)&&(t.ctrlKey||t.shiftKey)&&this.suggestions.length>0&&this.suggestions[0]&&this.listShown&&(t.preventDefault(),this.hover(this.suggestions[0]),this.autocompleteText(this.displayProperty(this.suggestions[0])))},suggestionClick:function(t,e){this.$emit("suggestion-click",t,e),this.select(t),this.hideList(),this.isClicking=this.isOverList=!1},onBlur:function(t){this.isInFocus?(this.isClicking=this.isOverList&&!this.isTabbed,this.isClicking?t.isTrusted&&!this.isTabbed&&this.inputElement.focus():(this.isInFocus=!1,this.hideList(),this.$emit("blur",t))):(this.inputElement.blur(),console.error("This should never happen!\n          If you encouneterd this error, please report at https://github.com/KazanExpress/vue-simple-suggest/issues")),this.isTabbed=!1},onFocus:function(t){this.isInFocus=!0,t.sourceCapabilities&&this.$emit("focus",t),this.isClicking||this.showList()},onInput:function(t){this.text=t.target.value,this.$emit("input",this.text),this.selected&&(this.selected=null,this.$emit("select",null)),this.debounce?(clearTimeout(this.timeoutInstance),this.timeoutInstance=setTimeout(this.research,this.debounce)):this.research()},research:h(function(){var t=this;return r(function(){return l(function(){return function(t){var e=t();if(e&&e.then)return e.then(f)}(function(){if(t.canSend){t.canSend=!1;var e=t.$set;return c(t.getSuggestions(t.text),function(i){e.call(t,t,"suggestions",i),t.canSend=!0})}})},function(e){throw t.clearSuggestions(),e})},function(){return 0===t.suggestions.length&&t.miscSlotsAreEmpty()?t.hideList():t.showList(),t.suggestions})}),getSuggestions:h(function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(t.listShown&&!e)return t.hideList(),t.clearSuggestions(),t.suggestions;if(t.minLength>0&&e.length<t.minLength)return t.suggestions;t.selected=null,t.listIsRequest&&t.$emit("request-start",e);var i=[];return r(function(){return l(function(){return a(function(){if(t.listIsRequest)return c(t.list(e),function(t){i=t||[]});i=t.list},function(){Array.isArray(i)||(i=[i]),t.isPlainSuggestion="object"!==u(i[0])||Array.isArray(i[0]),t.filterByQuery&&(i=i.filter(function(i){return t.filter(i,e)})),t.listIsRequest&&t.$emit("request-done",i)})},function(e){if(!t.listIsRequest)throw e;t.$emit("request-failed",e)})},function(){return t.maxSuggestions&&i.splice(t.maxSuggestions),i})}),clearSuggestions:function(){this.suggestions.splice(0)}}};return(Vue||window&&window.Vue)&&(Vue||window.Vue).component("vue-simple-suggest",g),g});
