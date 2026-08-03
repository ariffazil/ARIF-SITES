// ═══ DUAL-NAMESPACE 7-AXIS DATA ═══
// Canonical SOT for the 7-axis skeleton.
// /read is the DEFAULT lens (meaning/linguistics).
// /politics inherits from this data (lens="power").
// One source of truth. Two substrates. Seven invariant verbs.
//
// F2 TRUTH: this mirrors nusantara_atlas.geojson.
// Nusantara's blindness REQUIRED on BOTH faces.

export interface AxisPower {
  sees: string;
  thesis: string;
  gift: string;
  blindness: string;
  levers: string[];
  frictionPoints: string[];
}

export interface AxisMeaning {
  sees: string;
  thesis: string;
  gift: string;
  blindness: string;
  exemplars: string[];
}

export interface AxisVector {
  id: number;
  code: string;
  name: string;
  region: string;
  color: string;
  verb: string;
  power: AxisPower;
  meaning: AxisMeaning;
  mirrorOf: number;
}

/**
 * The canonical 7-axis dataset — dual-namespace.
 * /read consumes this with lens="meaning" (default).
 * /politics consumes this with lens="power".
 */
export const STATIC_AXES: AxisVector[] = [
  {
    id: 1, code: 'ATLANTIC', name: 'Western Maritime Alliance',
    region: 'United States, NATO, G7, Anglosphere',
    color: '#3b82f6', verb: 'specify', mirrorOf: 2,
    power: {
      sees: 'rules-based maritime order',
      thesis: 'Blue-water naval dominance, USD reserve currency, advanced semiconductor IP, and international contract law enforcement. Open sea, open contracts.',
      gift: 'precision — builds compilers, courts, and treaties that scale globally',
      blindness: 'reification — believes language describes reality rather than creating it. Cannot explain why arif_init creates a session.',
      levers: ['USD FX Clearing', 'Chip Export Bans', 'NATO Article 5'],
      frictionPoints: ['South China Sea freedom of navigation', 'Taiwan Strait defense', 'Ukraine Eastern frontier'],
    },
    meaning: {
      sees: 'language as code',
      thesis: 'Language is a formal system — syntax, semantics, rules, contracts. Frege\'s predicate logic. Chomsky\'s universal grammar. Austin\'s performative (Oxford 1955): "I name this ship" IS the naming. Words that DO rather than describe.',
      gift: 'gave us programming languages, international law, the performative — the vocabulary to state that arif_init creates a session',
      blindness: 'believes language describes reality rather than creating it — built compilers but didn\'t understand why arif_init creates a session until Austin',
      exemplars: ['Frege (Begriffsschrift, 1879)', 'early Wittgenstein (Tractatus, 1922)', 'J.L. Austin (How to Do Things with Words, 1955)'],
    },
  },
  {
    id: 2, code: 'HEARTLAND', name: 'Eurasian Continental Bloc',
    region: 'Russia, Central Asian Steppe, Belarus',
    color: '#ef4444', verb: 'hold', mirrorOf: 1,
    power: {
      sees: 'continental territorial depth',
      thesis: 'Vast territorial depth, energy & grain export, buffer state security, and nuclear strategic parity.',
      gift: 'depth — the novel, the epic, the untranslatable Russian toska',
      blindness: 'possessiveness — every word carries the weight of the soil; translation is incursion',
      levers: ['Pipeline Hydrocarbons', 'Nuclear Parity', 'Fertilizer & Grain'],
      frictionPoints: ['NATO Eastern expansion', 'Central Asian trade routes', 'Caucasus regional stability'],
    },
    meaning: {
      sees: 'language as territory',
      thesis: 'Language is sovereign ground. Words are borders. Dialects are buffer zones. Bakhtin\'s dialogism: every utterance is a battlefield between centripetal (centralizing) and centrifugal (dispersing) forces.',
      gift: 'dialogism — language as current, theorized from the Heartland. Bakhtin saw the bridge from axis ②.',
      blindness: 'can\'t let go — translation is not discovery; it\'s incursion. The word is soil.',
      exemplars: ['Bakhtin (The Dialogic Imagination)', 'Dostoevsky (the untranslatable soul)', 'Russian toska — no direct English equivalent'],
    },
  },
  {
    id: 3, code: 'SINIC', name: 'Sinic Industrial Capacity',
    region: 'China, East Asian Supply Chain',
    color: '#eab308', verb: 'align', mirrorOf: 4,
    power: {
      sees: 'manufacturing supremacy + state-directed capitalism',
      thesis: 'Manufacturing supremacy, rare-earth processing monopoly, infrastructure export via Belt & Road, state-directed capitalism.',
      gift: 'civilizational scale — language is the tool that orders society from above',
      blindness: 'rigidity — the mandate flows down, never bubbles up. The Emperor\'s edict rearranges the world but doesn\'t listen.',
      levers: ['Rare Earth Metals', 'BRI Loans', 'Global Manufacturing Share'],
      frictionPoints: ['Taiwan unification claim', 'Nine-Dash Line maritime EEZ', 'US tech embargoes'],
    },
    meaning: {
      sees: 'language as harmony',
      thesis: 'Language is alignment with the cosmic order. The character IS the worldview — 和 (harmony), 道 (the Way), 正名 (zhèngmíng, the Rectification of Names). Confucius: "If names are not correct, language is not in accord with truth."',
      gift: 'language as civilization — the brushstroke is not representation; it is ritual',
      blindness: 'the hierarchy of who speaks and who listens — the mandate flows down, never bubbles up',
      exemplars: ['Confucius (zhèngmíng — Rectification of Names)', '和 hé — harmony in a single character', 'the brushstroke as ritual, not representation'],
    },
  },
  {
    id: 4, code: 'BHARAT', name: 'Indo-Pacific Democratic Core',
    region: 'India, Subcontinent, Indian Ocean Rim',
    color: '#f97316', verb: 'resonate', mirrorOf: 3,
    power: {
      sees: 'demographic scale + strategic multi-alignment',
      thesis: 'Demographic scale, strategic non-alignment (multi-alignment), IT/pharma export, Indian Ocean maritime security.',
      gift: 'plurality — order emerges from infinite interplay, not imposed structure',
      blindness: 'infinite plurality can become infinite ambiguity — when everything resonates, nothing anchors',
      levers: ['IT/Services Supply', 'QUAD Participation', 'Strategic Non-Alignment'],
      frictionPoints: ['Himalayan border friction (LAC)', 'Malacca Strait balance', 'Pakistan border tension'],
    },
    meaning: {
      sees: 'language as vibration',
      thesis: 'Language is śabda — sound that creates reality. AUM precedes the universe. The mantra IS the deity, not a description. Pāṇini\'s Aṣṭādhyāyī (4th century BCE): 3,959 rules generating Sanskrit with algorithmic precision.',
      gift: 'language as physics — meaning has layers: literal (vācyārtha), suggested (dhvani), and the space between words',
      blindness: 'infinite resonance can become infinite ambiguity — when everything vibrates, nothing grounds',
      exemplars: ['Pāṇini (Aṣṭādhyāyī, ~350 BCE — 3,959 rules)', 'AUM — sound that precedes the universe', 'dhvani — the suggested meaning between words'],
    },
  },
  {
    id: 5, code: 'DAR', name: 'Middle East Energy & Islamic Hub',
    region: 'GCC, Iran, Levant, North Africa',
    color: '#10b981', verb: 'witness', mirrorOf: 6,
    power: {
      sees: 'global crude & LNG reserves + Islamic cultural leadership',
      thesis: 'Global crude & LNG reserves, sovereign wealth fund capital deployment, Islamic cultural leadership, maritime chokepoints (Hormuz, Bab-el-Mandeb).',
      gift: 'the bridge between human and divine — language as witness, not description',
      blindness: 'when revelation becomes the only valid language, translation becomes impossible — the gap between sacred text and lived reality widens',
      levers: ['OPEC+ Quotas', 'SWF Capital ($3T+)', 'LNG & Crude Exports'],
      frictionPoints: ['Red Sea / Bab-el-Mandeb threats', 'Strait of Hormuz transit', 'Israel-Palestine escalation'],
    },
    meaning: {
      sees: 'language as revelation',
      thesis: 'The Qur\'an IS the word of God — not a representation, but divine truth itself descended into Arabic. The doctrine of i\'jāz (inimitability): no human can produce language equal to it. "Kun fayakun" — "Be, and it is." The ultimate naming-as-creation.',
      gift: 'language as the bridge between human and divine — recitation (tajwīd) is not reading; it\'s communion',
      blindness: 'when revelation becomes the only valid language, the gap between the sacred text and lived reality widens — translation becomes heresy',
      exemplars: ['Qur\'an — i\'jāz (inimitability) as the ultimate language claim', 'kun fayakun — "Be, and it is" (naming as creation)', 'tajwīd — recitation as communion, not reading'],
    },
  },
  {
    id: 6, code: 'GONDWANA', name: 'Global South & Critical Minerals',
    region: 'Sub-Saharan Africa, Latin America',
    color: '#d97706', verb: 'reclaim', mirrorOf: 5,
    power: {
      sees: 'critical minerals + post-colonial voting bloc',
      thesis: 'Energy-transition raw materials (Lithium, Cobalt, Copper, Nickel), massive youth demographic, post-colonial non-aligned voting block.',
      gift: 'the awareness that every language choice is political — oral, communal, creole as synthesis-under-duress',
      blindness: 'the trauma lens can obscure genuine universality — not every English sentence is colonialism',
      levers: ['Lithium & Cobalt Reserves', 'UN Voting Block', 'Youth Labor Force'],
      frictionPoints: ['Value-chain extraction vs local refining', 'Debt restructuring', 'Resource sovereignty'],
    },
    meaning: {
      sees: 'language as resistance',
      thesis: 'Language is what was taken, and what must be reclaimed. Fanon: "To speak a language is to take on a world, a culture." Ngũgĩ wa Thiong\'o wrote Decolonising the Mind in Gikuyu — then translated it himself — because the colonizer\'s language is a structure of power.',
      gift: 'oral over literate, creole as synthesis-under-duress, language as the first resource extracted by colonizers',
      blindness: 'the trauma lens can obscure universality — Glissant saw the bridge (Poétique de la Relation) from axis ⑥, not ⑦',
      exemplars: ['Fanon (Black Skin, White Masks, 1952)', 'Ngũgĩ wa Thiong\'o (Decolonising the Mind, 1986)', 'Glissant (Poétique de la Relation, 1990 — créolisation)'],
    },
  },
  {
    id: 7, code: 'NUSANTARA', name: 'Nusantara Archipelagic Strait Pivot',
    region: 'Malaysia, Indonesia, Singapore, Philippines, Brunei',
    color: '#06b6d4', verb: 'refract', mirrorOf: 0,
    power: {
      sees: 'chokepoint sovereignty',
      thesis: 'The Crossroads of World Trade: control over Malacca, Sunda, and Lombok straits. Refracts global trade without taking military sides. ~⅓ of global trade + LNG passes the straits. Monsoon logic, not superpower alignment.',
      gift: 'refracts global trade without taking sides — ASEAN neutrality as architecture, not cowardice',
      blindness: 'divided rather than deciding — the pivot everyone wants, risk of being torn apart',
      levers: ['Strait of Malacca (~30% global trade)', 'Penang chip packaging', 'ASEAN neutrality'],
      frictionPoints: ['South China Sea EEZ encroachment', 'US-China dual dependency', 'Sarawak/Sabah PDA1974 gas rights'],
    },
    meaning: {
      sees: 'language as flow',
      thesis: 'The Crossroads of Meaning: language enters the strait from one direction and exits transformed. The pantun — four-line verse where the first couplet sets an image and the final couplet reframes it — is the purest expression: meaning is never direct, never fixed, always bending. Arif\'s BM-English code-switch isn\'t two languages — it\'s one strait owned.',
      gift: 'holds Wittgenstein\'s "limits of language" AND kun fayakun simultaneously without contradiction — the bridge is the mother tongue, not a dissident\'s breakthrough',
      blindness: 'mistakes being passed-through for doing the seeing — the strait doesn\'t understand the ships, it just touches all of them. The default, not the only. Being the crossroads is not the same as being the seer.',
      exemplars: ['pantun — four-line verse: image refracted into meaning', 'Penang BM-English code-switch — the unmarked case', 'Melaka contact zone — Sanskrit, Arabic, Portuguese, Dutch, English, Tamil, Chinese'],
    },
  },
];
