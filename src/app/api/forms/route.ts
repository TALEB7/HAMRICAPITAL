import { NextResponse } from "next/server";
import { formSchema } from "@/lib/forms";
import { sendFormEmail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";

/**
 * Point d'entrée unique des cinq formulaires du site.
 *
 * Tout passe en `multipart/form-data` — y compris les formulaires sans
 * fichier — pour n'avoir qu'un seul chemin de traitement, celui qui doit de
 * toute façon accepter le CV des candidatures de stage.
 */

// L'envoi d'email et la lecture du fichier CV exigent le runtime Node.
export const runtime = "nodejs";

/**
 * Limitation de débit en mémoire, par adresse IP.
 *
 * Volontairement simple : elle décourage les envois répétés d'un même client
 * sans dépendance externe. Sur un hébergement multi-instances elle ne
 * s'applique qu'à l'instance courante — reCAPTCHA reste la vraie protection.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Empêche la table de croître indéfiniment sur un processus long.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rateLimited" }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalidRequest" }, { status: 400 });
  }

  // Champ piège : invisible à l'écran, seul un robot le remplit. On répond
  // « succès » pour ne pas lui indiquer qu'il a été détecté.
  if (String(form.get("website") ?? "") !== "") {
    return NextResponse.json({ ok: true });
  }

  const locale = String(form.get("locale") ?? "en");
  const token = form.get("recaptchaToken");

  const human = await verifyRecaptcha(
    typeof token === "string" && token ? token : null,
  );
  if (!human) {
    return NextResponse.json({ error: "recaptchaFailed" }, { status: 400 });
  }

  // Les champs techniques ne font pas partie des schémas de validation.
  const entries = Object.fromEntries(form.entries());
  delete entries.website;
  delete entries.locale;
  delete entries.recaptchaToken;

  const parsed = formSchema.safeParse(entries);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        // Renvoie la première clé d'erreur par champ ; le client la traduit.
        fields: Object.fromEntries(
          parsed.error.issues.map((issue) => [
            issue.path.join("."),
            issue.message,
          ]),
        ),
      },
      { status: 422 },
    );
  }

  const result = await sendFormEmail(parsed.data, locale);
  if (!result.ok) {
    return NextResponse.json({ error: "sendFailed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
