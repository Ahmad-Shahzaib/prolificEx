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
│       ├── layout.tsx           # Dashboard layout (fixed sidebar + header, scrollable main)
│       ├── page.tsx             # Dashboard main page
│       ├── p2p/page.tsx         # P2P Marketplace
│       ├── wallet/page.tsx      # Wallet management
│       ├── deposit/page.tsx     # Deposit funds
│       ├── withdraw/page.tsx    # Withdraw funds
│       ├── history/page.tsx     # Transaction history
│       ├── kyc/page.tsx         # KYC verification steps
│       ├── security/page.tsx    # Security settings
│       ├── support/page.tsx     # Support & FAQ
│       └── settings/page.tsx    # Account settings
├── components/
│   ├── common/
│   │   ├── Badge/               # Feature badge component
│   │   ├── Button/              # Reusable button (primary, secondary, ghost, outline) — amber/yellow theme
│   │   └── Card/                # Card component (default, coin, howItWorks variants)
│   ├── dashboard/
│   │   ├── ActiveOrders/        # Active orders table widget
│   │   ├── MyPortfolio/         # Portfolio coin list with changes
│   │   ├── PageShell/           # Reusable page wrapper for sub-pages
│   │   ├── PortfolioOverview/   # Total portfolio value + Deposit/Withdraw/P2P Trade buttons
│   │   ├── PriceChart/          # Market prices chart (BTC/USD) with timeframe selector
│   │   └── Transactions/        # Transactions list with All/Sell/Buy tabs
│   ├── layout/
│   │   ├── DashboardNavbar/     # Fixed dashboard header (64px) with search + notifications + user
│   │   ├── Footer/              # Landing page footer
│   │   ├── Navbar/              # Landing page navigation bar
│   │   └── Sidebar/             # Fixed dashboard sidebar (200px) with 9 main links + Setting/Logout
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
- `/dashboard` — Dashboard main (portfolio, orders, chart, transactions)
- `/dashboard/p2p` — P2P Marketplace
- `/dashboard/wallet` — Wallet management
- `/dashboard/deposit` — Deposit funds
- `/dashboard/withdraw` — Withdraw funds
- `/dashboard/history` — Transaction history
- `/dashboard/kyc` — KYC Verification
- `/dashboard/security` — Security settings
- `/dashboard/support` — Support & FAQ
- `/dashboard/settings` — Account settings

## Design System
- **Background**: `#0d0e14` (dashboard), `#0d0d1a` (landing)
- **Sidebar Background**: `#11131a`
- **Card Background**: `#1a1b23`
- **Input/Secondary Background**: `#252630`
- **Primary Accent**: `#f0b90b` (amber/yellow) — sidebar active, buttons, highlights
- **Success**: `#1ecb4f` (green)
- **Error**: `#ef4444` (red)
- **Text Primary**: White
- **Text Secondary**: `#6b7280`
- **Fonts**: Inter (headings/UI), Rubik (body)

## Dashboard Layout
- **Sidebar**: Fixed, 200px wide, `#11131a` background, left side
- **Header**: Fixed, 64px tall, starts at left-[200px], `#0d0e14` background
- **Main Content**: `ml-[200px] pt-[64px]`, height constrained, only this area scrolls

## Run Commands
- **Dev**: `npx next dev -p 5000`
- **Build**: `next build`
- **Start**: `next start -p 5000`
