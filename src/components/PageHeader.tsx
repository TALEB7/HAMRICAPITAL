/**
 * En-tête commun à toutes les pages intérieures.
 *
 * Reprend la grammaire du hero — étiquette or, titre serif, filet rouge —
 * mais sans vidéo : la vidéo reste le privilège de la page d'accueil.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-hairline bg-surface">
      <div className="container-hc py-20 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="rule-brand mt-4 max-w-4xl font-display text-4xl leading-tight text-bright md:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-body">
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
