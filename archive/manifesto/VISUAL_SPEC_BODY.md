# Visual Spec: BODY Ring (aaa.arif-fazil.com)

## Primary Anomaly: Gold/Amber + Rounded Organic Forms

---

## Color Palette

```css
:root {
  /* Warm Dark */
  --body-void: #1a1410;
  --body-deep: #221a14;
  --body-mid: #2d2418;
  
  /* Single Accent: Amber/Gold */
  --body-gold: #d4a853;
  --body-amber: #b8934c;
  --body-gold-glow: rgba(212, 168, 83, 0.3);
  
  /* Status Colors */
  --status-live: #22c55e;
  --status-down: #ef4444;
  
  /* Text */
  --text-primary: #f5f0e8;
  --text-dim: #a89a84;
  --text-muted: #6b5d4d;
}
```

---

## Typography

**Primary**: Inter (friendly, legible)
- Headings: 600 weight
- Body: 400 weight  
- Data: 500 weight, tabular nums

**Secondary**: JetBrains Mono (for code/endpoints only)

---

## Geometry

**Rounded Organic**:
- Border radius: 12px+ (generous)
- Pill-shaped buttons
- Soft shadows
- Flowing layouts

**Key Shapes**:
```css
.pill-button {
  border-radius: 50px;
  padding: 12px 24px;
}

.card-organic {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
```

---

## Layout Components

### Header
```
┌──────────────────────────────────────┐
│  AAA  ───── Agents · API · AI · Apps │  ← Rounded, warm
│  Surface Layer                       │
└──────────────────────────────────────┘
```

### Hero: Live Status
```
                    ●
              33 Tools
           [LIVE - HEALTHY]
           
    [View Tools] [Health Check]
```
- Pulsing green dot
- Rounded buttons
- Warm glow effects

### Tool Cards
```
┌──────────────────────────────┐
│  arifos.init                 │
│  ═══════════════             │
│  Initialize constitutional   │
│  session with identity...    │
│                              │
│  [Read More]  [Try It]       │
└──────────────────────────────┘
```
- Rounded corners (16px)
- Gold border on hover
- Soft shadow
- Friendly button text

### Endpoint Display
```
┌────────────────────────────────────────┐
│  📋 https://arifosmcp.arif-fazil.com   │
│        [Copy] [Test]                   │
└────────────────────────────────────────┘
```
- Copy-paste friendly
- Monospace for URL
- Rounded container

---

## Animations

**Heartbeat/Pulse**:
- Live status indicators pulse
- Gold elements have subtle shimmer
- Smooth transitions (0.3s ease)

**Motion**:
- Cards lift on hover
- Buttons glow on hover
- Status dots pulse rhythmically

---

## Contrast with SOUL & MIND

| Element | SOUL | MIND | BODY |
|---------|------|------|------|
| Colors | Red/Blue/Yellow | Cyan | Gold/Amber |
| Typography | Space Grotesk | JetBrains Mono | Inter |
| Geometry | Jagged | Rectilinear | Rounded |
| Animation | Fractal | Static | Pulse/Heartbeat |
| Mood | Human/Jagged | Machine/Precise | Warm/Actionable |

---

## Implementation Notes

1. **Generous border-radius** — minimum 12px
2. **Gold is the hero color** — use for all accents
3. **Soft shadows everywhere** — depth through elevation
4. **Pulsing live indicators** — green heartbeat dots
5. **Action-oriented** — buttons should invite clicking
6. **Copy-paste friendly** — endpoints easily selectable

---

ΔΩΨ | BODY Ring Spec v1.0
