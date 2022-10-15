// @charset "utf-8"
// ==UserScript==
// @name        FLOAT_ELEMENT
// @version     0.1
// @description 要素を適当に別窓表示
// @match       *://*/*
// @exclude     
// @noframes
// @grant       none
// ==/UserScript==
(() => {
  'use strict';
  const ots = 'gachuchu_' + new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16); // one time string
  const css = `<style>
    .${ots}_float_element_item {
      padding-top:3px !important;
      padding-bottom:3px !important;
    }
    .${ots}_float_element {
      background:linear-gradient(45deg,#dddddd88 25%, transparent 25%, transparent 75%, #dddddd88 75%),
      linear-gradient(45deg,#dddddd88 25%, transparent 25%, transparent 75%, #dddddd88 75%) !important;
      background-color: #88888888 !important;
      background-size: 12px 12px !important;
      background-position: 0 0, 6px 6px !important;
    }
  </style>`;
  document.querySelector('head').insertAdjacentHTML('beforeend', css);

  let is_float_element = false;

  // event
  const onmouseover = (ev) => {
    const elm = ev.target;
    elm.classList.add(`${ots}_float_element`);
    elm.addEventListener('click', onclick);
  };
  const onmouseout = (ev) => {
    const elm = ev.target;
    elm.classList.remove(`${ots}_float_element`);
    elm.removeEventListener('click', onclick);    
  };

  // onclick
  const onclick = (ev) => {
    const get_csstext = (s) => {
      let t = '';
      for(let i = 0; i < s.length; ++i) {
        t += `${s[i]}:${s.getPropertyValue(s[i])};`;
      }
      return t;
    };

    toggle_float_element();

    const elm = ev.target;
    const cln = elm.cloneNode(true);
    const s = document.defaultView.getComputedStyle(elm, '');
    const w = elm.offsetWidth + parseInt(s.marginLeft) + parseInt(s.marginRight) + 20;
    const h = elm.offsetHeight + parseInt(s.marginTop) + parseInt(s.marginBottom) + 20;

    const win = window.open('', '_blank', `width=${w}, height=${h}`);
    win.document.open();
    win.document.clear();
    const div = document.createElement('div');
    //div.style.cssText = 'display:flex; justify-content:center; align-items:center;';
    div.style.cssText = `width:${w}px; transform-origin: top left;`;
    div.appendChild(cln);
    win.document.appendChild(div);

    const wcln = win.document.querySelector('div').querySelector(cln.tagName);
    wcln.style.cssText = get_csstext(s);

    const elms = elm.querySelectorAll('*');
    const wclns = wcln.querySelectorAll('*');
    const nodes = Array.from(elms).map((e, i) => [elms[i], wclns[i]]);
    nodes.forEach((e, i) => {
      const s = document.defaultView.getComputedStyle(e[0], '');
      e[1].style.cssText = get_csstext(s);
    });

    win.document.close();

    win.addEventListener('resize', () => {
      const wscale = win.innerWidth / w;
      div.style.transform = `scale(${wscale}, ${wscale})`;
    });
    
    ev.preventDefault();
  };

  const toggle_float_element = () => {
    const body = document.querySelector('body');
    const elms = body.querySelectorAll('*');

    if(is_float_element) {
      elms.forEach((elm) => {
        elm.classList.remove(`${ots}_float_element`);
        elm.removeEventListener('mouseover', onmouseover);
        elm.removeEventListener('mouseout', onmouseout);
        elm.removeEventListener('click', onclick);
      });
      is_float_element = false;
    }else{
      elms.forEach((elm) => {
        elm.addEventListener('mouseover', onmouseover);
        elm.addEventListener('mouseout', onmouseout);
      });
      is_float_element = true;
    }
  };

  document.addEventListener('keydown', (ev) => {
    if(ev.ctrlKey && ev.altKey) {
      toggle_float_element();
    }
  });
})();
