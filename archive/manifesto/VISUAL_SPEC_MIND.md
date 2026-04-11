# Visual Spec: MIND Ring (arifos.arif-fazil.com)

## Primary Anomaly: Monochrome Cyan + Grid Systems

---

## Color Palette

```css
:root {
  /* Void of Thought */
  --mind-void: #0a1628;
  --mind-deep: #0d1b2a;
  --mind-mid: #1b263b;
  
  /* Single Accent: Cyan */
  --mind-cyan: #00d4aa;
  --mind-cyan-dim: #00a884;
  --mind-cyan-glow: rgba(0, 212, 170, 0.3);
  
  /* Text */
  --text-primary: #e0e1dd;
  --text-dim: #778da9;
  --text-muted: #415a77;
}
```

---

## Typography

**Primary**: JetBrains Mono (all text)
- Hero: 700 weight, tight tracking
- Body: 400 weight
- Data: 300 weight, small caps

**No other fonts used** — this is the anomaly.

---

## Geometry

**Strict Rectangles**:
- Border radius: 0 (always)
- Grid-aligned everything
- Right angles only
- No organic curves

**Key Shapes**:
```css
.rect-strict {
  border-radius: 0;
  border: 1px solid var(--mind-mid);
}
```

---

## Layout Components

### Header
```
┌─────────────────────────────────────┐
│ arifOS                        [___] │  ← Cyan line, no curves
│ Constitutional Kernel               │
└─────────────────────────────────────┘
```

### Hero: 13 Floors
```
F01 AMANAH ──────────────────── [ACTIVE]
F02 TRUTH  ──────────────────── [ACTIVE]
F03 INPUT  ──────────────────── [ACTIVE]
...
F13 KHILAFAH ────────────────── [ACTIVE]
```
- Vertical list
- Cyan left border on each
- Status badges: rectangles

### Code Blocks
```
┌────────────────────────────────────┐
│ 1  {                                 │
│ 2    "mcpServers": {                 │
│ 3      "arifos": {                   │
│ 4        "url": "https://..."        │
│ 5      }                             │
│ 6    }                               │
│ 7  }                                 │
└────────────────────────────────────┘
```
- Syntax highlighting in cyan
- Line numbers
- Monospace throughout

---

## Animations

**Subtle Only**:
- Cursor blink (caret)
- Status indicator pulse (slow)
- No other motion

**Static preference** — this ring is about stability.

---

## Contrast with SOUL

| Element | SOUL | MIND |
|---------|------|------|
| Colors | Red/Blue/Yellow | Cyan only |
| Typography | Space Grotesk | JetBrains Mono |
| Geometry | Jagged | Rectilinear |
| Animation | Fractal pulses | Static/cursor |
| Mood | Human/Jagged | Machine/Precise |

---

## Implementation Notes

1. **No rounded corners anywhere** — this is critical
2. **Single font family** — JetBrains Mono for everything
3. **Cyan is the only bright color** — everything else is muted
4. **Grid lines optional** — subtle background texture
5. **Code is aesthetic** — display configs, schemas, tools

---

ΔΩΨ | MIND Ring Spec v1.0
