/** Constantes de marque et liens externes du footer. */

export const site = {
  name: "HAMRI CAPITAL",
  legalName: "HAMRI CAPITAL LLC",
  tagline: "Create Your Boat and Join Our Journey",
  ceo: "Omar Hamri",
  /** Remplacer par le domaine définitif une fois arbitré (voir .env.example). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hamricapital.com",
  logo: "/brand/hamri-capital-logo.png",
  /** Portrait du CEO, recadré et compressé depuis logo/ceo-omar-hamri.png. */
  ceoPhoto: "/brand/ceo-omar-hamri.webp",
  /**
   * Déclinaison « flotte » : les quatre bateaux, le slogan et la signature du
   * CEO. Dérivée de logo/image.png, dont le fond blanc a été rendu transparent
   * — aucune couleur de la marque n'a été modifiée.
   */
  fleet: "/brand/hamri-fleet.webp",
} as const;

/** Connect With Us — le footer masque toute entrée dont l'URL est vide. */
export const socialLinks: { name: string; href: string }[] = [
  { name: "LinkedIn", href: "" },
  { name: "X", href: "" },
  { name: "Facebook", href: "" },
  { name: "Instagram", href: "" },
  { name: "Pinterest", href: "" },
  { name: "WhatsApp", href: "" },
  { name: "Reddit", href: "" },
  { name: "Discord", href: "" },
  { name: "YouTube", href: "" },
  { name: "Medium", href: "" },
  { name: "MyInfos", href: "" },
];

/** Useful Links — ouverts en nouvel onglet, groupés par famille. */
export const usefulLinks: {
  group: "exchanges" | "trading" | "media";
  name: string;
  href: string;
}[] = [
  { group: "exchanges", name: "NYSE", href: "https://www.nyse.com" },
  { group: "exchanges", name: "Nasdaq", href: "https://www.nasdaq.com" },
  { group: "exchanges", name: "TMX", href: "https://www.tmx.com" },
  {
    group: "exchanges",
    name: "London Stock Exchange",
    href: "https://www.londonstockexchange.com",
  },
  {
    group: "exchanges",
    name: "Shanghai Stock Exchange",
    href: "https://english.sse.com.cn",
  },
  { group: "exchanges", name: "HKEX", href: "https://www.hkex.com.hk" },
  { group: "exchanges", name: "JPX", href: "https://www.jpx.co.jp/english" },
  { group: "exchanges", name: "ASX", href: "https://www.asx.com.au" },
  {
    group: "exchanges",
    name: "Börse Frankfurt",
    href: "https://www.boerse-frankfurt.de/en",
  },
  { group: "exchanges", name: "Euronext", href: "https://www.euronext.com" },
  {
    group: "exchanges",
    name: "SIX Swiss Exchange",
    href: "https://www.six-group.com/en.html",
  },
  {
    group: "exchanges",
    name: "Saudi Exchange",
    href: "https://www.saudiexchange.sa/wps/portal/saudiexchange?locale=en",
  },
  { group: "trading", name: "Forex.com", href: "https://www.forex.com" },
  {
    group: "trading",
    name: "MetaTrader 4",
    href: "https://www.metatrader4.com",
  },
  {
    group: "trading",
    name: "MetaTrader 5",
    href: "https://www.metatrader5.com",
  },
  { group: "trading", name: "Binance", href: "https://www.binance.com" },
  { group: "trading", name: "Capital.com", href: "https://capital.com" },
  { group: "trading", name: "TradingView", href: "https://www.tradingview.com" },
  {
    group: "trading",
    name: "CoinMarketCap",
    href: "https://coinmarketcap.com",
  },
  { group: "media", name: "WSJ", href: "https://www.wsj.com" },
  { group: "media", name: "Investing.com", href: "https://www.investing.com" },
  {
    group: "media",
    name: "Bloomberg News",
    href: "https://www.bloomberg.com",
  },
];

/** Partenaires affichés en section « Nos Partenaires ». */
export const partners: { name: string; logo?: string; href?: string }[] = [
  { name: "AbodyStudio" },
];

/**
 * Bandeau ticker — purement décoratif en V1, aucun flux temps réel.
 * Les valeurs sont figées et servent uniquement l'ambiance « terminal ».
 */
export const tickerItems: {
  symbol: string;
  value: string;
  change: number;
}[] = [
  { symbol: "S&P 500", value: "5,762.48", change: 0.42 },
  { symbol: "NASDAQ", value: "18,189.17", change: 0.68 },
  { symbol: "DOW J", value: "42,330.15", change: -0.14 },
  { symbol: "FTSE 100", value: "8,236.95", change: 0.21 },
  { symbol: "DAX", value: "19,473.63", change: -0.32 },
  { symbol: "NIKKEI", value: "38,919.55", change: 1.02 },
  { symbol: "HANG SENG", value: "21,133.68", change: 1.47 },
  { symbol: "EUR/USD", value: "1.0842", change: -0.09 },
  { symbol: "GBP/USD", value: "1.2967", change: 0.11 },
  { symbol: "USD/MAD", value: "9.7412", change: 0.05 },
  { symbol: "GOLD", value: "2,648.30", change: 0.53 },
  { symbol: "BRENT", value: "74.18", change: -0.87 },
  { symbol: "BTC/USD", value: "63,417.00", change: 2.14 },
  { symbol: "ETH/USD", value: "2,486.55", change: 1.36 },
];
