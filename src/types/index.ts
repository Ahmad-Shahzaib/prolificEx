export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface HowItWorksItem {
  img: string;
  title: string;
  description: string;
}

export interface CoinItem {
  icon: string;
  iconBg?: string;
  name: string;
  ticker: string;
  description: string;
  actionLabel?: string;
  actionIcon?: string;
  arrowIcon?: string;
}

export interface PaymentMethod {
  src: string;
  alt: string;
  label?: string;
  icon?: string;
}

export interface FeatureBadge {
  icon: string;
  label: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}
