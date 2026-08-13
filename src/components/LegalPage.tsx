import { PageHeader } from "./PageHeader";

/**
 * Gabarit partagé par les mentions légales et la politique de
 * confidentialité : un en-tête, un avertissement de relecture, puis une suite
 * de sections titre / texte.
 */
export function LegalPage({
  eyebrow,
  title,
  reviewNote,
  sections,
}: {
  eyebrow: string;
  title: string;
  reviewNote: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <main className="flex-1">
      <PageHeader eyebrow={eyebrow} title={title} />

      <section className="py-section">
        <div className="container-hc max-w-3xl">
          {/* Ces textes sont des projets : le signaler à l'écran évite qu'ils
              soient pris pour des mentions validées. */}
          <p className="border-s-2 border-data bg-elevated p-4 text-sm text-data">
            {reviewNote}
          </p>

          <div className="mt-12 space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-xl text-bright">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
