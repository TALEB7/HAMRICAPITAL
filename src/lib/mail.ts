import "server-only";
import { Resend } from "resend";
import type { Department } from "@/content/divisions";
import type { FormPayload } from "./forms";
import { departmentFor } from "./forms";

/**
 * Envoi des emails de formulaires, routé par département.
 *
 * Aucune base de données en V1 : le contenu du formulaire *est* l'email. Les
 * adresses viennent des variables d'environnement (voir .env.example), ce qui
 * permet de basculer vers des adresses dédiées par division sans redéployer
 * autre chose que la configuration.
 *
 * Sans RESEND_API_KEY, rien n'est envoyé : le message est journalisé et
 * l'envoi est déclaré réussi. C'est ce qui rend les formulaires testables en
 * local avant que le domaine définitif soit arbitré.
 */

const recipients: Record<Department, string | undefined> = {
  info: process.env.MAIL_TO_INFO,
  hr: process.env.MAIL_TO_HR,
  legal: process.env.MAIL_TO_LEGAL,
  ceo: process.env.MAIL_TO_CEO,
};

const FROM = process.env.MAIL_FROM ?? "HAMRI CAPITAL <onboarding@resend.dev>";

/** Neutralise le HTML des valeurs saisies avant de les insérer dans l'email. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const labels: Record<string, string> = {
  name: "Nom",
  company: "Société",
  email: "Email",
  phone: "Téléphone",
  country: "Pays",
  school: "École / Formation",
  field: "Domaine souhaité",
  subject: "Sujet",
  division: "Division",
  message: "Message",
};

const subjects: Record<FormPayload["kind"], string> = {
  service: "Demande de service",
  internship: "Candidature stage",
  advice: "Demande de conseil",
  contact: "Message de contact",
  notify: "Inscription — La Communauté",
};

function renderRows(payload: FormPayload) {
  return Object.entries(payload)
    .filter(([key, value]) => {
      if (key === "kind" || key === "cv") return false;
      return typeof value === "string" && value.trim() !== "";
    })
    .map(([key, value]) => {
      const label = labels[key] ?? key;
      const text = escapeHtml(String(value)).replace(/\n/g, "<br>");
      return `<tr>
        <td style="padding:8px 16px 8px 0;color:#8a91a0;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td>
        <td style="padding:8px 0;color:#111;font-size:14px">${text}</td>
      </tr>`;
    })
    .join("");
}

function renderEmail(payload: FormPayload, locale: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#f5f6f7;font-family:system-ui,-apple-system,Segoe UI,sans-serif">
  <div style="max-width:640px;margin:24px auto;background:#fff;border-top:4px solid #c8102e">
    <div style="padding:24px 28px 8px">
      <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#c8102e">HAMRI CAPITAL</p>
      <h1 style="margin:8px 0 0;font-size:20px;color:#111">${subjects[payload.kind]}</h1>
      <p style="margin:6px 0 0;font-size:12px;color:#8a91a0">
        Envoyé depuis le site — langue du visiteur : ${escapeHtml(locale)}
      </p>
    </div>
    <div style="padding:8px 28px 28px">
      <table style="width:100%;border-collapse:collapse">${renderRows(payload)}</table>
    </div>
  </div>
</body></html>`;
}

export type SendResult = { ok: true; delivered: boolean } | { ok: false };

export async function sendFormEmail(
  payload: FormPayload,
  locale: string,
): Promise<SendResult> {
  const department = departmentFor(payload);
  const to = recipients[department];
  const apiKey = process.env.RESEND_API_KEY;

  const subject = `[${department.toUpperCase()}] ${subjects[payload.kind]}${
    payload.kind === "service" ? ` — ${payload.division}` : ""
  }`;

  if (!apiKey || !to) {
    // Mode développement : on trace ce qui *serait* parti, sans rien envoyer.
    console.info(
      `[forms] envoi simulé → ${department} (${to ?? "adresse non configurée"})`,
      { subject, payload: { ...payload, cv: undefined } },
    );
    return { ok: true, delivered: false };
  }

  const attachments =
    payload.kind === "internship"
      ? [
          {
            filename: payload.cv.name,
            content: Buffer.from(await payload.cv.arrayBuffer()),
          },
        ]
      : undefined;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      // Répondre à l'email répond directement au visiteur.
      replyTo: payload.email,
      subject,
      html: renderEmail(payload, locale),
      attachments,
    });

    if (error) {
      console.error("[forms] Resend a refusé l'envoi", error);
      return { ok: false };
    }
    return { ok: true, delivered: true };
  } catch (error) {
    console.error("[forms] échec de l'envoi", error);
    return { ok: false };
  }
}
