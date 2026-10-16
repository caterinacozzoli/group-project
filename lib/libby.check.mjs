// Verifica minima del motore di Libby: `npm run check:libby`
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rispondi, comeTesto } from "./libby.ts";

const { libri: catalogo } = JSON.parse(readFileSync(new URL("../data/books.json", import.meta.url)));
const marica = JSON.parse(readFileSync(new URL("../data/user.json", import.meta.url)));
const ids = new Set(catalogo.map((l) => l.id));

// Massimo 3 libri, solo titoli del catalogo
const giallo = rispondi("vorrei un giallo", { catalogo, utente: null });
assert.ok(giallo.consigli.length > 0 && giallo.consigli.length <= 3);
assert.ok(giallo.consigli.every((c) => ids.has(c.libro.id) && c.libro.generi.includes("gialli")));

// Budget rispettato
const budget = rispondi("qualcosa sotto i 5 euro", { catalogo, utente: marica });
assert.ok(budget.consigli.every((c) => Number(c.libro.prezzo.replace(/[^\d,]/g, "").replace(",", ".")) <= 5));

// Non loggato senza indizi: una domanda, nessun libro
const vuoto = rispondi("ciao", { catalogo, utente: null });
assert.equal(vuoto.consigli.length, 0);
assert.ok(vuoto.chiusura.endsWith("?"));

// Loggato senza indizi: usa il profilo lettore
const profilo = rispondi("ciao", { catalogo, utente: marica });
assert.equal(profilo.consigli.length, 3);

// Non ripropone libri già consigliati
const altri = rispondi("vorrei un giallo", { catalogo, utente: null, giaConsigliati: giallo.consigli.map((c) => c.libro.id) });
assert.ok(altri.consigli.every((c) => !giallo.consigli.some((g) => g.libro.id === c.libro.id)));

// Domande operative → contatti della knowledge base
assert.match(rispondi("come faccio un reso?", { catalogo, utente: null }).intro, /91435530/);

// Lunghezza: massimo ~120 parole
const parole = comeTesto(profilo).split(/\s+/).length;
assert.ok(parole <= 130, `troppo lunga: ${parole} parole`);

console.log("libby ok", { parole, esempio: comeTesto(giallo) });

// Mood assente nel genere: lo dice e propone il più vicino
const vicino = rispondi("un giallo leggero sotto i 10 euro", { catalogo, utente: marica });
assert.match(vicino.intro, /non ce l.ho/);
assert.ok(!vicino.chiusura.includes("leggero"));
console.log(comeTesto(vicino));

// Concordanza: niente "romanzo rosa romantico" né aggettivi maschili su nomi femminili
for (const q of ["qualcosa di romantico", "un romanzo rosa leggero", "delle poesie", "sorprendimi"]) {
  for (const c of rispondi(q, { catalogo, utente: marica }).consigli) {
    assert.ok(!/rosa romantico|\buna (storia|raccolta)\b/.test(c.perche), `frase da sistemare: ${c.perche}`);
  }
}
