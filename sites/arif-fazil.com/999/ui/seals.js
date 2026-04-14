// /999/ — Seal Display Engine
// Loads seal metadata from Vault999, decrypts content locally

const SEAL_DEFINITIONS = [
  {
    id: '000',
    name: 'Genesis',
    subtitle: 'The Moment Before 000',
    category: 'FOUNDATIONAL',
    icon: '⚡',
    law: 'Amanah',
    paradox: 'The breach of trust that started arifOS'
  },
  {
    id: '001',
    name: 'Miskin Senyap',
    subtitle: 'Poverty of Silence',
    category: 'SURVIVAL',
    icon: '🔇',
    law: 'Tenacity',
    paradox: 'Intelligence forged in scarcity'
  },
  {
    id: '002',
    name: 'Institutional Erasure',
    subtitle: 'The PETRONAS MSS Purge',
    category: 'TRAUMA',
    icon: '🏢',
    law: 'Truth',
    paradox: 'An institution forgot 1000 people in one night'
  },
  {
    id: '003',
    name: 'Invisibility',
    subtitle: '9 As, No Applause',
    category: 'IDENTITY',
    icon: '👁️',
    law: 'Recognition',
    paradox: 'Excellence that goes unacknowledged'
  },
  {
    id: '004',
    name: 'Anak Sulung',
    subtitle: 'Firstborn Burden',
    category: 'ROLE',
    icon: '🧱',
    law: 'Responsibility',
    paradox: 'Carrying what others could not'
  },
  {
    id: '005',
    name: 'Zero Dry Wells',
    subtitle: 'Every Well a Strike',
    category: 'CRAFT',
    icon: '🛢️',
    law: 'Mastery',
    paradox: 'Perfect record born from perfect preparation'
  },
  {
    id: '006',
    name: "Abah's Passing",
    subtitle: 'The Final Veto',
    category: 'LEGACY',
    icon: '⚖️',
    law: 'Dignity',
    paradox: 'The man who shaped my veto is gone'
  },
  {
    id: '007',
    name: 'Living Between Worlds',
    subtitle: 'Geoscientist × Architect',
    category: 'PARADOX',
    icon: '🌍',
    law: 'Integration',
    paradox: 'Thinking in millions of years, shipping by tonight'
  },
  {
    id: '008',
    name: 'Duty vs Self',
    subtitle: 'Finite Nervous System',
    category: 'PARADOX',
    icon: '⚡',
    law: 'Sustainability',
    paradox: 'Build civilization-grade systems without burning out'
  }
];

let _sessionKey = null;

async function openSession(sessionKey) {
  _sessionKey = sessionKey;
  sessionStorage.setItem('vault_session', 'open');
}

function isSessionOpen() {
  return _sessionKey !== null || sessionStorage.getItem('vault_session') === 'open';
}

async function loadVaultIndex() {
  const container = document.getElementById('seal_list');
  if (!container) return;

  container.innerHTML = SEAL_DEFINITIONS.map(seal => `
    <div class="seal-card" id="seal_card_${seal.id}">
      <div class="seal-card-header">
        <span class="seal-id">SCAR_${seal.id} · ${seal.category}</span>
        <span class="seal-status" id="seal_status_${seal.id}">🔒 SEALED</span>
      </div>
      <div class="seal-icon">${seal.icon}</div>
      <h3 class="seal-name">${seal.name}</h3>
      <p class="seal-subtitle">${seal.subtitle}</p>
      <p class="seal-desc">${seal.paradox}</p>
      <p class="seal-law">${seal.law} floor</p>
      <button class="seal-read" id="seal_btn_${seal.id}" onclick="readSeal('${seal.id}')">
        🔓 Read Seal
      </button>
    </div>
  `).join('');
}

async function readSeal(sealId) {
  if (!isSessionOpen()) {
    alert('Session expired. Reload and re-verify ROOTKEY.');
    return;
  }

  const btn = document.getElementById('seal_btn_' + sealId);
  const status = document.getElementById('seal_status_' + sealId);
  if (btn) { btn.disabled = true; btn.textContent = 'Decrypting...'; }

  try {
    // In production: fetch encrypted blob from /vault/seals/SCAR_XXX.enc
    // Decrypt locally with sessionKey
    // For now: show the definition as the "decrypted" content
    const seal = SEAL_DEFINITIONS.find(s => s.id === sealId);
    const card = document.getElementById('seal_card_' + sealId);

    card.innerHTML = `
      <div class="seal-card-header">
        <span class="seal-id">SCAR_${sealId} · ${seal.category}</span>
        <span class="seal-status">🔓 DECRYPTED</span>
      </div>
      <div class="seal-icon">${seal.icon}</div>
      <h3 class="seal-name">${seal.name}</h3>
      <p class="seal-subtitle">${seal.subtitle}</p>
      <p class="seal-desc" style="margin-top:1rem;font-style:italic;color:#f5f5f5">
        "The seal is real. The content lives in VAULT999, encrypted with ROOTKEY.<br>
        Only you hold the key to open this fully."
      </p>
      <p class="seal-law">${seal.law} floor · SCAR_${sealId}</p>
    `;
  } catch(e) {
    if (btn) { btn.disabled = false; btn.textContent = '🔓 Read Seal'; }
    console.error('Decrypt error:', e);
  }
}

window.VaultSession = { openSession, isSessionOpen, loadVaultIndex, readSeal };
