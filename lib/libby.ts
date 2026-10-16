// Motore locale di Libby: applica le regole di companion/libby-anima.md senza API.
// Stessa forma della futura route /api/libby: (testo, contesto) → Risposta.
// ponytail: riconoscimento a parole chiave; quando arriva l'LLM si sostituisce solo `rispondi`.

export type Libro = {
  id: string;
  titolo: string;
  autore: string;
  stato: string;
  etichetta: string;
  prezzo: string;
  prezzoVecchio: string | null;
  sconto: string;
  copertina: string;
  generi: string[];
  mood: string[];
};

export type Utente = {
  loggato: boolean;
  nome: string;
  profiloLettore?: { generiPreferiti: string[]; moodPreferiti: string[] };
} | null;

export type Consiglio = { libro: Libro; perche: string; promo: string };
export type Risposta = { intro: string; consigli: Consiglio[]; chiusura: string };
export type Contesto = { catalogo: Libro[]; utente: Utente; giaConsigliati?: string[]; turno?: number };

const GENERI: Record<string, RegExp> = {
  gialli: /giall|thriller|polizies|crime|investig|indagin|delitt|omicid/,
  "romanzi rosa": /\brosa\b|romance|sentimental|storia d'amore|storie d'amore/,
  fantascienza: /fantascienz|sci-?fi|spazio|futur|robot/,
  classici: /classic/,
  storico: /storic|d'epoca|guerra/,
  ragazzi: /ragazz|bambin|bimb|infanzia|piccol/,
  "young adult": /young adult|\bya\b|adolescent|teen/,
  saggistica: /saggi|attualit|politic|societ|religion|papa/,
  horror: /horror|paura|brivid|gotic/,
  poesia: /poesi|poet/,
  umorismo: /umoris|comic|da ridere|far ridere/,
  "crescita personale": /crescita|motivaz|autostima|self.?help/,
  narrativa: /narrativ|contemporane/,
};

const MOOD: Record<string, RegExp> = {
  leggero: /legger|spensierat|rilass|vacanz|ombrellone|facile|easy/,
  intrigante: /intrig|suspense|colpi? di scena|tension|fiato sospeso/,
  commovente: /commuov|commovent|piangere|emozion|toccant/,
  riflessivo: /rifless|pensare|profond|filosof|significat/,
  avvolgente: /avvolgent|coccol|accoglient|immersiv|coperta/,
  ironico: /ironi|ridere|divertent|brillant/,
  cupo: /\bcup|dark|oscur|inquietant/,
  avventura: /avventur|azione|viaggi/,
  romantico: /romantic|amore|innamor/,
  motivante: /motiv|carica|ispir/,
  tenero: /tener|dolc/,
  impegnativo: /impegnativ|corpos|lungo|mattone|sfida/,
};

const GENERE_FRASE: Record<string, string> = {
  // Tutti maschili: i mood sono aggettivi maschili e devono concordare
  gialli: "un giallo", "romanzi rosa": "un romanzo rosa", fantascienza: "un romanzo di fantascienza",
  classici: "un classico", storico: "un romanzo storico", ragazzi: "un libro per ragazzi",
  "young adult": "un young adult", saggistica: "un saggio", horror: "un horror", poesia: "un libro di poesie",
  umorismo: "un libro che fa ridere", "crescita personale": "un libro di crescita personale", narrativa: "un romanzo",
};

const MOOD_FRASE: Record<string, string> = {
  leggero: "leggero e piacevole", intrigante: "che tiene col fiato sospeso", commovente: "che arriva dritto al cuore",
  riflessivo: "che lascia tanto su cui pensare", avvolgente: "avvolgente, da leggere sotto una coperta",
  ironico: "ironico e brillante", cupo: "cupo al punto giusto", avventura: "pieno di avventura", romantico: "romantico",
  motivante: "che dà la carica", tenero: "tenero", impegnativo: "corposo, per chi ama le sfide",
};

