"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter } from "next-intl";

/**
 * Compteur qui s'anime la première fois qu'il entre dans le champ de vision.
 *
 * Le nombre final est rendu immédiatement dans le DOM puis remplacé une fois
 * l'animation lancée : sans JavaScript, ou pour un lecteur d'écran, la valeur
 * reste correcte. Une demande de réduction des animations affiche la valeur
 * finale sans transition.
 */
export function Counter({ value, label }: { value: number; label: string }) {
  const format = useFormatter();
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    if (!node) return;

    setCurrent(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStarted(true);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Décélération : le compteur ralentit en approchant de sa valeur finale.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div ref={ref} className="border-s border-hairline ps-6">
      <div className="tabular font-display text-5xl font-bold text-data md:text-6xl">
        {format.number(current)}
      </div>
      <div className="mt-2 text-sm text-muted">{label}</div>
    </div>
  );
}
