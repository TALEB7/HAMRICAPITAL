/**
 * Les 8 piliers de service HAMRI CAPITAL.
 *
 * Chaque entrée est la source de vérité pour : l'URL de la sous-page, la clé
 * de traduction du contenu (messages/<lang>/divisions.json → <key>), et le
 * département qui reçoit le formulaire.
 *
 * Cette liste a remplacé les 16 divisions issues du PDF de présentation :
 * Asset et Wealth Management ont été fusionnés en un pilier unique, Crypto
 * est passé de contenu pédagogique à service, et Accounting & Finance a été
 * ajouté. Les huit divisions retirées (Ingénierie Financière, Développement
 * Commercial, Construction, Forex, Marché Boursier, Finance Agricole, Conseil
 * en Management, Gestion des Clôtures) restent dans l'historique git.
 */

export type Department = "info" | "hr" | "legal" | "ceo";

export type Division = {
  /** Segment d'URL : /[locale]/services/<slug> */
  slug: string;
  /** Clé dans messages/<lang>/divisions.json */
  key: string;
  /** Département destinataire du formulaire */
  department: Department;
  /** Mise en avant sur la page d'accueil */
  flagship?: boolean;
};

export const divisions: Division[] = [
  {
    slug: "asset-wealth-management",
    key: "assetWealthManagement",
    department: "info",
    flagship: true,
  },
  {
    slug: "hedge-funds",
    key: "hedgeFunds",
    department: "info",
    flagship: true,
  },
  {
    slug: "private-equity",
    key: "privateEquity",
    department: "info",
    flagship: true,
  },
  {
    slug: "venture-capital",
    key: "ventureCapital",
    department: "info",
  },
  {
    slug: "real-estate-investment-trust",
    key: "realEstate",
    department: "info",
  },
  {
    slug: "investment-banking",
    key: "investmentBanking",
    department: "info",
    flagship: true,
  },
  {
    slug: "crypto-assets",
    key: "cryptoAssets",
    department: "info",
  },
  {
    slug: "accounting-finance",
    key: "accountingFinance",
    department: "info",
  },
];

export const flagshipDivisions = divisions.filter((d) => d.flagship);

export function getDivision(slug: string) {
  return divisions.find((d) => d.slug === slug);
}
