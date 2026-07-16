// Unified Header Loader — arifOS Federation
// Include this script in any site: <script src="/_shared/unified-header-loader.js"></script>
// It fetches unified-header.html and injects it at the top of <body>
(function(){
  var base = document.querySelector('script[src*="unified-header-loader"]');
  if(!base) base = {src:'/_shared/'};
  var src = base.src.replace(/[^\/]*$/, 'unified-header.html');
  fetch(src).then(function(r){return r.text()}).then(function(html){
    document.body.insertAdjacentHTML('afterbegin', html);
  }).catch(function(){});
})();
