import { useState } from 'react';
import { Map, Calendar, Search, Bot, Navigation, MapPin } from 'lucide-react';
import MapView from './components/MapView';
import PlanView from './components/PlanView';
import PlaceNodes from './components/PlaceNodes';
import AgentChat from './components/AgentChat';

export type TabName = 'map' | 'plan' | 'places' | 'agent';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('map');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400" />
          <h1 className="text-sm font-bold tracking-wider text-zinc-100">
            Ξ TRAVEL <span className="text-emerald-400">LWM</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Agent Online
          </span>
        </div>
      </header>

      {/* Search Bar (global) */}
      <div className="shrink-0 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveTab('places');
              }
            }}
            placeholder="Where to? (e.g., best cafe in Hat Yai)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'plan' && <PlanView />}
        {activeTab === 'places' && <PlaceNodes query={searchQuery} />}
        {activeTab === 'agent' && <AgentChat />}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="shrink-0 bg-zinc-950 border-t border-zinc-800 grid grid-cols-4">
        <TabButton
          name="map"
          label="Map"
          icon={Map}
          active={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
        />
        <TabButton
          name="plan"
          label="Plan"
          icon={Calendar}
          active={activeTab === 'plan'}
          onClick={() => setActiveTab('plan')}
        />
        <TabButton
          name="places"
          label="Places"
          icon={Search}
          active={activeTab === 'places'}
          onClick={() => setActiveTab('places')}
        />
        <TabButton
          name="agent"
          label="Agent"
          icon={Bot}
          active={activeTab === 'agent'}
          onClick={() => setActiveTab('agent')}
        />
      </nav>
    </div>
  );
}

function TabButton({
  name,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  name: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-3 border-t-2 transition-all ${
        active
          ? 'border-emerald-500 text-emerald-400 bg-zinc-900'
          : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 bg-black'
      }`}
    >
      <Icon size={20} className="mb-1" />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
