/**
 * Chargement paresseux de reCAPTCHA v3.
 *
 * Le script n'est téléchargé qu'au premier envoi de formulaire : une page
 * simplement consultée ne paie ni la requête ni le suivi associé. Sans clé
 * publique configurée, la fonction renvoie `null` et le serveur laisse alors
 * passer la requête — les formulaires restent testables en local.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let loader: Promise<void> | null = null;

function loadScript(siteKey: string) {
  loader ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha script failed"));
    document.head.appendChild(script);
  });
  return loader;
}

export async function getRecaptchaToken(
  action: string,
): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;

  try {
    await loadScript(siteKey);
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return null;

    await new Promise<void>((resolve) => grecaptcha.ready(resolve));
    return await grecaptcha.execute(siteKey, { action });
  } catch {
    // Un échec de chargement ne doit pas empêcher l'envoi : le serveur
    // recevra un jeton absent et décidera lui-même.
    return null;
  }
}
