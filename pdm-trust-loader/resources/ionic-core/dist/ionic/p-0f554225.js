import"./p-aea38759.js";import"./p-f4d641a6.js";import{c as t}from"./p-613c0939.js";import{g as a}from"./p-cd6fce72.js";const o=(o,r)=>{const i="back"===r.direction,s=r.leavingEl,c=a(r.enteringEl),e=c.querySelector("ion-toolbar"),p=t();if(p.addElement(c).fill("both").beforeRemoveClass("ion-page-invisible"),i?p.duration(r.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)"):p.duration(r.duration||280).easing("cubic-bezier(0.36,0.66,0.04,1)").fromTo("transform","translateY(40px)","translateY(0px)").fromTo("opacity",.01,1),e){const a=t();a.addElement(e),p.addAnimation(a)}if(s&&i){p.duration(r.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)");const o=t();o.addElement(a(s)).onFinish((t=>{1===t&&o.elements.length>0&&o.elements[0].style.setProperty("display","none")})).fromTo("transform","translateY(0px)","translateY(40px)").fromTo("opacity",1,0),p.addAnimation(o)}return p};export{o as mdTransitionAnimation}