# ProlificEx — Crypto Trading Platform

## Project Overview
A landing page for ProlificEx, a P2P crypto trading platform. Built with Next.js 14, Tailwind CSS, and Redux Toolkit, matching the exact Figma design.

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
│   ├── globals.css          # Global styles + CSS variables from Figma
│   ├── layout.tsx           # Root layout with Redux Provider
│   └── page.tsx             # Main landing page
├── components/
│   ├── common/
│   │   ├── Badge/           # Feature badge component
│   │   ├── Button/          # Reusable button (primary, secondary, ghost, outline)
│   │   └── Card/            # Card component (default, coin, howItWorks variants)
│   ├── layout/
│   │   ├── Footer/          # Footer with links and payment methods
│   │   └── Navbar/          # Navigation bar
│   ├── providers/
│   │   └── ReduxProvider.tsx # Client-side Redux store provider
│   └── sections/
│       ├── CTABanner/       # Call-to-action banner
│       ├── Hero/            # Hero section with headline + CTA buttons
│       ├── HowItWorks/      # How It Works cards
│       ├── PaymentMethods/  # Payment methods section
│       ├── Stats/           # Platform stats (users, trades, etc.)
│       └── SupportedCoins/  # Supported cryptocurrencies
├── lib/
│   └── utils.ts             # cn() utility for Tailwind class merging
├── redux/
│   ├── hooks.ts             # Typed useAppDispatch, useAppSelector
│   ├── slices/
│   │   └── uiSlice.ts       # UI state (mobile menu, active nav, scroll)
│   └── store.ts             # Redux store configuration
└── types/
    └── index.ts             # TypeScript interfaces
public/
└── figmaAssets/             # All Figma exported images and SVGs
```

## Design System (from Figma)
- **Background**: `#0d0d1a` (dark navy)
- **Card Background**: `#1a1b23`, `#191a23`
- **Primary**: Violet-600 (`#7c3aed`)
- **Main Accent**: `rgba(100, 207, 249, 1)` (cyan-blue)
- **Text Primary**: White
- **Text Secondary**: `#a6aab2`, `#898ca9`
- **Fonts**: Inter (headings, 800/700/500/400), Rubik (body, 500/400)

## Run Commands
- **Dev**: `npx next dev -p 5000`
- **Build**: `next build`
- **Start**: `next start -p 5000`

## Key Features
- Component-based architecture (reusable Button, Card, Badge)
- Redux state management for UI (mobile menu, active links, scroll)
- Pixel-perfect recreation of Figma design
- Next.js App Router with server and client components
- TypeScript throughout
