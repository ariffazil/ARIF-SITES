// Unified Header Loader — arifOS Federation
// Include: <script src="/_shared/unified-header-loader.js"></script>
// Product pages: set <html data-header="product"> for compact chronometer.
(function(){
  var base = document.querySelector('script[src*="unified-header-loader"]');
  if(!base) base = {src:'/_shared/'};
  var src = base.src.replace(/[^\/]*$/, 'unified-header.html?v=20260718');
  // Propagate product mode onto body once header is injected
  var product = document.documentElement.getAttribute('data-header') === 'product';
  fetch(src).then(function(r){return r.text()}).then(function(html){
    document.body.classList.add('has-federation-header');
    if (product) document.body.setAttribute('data-header', 'product');
    // CRITICAL: <script> tags inserted via insertAdjacentHTML do NOT execute per HTML5 spec.
    // Extract scripts, render HTML, then manually execute each script after DOM insertion.
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var scripts = Array.prototype.slice.call(tmp.querySelectorAll('script'));
    scripts.forEach(function(s){ s.parentNode.removeChild(s); });
    document.body.insertAdjacentHTML('afterbegin', tmp.innerHTML);
    scripts.forEach(function(s){
      var ns = document.createElement('script');
      Array.prototype.forEach.call(s.attributes, function(a){ ns.setAttribute(a.name, a.value); });
      ns.textContent = s.textContent;
      document.body.appendChild(ns);
    });
  }).catch(function(){});
})();
