import{r as t,c as s,h as i,g as e}from "./p-15febc39.js";const o=class{constructor(i){t(this,i),this.cancelable=!0,this.options=[],this.open=!1,this.onSelection=s(this,"onSelection",7)}componentDidLoad(){requestAnimationFrame(()=>{this.open=!0})}dismiss(){this.cancelable&&this.close()}close(){this.open=!1,setTimeout(()=>{this.el.parentNode.removeChild(this.el)},500)}handleOptionClick(t, s){t.stopPropagation(),this.onSelection.emit(s),this.close()}render(){return i("div",{class:`wrapper${this.open?" open":""}`,onClick:()=>this.dismiss()},i("div",{class:"content"},i("div",{class:"title"},this.header),this.options.map((t, s)=>i("div",{class:"action-sheet-option",onClick: t=>this.handleOptionClick(t,s)},i("div",{class:"action-sheet-button"},t.title)))))}get el(){return e(this)}static get style(){return":host{z-index:1000;position:fixed;top:0;left:0;width:100%;height:100%;contain:strict;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,Roboto,sans-serif}.wrapper,:host{display:-ms-flexbox;display:flex}.wrapper{-ms-flex:1;flex:1;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:transparent;-webkit-transition:background-color .4s cubic-bezier(.36,.66,.04,1);transition:background-color .4s cubic-bezier(.36,.66,.04,1)}.wrapper.open{background-color:rgba(0,0,0,.32)}.title{color:#999;height:23px;line-height:23px;padding-bottom:17px;-webkit-padding-end:16px;padding-inline-end:16px;-webkit-padding-start:16px;padding-inline-start:16px;padding-left:16px;padding-right:16px;padding-top:20px}.content{width:568px;-ms-flex-item-align:end;align-self:flex-end;background-color:#fff;-webkit-transition:-webkit-transform .4s cubic-bezier(.36,.66,.04,1);transition:-webkit-transform .4s cubic-bezier(.36,.66,.04,1);transition:transform .4s cubic-bezier(.36,.66,.04,1);transition:transform .4s cubic-bezier(.36,.66,.04,1),-webkit-transform .4s cubic-bezier(.36,.66,.04,1);-webkit-transform:translateY(100%);transform:translateY(100%)}.wrapper.open .content{-webkit-transform:translateY(0);transform:translateY(0)}\@media only screen and (max-width:568px){.content{width:100%}}.action-sheet-option{cursor:pointer;height:52px;line-height:52px}.action-sheet-button{color:#262626;font-size:16px;-webkit-padding-end:16px;padding-inline-end:16px;-webkit-padding-start:16px;padding-inline-start:16px;padding-left:16px;padding-right:16px;padding-top:0}.action-sheet-button:hover{background-color:#f6f6f6}"}};export{o as pwa_action_sheet};