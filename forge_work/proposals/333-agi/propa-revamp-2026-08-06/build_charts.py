import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

outdir = '/root/arif-fazil.com/forge_work/proposals/333-agi/propa-revamp-2026-08-06/charts'
os.makedirs(outdir, exist_ok=True)

NAVY = '#0e1a2b'
GOLD = '#c9a227'
RED = '#c0392b'
GREEN = '#27ae60'
BLUE = '#2980b9'
ORANGE = '#e67e22'

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['DejaVu Sans', 'Helvetica', 'Arial'],
    'font.size': 10,
    'axes.titlesize': 13,
    'axes.titleweight': 'bold',
    'figure.facecolor': 'white',
})

# ════════════════════════════════════════════════════════════
# CHART S1 — The Subsidy Paradox: Brent vs Net Nation Position
# ════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 5.5))
brent_levels = [55, 65, 75, 85, 90, 100, 120]

# PETRONAS dividend sensitivity (RM B) — ~RM 0.5B per $1 Brent
pet_div = [10, 15, 22, 30, 35, 42, 55]

# Subsidy bill sensitivity (RM B/year) — non-linear, explodes at $90+
sub_bill = [8, 12, 20, 30, 42, 55, 80]

# Net nation fiscal position
net_pos = [p - s for p, s in zip(pet_div, sub_bill)]

ax.plot(brent_levels, pet_div, 'o-', color=GOLD, linewidth=2.5, markersize=8, label='PETRONAS dividend to govt (RM B)')
ax.plot(brent_levels, sub_bill, 's-', color=RED, linewidth=2.5, markersize=8, label='Fuel subsidy bill (RM B)')
ax.fill_between(brent_levels, net_pos, alpha=0.25, color=BLUE, label='Net nation position')
ax.plot(brent_levels, net_pos, 'D-', color=NAVY, linewidth=2.5, markersize=7)

ax.axhline(y=0, color=NAVY, linewidth=1, linestyle='--', alpha=0.5)

# Crossover annotation
ax.annotate('Crossover at ~$80 Brent\ndividend = subsidy', xy=(80, 0), xytext=(72, -25),
            fontsize=9, ha='center', color=NAVY, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color=NAVY))

ax.text(115, 65, '← PETRONAS wins big\nbut nation loses more',
        fontsize=9, color=RED, ha='center', fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.3', facecolor='#ffeaea', edgecolor=RED, alpha=0.8))

ax.text(60, -15, 'Nation wins →\n(dividend > subsidy)',
        fontsize=9, color=GREEN, ha='center', fontweight='bold')

ax.set_title('THE SUBSIDY PARADOX: Higher Oil Price = Better for PETRONAS, Worse for Malaysia',
             pad=15)
ax.set_xlabel('Brent Crude (USD/bbl)')
ax.set_ylabel('RM Billion / year')
ax.legend(loc='upper left', framealpha=0.9, fontsize=9)
ax.grid(axis='y', alpha=0.3)
ax.set_xlim(50, 125)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(f'{outdir}/subsidy_paradox.png', dpi=180, bbox_inches='tight', facecolor='white')
plt.close()

# ════════════════════════════════════════════════════════════
# CHART S2 — Monthly Subsidy Bill Trajectory 2025-2026
# ════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 4.5))
months = ['Jan 25', 'Apr 25', 'Jul 25', 'Oct 25', 'Jan 26', 'Mar 26', 'Apr 26', 'Jun 26', 'Jul 26']
sub_monthly = [0.7, 0.8, 1.0, 1.2, 1.5, 5.0, 7.5, 3.5, 3.5]
colors = [GREEN if v < 2 else (ORANGE if v < 5 else RED) for v in sub_monthly]
bars = ax.bar(range(len(months)), sub_monthly, color=colors, alpha=0.85, edgecolor='white')
for b, v in zip(bars, sub_monthly):
    ax.text(b.get_x() + b.get_width()/2, v + 0.15, f'RM {v:.1f}B',
            ha='center', fontsize=9, fontweight='bold')

ax.axhline(y=2, color=ORANGE, linewidth=1, linestyle=':', alpha=0.7)
ax.text(8.3, 2.2, 'Baseline', fontsize=8, color=ORANGE, ha='right')

# Iran war marker
ax.annotate('Iran war starts\nFeb 28 2026', xy=(5, 5), xytext=(5.5, 6.5),
            fontsize=8, ha='center', color=RED, fontweight='bold',
            arrowprops=dict(arrowstyle='->', color=RED))

ax.set_title('MONTHLY FUEL SUBSIDY BILL — 2025 to mid-2026 (RM Billion)', pad=12)
ax.set_xticks(range(len(months)))
ax.set_xticklabels(months, rotation=30)
ax.set_ylim(0, 9)
ax.set_ylabel('RM Billion / month')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig(f'{outdir}/subsidy_monthly.png', dpi=180, bbox_inches='tight', facecolor='white')
plt.close()

# ════════════════════════════════════════════════════════════
# CHART S3 — Three Coupling States (visual)
# ════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 5))
ax.axis('off')

# Three state circles
import matplotlib.patches as mpatches

states = [
    ('STATE A: QUIET', 'Brent $55–70\nPETRONAS solvent\nNation: ok\nSubsidy low', GREEN, 0.15),
    ('STATE B: SQUEEZE', 'Brent $70–85\nPETRONAS marginal\nNation: tightening\nSubsidy rising', ORANGE, 0.5),
    ('STATE C: PARADOX', 'Brent $85+\nPETRONAS winning\nNation: BLEEDING\nSubsidy explodes', RED, 0.85),
]

for label, body, color, x in states:
    circle = mpatches.Circle((x, 0.5), 0.12, facecolor=color, alpha=0.4, edgecolor=color, linewidth=2)
    ax.add_patch(circle)
    ax.text(x, 0.7, label, ha='center', va='center', fontsize=11, fontweight='bold', color=color)
    ax.text(x, 0.5, body, ha='center', va='center', fontsize=8, color='#1a1a1a')

# Arrows
ax.annotate('', xy=(0.42, 0.5), xytext=(0.27, 0.5),
            arrowprops=dict(arrowstyle='->', color=NAVY, lw=2))
ax.annotate('', xy=(0.77, 0.5), xytext=(0.62, 0.5),
            arrowprops=dict(arrowstyle='->', color=NAVY, lw=2))

ax.text(0.5, 0.15, 'Brent up → PETRONAS up → Subsidy up FASTER → Nation down',
        ha='center', fontsize=10, color=NAVY, fontweight='bold',
        bbox=dict(boxstyle='round,pad=0.4', facecolor='#f0f0f0', edgecolor=NAVY))

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_title('THE THREE STATES: Brent Price → Nation Fiscal Position',
             pad=20, fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig(f'{outdir}/three_states.png', dpi=180, bbox_inches='tight', facecolor='white')
plt.close()

print("Subsidy paradox charts generated.")
print(os.listdir(outdir))
