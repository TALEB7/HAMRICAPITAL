/**
 * Capture d'écran et audit de mise en page, via le Chrome déjà installé.
 *
 * Utilisé pendant le développement pour vérifier le rendu réel (thème sombre,
 * RTL arabe, mobile) sans dépendre d'un navigateur téléchargé.
 *
 *   node scripts/preview.mjs /fr            → capture desktop + mobile
 *   node scripts/preview.mjs /ar --audit    → signale tout débordement
 *
 * L'audit remonte les éléments plus larges que la fenêtre : c'est la cause
 * habituelle d'une barre de défilement horizontale sur mobile.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.PREVIEW_BASE ?? "http://localhost:3000";
const OUT = process.env.PREVIEW_OUT ?? "./.preview";

// Git Bash sous Windows réécrit « /fr » en chemin Windows absolu : on accepte
// donc aussi bien « fr » que « /fr », et on ne garde que le chemin d'URL.
const rawPath = process.argv[2] ?? "en";
const path = rawPath.startsWith("http")
  ? new URL(rawPath).pathname
  : `/${rawPath.replace(/^.*[\\/]([a-z]{2}(?:\/.*)?)$/i, "$1").replace(/^\/+/, "")}`;
const audit = process.argv.includes("--audit");
const full = process.argv.includes("--full");

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--autoplay-policy=no-user-gesture-required"],
});

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: Boolean(vp.isMobile),
  });

  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2" });
  // Laisse le temps aux polices et à l'image du hero de s'afficher.
  await new Promise((r) => setTimeout(r, 1200));

  if (full) {
    // Une capture pleine page ne fait pas défiler : sans ce parcours, tout ce
    // qui s'anime à l'entrée dans le champ de vision (compteurs, apparitions)
    // reste figé à son état initial sur l'image.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 800));
  }

  if (audit) {
    const offenders = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      const found = [];
      for (const el of document.querySelectorAll("body *")) {
        const box = el.getBoundingClientRect();
        // On ne retient que ce qui dépasse réellement, en ignorant les
        // éléments volontairement masqués par un parent en overflow-hidden.
        if (box.right <= limit + 1 && box.left >= -1) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        let clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          if (getComputedStyle(p).overflowX !== "visible") {
            clipped = true;
            break;
          }
        }
        if (clipped) continue;
        found.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.toString?.() ?? "").slice(0, 90),
          left: Math.round(box.left),
          right: Math.round(box.right),
        });
      }
      return { limit, scrollWidth: document.body.scrollWidth, found };
    });

    console.log(`\n[${vp.name}] viewport=${offenders.limit} scrollWidth=${offenders.scrollWidth}`);
    if (offenders.found.length === 0) {
      console.log("  aucun débordement");
    } else {
      // Les parents débordent en cascade : les premiers de la liste sont les
      // plus proches de la racine, donc les plus proches de la cause.
      for (const o of offenders.found.slice(0, 8)) {
        console.log(`  <${o.tag}> ${o.left}→${o.right}  ${o.cls}`);
      }
      if (offenders.found.length > 8) {
        console.log(`  … et ${offenders.found.length - 8} autres`);
      }
    }
  }

  const file = `${OUT}/${path.replace(/\W+/g, "_") || "root"}-${vp.name}.png`;
  await page.screenshot({ path: file, fullPage: full });
  console.log(`  → ${file}`);
  await page.close();
}

await browser.close();
