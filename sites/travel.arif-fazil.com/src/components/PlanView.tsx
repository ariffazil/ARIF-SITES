import { useState } from 'react';
import { Clock, CheckCircle2, Circle, MapPin, Navigation, Car, Coffee, BedDouble, Camera } from 'lucide-react';

interface PlanItem {
  time: string;
  label: string;
  done: boolean;
  active: boolean;
  type: 'travel' | 'activity' | 'food' | 'rest' | 'photo';
}

interface DayPlan {
  day: string;
  title: string;
  status: 'IN PROGRESS' | 'PLANNED' | 'COMPLETED';
  items: PlanItem[];
}

const defaultPlan: DayPlan[] = [
  {
    day: 'DAY 1 (FRI)',
    title: 'ARRIVAL',
    status: 'IN PROGRESS',
    items: [
      { time: '08:00', label: 'Border Cross & Sadao', done: true, active: false, type: 'travel' },
      { time: '09:30', label: 'Coffee at Niim Hatyai', done: false, active: true, type: 'food' },
      { time: '11:00', label: 'Kim Yong Market', done: false, active: false, type: 'activity' },
      { time: '13:00', label: 'Check-in Lee Gardens Plaza', done: false, active: false, type: 'rest' },
      { time: '15:00', label: 'Wat Hat Yai Nai (Big Buddha)', done: false, active: false, type: 'photo' },
      { time: '19:00', label: 'Dinner at The Second Hatyai', done: false, active: false, type: 'food' },
    ],
  },
  {
    day: 'DAY 2 (SAT)',
    title: 'EXPLORATION',
    status: 'PLANNED',
    items: [
      { time: '07:00', label: 'Morning run at Municipal Park', done: false, active: false, type: 'activity' },
      { time: '09:00', label: 'Ton Nga Chang Waterfall', done: false, active: false, type: 'photo' },
      { time: '12:30', label: 'Lunch at Krua Pa-Yad', done: false, active: false, type: 'food' },
      { time: '14:00', label: 'ASEAN Night Bazaar', done: false, active: false, type: 'activity' },
      { time: '17:00', label: 'Drive to Songkhla Old Town', done: false, active: false, type: 'travel' },
      { time: '20:00', label: 'Sunset at Samila Beach', done: false, active: false, type: 'photo' },
    ],
  },
];

const typeIcon = {
  travel: Car,
  activity: MapPin,
  food: Coffee,
  rest: BedDouble,
  photo: Camera,
};

export default function PlanView() {
  const [plan] = useState<DayPlan[]>(defaultPlan);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 space-y-4">
      {/* Live Route Spine */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-xs font-bold text-zinc-500 mb-4 tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-2">
          <Navigation size={14} className="text-emerald-400" />
          LIVE ROUTE SPINE
        </div>
        <div className="relative pl-4">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-800" />
          {plan.map((day, di) =>
            day.items.map((item, ii) => {
              const Icon = typeIcon[item.type];
              return (
                <div key={`${di}-${ii}`} className="relative flex gap-3 mb-3 last:mb-0">
                  <div
                    className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      item.active
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : item.done
                        ? 'border-zinc-600 bg-zinc-800'
                        : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {item.done ? (
                      <CheckCircle2 size={10} className="text-zinc-500" />
                    ) : item.active ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ) : (
                      <Circle size={10} className="text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">{item.time}</span>
                      <Icon size={10} className="text-zinc-600" />
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        item.active
                          ? 'text-emerald-400 font-medium'
                          : item.done
                          ? 'text-zinc-500 line-through'
                          : 'text-zinc-300'
                      }`}
                    >
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Day Cards */}
      {plan.map((day) => (
        <div key={day.day} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-300">
              {day.day} : {day.title}
            </span>
            <span
              className={`text-[9px] px-2 py-0.5 rounded ${
                day.status === 'IN PROGRESS'
                  ? 'bg-emerald-900/30 text-emerald-400'
                  : day.status === 'COMPLETED'
                  ? 'bg-zinc-800 text-zinc-500'
                  : 'bg-zinc-800/50 text-zinc-500'
              }`}
            >
              {day.status}
            </span>
          </div>
          <div className="space-y-1 mt-2">
            {day.items.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-[10px] ${
                  item.done ? 'line-through opacity-50 text-zinc-500' : item.active ? 'text-emerald-400' : 'text-zinc-400'
                }`}
              >
                <span className="text-zinc-600 font-mono w-8 shrink-0">{item.time}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
