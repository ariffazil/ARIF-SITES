import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin, Navigation, Loader2 } from 'lucide-react';
import { usePlaces } from '@/hooks/usePlaces';
import { useDirections } from '@/hooks/useDirections';

interface Message {
  role: 'user' | 'agent';
  text: string;
  actions?: { label: string; type: 'search' | 'route'; payload: string }[];
}

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      text: 'Salam, Arif. I am your travel clerk. Ask me to find places, plan routes, or reason about your journey.',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { search: searchPlaces } = usePlaces();
  const { getDirections } = useDirections();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setThinking(true);

    // Simple intent detection (replace with real LLM via arifOS MCP)
    const lower = userText.toLowerCase();
    let reply: Message = { role: 'agent', text: '' };

    if (lower.includes('route') || lower.includes('direction') || lower.includes('from') && lower.includes('to')) {
      // Extract origin/destination with simple heuristic
      const parts = userText.split(/\b(?:from|to)\b/i);
      if (parts.length >= 3) {
        const origin = parts[1].trim().replace(/[?,]/g, '');
        const dest = parts[2].trim().replace(/[?,]/g, '');
        reply = {
          role: 'agent',
          text: `I can route from **${origin}** to **${dest}**. Shall I calculate the driving directions?`,
          actions: [{ label: `Route: ${origin} → ${dest}`, type: 'route', payload: `${origin}|${dest}` }],
        };
      } else {
        reply = { role: 'agent', text: 'To plan a route, say: "Route from Penang to Hat Yai"' };
      }
    } else if (lower.includes('find') || lower.includes('best') || lower.includes('restaurant') || lower.includes('hotel') || lower.includes('cafe')) {
      reply = {
        role: 'agent',
        text: `I will search for "${userText}" using Google Places.`,
        actions: [{ label: `Search: ${userText}`, type: 'search', payload: userText }],
      };
    } else if (lower.includes('hello') || lower.includes('salam')) {
      reply = { role: 'agent', text: 'Waalaikumussalam. Ready to navigate the world model.' };
    } else {
      reply = {
        role: 'agent',
        text: 'I understand you want to travel intelligently. Try:\n• "Find best dessert in Hat Yai"\n• "Route from Penang to Hat Yai"\n• "Hotels near Kim Yong Market"',
      };
    }

    // Simulate reasoning delay
    setTimeout(() => {
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
    }, 600);
  };

  const runAction = async (action: NonNullable<Message['actions']>[0]) => {
    if (action.type === 'search') {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: `🔍 Searching places for "${action.payload}"...` },
      ]);
      await searchPlaces(action.payload);
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: '✅ Results loaded. Switch to **Map** or **Places** tab to view.' },
      ]);
    } else if (action.type === 'route') {
      const [origin, dest] = action.payload.split('|');
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: `🧭 Calculating route from ${origin} to ${dest}...` },
      ]);
      const route = await getDirections(origin, dest, 'driving');
      if (route) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            text: `✅ Route ready: **${route.legs[0].distance.text}**, **${route.legs[0].duration.text}**. Switch to **Map** tab to see the polyline.`,
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'agent', text: '❌ Could not calculate route.' }]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'agent' && (
              <div className="w-6 h-6 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[80%] ${m.role === 'user' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-900 text-zinc-300'} text-xs p-2.5 rounded-lg border ${m.role === 'user' ? 'border-zinc-700' : 'border-zinc-800'}`}>
              <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
              {m.actions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {m.actions.map((a, ai) => (
                    <button
                      key={ai}
                      onClick={() => runAction(a)}
                      className="flex items-center gap-1 text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded hover:bg-emerald-900/50 transition-colors"
                    >
                      {a.type === 'search' ? <MapPin size={10} /> : <Navigation size={10} />}
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-zinc-400" />
              </div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Loader2 size={12} className="text-emerald-400 animate-spin" />
            </div>
            <div className="bg-zinc-900 text-zinc-500 text-xs p-2.5 rounded-lg border border-zinc-800">Reasoning...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your travel clerk..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={thinking || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-md transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="text-[9px] text-zinc-600 mt-1.5 text-center">
          Powered by arifOS · Google Places · GEOX Mobility
        </div>
      </div>
    </div>
  );
}
