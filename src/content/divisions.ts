/**
 * Les 16 divisions HAMRI CAPITAL.
 *
 * Chaque entrée est la source de vérité pour : l'URL de la sous-page, la clé
 * de traduction du contenu (messages/<lang>.json → divisions.<key>), la
 * présence d'un formulaire « Demander ce service », et le département qui
 * reçoit ce formulaire.
 *
 * Les trois divisions marquées `kind: "editorial"` (Forex, Crypto, Stock
 * Market) sont du contenu pédagogique renvoyant vers les liens externes.
 */

export type Department = "info" | "hr" | "legal" | "ceo";

export type Division = {
  /** Segment d'URL : /[locale]/services/<slug> */
  slug: string;
  /** Clé dans messages/*.json sous `divisions` */
  key: string;
  /** "service" → formulaire dédié ; "editorial" → contenu informatif */
  kind: "service" | "editorial";
  /** Département destinataire du formulaire (services uniquement) */
  department?: Department;
  /** Mise en avant sur la page d'accueil et en section parallax */
  flagship?: boolean;
};

export const divisions: Division[] = [
  {
    slug: "asset-management",
    key: "assetManagement",
    kind: "service",
    department: "info",
    flagship: true,
  },
  {
    slug: "wealth-management",
    key: "wealthManagement",
    kind: "service",
    department: "info",
  },
  {
    slug: "hedge-funds",
    key: "hedgeFunds",
    kind: "service",
    department: "info",
    flagship: true,
  },
  {
    slug: "private-equity",
    key: "privateEquity",
    kind: "service",
    department: "info",
    flagship: true,
  },
  {
    slug: "venture-capital",
    key: "ventureCapital",
    kind: "service",
    department: "info",
  },
  {
    slug: "investment-banking",
    key: "investmentBanking",
    kind: "service",
    department: "info",
    flagship: true,
  },
  {
    slug: "real-estate-funds-reits",
    key: "realEstate",
    kind: "service",
    department: "info",
  },
  {
    slug: "financial-engineering",
    key: "financialEngineering",
    kind: "service",
    department: "info",
  },
  {
    slug: "business-development",
    key: "businessDevelopment",
    kind: "service",
    department: "info",
  },
  {
    slug: "construction-building-public-works",
    key: "construction",
    kind: "service",
    department: "info",
  },
  { slug: "forex-trading", key: "forex", kind: "editorial" },
  { slug: "cryptocurrency", key: "crypto", kind: "editorial" },
  { slug: "stock-market", key: "stockMarket", kind: "editorial" },
  {
    slug: "agriculture-finance",
    key: "agriculture",
    kind: "service",
    department: "info",
  },
  {
    slug: "management-consulting",
    key: "managementConsulting",
    kind: "service",
    department: "info",
  },
  {
    slug: "closing-management",
    key: "closingManagement",
    kind: "service",
    department: "info",
  },
];

export const serviceDivisions = divisions.filter((d) => d.kind === "service");
export const editorialDivisions = divisions.filter(
  (d) => d.kind === "editorial",
);
export const flagshipDivisions = divisions.filter((d) => d.flagship);

export function getDivision(slug: string) {
  return divisions.find((d) => d.slug === slug);
}
