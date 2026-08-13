import { z } from "zod";
import { divisions, type Department } from "@/content/divisions";

/**
 * Schémas de validation des cinq formulaires du site.
 *
 * Les mêmes schémas servent côté client (React Hook Form) et côté serveur
 * (route API) : une validation contournée dans le navigateur est de toute
 * façon rejouée sur le serveur avant tout envoi d'email.
 *
 * Les messages d'erreur sont des *clés* de traduction, pas du texte : le
 * formulaire les affiche dans la langue active.
 */

const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const name = z.string().trim().min(2, "nameRequired").max(120);
const email = z.email("emailInvalid").max(180);
const message = z.string().trim().min(10, "messageRequired").max(5000);
const phone = z.string().trim().min(5, "phoneRequired").max(40);
const subject = z.string().trim().min(2, "subjectRequired").max(200);

const divisionSlugs = divisions.map((d) => d.slug) as [string, ...string[]];

/** Demande de service — un par division, la division étant pré-remplie. */
export const serviceRequestSchema = z.object({
  kind: z.literal("service"),
  division: z.enum(divisionSlugs),
  name,
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email,
  phone,
  country: z.string().trim().min(2, "countryRequired").max(80),
  message,
});

/** Candidature à un stage — seul formulaire à accepter un fichier. */
export const internshipSchema = z.object({
  kind: z.literal("internship"),
  name,
  email,
  phone,
  school: z.string().trim().min(2, "schoolRequired").max(160),
  field: z.string().trim().min(2, "fieldRequired").max(160),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  cv: z
    .instanceof(File, { message: "cvRequired" })
    .refine((f) => f.size > 0, "cvRequired")
    .refine((f) => f.size <= CV_MAX_BYTES, "cvTooLarge")
    .refine((f) => CV_TYPES.includes(f.type), "cvType"),
});

/** Demande de conseil. */
export const adviceSchema = z.object({
  kind: z.literal("advice"),
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  subject,
  message,
});

/** Contact général / réclamation. */
export const contactSchema = z.object({
  kind: z.literal("contact"),
  name,
  email,
  subject,
  message,
});

/** Inscription à l'annonce de lancement de La Communauté. */
export const notifySchema = z.object({
  kind: z.literal("notify"),
  email,
});

export const formSchema = z.discriminatedUnion("kind", [
  serviceRequestSchema,
  internshipSchema,
  adviceSchema,
  contactSchema,
  notifySchema,
]);

export type FormKind = z.infer<typeof formSchema>["kind"];
export type FormPayload = z.infer<typeof formSchema>;
export type ServiceRequest = z.infer<typeof serviceRequestSchema>;
export type Internship = z.infer<typeof internshipSchema>;
export type Advice = z.infer<typeof adviceSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Notify = z.infer<typeof notifySchema>;

/**
 * Département destinataire de chaque type de formulaire (§5.1 du cahier des
 * charges). Les demandes de service suivent le département déclaré sur la
 * division, ce qui permettra de passer à des adresses dédiées par division
 * sans toucher à cette table.
 */
const departmentByKind: Record<Exclude<FormKind, "service">, Department> = {
  internship: "hr",
  advice: "info",
  contact: "legal",
  notify: "ceo",
};

export function departmentFor(payload: FormPayload): Department {
  if (payload.kind === "service") {
    const division = divisions.find((d) => d.slug === payload.division);
    return division?.department ?? "info";
  }
  return departmentByKind[payload.kind];
}
