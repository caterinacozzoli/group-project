// PDF della presentazione: node scripts/esporta-pdf.mjs [url] [file]  (serve `next dev` acceso)
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/presentazione/";
const file = process.argv[3] ?? "presentazione.pdf";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.emulateMedia({ media: "screen" }); // stessi stili della tela a schermo, non quelli di stampa del browser
await page.goto(`${url}?stampa`, { waitUntil: "networkidle" });
await page.waitForSelector("#piu-caveman");
// Il video non si muove sulla carta: un fotogramma a metà test
await page.$$eval("video", (vv) => Promise.all(vv.map((v) => new Promise((ok) => {
  v.pause();
  v.onseeked = ok;
  v.currentTime = 4;
}))));
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: file, width: "1920px", height: "1080px", printBackground: true, tagged: true, outline: true });
await browser.close();
console.log(file);
