/**
 * chart-init.js — Auto-initialize D3 visualizations on arif-fazil.com economics pages.
 * Forged 2026-08-07 by 333-AGI.
 * 
 * Scans for #mainChart + wealth-reality-packet JSON → renders D3 price bar.
 * Falls back gracefully. Zero config per page.
 */
(function() {
  'use strict';
  if (typeof d3 === 'undefined') return; // D3 not loaded

  var chartEl = document.getElementById('mainChart');
  if (!chartEl) return;

  // Find the wealth reality packet
  var packetEl = document.getElementById('wealth-reality-packet');
  if (!packetEl) {
    // Fallback: try data/markets/*.json
    var path = window.location.pathname.replace(/\/+$/,'');
    var slug = path.split('/').pop();
    fetch('/data/markets/'+slug+'_digest.json')
      .then(function(r){ return r.json(); })
      .then(function(d){ renderFromDigest(d); })
      .catch(function(){ chartEl.innerHTML = '<p style="color:var(--dim);font-family:monospace;font-size:12px;padding:40px;text-align:center">[Live chart data loading — refresh for latest]</p>'; });
    return;
  }

  try {
    var packet = JSON.parse(packetEl.textContent);
    renderFromPacket(packet);
  } catch(e) {
    chartEl.innerHTML = '<p style="color:var(--dim);font-family:monospace;font-size:12px;padding:40px;text-align:center">[Chart data parse error]</p>';
  }

  function renderFromPacket(packet) {
    var state = packet.market_state || packet.ticker || {};
    var price = state.price_usd || state.price || 0;
    var levels = state.key_levels || packet.levels || {};
    var support = levels.support || [];
    var resistance = levels.resistance || [];
    var rsi = state.rsi_14 || state.rsi || 50;
    var emaTrend = state.ema_trend || state.emaTrend || 'NEUTRAL';

    var W = chartEl.clientWidth || 700;
    var H = 450;
    var M = {top:20, right:40, bottom:40, left:60};

    var svg = d3.select(chartEl).append('svg')
      .attr('width',W).attr('height',H);
    var g = svg.append('g').attr('transform','translate('+M.left+','+M.top+')');
    var iW = W - M.left - M.right;
    var iH = H - M.top - M.bottom;

    // Theme
    var ink  = getComputedStyle(document.documentElement).getPropertyValue('--ink')  || '#EDEAE2';
    var dim  = getComputedStyle(document.documentElement).getPropertyValue('--dim')  || '#8A8378';
    var lineC = getComputedStyle(document.documentElement).getPropertyValue('--line') || '#2A2A3A';
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#D4A853';
    var up = '#22C55E', down = '#EF4444';

    // Price zone
    var allLevels = support.concat(resistance).concat([price]);
    var yMin = Math.min.apply(null, allLevels) * 0.98;
    var yMax = Math.max.apply(null, allLevels) * 1.02;
    var y = d3.scaleLinear().domain([yMin, yMax]).range([iH, 0]);

    // Grid
    g.append('g').attr('class','grid').call(d3.axisLeft(y).ticks(8).tickSize(-iW).tickFormat('')).style('color',lineC).style('stroke-dasharray','2,3');

    // Support zone (green band)
    if (support.length >= 2) {
      g.append('rect').attr('x',0).attr('width',iW)
        .attr('y',y(support[0])).attr('height',y(support[support.length-1])-y(support[0]))
        .attr('fill',up).attr('opacity',0.06);
    }
    // Resistance zone (red band)
    if (resistance.length >= 2) {
      g.append('rect').attr('x',0).attr('width',iW)
        .attr('y',y(resistance[resistance.length-1])).attr('height',y(resistance[0])-y(resistance[resistance.length-1]))
        .attr('fill',down).attr('opacity',0.06);
    }

    // Support lines
    support.forEach(function(s,i) {
      g.append('line').attr('x1',0).attr('x2',iW).attr('y1',y(s)).attr('y2',y(s))
        .attr('stroke',up).attr('stroke-width',1).attr('stroke-dasharray','4,3').attr('opacity',0.5);
      g.append('text').attr('x',iW-2).attr('y',y(s)-4).attr('text-anchor','end')
        .style('font-family','monospace').style('font-size','9px').style('fill',up)
        .text('S'+(i+1)+' '+s.toFixed(2));
    });

    // Resistance lines
    resistance.forEach(function(r,i) {
      g.append('line').attr('x1',0).attr('x2',iW).attr('y1',y(r)).attr('y2',y(r))
        .attr('stroke',down).attr('stroke-width',1).attr('stroke-dasharray','4,3').attr('opacity',0.5);
      g.append('text').attr('x',iW-2).attr('y',y(r)-4).attr('text-anchor','end')
        .style('font-family','monospace').style('font-size','9px').style('fill',down)
        .text('R'+(resistance.length-i)+' '+r.toFixed(2));
    });

    // Price line (large horizontal)
    g.append('line').attr('x1',0).attr('x2',iW).attr('y1',y(price)).attr('y2',y(price))
      .attr('stroke',accent).attr('stroke-width',2.5);
    
    // Price label bubble
    g.append('rect').attr('x',iW-110).attr('y',y(price)-16).attr('width',108).attr('height',22).attr('rx',6)
      .attr('fill',accent).attr('opacity',0.9);
    g.append('text').attr('x',iW-56).attr('y',y(price)-1).attr('text-anchor','middle')
      .style('font-family','monospace').style('font-size','12px').style('font-weight','bold').style('fill','#0A0B0D')
      .text('$'+price.toFixed(2));

    // Y-axis
    g.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(function(d){return d.toFixed(1);}))
      .style('color',dim).style('font-family','monospace').style('font-size','10px');

    // Bottom metrics bar
    var metrics = [
      {label:'RSI',value:rsi.toFixed(1),color:rsi>70?down:rsi<30?up:dim},
      {label:'EMA Trend',value:emaTrend,color:emaTrend==='BULLISH'?up:emaTrend==='BEARISH'?down:dim},
      {label:'S'+support.length,value:support.join('/'),color:up},
      {label:'R'+resistance.length,value:resistance.join('/'),color:down}
    ];

    var mBar = svg.append('g').attr('transform','translate('+M.left+','+(H-8)+')');
    var xPos = 0;
    metrics.forEach(function(m) {
      var txt = mBar.append('text').attr('x',xPos).attr('y',0)
        .style('font-family','monospace').style('font-size','10px').style('fill',dim);
      txt.append('tspan').text(m.label+': ').style('font-weight','bold');
      txt.append('tspan').text(m.value).style('fill',m.color);
      xPos += txt.node().getComputedTextLength() + 20;
    });

    // Pulse dot
    svg.append('circle').attr('cx',14).attr('cy',H-6).attr('r',3.5).attr('fill',up)
      .append('animate').attr('attributeName','opacity').attr('values','1;0.3;1').attr('dur','2s').attr('repeatCount','indefinite');
    svg.append('text').attr('x',22).attr('y',H-3)
      .style('font-family','monospace').style('font-size','8px').style('fill',dim)
      .text('LIVE');
  }

  function renderFromDigest(d) {
    var price = d.price_usd || 0;
    chartEl.innerHTML = '<div style="padding:40px;text-align:center;color:var(--accent);font-family:monospace;font-size:14px">'+
      (d.one_liner ? d.one_liner.en : 'Price: $'+price)+'</div>';
  }
})();
