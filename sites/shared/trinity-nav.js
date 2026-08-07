// Trinity Navigation Loader — injects shared federation nav into all arifOS sites
// Served from /_shared/trinity-nav.js — auto-included by every static site
// DITEMPA BUKAN DIBERI — Forged, Not Given
//
// 2026-07-26 (P1-HOME/S4): federation strip + market strip demoted behind a
// collapsed <details class="trinity-machine">. All links, IDs and classes are
// preserved inside the disclosure — nothing is removed, only demoted.

(function() {
  'use strict';
  if (document.querySelector('.trinity-nav')) return;

  // Federation topology: Trinity (SOUL·MIND·BODY) + Organs (GEOX·WEALTH·WELL) + Actuator (FORGE) + Gate (MCP)
  var links = [
    { href: 'https://arif-fazil.com',      label: 'SOUL',    cls: 'soul',   emoji: '&#936;' },
    { href: 'https://arifos.arif-fazil.com', label: 'MIND',    cls: 'mind',   emoji: '&#937;' },
    { href: 'https://aaa.arif-fazil.com',   label: 'BODY',    cls: 'body',   emoji: '&#916;' },
    { href: 'https://geox.arif-fazil.com',  label: 'GEOX',    cls: 'geox',   emoji: '&#934;' },
    { href: 'https://wealth.arif-fazil.com', label: 'WEALTH',  cls: 'wealth', emoji: '&#926;' },
    { href: 'https://well.arif-fazil.com',  label: 'WELL',    cls: 'well',   emoji: '&#937;&#9733;' },
    { href: 'https://forge.arif-fazil.com', label: 'FORGE',   cls: 'forge',  emoji: '&#9878;' },
    { href: 'https://mcp.arif-fazil.com',   label: 'MCP',     cls: 'gate',   emoji: '&#9675;' },
    { href: 'https://t.me/arifos',          label: 'HERMES',  cls: 'hermes', emoji: '&#9883;' },
  ];

  var html = '';
  for (var i = 0; i < links.length; i++) {
    if (i > 0) html += '<span class="sep">|</span>';
    html += '<a href="' + links[i].href + '" class="' + links[i].cls + '">' +
            links[i].emoji + ' ' + links[i].label + '</a>';
  }
  html += '<span class="motto">DITEMPA BUKAN DIBERI</span>';

  var nav = document.createElement('nav');
  nav.className = 'trinity-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Federation Navigation');
  nav.innerHTML = html;

  // Machine-state disclosure: federation + market links live behind one calm
  // summary line. Collapsed by default; all content reachable when opened.
  var details = document.createElement('details');
  details.className = 'trinity-machine';
  var summary = document.createElement('summary');
  summary.textContent = 'Federation & market links';
  details.appendChild(summary);
  details.appendChild(nav);

  if (document.body) {
    document.body.insertBefore(details, document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.insertBefore(details, document.body.firstChild);
    });
  }

  var style = document.createElement('style');
  style.textContent =
    '.trinity-machine{background:#0a0a0a;border-bottom:2px solid #1a1a1a;' +
    'font-family:"JetBrains Mono","SF Mono",monospace}' +
    '.trinity-machine>summary{cursor:pointer;list-style:none;padding:0.3rem 1rem;' +
    'color:#555;font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;' +
    'user-select:none}' +
    '.trinity-machine>summary::-webkit-details-marker{display:none}' +
    '.trinity-machine>summary::before{content:"\\25B8\\0020";color:#333}' +
    '.trinity-machine[open]>summary::before{content:"\\25BE\\0020"}' +
    '.trinity-machine>summary:hover{color:#999}' +
    '.trinity-nav{display:flex;gap:0;justify-content:center;align-items:center;' +
    'padding:0.5rem 1rem;background:#0a0a0a;border-bottom:2px solid #1a1a1a;' +
    'font-family:"JetBrains Mono","SF Mono",monospace;font-size:0.75rem;' +
    'letter-spacing:0.05em;flex-wrap:wrap}' +
    '.trinity-nav a{color:#888;text-decoration:none;padding:0.25rem 0.6rem;' +
    'border-radius:3px;transition:all 0.15s ease}' +
    '.trinity-nav a:hover{color:#fff;background:rgba(255,255,255,0.05)}' +
    '.trinity-nav a.soul{color:#FF3333}' +
    '.trinity-nav a.soul:hover{background:rgba(255,51,51,0.1)}' +
    '.trinity-nav a.mind{color:#00D4AA}' +
    '.trinity-nav a.mind:hover{background:rgba(0,212,170,0.1)}' +
    '.trinity-nav a.body{color:#D4A853}' +
    '.trinity-nav a.body:hover{background:rgba(212,168,83,0.1)}' +
    '.trinity-nav a.geox{color:#C4791A}' +
    '.trinity-nav a.geox:hover{background:rgba(196,121,26,0.1)}' +
    '.trinity-nav a.wealth{color:#2EA96A}' +
    '.trinity-nav a.wealth:hover{background:rgba(46,169,106,0.1)}' +
    '.trinity-nav a.well{color:#38BEC9}' +
    '.trinity-nav a.well:hover{background:rgba(56,190,201,0.1)}' +
    '.trinity-nav a.forge{color:#E3B341}' +
    '.trinity-nav a.forge:hover{background:rgba(227,179,65,0.1)}' +
    '.trinity-nav a.gate{color:#7C6FD4}' +
    '.trinity-nav a.gate:hover{background:rgba(124,111,212,0.1)}' +
    '.trinity-nav a.hermes{color:#E879F9}' +
    '.trinity-nav a.hermes:hover{background:rgba(232,121,249,0.12)}' +
    '.trinity-nav .sep{color:#333;margin:0 0.1rem;user-select:none}' +
    '.trinity-nav .motto{color:#444;font-size:0.6rem;margin-left:auto;font-style:italic;padding-left:0.5rem}' +
    '.trinity-markets{display:flex;gap:0;justify-content:center;align-items:center;' +
    'padding:0.3rem 1rem;background:#060606;border-bottom:1px solid #121212;' +
    'font-family:"JetBrains Mono","SF Mono",monospace;font-size:0.6rem;' +
    'letter-spacing:0.08em;flex-wrap:wrap}' +
    '.trinity-markets a{color:#555;text-decoration:none;padding:0.15rem 0.5rem;' +
    'border-radius:2px;transition:all 0.15s ease}' +
    '.trinity-markets a:hover{color:#ccc;background:rgba(255,255,255,0.03)}' +
    '.trinity-markets .m-label{color:#333;margin-right:0.3rem;text-transform:uppercase}';
  document.head.appendChild(style);

  // Market sub-nav — injects on arif-fazil.com and wealth.arif-fazil.com
  var host = window.location.hostname;
  if (host === 'arif-fazil.com' || host === 'wealth.arif-fazil.com' || host === 'www.arif-fazil.com') {
    var markets = [
      { href: '/propa/', label: 'PETRONAS φ', host: 'wealth' },
      { href: '/malaysia/', label: 'MALAYSIA φ', host: 'wealth' },
      { href: '/oil/', label: 'OIL', host: 'main' },
      { href: '/gas/', label: 'GAS', host: 'main' },
      { href: '/gold/', label: 'GOLD', host: 'main' },
    ];
    var mhtml = '<span class="m-label">φ MARKETS</span>';
    for (var j = 0; j < markets.length; j++) {
      var m = markets[j];
      var mhref = m.host === 'wealth' ? 'https://wealth.arif-fazil.com' + m.href : 'https://arif-fazil.com' + m.href;
      if (j > 0) mhtml += '<span class="sep" style="color:#222">|</span>';
      mhtml += '<a href="' + mhref + '">' + m.label + '</a>';
    }
    var mnav = document.createElement('nav');
    mnav.className = 'trinity-markets';
    mnav.setAttribute('role', 'navigation');
    mnav.setAttribute('aria-label', 'Market Surfaces');
    mnav.innerHTML = mhtml;
    if (document.body) {
      var tn = document.querySelector('.trinity-nav');
      if (tn) {
        // tn lives inside the .trinity-machine disclosure — keep markets with it.
        if (tn.nextSibling) {
          tn.parentNode.insertBefore(mnav, tn.nextSibling);
        } else {
          tn.parentNode.appendChild(mnav);
        }
      } else {
        document.body.insertBefore(mnav, document.body.firstChild);
      }
    }
  }
})();
