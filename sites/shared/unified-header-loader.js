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
    document.body.insertAdjacentHTML('afterbegin', html);
  }).catch(function(){});
})();
