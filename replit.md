# ProlificEx — Crypto Trading Platform

## Project Overview
A crypto P2P trading platform with a landing page and dashboard. Built with Next.js 14, Tailwind CSS, and Redux Toolkit, matching the Figma design.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **State Management**: Redux Toolkit + react-redux
- **Language**: TypeScript
- **Fonts**: Inter, Rubik (Google Fonts)

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles + CSS variables from Figma
│   ├── layout.tsx               # Root layout with Redux Provider
│   ├── page.tsx                 # Main landing page
│   └── dashboard/
│       ├── layout.tsx           # Dashboard layout (sidebar + navbar)
│       └── page.tsx             # Dashboard main page
├── components/
│   ├── common/
│   │   ├── Badge/               # Feature badge component
│   │   ├── Button/              # Reusable button (primary, secondary, ghost, outline)
│   │   └── Card/                # Card component (default, coin, howItWorks variants)
│   ├── dashboard/
│   │   ├── CryptoCards/         # Crypto asset cards (BTC, USDT, USDC)
│   │   ├── MarketOverview/      # Market pairs list
│   │   ├── PortfolioOverview/   # Total balance + actions
│   │   ├── PriceChart/          # BTC/USD price chart with timeframe selector
│   │   ├── QuickTrade/          # Buy/sell form with coin selector
│   │   └── RecentTransactions/  # Transaction history table
│   ├── layout/
│   │   ├── DashboardNavbar/     # Dashboard top bar with search + user info
│   │   ├── Footer/              # Landing page footer
│   │   ├── Navbar/              # Landing page navigation bar
│   │   └── Sidebar/             # Dashboard sidebar navigation
│   ├── providers/
│   │   └── ReduxProvider.tsx    # Client-side Redux store provider
│   └── sections/
│       ├── CTABanner/           # CTA banner
│       ├── Hero/                # Hero section
│       ├── HowItWorks/          # How It Works cards
│       ├── PaymentMethods/      # Payment methods section
│       ├── Stats/               # Platform stats
│       └── SupportedCoins/      # Supported cryptocurrencies
├── lib/
│   └── utils.ts                 # cn() utility for Tailwind class merging
├── redux/
│   ├── hooks.ts                 # Typed useAppDispatch, useAppSelector
│   ├── slices/
│   │   └── uiSlice.ts           # UI state (mobile menu, active nav, scroll)
│   └── store.ts                 # Redux store configuration
└── types/
    └── index.ts                 # TypeScript interfaces
public/
└── figmaAssets/                 # All Figma exported images and SVGs
```

## Routes
- `/` — Landing page (public)
- `/dashboard` — Dashboard (after login)

## Design System (from Figma)
- **Background**: `#0d0d1a` (dark navy)
- **Card Background**: `#1a1b23`, `#191a23`
- **Footer Background**: `#0b0e11`
- **Primary**: Violet-600 (`#7c3aed`)
- **Success**: `#1ecb4f` (green)
- **Warning**: `#f46d22` (orange)
- **Text Primary**: White
- **Text Secondary**: `#a6aab2`, `#898ca9`
- **Fonts**: Inter (headings, 800/700/500/400), Rubik (body, 500/400)

## Run Commands
- **Dev**: `npx next dev -p 5000`
- **Build**: `next build`
- **Start**: `next start -p 5000`
