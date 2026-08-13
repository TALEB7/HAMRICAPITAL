"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Vidéo de fond du hero.
 *
 * Sur mobile, et pour toute personne ayant demandé à réduire les animations,
 * la vidéo n'est jamais téléchargée : seule l'image poster s'affiche. C'est
 * 4 Mo économisés sur données mobiles, et le rendu reste identique au premier
 * regard puisque le poster est une image du montage lui-même.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const decide = () => setShowVideo(wide.matches && !calm.matches);
    decide();

    wide.addEventListener("change", decide);
    calm.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      calm.removeEventListener("change", decide);
    };
  }, []);

  return (
    // Pas de z-index négatif ici : le `body` peint un fond noir opaque, et
    // tout ce qui passe derrière lui devient invisible. Le fond reste donc en
    // z-0 et c'est le contenu du hero qui est remonté en z-10.
    <div className="absolute inset-0 z-0 overflow-hidden bg-ink">
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/video/hero-poster.jpg"
          aria-hidden
          className="h-full w-full object-cover"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- image de fond
        // plein cadre : next/image n'apporte rien ici, le fichier est déjà
        // dimensionné et compressé par le script de montage.
        <img
          src="/video/hero-poster.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      )}

      {/* Voile uniforme, volontairement léger : il calme l'image sans
          l'effacer. En empiler deux opaques noyait complètement le montage. */}
      <div className="absolute inset-0 bg-ink/45" />

      {/* Dégradé latéral, sombre du côté où se pose le texte : c'est lui qui
          garantit le contraste par-dessus les façades claires, tout en
          laissant la skyline visible de l'autre côté. Miroité en arabe. */}
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/75 to-ink/20 rtl:bg-linear-to-l" />

      {/* Fondu vers le noir en bas uniquement, pour souder le hero à la
          section suivante sans assombrir le reste du cadre. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent" />
    </div>
  );
}
