// panel-boundary.js — Universal Fallback Pattern
// Part of SEAL_SESSION_arif-2026-06-27-001
// DITEMPA BUKAN DIBERI
//
// Usage:
//   const panel = new PanelBoundary('my-panel', '<p>Loading...</p>', 3000);
//   panel.arm();
//   // ... fetch data ...
//   panel.resolve();  // or panel.error('Failed')

class PanelBoundary {
  constructor(id, fallbackHTML, timeoutMs = 3000) {
    this.el = document.getElementById(id);
    this.fallback = fallbackHTML;
    this.timeout = null;
    this.timeoutMs = timeoutMs;
  }

  arm() {
    if (this.el) {
      this.el.setAttribute('data-state', 'loading');
    }
    this.timeout = setTimeout(() => this.showFallback(), this.timeoutMs);
  }

  resolve() {
    clearTimeout(this.timeout);
    if (this.el) {
      this.el.setAttribute('data-state', 'live');
    }
  }

  showFallback() {
    if (this.el) {
      this.el.innerHTML = this.fallback;
      this.el.setAttribute('data-state', 'fallback');
    }
  }

  error(msg) {
    clearTimeout(this.timeout);
    if (this.el) {
      this.el.innerHTML = `<p class="error-message">${msg}</p>`;
      this.el.setAttribute('data-state', 'error');
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PanelBoundary;
}
