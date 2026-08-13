import { notFound } from "next/navigation";

/**
 * Attrape toutes les URLs inconnues sous une langue.
 *
 * Sans cette route, une adresse comme /fr/nimporte-quoi ne correspond à aucun
 * segment et Next affiche sa page 404 par défaut, hors du layout du site :
 * fond blanc, sans header ni footer, en anglais. En capturant l'URL ici, le
 * `notFound()` est déclenché *dans* le segment `[locale]`, ce qui rend bien
 * `[locale]/not-found.tsx`.
 */
export default function CatchAll() {
  notFound();
}
