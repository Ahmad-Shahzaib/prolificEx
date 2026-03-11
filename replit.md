# ProlificEx — Crypto Trading Platform

## Project Overview
A crypto P2P trading platform with a landing page and dashboard. Frontend-only project — no backend, no database, all static data. Built with Next.js 14, Tailwind CSS, and Redux Toolkit, matching the Figma design.

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
│   │   ├── Button/              # Reusable button (primary, secondary, ghost, outline) — violet/purple theme, rounded-xl
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
│   │   ├── ReduxProvider.tsx    # Client-side Redux store provider
│   │   └── SidebarContext.tsx   # Dashboard sidebar toggle context (open/close/toggle)
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
- **Primary Accent**: Violet-600 (`#7c3aed`) — sidebar active, buttons, highlights (consistent with landing page)
- **Success**: `#1ecb4f` (green)
- **Error**: `#ef4444` (red)
- **Text Primary**: White
- **Text Secondary**: `#6b7280`
- **Fonts**: Inter (headings/UI), Rubik (body)

## Dashboard Layout (Responsive)
- **Sidebar**: Fixed, 200px wide, `#11131a` background. Hidden on mobile (`-translate-x-full`), slides in as overlay when toggled via `SidebarContext`. Visible on `lg:` breakpoint and above.
- **Header**: Fixed, 64px tall, `left-0` on mobile / `lg:left-[200px]` on desktop. Includes hamburger toggle button (`lg:hidden`).
- **Main Content**: No left margin on mobile / `lg:ml-[200px]` on desktop. `pt-[64px]`, height constrained, only this area scrolls.
- **Mobile sidebar**: Uses `SidebarProvider` context in dashboard layout. Dark backdrop overlay closes sidebar on click. All sidebar nav links close sidebar on click.

## Landing Page (Responsive)
- Converted from absolute pixel positioning to fluid responsive layout using CSS Grid and Flexbox.
- All sections use `max-w-[1240px] mx-auto px-4 sm:px-6` for consistent container sizing.
- Navbar: Horizontal on `md:` and above, mobile hamburger menu dropdown on `sm:` and below.
- Hero, Stats, HowItWorks, SupportedCoins, PaymentMethods, CTABanner, Footer all fully responsive.

## Run Commands
- **Dev**: `npx next dev -p 5000`
- **Build**: `next build`
- **Start**: `next start -p 5000`
