import { tickerItems } from "@/content/site";

/**
 * Bandeau défilant façon terminal Bloomberg. Purement décoratif : les valeurs
 * sont figées (aucun flux temps réel en V1), d'où le `aria-hidden` — un lecteur
 * d'écran n'a rien à annoncer ici.
 *
 * Le défilement repose sur une liste dupliquée translatée de -50 % : la boucle
 * est donc sans couture. En RTL, l'animation reste identique et le sens de
 * lecture du bandeau n'a pas d'importance puisqu'il s'agit de chiffres.
 */
export function Ticker() {
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div
      aria-hidden
      dir="ltr"
      className="relative overflow-hidden border-b border-hairline bg-black/60 py-2"
    >
      <div className="flex w-max animate-[var(--animate-ticker)] gap-8 px-4">
        {loop.map((item, i) => (
          <span
            key={`${item.symbol}-${i}`}
            className="tabular flex shrink-0 items-baseline gap-2 text-xs tracking-wide"
          >
            <span className="font-medium text-muted">{item.symbol}</span>
            <span className="text-bright">{item.value}</span>
            <span className={item.change >= 0 ? "text-up" : "text-down"}>
              {item.change >= 0 ? "▲" : "▼"}
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>

      {/* Fondu sur les bords pour que les valeurs n'apparaissent pas coupées. */}
      <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-linear-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-linear-to-l from-ink to-transparent" />
    </div>
  );
}
