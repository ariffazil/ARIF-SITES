/**
 * pulse-widget.js — Weekly WEALTH Organ Pulse widget for arif-fazil.com
 * Fetches /data/wealth/latest.json and renders the weekly snapshot.
 * Forged 2026-08-07 by 333-AGI.
 */

(function() {
  'use strict';
  var el = document.getElementById('weekly-pulse');
  if (!el) return;

  var CSS = {
    ink:    'var(--ink,#EDEAE2)',
    dim:    'var(--dim,#8A8378)',
    accent: 'var(--accent,#D4A853)',
    up:     '#22C55E',
    down:   '#EF4444',
    sabar:  '#FFD600',
  };

  function fmt(num, decimals) {
    decimals = decimals || 2;
    return Number(num).toFixed(decimals);
  }

  function arrow(val) {
    return val > 0 ? '<span style="color:'+CSS.up+'">↑+' + fmt(val,1) + '%</span>'
         : val < 0 ? '<span style="color:'+CSS.down+'">↓' + fmt(val,1) + '%</span>'
         : '<span style="color:'+CSS.dim+'">—</span>';
  }

  function render(d) {
    var p = d.weekly_pulse;
    if (!p) { el.innerHTML = '<p style="color:var(--dim)">No pulse data yet.</p>'; return; }

    var c = p.crude, e = p.energy_equities, g = p.gas, m = d.malaysia_macro;

    var h = '';
    h += '<div class="pulse-widget" style="font-family:monospace;font-size:12px;line-height:1.7;">';

    // Header
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--line,#2A2A3A)">';
    h += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:'+CSS.up+'"></span>';
    h += '<span style="font-weight:700;letter-spacing:.06em;color:var(--ink)">WEEKLY PULSE — w/e 7 Aug 2026</span>';
    h += '</div>';

    // Crude benchmark table
    h += '<table style="width:100%;border-collapse:collapse;margin-bottom:16px">';
    h += '<tr style="color:var(--dim);font-size:10px;text-transform:uppercase;letter-spacing:.06em"><td style="padding:4px 8px">Benchmark</td><td style="padding:4px 8px;text-align:right">Close</td><td style="padding:4px 8px;text-align:right">WoW</td><td style="padding:4px 8px;text-align:right">1-Mo</td></tr>';
    h += '<tr style="border-top:1px solid var(--line)"><td style="padding:6px 8px;font-weight:600;color:var(--ink)">WTI</td><td style="padding:6px 8px;text-align:right;color:var(--ink)">$'+fmt(c.wti.close)+'</td><td style="padding:6px 8px;text-align:right">'+arrow(c.wti.wow_pct)+'</td><td style="padding:6px 8px;text-align:right">'+arrow(c.wti.one_month_pct)+'</td></tr>';
    h += '<tr style="border-top:1px solid var(--line)"><td style="padding:6px 8px;font-weight:600;color:var(--ink)">Brent</td><td style="padding:6px 8px;text-align:right;color:var(--ink)">$'+fmt(c.brent.close)+'</td><td style="padding:6px 8px;text-align:right">'+arrow(c.brent.wow_pct)+'</td><td style="padding:6px 8px;text-align:right">'+arrow(c.brent.one_month_pct)+'</td></tr>';
    h += '<tr style="border-top:1px solid var(--line)"><td style="padding:6px 8px;font-weight:600;color:var(--ink)">Brent–WTI Spread</td><td style="padding:6px 8px;text-align:right;color:var(--ink)" colspan="3">$'+fmt(c.brent.brent_wti_spread)+'</td></tr>';
    h += '</table>';

    // Energy equities + gas
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
    h += '<div style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface3)">';
    h += '<div style="font-size:10px;color:var(--dim);letter-spacing:.06em;margin-bottom:4px">XLE (Energy Equities)</div>';
    h += '<div style="font-size:14px;font-weight:700;color:var(--ink)">$'+fmt(e.xle.close)+'</div>';
    h += '<div style="font-size:11px;margin-top:2px">WoW: '+arrow(e.xle.wow_pct)+' · 1-Mo: '+arrow(e.xle.one_month_pct)+'</div>';
    h += '</div>';
    h += '<div style="padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--surface3)">';
    h += '<div style="font-size:10px;color:var(--dim);letter-spacing:.06em;margin-bottom:4px">Henry Hub Gas</div>';
    h += '<div style="font-size:14px;font-weight:700;color:var(--ink)">$'+fmt(g.henry_hub.close)+'/MMBtu</div>';
    h += '<div style="font-size:11px;margin-top:2px">WoW: '+arrow(g.henry_hub.wow_pct)+'</div>';
    h += '</div>';
    h += '</div>';

    // Malaysia macro
    if (m) {
      h += '<div style="padding:12px;border:1px solid var(--line);border-radius:6px;background:var(--surface3);margin-bottom:12px">';
      h += '<div style="font-size:10px;color:var(--dim);letter-spacing:.06em;margin-bottom:6px">MALAYSIA MACRO</div>';
      h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:11px">';
      h += '<div><span style="color:var(--dim)">GDP 2025</span><br><span style="color:var(--ink);font-weight:700">'+fmt(m.gdp['2025'],1)+'%</span> <span style="font-size:9px;color:var(--dim)">US$'+m.gdp.usd_2025+'bn</span></div>';
      h += '<div><span style="color:var(--dim)">CPI 2025</span><br><span style="color:var(--ink);font-weight:700">'+fmt(m.cpi['2025'],1)+'%</span> <span style="font-size:9px;color:var(--dim)">2026F: '+fmt(m.cpi['2026F'],1)+'%</span></div>';
      h += '<div><span style="color:var(--dim)">USD/MYR</span><br><span style="color:var(--ink);font-weight:700">'+fmt(m.myr.end_jun_2026,2)+'</span> <span style="font-size:9px;color:var(--dim)">Jun 2026</span></div>';
      h += '</div></div>';
    }

    // One-liner
    if (c.note) {
      h += '<div style="font-size:10px;color:var(--sabar);padding:8px;border-left:2px solid var(--sabar);margin-bottom:12px">'+c.note+'</div>';
    }

    // Sources
    h += '<div style="font-size:9px;color:var(--faint);margin-top:12px;padding-top:8px;border-top:1px solid var(--line)">';
    h += 'Sources: Yahoo Finance · IMF WEO · World Bank Open Data · IMF IFS · as of 7 Aug 2026';
    h += '</div>';

    h += '</div>';
    el.innerHTML = h;
  }

  // Fetch live data
  fetch('/data/wealth/latest.json')
    .then(function(r) { return r.json(); })
    .then(render)
    .catch(function() {
      el.innerHTML = '<p style="color:var(--dim);font-family:monospace;font-size:11px;padding:20px">[Weekly pulse loading — refresh for latest]</p>';
    });
})();
