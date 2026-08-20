# HAMRI CAPITAL — État du projet

**Dernière mise à jour :** 20 août 2026
**Dépôt :** https://github.com/TALEB7/HAMRICAPITAL (branche `master`)
**Statut :** site complet et fonctionnel en local. Non déployé — 4 éléments manquants côté client.

---

## 1. En bref

| | |
|---|---|
| Pages | 13 gabarits → **76 pages pré-générées** (19 par langue) |
| Langues | 4 — anglais, français, arabe (RTL), chinois |
| Piliers de service | 8, avec formulaire dédié |
| Formulaires | 5 types, tous testés au navigateur |
| Poids des assets | 4,8 Mo (dont 4,2 Mo de vidéo) |
| Build de production | ✅ passe, sans erreur ni avertissement |

---

## 2. Ce qui est fait

### Fondations
- **Next.js 16** (App Router, Turbopack), TypeScript, Tailwind CSS v4
- Design system sur mesure : noir profond, **rouge de marque** (le rouge du bateau), or réservé aux chiffres et aux données
- Typographie : Playfair Display (titres), Inter (texte), Noto Sans Arabic (arabe)

### Multilingue
- 4 langues, détection automatique du navigateur, repli sur l'anglais
- **RTL complet en arabe** : navigation, footer, dégradés et flèches tous miroités
- Toute clé non traduite s'affiche en anglais au lieu de casser la page
- `hreflang` déclaré **page par page** (une erreur initiale les faisait tous pointer vers l'accueil)

### Contenu
- **EN et FR complets** sur l'ensemble du site
- **AR et ZH** : navigation, footer, titres et accroches des piliers traduits ; le reste bascule en anglais
- Les 8 piliers : résumé, sections détaillées, conclusion, appel à l'action propre à chacun
- Fichier de référence FR conservé à la racine : `Contenu_16_Divisions_HAMRI_CAPITAL_FR.md`

### Les 8 piliers de service

| Pilier | URL |
|---|---|
| Gestion d'Actifs & de Patrimoine | `/services/asset-wealth-management` |
| Hedge Funds (Fonds Spéculatifs) | `/services/hedge-funds` |
| Private Equity (Capital-Investissement) | `/services/private-equity` |
| Capital-Risque (Venture Capital) | `/services/venture-capital` |
| Real Estate Investment Trust | `/services/real-estate-investment-trust` |
| Investment Banking | `/services/investment-banking` |
| Crypto Assets (Actifs Numériques) | `/services/crypto-assets` |
| Comptabilité & Finance | `/services/accounting-finance` |

### Pages
Accueil · À propos · Services (hub) · 8 sous-pages de pilier · Industries (29 secteurs) · La Communauté (teaser) · Stages & Carrières · Demander un conseil · Contact · Ressources · Mentions légales · Confidentialité · 404 et page d'erreur localisées

### Vidéo du hero
- Montée depuis vos 10 rushes 4K : 6 séquences alternant skylines et écrans de marché, fondus enchaînés, étalonnage sombre
- **390 Mo → 4,2 Mo**, boucle de 23 s
- **Jamais téléchargée sur mobile** ni en mode « animations réduites » : seule l'image poster (163 Ko) est servie
- Regénérable : `bash scripts/build-hero-video.sh`

### Formulaires
5 types — demande de service (par pilier), stage avec CV, conseil, contact, notification Communauté.

- Mêmes règles de validation côté navigateur **et** côté serveur
- Routage par département : Info, RH, Legal, CEO
- Protections : champ piège anti-robot, limite de 5 envois / 10 min par IP, reCAPTCHA v3 prêt
- **Sans clé Resend, rien n'est envoyé** : le message est journalisé et la confirmation s'affiche quand même

### Marque
- Logo bateau + lettrage composé en Playfair (net à toute taille, lisible par Google)
- Portrait du CEO à côté de sa citation (947 Ko → 38 Ko)
- Déclinaison « flotte » sous la citation, fond blanc rendu transparent

### SEO
`sitemap.xml` multilingue · `robots.txt` · `hreflang` + canonical par page · métadonnées par page

### Outils livrés
- `scripts/build-hero-video.sh` — remonte la vidéo depuis les rushes
- `scripts/preview.mjs` — captures desktop/mobile et audit de débordement, via votre Chrome

---

## 3. Bugs trouvés et corrigés

Chacun serait passé en production : le build était vert à chaque fois.

| Bug | Cause |
|---|---|
| **Hero entièrement noir** | Le fond était en `z-index` négatif, donc derrière le fond opaque de la page |
| **Texte illisible sur le hero** | Voile trop léger sur les façades claires — dégradé latéral ajouté, miroité en RTL |
| **CV refusé alors qu'il était joint** | Le champ fichier transmettait `C:\fakepath\CV.pdf` au lieu du fichier |
| **404 en anglais, fond blanc, sans header** | Une URL inconnue n'entrait jamais dans le segment de langue |
| **Tous les `hreflang` pointaient vers l'accueil** | Déclarés dans le layout au lieu de chaque page |
| **Menu mobile décalé de 16 px** | Hauteur de barre écrite en dur, non suivie après agrandissement |
| **Bouton d'envoi comprimé sur 3 lignes** | Écrasé par le texte voisin, faute de `shrink-0` |

---

## 4. Ce que vous devez fournir

### 🔴 Bloquant pour la mise en ligne

**1. Nom de domaine définitif**
→ Sans lui, les URLs du sitemap et des `hreflang` pointent vers `hamricapital.com`, qui est un exemple.

**2. Compte Resend + clé API**
→ **Aucun email ne part actuellement.** Les formulaires affichent la confirmation, mais le message n'est écrit que dans la console du serveur. Créez le compte sur resend.com, vérifiez le domaine, et donnez-moi la clé.

**3. Les 4 adresses email par département**
`info@` (services et conseil) · `hr@` (stages) · `legal@` (contact et réclamations) · `ceo@` (Communauté, partenariats, presse)

**4. Clés reCAPTCHA v3** (site + secret, sur google.com/recaptcha)
→ Sans elles la vérification est ignorée. Le champ piège et la limite de débit fonctionnent déjà.

### 🟠 Important, non bloquant

**5. URLs des 11 réseaux sociaux**
LinkedIn, X, Facebook, Instagram, Pinterest, WhatsApp, Reddit, Discord, YouTube, Medium, MyInfos.
→ **Aucune n'est renseignée**, ils sont donc masqués du footer et de la page Contact — plutôt que d'afficher des liens morts.

**6. Relecture juridique des mentions légales et de la confidentialité**
→ Les deux pages sont des **projets de travail** et l'affichent à l'écran. À compléter : siège social, numéro d'immatriculation, capital social, hébergeur.

**7. Agréments pour Crypto Assets et Comptabilité & Finance**
→ Ces deux pages présentent désormais une **offre de service**. Ces activités sont réglementées dans la plupart des juridictions. À confirmer que HAMRI CAPITAL dispose des autorisations au Maroc, au Canada et aux États-Unis.

**8. Relecture professionnelle AR et ZH**
→ Traductions faites par mes soins. Vu le positionnement premium, une relecture par un traducteur natif est recommandée avant mise en ligne.

### 🟡 Décisions de design en attente

**9. Barre de navigation claire ou sombre ?**
Le modèle BlackRock que vous m'avez montré a une barre blanche. La nôtre est noire. Options : garder noir · barre blanche · blanche seulement au défilement.

**10. Le rouge foncé de la flotte est peu lisible**
« Omar Hamri — CEO, HAMRI CAPITAL » ressort à **2,98:1** de contraste, sous le seuil de 4,5:1. Ce rouge a été conçu pour un fond blanc.
→ Recommandation : l'éclaircir vers le rouge vif de la marque. Une ligne à changer.

**11. Photo du CEO**
Le cliché actuel est pris sur le vif (canapé, éclairage rose). Un portrait professionnel servirait mieux une vitrine institutionnelle. Déposez-le dans `logo/` et je régénère.

**12. Vidéo sur les pages intérieures ?**
Actuellement sur l'accueil seulement. Ma recommandation : image fixe dans les en-têtes intérieurs, et bande vidéo sur les piliers phares — ce que demande le §2.2 de votre cahier des charges.

**13. Contenus retirés — à confirmer**
Huit divisions du PDF ne sont plus sur le site : Ingénierie Financière, Développement Commercial, Construction/BTP, Forex, Marché Boursier, Finance Agricole, Conseil en Management, Gestion des Clôtures.
→ Tout est récupérable depuis le commit `adb67d5`. Le BTP notamment est présenté comme une activité du groupe dans votre PDF.

---

## 5. Lancer le site en local

```bash
npm install       # la première fois seulement
npm run dev
```

Puis ouvrir **http://localhost:3000/fr**

> ⚠️ Après toute modification d'un fichier de `messages/`, **redémarrez le serveur** : les traductions ne se rechargent pas à chaud, vous verriez l'ancien texte.

> ⚠️ Au 6ᵉ envoi de formulaire en 10 minutes, la limite de débit se déclenche. C'est voulu.

---

## 6. Une fois les clés reçues

1. Copier `.env.example` en `.env.local`
2. Y renseigner domaine, clé Resend, adresses email et clés reCAPTCHA
3. Redémarrer — les emails partent réellement
4. Déployer sur Vercel (adapté à Next.js) ou tout hébergement Node.js

Aucun changement de code n'est nécessaire : tout est piloté par les variables d'environnement.
