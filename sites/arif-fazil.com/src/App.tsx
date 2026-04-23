import { ConstellationNav } from '@/components/ConstellationNav';
import { ConstellationFooter } from '@/components/ConstellationFooter';
import { Home } from '@/pages/Home';

function App() {
  return (
    <div className="site-shell">
      <ConstellationNav />
      <main className="site-main">
        <Home />
      </main>
      <ConstellationFooter />
    </div>
  );
}

export default App;
