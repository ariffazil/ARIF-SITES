import { useEffect } from 'react';
import { usePlaces } from '@/hooks/usePlaces';
import { Star, MapPin, Loader2, Search } from 'lucide-react';

interface Props {
  query: string;
}

export default function PlaceNodes({ query }: Props) {
  const { results, loading, error, search } = usePlaces();

  useEffect(() => {
    if (query.trim()) {
      search(query);
    } else {
      search('restaurants in Hat Yai Thailand');
    }
  }, [query]);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xs font-bold text-zinc-500 tracking-wider flex items-center gap-2">
          <Search size={14} />
          PLACE NODES
        </h2>
        {loading && <Loader2 size={14} className="text-emerald-400 animate-spin" />}
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="text-xs text-zinc-600 text-center py-8">No places found. Search above.</div>
      )}

      {results.map((place) => (
        <div
          key={place.place_id}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-emerald-500/30 transition-colors group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                {place.name}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{place.formatted_address}</div>
            </div>
            {place.rating && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-zinc-300 font-mono">{place.rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {place.types?.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded capitalize">
                {t.replace(/_/g, ' ')}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-600">
              <MapPin size={10} />
              <span className="font-mono">
                {place.geometry.location.lat.toFixed(4)},{place.geometry.location.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