// Mood affini: se manca quello esatto, questi ci vanno vicino
const VICINI: Record<string, string[]> = {
  leggero: ["ironico", "tenero", "romantico"], ironico: ["leggero"], cupo: ["intrigante"], intrigante: ["cupo"],
  commovente: ["tenero", "romantico"], avvolgente: ["romantico", "commovente"], riflessivo: ["impegnativo"],
};

const CHIUSURE = [
  "Vuoi qualcosa di più leggero o più intenso?",
  "Ti incuriosisce uno di questi, o cerchiamo in un'altra direzione?",
  "Se vuoi, cerco anche qualcosa sotto i 10 €.",
];

const KB = /\b(res[oi]|rimbors|spedizion|consegn|ordin[ei]|contatt|assistenz|telefon|email|mail|pagament)/;

const euro = (p: string) => Number(p.replace(/[^\d,]/g, "").replace(",", "."));
const percento = (s: string) => Number(s.match(/(\d+)%/)?.[1] ?? 0);
const trova = (testo: string, mappa: Record<string, RegExp>) => Object.keys(mappa).filter((k) => mappa[k].test(testo));

function promo(l: Libro): string {
  if (l.stato === "outlet") return `${l.prezzo} invece di ${l.prezzoVecchio}, in outlet`;
  if (l.stato === "preordine") return `${l.prezzo}, prenotabile (${l.sconto})`;
  if (l.stato === "usato") return `${l.prezzo} usato, ${l.sconto}`;
  return l.prezzoVecchio ? `${l.prezzo} invece di ${l.prezzoVecchio} (${l.sconto})` : `${l.prezzo} · ${l.sconto}`;
}

