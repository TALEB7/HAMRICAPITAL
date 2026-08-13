import "server-only";

/**
 * Vérification reCAPTCHA v3 côté serveur.
 *
 * Tant que RECAPTCHA_SECRET_KEY n'est pas renseignée, la vérification est
 * ignorée : les formulaires restent utilisables en local et en préproduction.
 * Renseigner la clé suffit à activer la protection, sans changement de code.
 */

/** En dessous de ce score, Google considère le trafic comme automatisé. */
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;

  if (!token) return false;

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        cache: "no-store",
      },
    );

    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
    };

    return Boolean(result.success) && (result.score ?? 0) >= MIN_SCORE;
  } catch (error) {
    // Une panne de l'API Google ne doit pas bloquer un visiteur légitime :
    // on laisse passer et on trace, plutôt que de perdre une demande.
    console.error("[recaptcha] vérification impossible", error);
    return true;
  }
}
