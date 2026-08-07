/**
 * d3-charts.js — Shared D3 v7 visualization library for arif-fazil.com
 * Forged 2026-08-07 by 333-AGI under F13 SOVEREIGN directive.
 * 
 * Depends on D3 v7 (loaded via CDN <script> before this file).
 * All charts use the site's CSS variables for theming.
 * DITEMPA BUKAN DIBERI.
 */

const D3Charts = (function() {
  'use strict';

  const CSS = {
    ink:      getComputedStyle(document.documentElement).getPropertyValue('--ink')      || '#EDEAE2',
    dim:      getComputedStyle(document.documentElement).getPropertyValue('--dim')       || '#7A7880',
    faint:    getComputedStyle(document.documentElement).getPropertyValue('--faint')     || '#5A554D',
    accent:   getComputedStyle(document.documentElement).getPropertyValue('--accent')    || '#D4A853',
    void:     '#616161',
    hold:     '#FF9500',
    sabar:    '#FFD600',
    seal:     '#00C853',
    danger:   '#D50000',
    up:       '#22C55E',
    down:     '#EF4444',
    bg:       getComputedStyle(document.documentElement).getPropertyValue('--paper')     || '#0A0B0D',
    surface:  getComputedStyle(document.documentElement).getPropertyValue('--surface3')  || '#1A1A1E',
    line:     getComputedStyle(document.documentElement).getPropertyValue('--line')       || '#2A2A3A',
  };

  const WIDTH =  function(el) { return el ? el.clientWidth  || 800 : 800; };
  const HEIGHT = function(el) { return el ? el.clientHeight || 400 : 400; };

  /* ── Sparkline  (tiny inline trend) ──────────────────────────── */
  function sparkline(selector, data, opts) {
    opts = Object.assign({ width: 160, height: 40, color: CSS.accent, thresholds: [] }, opts);
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || !data || data.length < 2) return;
    const svg = d3.select(el).append('svg')
      .attr('width', opts.width).attr('height', opts.height)
      .style('overflow','visible');

    const x = d3.scaleLinear().domain([0, data.length-1]).range([2, opts.width-2]);
    const y = d3.scaleLinear().domain(d3.extent(data)).range([opts.height-4, 4]);

    const line = d3.line().x((d,i) => x(i)).y(d => y(d)).curve(d3.curveMonotoneX);
    
    // Threshold zones
    (opts.thresholds||[]).forEach(function(t) {
      svg.append('line')
        .attr('x1',0).attr('x2',opts.width)
        .attr('y1',y(t.value)).attr('y2',y(t.value))
        .attr('stroke', t.color||'#FF9500').attr('stroke-width',0.5).attr('stroke-dasharray','3,2');
    });

    svg.append('path').datum(data).attr('d',line)
      .attr('fill','none').attr('stroke', opts.color).attr('stroke-width',1.5);
    
    // End dot
    svg.append('circle')
      .attr('cx', x(data.length-1)).attr('cy', y(data[data.length-1]))
      .attr('r', 2.5).attr('fill', opts.color);
  }

  /* ── Line Chart ─────────────────────────────────────────────── */
  function lineChart(selector, data, opts) {
    opts = Object.assign({
      width: null, height: 400, margin: {top:20,right:30,bottom:30,left:50},
      color: CSS.accent, xKey: 'date', yKey: 'value', curve: true,
      grid: true, tooltip: true, areaFill: false
    }, opts);
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || !data || !data.length) return;
    const W = opts.width || el.clientWidth || 700;
    const H = opts.height;
    const M = opts.margin;

    const svg = d3.select(el).append('svg')
      .attr('width', W).attr('height', H)
      .append('g').attr('transform','translate('+M.left+','+M.top+')');
    
    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const x = d3.scaleTime().range([0, innerW]);
    const y = d3.scaleLinear().range([innerH, 0]);

    if (typeof data[0][opts.xKey] === 'string') {
      data.forEach(function(d) { d._parsed = new Date(d[opts.xKey]); });
      x.domain(d3.extent(data, function(d) { return d._parsed; }));
    } else {
      x.domain([0, data.length-1]);
    }
    y.domain(d3.extent(data, function(d) { return +d[opts.yKey]; })).nice();

    if (opts.grid) {
      svg.append('g').attr('class','grid')
        .call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(''))
        .style('color',CSS.line).style('stroke-dasharray','2,3');
    }

    svg.append('g').attr('transform','translate(0,'+innerH+')')
      .call(d3.axisBottom(x).ticks(5))
      .style('color',CSS.dim).style('font-family','monospace').style('font-size','10px');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) {
        return d >= 1000 ? (d/1000).toFixed(1)+'k' : d;
      }))
      .style('color',CSS.dim).style('font-family','monospace').style('font-size','10px');

    const line = d3.line()
      .x(function(d) { return d._parsed ? x(d._parsed) : x(d._idx); })
      .y(function(d) { return y(+d[opts.yKey]); });
    if (opts.curve) line.curve(d3.curveMonotoneX);

    if (opts.areaFill) {
      const area = d3.area()
        .x(function(d) { return d._parsed ? x(d._parsed) : x(d._idx); })
        .y0(innerH)
        .y1(function(d) { return y(+d[opts.yKey]); });
      if (opts.curve) area.curve(d3.curveMonotoneX);
      svg.append('path').datum(data).attr('d',area)
        .attr('fill',opts.color).attr('opacity',0.08);
    }

    svg.append('path').datum(data).attr('d',line)
      .attr('fill','none').attr('stroke',opts.color).attr('stroke-width',2);

    if (opts.tooltip) {
      const tip = d3.select(el).append('div')
        .style('position','absolute').style('pointer-events','none')
        .style('background',CSS.surface).style('color',CSS.ink)
        .style('padding','4px 8px').style('border-radius','4px')
        .style('font-family','monospace').style('font-size','11px')
        .style('border','1px solid '+CSS.line).style('opacity',0);

      svg.append('rect').attr('width',innerW).attr('height',innerH)
        .attr('fill','none').attr('pointer-events','all')
        .on('mousemove', function(ev) {
          const mx = d3.pointer(ev, this)[0];
          const idx = Math.round(x.invert(mx));
          tip.style('opacity',1).style('left',(ev.offsetX+10)+'px').style('top',(ev.offsetY-30)+'px')
            .html(data[idx] ? (data[idx][opts.xKey]+': <b>'+data[idx][opts.yKey]+'</b>') : '');
        })
        .on('mouseleave', function() { tip.style('opacity',0); });
    }
  }

  /* ── Bar Chart ──────────────────────────────────────────────── */
  function barChart(selector, data, opts) {
    opts = Object.assign({
      width: null, height: 300, margin: {top:10,right:20,bottom:60,left:50},
      color: CSS.accent, xKey: 'label', yKey: 'value', sort: false
    }, opts);
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || !data || !data.length) return;
    const W = opts.width || el.clientWidth || 700;
    const H = opts.height;
    const M = opts.margin;
    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const svg = d3.select(el).append('svg')
      .attr('width',W).attr('height',H)
      .append('g').attr('transform','translate('+M.left+','+M.top+')');

    const x = d3.scaleBand().range([0,innerW]).padding(0.2);
    const y = d3.scaleLinear().range([innerH,0]);

    let items = data.slice();
    if (opts.sort) items.sort(function(a,b) { return d3.descending(+a[opts.yKey], +b[opts.yKey]); });
    x.domain(items.map(function(d) { return d[opts.xKey]; }));
    y.domain([0, d3.max(items, function(d) { return +d[opts.yKey]; }) * 1.1]).nice();

    svg.append('g').attr('transform','translate(0,'+innerH+')')
      .call(d3.axisBottom(x)).selectAll('text')
      .style('font-family','monospace').style('font-size','10px').style('color',CSS.dim)
      .attr('transform','rotate(-25)').style('text-anchor','end');

    svg.append('g').call(d3.axisLeft(y).ticks(5))
      .style('color',CSS.dim).style('font-family','monospace').style('font-size','10px');

    svg.selectAll('.bar').data(items).enter().append('rect')
      .attr('x',function(d) { return x(d[opts.xKey]); })
      .attr('width',x.bandwidth())
      .attr('y',innerH).attr('height',0)
      .attr('fill',opts.color).attr('opacity',0.85)
      .transition().duration(800).delay(function(_,i) { return i*50; })
      .attr('y',function(d) { return y(+d[opts.yKey]); })
      .attr('height',function(d) { return innerH - y(+d[opts.yKey]); });

    svg.selectAll('.bar-label').data(items).enter().append('text')
      .attr('x',function(d) { return x(d[opts.xKey]) + x.bandwidth()/2; })
      .attr('y',function(d) { return y(+d[opts.yKey]) - 6; })
      .attr('text-anchor','middle').style('font-family','monospace')
      .style('font-size','9px').style('fill',CSS.ink).style('opacity',0)
      .text(function(d) { return d[opts.yKey]; })
      .transition().delay(1000).duration(400).style('opacity',0.7);
  }

  /* ── Gauge (semi-circular) ──────────────────────────────────── */
  function gauge(selector, value, opts) {
    opts = Object.assign({
      width: 200, height: 120, min: 0, max: 100,
      zones: [
        {from:0,to:25,color:CSS.void,label:'VOID'},
        {from:25,to:50,color:CSS.hold,label:'HOLD'},
        {from:50,to:75,color:CSS.sabar,label:'SABAR'},
        {from:75,to:100,color:CSS.seal,label:'SEAL'}
      ]
    }, opts);
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    const W = opts.width, H = opts.height;
    const svg = d3.select(el).append('svg').attr('width',W).attr('height',H+20);
    const cx = W/2, cy = H, r = Math.min(W/2, H) * 0.85;
    const arc = d3.arc().innerRadius(r-18).outerRadius(r).cornerRadius(3);
    const pie = d3.pie().startAngle(-Math.PI).endAngle(0).sort(null);

    // Background
    svg.append('path').attr('d',arc({startAngle:-Math.PI,endAngle:0}))
      .attr('fill',CSS.surface).attr('transform','translate('+cx+','+cy+')');

    // Zone arcs
    opts.zones.forEach(function(z) {
      var sa = -Math.PI + (z.from/opts.max)*Math.PI;
      var ea = -Math.PI + (z.to/opts.max)*Math.PI;
      svg.append('path').attr('d',arc({startAngle:sa,endAngle:ea}))
        .attr('fill',z.color).attr('opacity',0.3)
        .attr('transform','translate('+cx+','+cy+')');
    });

    // Needle
    var angle = -Math.PI + (value/opts.max)*Math.PI;
    var nx = cx + (r-30)*Math.cos(angle), ny = cy + (r-30)*Math.sin(angle);
    svg.append('line').attr('x1',cx).attr('y1',cy).attr('x2',cx).attr('y2',cy)
      .attr('stroke',CSS.ink).attr('stroke-width',2.5).attr('stroke-linecap','round')
      .transition().duration(1000).ease(d3.easeElastic)
      .attr('x2',nx).attr('y2',ny);
    svg.append('circle').attr('cx',cx).attr('cy',cy).attr('r',5).attr('fill',CSS.accent);

    // Value label
    var verdict = '';
    opts.zones.forEach(function(z) { if (value >= z.from && value < z.to) verdict = z.label; });
    svg.append('text').attr('x',cx).attr('y',cy-20)
      .attr('text-anchor','middle').style('font-family','monospace')
      .style('font-size','14px').style('font-weight','bold').style('fill',CSS.ink)
      .text(value+''+verdict);
  }

  /* ── NOC Peer Comparison ────────────────────────────────────── */
  function peerBars(selector, peers, opts) {
    opts = Object.assign({
      width: null, height: 280, margin: {top:5,right:20,bottom:5,left:120},
      valueKey: 'score', labelKey: 'name', color: CSS.accent
    }, opts);
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el || !peers || !peers.length) return;
    const W = opts.width || el.clientWidth || 500;
    const H = opts.height;
    const M = opts.margin;
    const svg = d3.select(el).append('svg')
      .attr('width',W).attr('height',H)
      .append('g').attr('transform','translate('+M.left+','+M.top+')');
    const innerW = W - M.left - M.right;
    const innerH = H - M.top - M.bottom;

    const y = d3.scaleBand().range([0,innerH]).padding(0.3);
    const x = d3.scaleLinear().range([0,innerW]);
    y.domain(peers.map(function(d) { return d[opts.labelKey]; }));
    x.domain([0, d3.max(peers, function(d) { return +d[opts.valueKey]; }) * 1.2]).nice();

    svg.append('g').call(d3.axisLeft(y))
      .style('color',CSS.dim).style('font-family','monospace').style('font-size','11px');

    svg.selectAll('.peer-bar').data(peers).enter().append('rect')
      .attr('y',function(d) { return y(d[opts.labelKey]); })
      .attr('height',y.bandwidth())
      .attr('x',0).attr('width',0)
      .attr('fill',opts.color).attr('opacity',0.8).attr('rx',3)
      .transition().duration(800).delay(function(_,i){ return i*80; })
      .attr('width',function(d) { return x(+d[opts.valueKey]); });

    svg.selectAll('.peer-val').data(peers).enter().append('text')
      .attr('y',function(d) { return y(d[opts.labelKey]) + y.bandwidth()/2 + 4; })
      .attr('x',function(d) { return x(+d[opts.valueKey]) + 6; })
      .style('font-family','monospace').style('font-size','10px').style('fill',CSS.dim)
      .text(function(d) { return d[opts.valueKey]; });
  }

  /* ── Public API ─────────────────────────────────────────────── */
  return {
    sparkline: sparkline,
    lineChart: lineChart,
    barChart:  barChart,
    gauge:     gauge,
    peerBars:  peerBars,
    CSS:       CSS,
  };
})();

// Auto-init: scan for [data-d3-chart] elements
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-d3-chart]').forEach(function(el) {
    var type = el.getAttribute('data-d3-chart');
    var src  = el.getAttribute('data-d3-src');
    if (!src) return;
    fetch(src).then(function(r) { return r.json(); }).then(function(data) {
      if (type === 'sparkline' && Array.isArray(data)) {
        D3Charts.sparkline(el, data, { color: el.getAttribute('data-d3-color')||D3Charts.CSS.accent });
      } else if (type === 'line' && Array.isArray(data)) {
        D3Charts.lineChart(el, data, {
          xKey: el.getAttribute('data-d3-x')||'date',
          yKey: el.getAttribute('data-d3-y')||'value',
          color: el.getAttribute('data-d3-color')||D3Charts.CSS.accent
        });
      } else if (type === 'bar' && Array.isArray(data)) {
        D3Charts.barChart(el, data, {
          xKey: el.getAttribute('data-d3-x')||'label',
          yKey: el.getAttribute('data-d3-y')||'value',
          color: el.getAttribute('data-d3-color')||D3Charts.CSS.accent
        });
      }
    });
  });
});