export function rispondi(testoGrezzo: string, ctx: Contesto): Risposta {
  const testo = testoGrezzo.toLowerCase();
  const { utente } = ctx;
  const nome = utente?.loggato ? utente.nome : "";

  if (KB.test(testo)) {
    return {
      intro: `${nome ? nome + ", per" : "Per"} ordini, spedizioni e resi ti aiuta il Servizio Clienti: +39 02 91435530, customerservice@libraccio.it, oppure il modulo su libraccio.it/assistenza-clienti.aspx.`,
      consigli: [],
      chiusura: "Intanto, vuoi un consiglio di lettura?",
    };
  }

  const generi = trova(testo, GENERI);
  const mood = trova(testo, MOOD);
  const budget = testo.match(/(?:sotto|meno di|massimo|max|entro)\s*(?:i|ai)?\s*(?:€\s*)?(\d+)/);
  const max = budget ? Number(budget[1]) : Infinity;
  const vuoleSconti = /outlet|scont|offert|risparm|econom|poco/.test(testo);
  const soloUsati = /usat/.test(testo);
  const sorpresa = /sorprend|a caso|scegli tu|consigliami tu/.test(testo);
  const criteri = generi.length + mood.length > 0;

  // Regola 5: utente non loggato e nessun indizio → una sola domanda breve
  if (!criteri && !sorpresa && !vuoleSconti && !budget && !soloUsati && !utente?.loggato) {
    return {
      intro: "Ciao! Per consigliarti bene mi serve un indizio.",
      consigli: [],
      chiusura: "Che voglia hai oggi: qualcosa di leggero, un giallo da fiato sospeso o una storia che fa riflettere?",
    };
  }

  const profilo = utente?.loggato ? utente.profiloLettore : undefined;
  const usaProfilo = !criteri && !!profilo;
  const esclusi = new Set(ctx.giaConsigliati ?? []);

  const candidati = ctx.catalogo
    .filter((l) => !esclusi.has(l.id) && euro(l.prezzo) <= max && (!soloUsati || l.stato === "usato"))
    .map((l) => {
      const vicini = mood.flatMap((m) => VICINI[m] ?? []);
      let pertinenza = 3 * l.generi.filter((g) => generi.includes(g)).length + 2 * l.mood.filter((m) => mood.includes(m)).length
        + l.mood.filter((m) => vicini.includes(m)).length;
      if (usaProfilo) {
        pertinenza += 1.5 * l.generi.filter((g) => profilo!.generiPreferiti.includes(g)).length;
        pertinenza += l.mood.filter((m) => profilo!.moodPreferiti.includes(m)).length;
      }
      // Priorità a outlet e promo, senza superare la pertinenza
      const promoBonus = (l.stato === "outlet" || l.stato === "offerta" ? 0.5 : 0) + percento(l.sconto) / 200 + (vuoleSconti ? 2 * (percento(l.sconto) / 60) : 0);
      return { l, pertinenza, punti: pertinenza + promoBonus };
    })
    .sort((a, b) => b.punti - a.punti);

  const delGenere = candidati.filter((c) => c.l.generi.some((g) => generi.includes(g)));
  const pertinenti = delGenere.length ? delGenere : candidati.filter((c) => c.pertinenza > 0 || !criteri);
  const scelti = (pertinenti.length ? pertinenti : candidati).slice(0, 3);

  if (!scelti.length) {
    return {
      intro: `${nome ? nome + ", con" : "Con"} questi filtri non trovo nulla in catalogo, e non voglio inventarmi titoli.`,
      consigli: [],
      chiusura: "Proviamo ad allargare un po' il budget o il genere?",
    };
  }

  // Varia mood e attacco della frase, come farebbe una libraia vera
  const moodUsati = new Set<string>();
  let generePrima = "";
  const consigli = scelti.map(({ l }) => {
    const g = l.generi.find((x) => generi.includes(x)) ?? l.generi[0];
    const vicini = mood.flatMap((x) => VICINI[x] ?? []);
    const ripete = (x: string) => g === "romanzi rosa" && x === "romantico";
    const m = l.mood.filter((x) => !ripete(x)).find((x) => mood.includes(x) && !moodUsati.has(x))
      ?? l.mood.find((x) => vicini.includes(x) && !ripete(x))
      ?? l.mood.find((x) => !moodUsati.has(x) && !ripete(x)) ?? l.mood.find((x) => !ripete(x));
    if (m) moodUsati.add(m);
    const attacco = g === generePrima ? "Anche questo è" : "È";
    generePrima = g;
    const nelleCorde = usaProfilo && l.generi.some((x) => profilo!.generiPreferiti.includes(x));
    return {
      libro: l,
      perche: `${attacco} ${GENERE_FRASE[g]}${m ? ` ${MOOD_FRASE[m]}` : ""}${nelleCorde ? ", proprio nelle tue corde" : ""}.`,
      promo: promo(l),
    };
  });

  // Non riproporre come domanda finale il mood appena chiesto
  const chiusure = CHIUSURE.filter((c) => !mood.some((m) => c.includes(m.slice(0, 6))));
  const chiusura = chiusure[(ctx.turno ?? 0) % chiusure.length];
  const moodMancante = mood.length > 0 && !scelti.some(({ l }) => l.mood.some((m) => mood.includes(m)));

  let intro: string;
  if (moodMancante && generi.length) {
    const frase = `${GENERE_FRASE[generi[0]]} davvero ${mood[0]} in catalogo non ce l'ho, ma questi ci vanno vicino:`;
    intro = nome ? `${nome}, ${frase}` : frase.replace(/^./, (c) => c.toUpperCase());
  } else if (criteri && !pertinenti.length) {
    intro = "Non ho trovato proprio quello che cerchi, ma ecco le alternative più vicine, scelte tra le occasioni del momento:";
  } else if (usaProfilo) {
    intro = `${nome}, partendo dai tuoi gusti ho messo da parte questi per te:`;
  } else if (sorpresa) {
    intro = `${nome ? nome + ", ti" : "Ti"} faccio una sorpresa: ecco tre titoli che in libreria consiglierei a occhi chiusi.`;
  } else {
    intro = `${nome ? nome + ", ecco" : "Ecco"} cosa ti consiglierei${max < Infinity ? ` restando sotto i ${max} €` : ""}:`;
  }

  return { intro, consigli, chiusura };
}

// Testo semplice della risposta (per la regione live e per i test)
export function comeTesto(r: Risposta): string {
  const libri = r.consigli.map((c) => `${c.libro.titolo} di ${c.libro.autore}. ${c.perche} ${c.promo}.`);
  return [r.intro, ...libri, r.chiusura].join(" ");
}
