# arif-fazil.com (The Body)

> The **Body** of the arifOS Trinity — a high-performance React application serving as the personal portfolio and digital presence of **Muhammad Arif bin Fazil**.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

## 📌 Overview

**arif-fazil.com** is the primary interface ("The Body") in the [Trinity Architecture](https://arifos.arif-fazil.com/concepts/trinity), bridging the gap between human intent and the computational governance of **arifOS**.

This site showcases:
-   **Professional Portfolio**: Geoscience, Energy, and AI Governance work.
-   **Philosophy**: The thermodynamic principles behind arifOS ("Ditempa Bukan Diberi").
-   **Identity**: The personal and professional history of Arif Fazil.

## 🛠 Tech Stack

-   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: TypeScript
-   **Styling**: [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Deployment**: [Railway](https://railway.app/) + Docker (Nginx)

## 🤖 AI Governance (`llms.txt`)

This site complies with the **arifOS Constitutional Governance** standards.
It exposes a root-level `llms.txt` file for AI agents to understand the site's context, architecture, and governance rules.

-   **Live URL**: [https://arif-fazil.com/llms.txt](https://arif-fazil.com/llms.txt)
-   **Repo Source**: `body/llms.txt`

## 🚀 Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm or pnpm

### Installation

```bash
# Navigate to the body directory
cd body

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

### Build

```bash
# Type-check and build for production
npm run build
```

## 📂 Project Structure

```
body/
├── public/             # Static assets (images, llms.txt, robots.txt)
├── src/                # Source code
│   ├── components/     # Reusable UI components (shadcn/ui)
│   ├── lib/            # Utilities (cn, validators)
│   └── ...
├── Dockerfile          # Production Docker image (Nginx)
├── railway.json        # Railway deployment config
├── vite.config.ts      # Vite configuration
└── tailwind.config.js  # Tailwind configuration
```

## ⚖️ License

© 2026 Muhammad Arif bin Fazil. All rights reserved.
Licensed under the [MIT License](LICENSE).

---

**DITEMPA BUKAN DIBERI**
*Forged, Not Given*
