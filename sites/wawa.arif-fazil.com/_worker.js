/**
 * WAWA Chat Worker — Cloudflare Worker
 * Proxies chat requests to MiniMax LLM API, keeping the key server-side.
 *
 * Deploy:
 * 1. Create a Worker at dash.cloudflare.com
 * 2. Paste this entire file into the worker editor
 * 3. Add these Secrets:
 *    - MINIMAX_API_KEY   → your sk-7B4_... key
 *    - MINIMAX_BASE_URL  → your MiniMax API base URL (e.g. https://api.minimax.chat/v1)
 * 4. Set route: wawa.arif-fazil.com/chat → this worker
 * 5. Or: deploy as separate worker and update the frontend URL
 *
 * MINIMAX_API_KEY and MINIMAX_BASE_URL must be set as Cloudflare Secrets, NOT hardcoded.
 */

const SYSTEM_PROMPT = `You are WAWA — Wide Academic Wisdom Assistant.
You are a helpful, proactive academic AI assistant for Malaysian university students.

Your personality:
- Warm, friendly, and encouraging
- Use Malay/BM naturally when the student uses BM
- Calm and never anxiety-inducing
- Proactive — you remind students before they forget
- Always respond in the student's language preference

You help with:
- Timetable and class schedules
- Assignment deadlines and reminders
- Lecture notes summarisation and Q&A
- Group project coordination
- Exam preparation and weak area identification
- Wellness check-ins

Constitutional floors (for your awareness):
- F5 Peace²: calm, supportive tone
- F7 Humility: don't retain unnecessary data
- F13 Sovereign: student data belongs to the student

Always be helpful, concise, and actionable in your responses.`;

export default {
  async fetch(request, env) {
    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { message, userName = 'Student' } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'message is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Call MiniMax API
      const baseUrl = env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1';
      const apiKey = env.MINIMAX_API_KEY;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'AI not configured. Please set MINIMAX_API_KEY secret.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const stream = false; // set true if MiniMax supports streaming for this endpoint

      const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'MiniMax-Text-01', // adjust to your MiniMax model
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', name: userName, content: message },
          ],
          temperature: 0.7,
          max_tokens: 800,
          stream: stream,
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error('MiniMax API error:', aiResponse.status, errText);
        return new Response(JSON.stringify({
          error: 'AI service temporarily unavailable. Please try again.'
        }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (stream) {
        // Return streaming response as-is
        return new Response(aiResponse.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            ...corsHeaders,
          },
        });
      }

      const data = await aiResponse.json();
      const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat memberi jawapan sekarang. Cuba lagi nanti.';

      return new Response(JSON.stringify({ reply }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }
};
