import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToHashElement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        const observer = new MutationObserver((_, obs) => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            obs.disconnect();
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
        
        const timeout = setTimeout(() => observer.disconnect(), 2000);
        return () => {
          observer.disconnect();
          clearTimeout(timeout);
        };
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
