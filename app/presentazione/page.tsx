import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Orbit } from "next/font/google";
import approfondimenti from "@/data/presentazione.json";
import { asset } from "@/lib/asset";
import Deck, { type Slide } from "./Deck";
import s from "./presentazione.module.css";

// Titoli in Orbit al posto del Bodoni 72 del Figma: in proiezione si legge meglio
const orbit = Orbit({ variable: "--font-orbit", subsets: ["latin"], weight: "400" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Da Figma al prototipo con Antigravity",
  description: "Il workflow della settimana AI: copia fedele, responsive, una feature AI.",
};

const DEMO = "https://caterinacozzoli.github.io/group-project/";

// Icone Lucide al tratto: a 52 px il tratto 0,7 vale 1,5 px come nel Figma
const ICONE = {
  "book-open": (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  "code-xml": <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />,
  "panels-top-left": (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  monitor: (
    <>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  "file-text": (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
    </>
  ),
  // Ricavata dall'export SVG del Figma (frame 1:135)
  cable: (
    <path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h1m-2 5h4m-4 0v2m2-7h1a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1m-2-5V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V10m16 9v2M5 10H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1m2 5h1a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1M3 5V3m0 2h4m0 0V3" />
  ),
};

function Icona({ nome }: { nome: keyof typeof ICONE }) {
  return (
    <svg className={s.icona} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={0.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONE[nome]}
    </svg>
  );
}

// Loghi monocromi (Simple Icons, Antigravity e Vizcom dai loro siti). Decorativi: il nome è sempre scritto accanto
function Logo({ nome }: { nome: string }) {
  return <img className={s.logo} src={asset(`/presentazione/loghi/${nome}.svg`)} alt="" />;
}

// La lampadina accanto al testo: Deck apre il pannello leggendo data-piu
function Piu({ id, children }: { id: keyof typeof approfondimenti; children: ReactNode }) {
  return (
    <button type="button" className={s.piu} data-piu={id} aria-haspopup="dialog">
      {children}
      <span className={s.segno} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2ZM9 20h6v.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20.5Z" />
        </svg>
      </span>
      <span className="sr-only">, approfondimento</span>
    </button>
  );
}

function Freccia({ verso }: { verso?: "doppia" | "su" }) {
  return <span className={`${s.freccia} ${verso ? s[verso] : ""}`} aria-hidden="true" />;
}

function Voce({
  etichetta,
  icona,
  logo,
  titolo,
  piu,
  freccia,
  tempo,
  children,
}: {
  etichetta?: string;
  icona?: keyof typeof ICONE;
  logo?: string;
  titolo: ReactNode;
  piu?: keyof typeof approfondimenti;
  freccia?: "destra" | "doppia";
  tempo?: string;
  children?: ReactNode;
}) {
  // Nel sorgente il titolo viene prima dell'etichetta (ordine di lettura); il CSS la riporta sopra
  return (
    <div className={`${s.voce} ${etichetta ? s.conEtichetta : ""}`}>
      <h3 className={s.voceTitolo}>{piu ? <Piu id={piu}>{titolo}</Piu> : titolo}</h3>
      {etichetta && <p className={s.etichetta}>{etichetta}</p>}
      {(icona || logo) && (
        <div className={s.simbolo}>
          {icona ? <Icona nome={icona} /> : <Logo nome={logo!} />}
          {freccia && <Freccia verso={freccia === "doppia" ? "doppia" : undefined} />}
        </div>
      )}
      {children && <p className={s.descrizione}>{children}</p>}
      {tempo && <p className={s.tempo}>{tempo}</p>}
    </div>
  );
}

// I riquadri a margine: "Cos'è…" per i concetti, sempre aperti
function Riquadro({ titolo, piu, children }: { titolo: string; piu?: keyof typeof approfondimenti; children: ReactNode }) {
  return (
    <div className={s.perche}>
      <h3 className={s.etichetta}>{piu ? <Piu id={piu}>{titolo}</Piu> : titolo}</h3>
      <p>{children}</p>
    </div>
  );
}

// "Cosa abbiamo imparato" per le scelte: chiuso, si apre col mouse sopra (Deck.tsx), clic o Invio
function Imparato({ tema, piu, children }: { tema?: string; piu?: keyof typeof approfondimenti; children: ReactNode }) {
  return (
    <details className={`${s.perche} ${s.apribile}`}>
      <summary className={s.etichetta}>
        {IMPARATO}
        {tema && ` · ${tema}`}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p>{children}</p>
      {piu && (
        <p className={s.dettaglio}>
          <Piu id={piu}>Approfondisci</Piu>
        </p>
      )}
    </details>
  );
}

function Foto({ src, alt, w, h, didascalia, className }: { src: string; alt: string; w: number; h: number; didascalia?: string; className?: string }) {
  return (
    <figure className={`${s.foto} ${className ?? ""}`}>
      <img src={asset(src)} alt={alt} width={w} height={h} />
      {didascalia && <figcaption className={s.etichetta}>{didascalia}</figcaption>}
    </figure>
  );
}

const IMPARATO = "Cosa abbiamo imparato";

const LOGHI = [
  ["figma", "Figma"],
  ["claude", "Claude"],
  ["antigravity", "Antigravity"],
  ["github", "GitHub"],
  ["meta", "Meta AI"],
];

const ALBERO = [
  ["libby/", ""],
  ["├── BRIEF.md", "decisioni, link Figma, struttura, cartelle"],
  ["├── PROMPT-ANTIGRAVITY.md", "prompt di avvio"],
  ["├── asset/", "immagini esportate dal Figma"],
  ["├── companion/", "libby-anima.md + libby.svg"],
  ["└── docs/", "architettura delle informazioni + variabili CSS"],
];

// Le domande vere della sessione del 16/10 (transcript di Claude Code), con la risposta scelta
const DOMANDE = [
  ["Immagini", "I PNG in asset/ hanno il testo dentro l'immagine. Da dove prendo le immagini?", "Export pulito dal ponte con Figma"],
  ["Dati libri", "Nelle card ci sono segnaposto («Titolo Libro», «€ 000,00»). Cosa metto nei JSON?", "Segnaposto identici"],
  ["Status bar", "Status bar iPhone su tablet e desktop?", "Solo su mobile"],
  ["Breakpoint", "Breakpoint per il layout allargato?", "768 / 1024, max 1280"],
];

const CHECKLIST: ReactNode[] = [
  "Uno spazio Claude con istruzioni e knowledge base",
  <>
    Una cartella: brief, prompt di avvio, <code>asset/</code>, <code>companion/</code>, <code>docs/</code>
  </>,
  <>
    Antigravity e <code>claude</code> nel terminale
  </>,
  "Il ponte con Figma: figma-ui-mcp e il plugin",
  <>
    Le skill che servono, solo dove servono (<code>/plugin</code>)
  </>,
  "Un prompt breve: domande prima, ipotesi alla fine",
  "La verifica: Playwright e accessibility agents",
  <>
    <code>git push</code>: Actions compila, Pages pubblica
  </>,
];

// Le foto dietro le quinte (da dietro_le_quinte/, convertite da HEIC)
const QUINTE: [string, string, number, number][] = [
  ["/presentazione/quinte/foto-1.jpg", "Al lavoro in cucina, dietro il portatile", 900, 1200],
  ["/presentazione/quinte/foto-2.jpg", "In salotto, con il cane e una collega collegata sulla TV", 1200, 900],
  ["/presentazione/quinte/foto-3.jpg", "Selfie di gruppo per strada", 1200, 900],
];

const SLIDES: Slide[] = [
  {
    titolo: "Da Figma al prototipo con Antigravity",
    fase: "Libraccio / Group Project TAG",
    sintesi: "Il workflow che abbiamo costruito nella settimana AI, tappa per tappa.",
    layout: s.copertina,
    corpo: (
      <>
        <ul role="list" className={s.loghi} aria-label="Gli strumenti">
          {LOGHI.map(([nome, testo]) => (
            <li key={nome}>
              <Logo nome={nome} />
              {testo}
            </li>
          ))}
          <li>
            <img className={s.parola} src={asset("/presentazione/loghi/vizcom.svg")} alt="Vizcom" />
          </li>
        </ul>
        <p className={s.oratori}>Cozzoli Caterina Maria · Domenighini Sara · Gattullo Gaia · Polimeni Alberto</p>
      </>
    ),
  },
  {
    titolo: "Il contesto del progetto",
    fase: "Contesto",
    sintesi: "Una settimana di sperimentazione AI, dalla pagina Libraccio al prototipo React / Next.js.",
    layout: s.contesto,
    corpo: (
      <>
        <div className={s.colonne}>
          <Voce etichetta="Cliente" icona="book-open" titolo="Libraccio.it" freccia="destra">Homepage «Offerte e Outlet»</Voce>
          <Voce etichetta="Strumento" logo="antigravity" titolo="Antigravity" piu="antigravity" freccia="destra">Editor di codice con agenti AI</Voce>
          <Voce etichetta="Attività" icona="code-xml" titolo="Generare la pagina" freccia="destra">Dal design Figma a un prototipo React / Next.js funzionante</Voce>
          <Voce etichetta="Risultato" icona="panels-top-left" titolo="Prototipo + AI">Homepage Outlet con Libby, la libraia digitale</Voce>
        </div>
        <div className={s.settimana}>
          <Freccia verso="su" />
          <h3 className={s.voceTitolo}>Settimana AI</h3>
          <p className={s.dettaglio}>Durante il Master Talent Garden</p>
        </div>
        <Imparato>
          Conta dove gira l&apos;agente. In Antigravity Claude lavora sul nostro computer: raggiunge il file Figma aperto, avvia il sito e lo controlla nel browser.
        </Imparato>
      </>
    ),
  },
  {
    titolo: "Il workflow in tre fasi",
    fase: "Il workflow",
    layout: s.fasi,
    corpo: (
      <>
        <div className={s.colonne}>
          <Voce etichetta="Fase 1 · Claude Desktop" icona="file-text" titolo="Preparazione" freccia="destra" tempo="~15 min*">
            Pensare: Prompt maker, file di handoff, cartella di progetto.
          </Voce>
          <Voce etichetta="Fase 2 · Antigravity" icona="cable" titolo="Configurazione" freccia="destra" tempo="~15 min*">
            Collegare: ponte con Figma, istruzioni, skill.
          </Voce>
          <Voce etichetta="Fase 3 · Claude Code in Antigravity" icona="code-xml" titolo="Esecuzione" freccia="destra" tempo="~45 min">
            Costruire: homepage, responsive, app da telefono, Libby, verifica.
          </Voce>
          <Voce etichetta="Risultato" icona="panels-top-left" titolo="Prototipo online" tempo="~15 min">
            Pubblicare: GitHub, Actions, Pages.
          </Voce>
        </div>
        <p className={s.nota}>
          Circa 1 h 30 in tutto. * Stima: Prompt maker, ponte con Figma e skill si preparano una volta e si riusano nei progetti successivi.
        </p>
        <Imparato>
          Claude Desktop per decidere, conversando e leggendo il Figma con il connettore. Antigravity per costruire, perché lì l&apos;agente lavora sul computer.
        </Imparato>
      </>
    ),
  },
  {
    titolo: "Le basi: il Prompt maker",
    fase: "Fase 1 · Preparazione",
    sintesi: "Uno spazio Claude con istruzioni e knowledge base, da cui escono i prompt di ogni passo.",
    layout: s.duo,
    corpo: (
      <>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce etichetta="Spazio" titolo="Prompt maker" piu="prompt-maker">Un Progetto di Claude: istruzioni fisse e file di contesto</Voce>
            <Voce etichetta="Istruzioni" titolo="Prompt designer" piu="pm-istruzioni">Trasforma richieste brevi o disordinate in prompt pronti</Voce>
            <Voce etichetta="Knowledge base" titolo="Le regole" piu="pm-kb">Obiettivo reale, dati mancanti, verifica prima di consegnare</Voce>
            <Voce etichetta="Output" titolo="Handoff" piu="brief">
              <code>BRIEF.md</code>, <code>libby-anima.md</code>, <code>PROMPT-ANTIGRAVITY.md</code>
            </Voce>
          </div>
          <Imparato>
            Le decisioni non restano nella memoria di una chat. Stanno in file che si rileggono, si versionano e si passano a un altro agente o a un collega.
          </Imparato>
        </div>
        <Foto
          className={s.schermata}
          src="/presentazione/pm-progetto.png"
          alt="Il progetto Prompt maker in Claude: le istruzioni («Agisci come un Prompt Designer senior…») e il file di contesto KB_prompt maker.txt"
          w={1294}
          h={678}
          didascalia="Lo spazio Claude «Prompt maker»"
        />
      </>
    ),
  },
  {
    titolo: "La cartella di progetto",
    fase: "Fase 1 · Preparazione",
    sintesi: "I file che avevamo, riordinati in una cartella che l'agente legge da solo.",
    layout: s.cartella,
    corpo: (
      <>
        <div className={s.pila}>
          <Foto
            src="/presentazione/cartella-prima.png"
            alt="La cartella all'inizio: sei file sparsi, tra cui Anima Libby.txt, Libraccio.txt, README.md e gli stili e le variabili dell'outlet"
            w={360}
            h={230}
            didascalia="Prima · i file che avevamo"
          />
          <figure className={s.foto}>
            <pre className={s.albero}>
              {ALBERO.map(([nome, nota]) => (
                <span key={nome}>
                  {nome.padEnd(27)}
                  <span className={s.nota}>{nota}</span>
                </span>
              ))}
            </pre>
            <figcaption className={s.etichetta}>Dopo · la cartella di lavoro</figcaption>
          </figure>
        </div>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce titolo={<code>asset/</code>}>Ogni immagine del Figma, esportata come indicato dal Prompt maker</Voce>
            <Voce titolo={<code>companion/</code>}>L&apos;anima di Libby (tono, regole, limiti) e il suo avatar</Voce>
            <Voce titolo={<code>docs/</code>} piu="architettura">
              Architettura delle informazioni di Libraccio e variabili del design
            </Voce>
          </div>
          <Imparato>L&apos;agente parte da file, non da spiegazioni a voce: meno ambiguità e un risultato ripetibile.</Imparato>
        </div>
      </>
    ),
  },
  {
    titolo: "Collegare Figma e Antigravity",
    fase: "Fase 2 · Configurazione",
    sintesi: "Un ponte locale fa leggere all'agente il file Figma aperto: variabili, componenti, stili e immagini.",
    layout: s.duo,
    corpo: (
      <>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce etichetta="Server" titolo="figma-ui-mcp" piu="figma-ui-mcp">
              <code>claude mcp add --scope user figma-ui-mcp -- npx figma-ui-mcp</code>
            </Voce>
            <Voce etichetta="Plugin" titolo="Figma UI MCP Bridge">Figma desktop → Plugins → Development → Import plugin from manifest</Voce>
            <Voce etichetta="Controllo" titolo={<code>/mcp</code>} piu="mcp">Lo stato dei server, e Reconnect quando il ponte cade</Voce>
          </div>
          <Riquadro titolo="Cos'è GitHub">
            La piattaforma dove si salva e si condivide il codice con tutta la sua storia. figma-ui-mcp è un progetto open source che si prende da lì.
          </Riquadro>
        </div>
        <div className={s.pila}>
          <div className={`${s.colonne} ${s.ponte}`}>
            <Voce etichetta="AI" logo="antigravity" titolo="Antigravity" freccia="doppia" />
            <Voce etichetta="Ponte" icona="cable" titolo="MCP" freccia="doppia" />
            <Voce etichetta="Design" logo="figma" titolo="Figma" />
          </div>
          <Riquadro titolo="Cos'è MCP">
            Uno standard aperto per collegare un agente AI a strumenti esterni (Figma, browser, GitHub), come una presa universale.
          </Riquadro>
          <Imparato>
            figma-ui-mcp gira in locale, senza API key e senza limiti di chiamate. Il connettore Figma ufficiale le aveva già esaurite.
          </Imparato>
        </div>
      </>
    ),
  },
  {
    titolo: "Aprire la cartella e dare le istruzioni",
    fase: "Fase 2 · Configurazione",
    sintesi: "Claude Code nel terminale di Antigravity, un prompt breve che rimanda ai file e, prima del codice, le domande.",
    layout: `${s.duo} ${s.avvio}`,
    corpo: (
      <>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce etichetta="Agente" titolo="Claude Code" piu="claude-code">
              <code>claude</code> nel terminale di Antigravity, dentro la cartella
            </Voce>
          </div>
          <figure className={s.citazione}>
            <blockquote>
              <p>
                «Leggi <code>BRIEF.md</code>… Copia il design <strong>paro paro</strong>… Prima di scrivere codice fammi le domande… Alla fine elenca tutto ciò che hai
                dovuto ipotizzare.»
              </p>
            </blockquote>
            <figcaption className={s.etichetta}>
              Estratto da <Piu id="prompt-avvio"><code>PROMPT-ANTIGRAVITY.md</code></Piu>
            </figcaption>
          </figure>
          <Imparato>
            Domande prima del codice e ipotesi dichiarate alla fine. Il controllo resta a chi progetta, senza decisioni nascoste.
          </Imparato>
        </div>
        <figure className={s.domande}>
          <ol role="list">
            {DOMANDE.map(([tema, domanda, risposta]) => (
              <li key={tema}>
                <p className={s.etichetta}>{tema}</p>
                <p>«{domanda}»</p>
                <p className={s.risposta}>
                  <span aria-hidden="true">→ </span>
                  <span className="sr-only">Risposta scelta: </span>
                  {risposta}
                </p>
              </li>
            ))}
          </ol>
          <figcaption className={s.etichetta}>Le domande di Claude prima del codice, dalla sessione originale</figcaption>
        </figure>
      </>
    ),
  },
  {
    titolo: "Le skill",
    fase: "Fase 2 · Configurazione",
    sintesi: "Istruzioni pronte che insegnano all'agente un mestiere.",
    layout: s.skill,
    corpo: (
      <>
        <div className={s.pila}>
          <table className={s.tabella}>
            <caption className="sr-only">Le skill usate nel progetto</caption>
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Cosa fa</th>
                <th scope="col">Quando l&apos;abbiamo usata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><Piu id="caveman">Caveman</Piu></th>
                <td>Risposte asciutte, meno token</td>
                <td>Sempre</td>
              </tr>
              <tr>
                <th scope="row"><Piu id="impeccable">Impeccable</Piu></th>
                <td>Linguaggio di design per l&apos;AI</td>
                <td>Solo su Libby</td>
              </tr>
              <tr>
                <th scope="row"><Piu id="ui-ux-pro-max">UI/UX Pro Max</Piu></th>
                <td>Regole UX per interfacce professionali</td>
                <td>Solo su Libby</td>
              </tr>
              <tr>
                <th scope="row"><Piu id="playwright">Playwright</Piu></th>
                <td>L&apos;agente usa il browser</td>
                <td>Verifiche</td>
              </tr>
              <tr>
                <th scope="row"><Piu id="accessibility-agents">Accessibility agents</Piu></th>
                <td>Revisione WCAG 2.2 AA</td>
                <td>A ogni modifica dell&apos;interfaccia</td>
              </tr>
            </tbody>
          </table>
          <p className={s.dettaglio}>
            <Piu id="plugin">Installazione</Piu>: <code>/plugin marketplace add &lt;utente/repo&gt;</code>, poi <code>/plugin install</code>
          </p>
        </div>
        <div className={s.pila}>
          <Riquadro titolo="Cos'è una skill">
            Istruzioni che l&apos;agente carica quando servono: competenze specifiche senza riscriverle ogni volta nel prompt.
          </Riquadro>
          <Imparato>
            Sulla homepage niente skill che ne cambino l&apos;aspetto: doveva restare identica al Figma. Le skill di design le abbiamo usate solo per Libby.
          </Imparato>
        </div>
      </>
    ),
  },
  {
    titolo: "Da Figma alle variabili e al codice",
    fase: "Fase 3 · Esecuzione",
    sintesi: "La homepage importata identica: variabili, componenti, stili, asset.",
    layout: s.trio,
    corpo: (
      <>
        <div className={s.righe}>
          <Voce titolo="Variabili" piu="variabili">
            <code>styles/tokens.css</code>: preparate in Claude Desktop, completate in Antigravity leggendo il Figma
          </Voce>
          <Voce titolo="Componenti">Un componente per ogni componente Figma (card, carosello, tab bar…)</Voce>
          <Voce titolo="Stili di testo">Bitter e Poppins, come nel Figma</Voce>
          <Voce titolo="Asset">
            Immagini esportate, rinominate e smistate in <code>public/assets/</code>
          </Voce>
          <Voce titolo="Dati">
            Testi e libri in <code>data/*.json</code>
          </Voce>
        </div>
        <div className={s.pila}>
          <Riquadro titolo="Cosa sono i token" piu="stack">
            Un&apos;unica fonte per colori, testi e spazi. Se cambia un valore cambia ovunque, come nel Figma.
          </Riquadro>
          <Imparato>
            Alcune immagini uscivano vuote: il frame aveva attivo «ritaglia contenuto» (clipsContent). Claude ha chiesto il permesso, l&apos;ha disattivato per
            l&apos;export e l&apos;ha riattivato.
          </Imparato>
        </div>
        <div className={s.primaDopo}>
          <Foto src="/presentazione/figma-home.png" alt="La homepage nel Figma" w={584} h={840} didascalia="Prima · Figma" />
          <Freccia />
          <Foto src="/presentazione/prototipo-393.png" alt="La stessa homepage nel prototipo, a 393 px" w={393} h={564} didascalia="Dopo · prototipo" />
        </div>
      </>
    ),
  },
  {
    titolo: "La verifica",
    fase: "Fase 3 · Esecuzione",
    sintesi: "L'agente controlla da solo quello che ha fatto.",
    layout: `${s.duo} ${s.verifica}`,
    corpo: (
      <>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce titolo="Playwright" piu="verifica-playwright">Apre il sito, simula un iPhone, clicca, scrive, fotografa e confronta con il Figma</Voce>
            <Voce titolo="Accessibility agents" piu="verifica-accessibilita">Alt text, tastiera, screen reader, contrasti (WCAG 2.2 AA)</Voce>
            <Voce titolo="Test">
              <code>check:libby</code> controlla le regole di Libby
            </Voce>
          </div>
          <Imparato piu="hook">
            La verifica è ripetibile e veloce, senza test a mano. L&apos;accessibilità si controlla mentre si scrive: un hook ferma i file dell&apos;interfaccia
            finché non passano la revisione.
          </Imparato>
        </div>
        <figure className={`${s.foto} ${s.telefono}`}>
          <video
            src={asset("/presentazione/playwright-test.webm")}
            autoPlay
            loop
            muted
            playsInline
            width={393}
            height={852}
            aria-label="Playwright che testa automaticamente il prototipo su un iPhone simulato"
          />
          <figcaption className={s.etichetta}>Playwright in azione</figcaption>
        </figure>
      </>
    ),
  },
  {
    titolo: "Responsive senza disegnare i breakpoint",
    fase: "Fase 3 · Esecuzione",
    sintesi: "Dal solo mobile (393 px) a tablet e desktop.",
    layout: s.responsive,
    corpo: (
      <>
        <div className={s.colonne}>
          <Voce titolo="Mobile 393">Identico al Figma</Voce>
          <Voce titolo="Tablet ≥ 768">Margini più ampi, griglie più larghe</Voce>
          <Voce titolo="Desktop ≥ 1024">Contenuto fino a 1280 px</Voce>
          <Voce titolo="⌘D" piu="anteprima">Anteprima mobile → tablet → desktop dentro cornici iPhone e iPad</Voce>
        </div>
        <Foto src="/presentazione/cmdD-mobile.png" alt="Anteprima Cmd+D: la homepage nella cornice iPhone" w={1440} h={900} didascalia="⌘D · mobile" />
        <Foto src="/presentazione/cmdD-tablet.png" alt="Anteprima Cmd+D: la homepage nella cornice iPad" w={1440} h={900} didascalia="⌘D · tablet" />
        <Imparato>
          ⌘D è uno strumento su misura: l&apos;abbiamo chiesto in una frase e l&apos;agente l&apos;ha costruito per questo progetto. Ogni progetto può avere le sue
          scorciatoie.
        </Imparato>
      </>
    ),
  },
  {
    titolo: "Come un'app sul telefono",
    fase: "Fase 3 · Esecuzione",
    sintesi: "Aperto dal telefono, niente cornici: sembra un'app.",
    layout: s.duo,
    corpo: (
      <>
        <div className={s.pila}>
          <div className={s.righe}>
            <Voce titolo="Status bar">Quella finta del Figma si nasconde sui telefoni veri</Voce>
            <Voce titolo="Margini">Rispettano notch, Dynamic Island e barra home</Voce>
            <Voce titolo="Aggiungi a Home">Icona Libraccio, si apre a tutto schermo</Voce>
            <Voce titolo="Avatar" piu="avatar">
              <img className={s.avatar} src={asset("/assets/brand/libby.svg")} alt="" width={48} height={48} />
              Generato con Meta AI, ritoccato, poi vettorializzato con Vizcom
            </Voce>
          </div>
          <Riquadro titolo="Cos'è una PWA" piu="pwa">
            Una Progressive Web App è un sito che si installa sulla Home senza passare dallo store. Bastano un manifest e un&apos;icona.
          </Riquadro>
        </div>
        <div className={s.coppia}>
          <Foto
            className={s.telefono}
            src="/presentazione/phone-home.png"
            alt="La homepage a tutto schermo sul telefono, senza status bar finta"
            w={393}
            h={852}
            didascalia="Sul telefono"
          />
          <Foto
            className={s.telefono}
            src="/presentazione/pages-iphone.png"
            alt="Il prototipo pubblicato dentro la cornice iPhone dell'anteprima"
            w={1440}
            h={900}
            didascalia="Nella cornice ⌘D"
          />
        </div>
      </>
    ),
  },
  {
    titolo: "Libby, con poco",
    fase: "Fase 3 · Esecuzione",
    sintesi: "Una feature nuova: la libraia digitale.",
    layout: s.trio,
    corpo: (
      <>
        <div className={s.righe}>
          <Voce titolo="Anima" piu="anima">
            <code>libby-anima.md</code>: tono, regole e limiti (al massimo 3 libri, mai titoli inventati)
          </Voce>
          <Voce titolo="Motore">Regole locali che seguono l&apos;anima, senza API</Voce>
          <Voce titolo="Interfaccia" piu="libby-chat">A tutto schermo sul telefono, pannello su desktop</Voce>
          <Voce titolo="Design" piu="libby-design">Impeccable e UI/UX Pro Max, solo qui</Voce>
        </div>
        <div className={s.pila}>
          <Imparato tema="senza API">
            Zero costi, nessuna chiave nel repo pubblico, risposte prevedibili e testabili (<code>npm run check:libby</code>). Domani si collega a un modello AI vero,
            con la stessa interfaccia.
          </Imparato>
          <Imparato tema="le skill solo qui">La homepage è il Figma e non si tocca. La libertà di design va dove aggiunge valore.</Imparato>
        </div>
        <div className={s.coppia}>
          <Foto className={s.telefono} src="/presentazione/libby-welcome.png" alt="Libby si presenta: Ciao Marica, cosa leggiamo oggi?" w={393} h={852} />
          <Foto className={s.telefono} src="/presentazione/phone-chat-2.png" alt="Libby consiglia tre gialli in offerta, con prezzo e carrello" w={393} h={852} />
        </div>
      </>
    ),
  },

  {
    titolo: "Dal locale alla condivisione",
    fase: "Condivisione",
    sintesi: "Vederlo sul nostro computer non vuol dire averlo pubblicato.",
    layout: s.pubblica,
    corpo: (
      <>
        <div className={s.colonne}>
          <Voce icona="monitor" titolo={<code>npm run dev</code>} freccia="destra">Anteprima sul computer</Voce>
          <Voce icona="user" titolo={<code>gh auth login</code>} freccia="destra">Accesso a GitHub</Voce>
          <Voce logo="github" titolo={<code>git push</code>} freccia="destra">Il codice va su GitHub</Voce>
          <Voce logo="githubactions" titolo="GitHub Actions" freccia="destra">Compila</Voce>
          <Voce icona="panels-top-left" titolo="GitHub Pages">Pubblica</Voce>
        </div>
        <Imparato tema="in locale">
          Su <code>localhost</code> il sito lo vediamo solo noi. Per condividerlo serve un passaggio a parte: GitHub e una pubblicazione.
        </Imparato>
        <Imparato tema="la pubblicazione" piu="pubblicazione">
          Login dal browser, nessun token da copiare. A ogni push Actions ricompila e Pages pubblica, gratis: il sito è statico, non serve un server.
        </Imparato>
        <Foto
          className={s.schermata}
          src="/presentazione/actions.png"
          alt="Due esecuzioni di «Pubblica su GitHub Pages», entrambe riuscite, in 1 min 19 s e 42 s"
          w={1280}
          h={560}
          didascalia="GitHub Actions · ogni push ripubblica il sito"
        />
      </>
    ),
  },
  {
    titolo: "Demo",
    fase: "Demo",
    layout: s.demo,
    corpo: (
      <>
        <figure className={s.qr}>
          <img src={asset("/presentazione/qr.svg")} alt="Codice QR del prototipo online" width={41} height={41} />
          <figcaption>
            <a href={DEMO}>caterinacozzoli.github.io/group-project</a>
          </figcaption>
        </figure>
        <div className={s.pila}>
          <p className={s.linkPrototipo}>
            <a href={DEMO} target="_blank" rel="noopener noreferrer">
              Apri il prototipo <span aria-hidden="true">↗</span>
              <span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>
          </p>
          <ol className={s.passi}>
            <li>
              <h3 className={s.voceTitolo}>Dal telefono</h3>
              <p className={s.descrizione}>Homepage, poi Libby: chiedere un consiglio, aggiungere al carrello.</p>
            </li>
            <li>
              <h3 className={s.voceTitolo}>Desktop</h3>
              <p className={s.descrizione}>La stessa pagina allargata, con il pannello di Libby.</p>
            </li>
            <li>
              <h3 className={s.voceTitolo}>⌘D</h3>
              <p className={s.descrizione}>Mobile → tablet → desktop.</p>
            </li>
          </ol>
        </div>
      </>
    ),
  },
  {
    titolo: "Rifarlo da zero",
    fase: "Per ripartire",
    sintesi: "Lo stesso ambiente, per il prossimo progetto.",
    layout: s.chiusura,
    corpo: (
      <>
        <ol className={s.passi}>
          {CHECKLIST.map((passo, k) => (
            <li key={k} className={s.descrizione}>
              {passo}
            </li>
          ))}
        </ol>
        <p className={s.messaggio}>Fedeltà dove serve, libertà dove aggiunge valore.</p>
      </>
    ),
  },
  {
    titolo: "Grazie e buona esplorazione",
    fase: "",
    layout: s.finale,
    corpo: (
      <>
        <ul role="list" className={s.quinte} aria-label="Dietro le quinte">
          {QUINTE.slice(0, 2).map(([src, alt, w, h]) => (
            <li key={src} className={s.polaroid}>
              <img src={asset(src)} alt={alt} width={w} height={h} />
            </li>
          ))}
          <li className={s.foglio}>
            <img src={asset("/presentazione/quinte/logo-gruppo.png")} alt="Il logo del gruppo: noi quattro disegnati a linea continua" width={900} height={900} />
          </li>
          {QUINTE.slice(2).map(([src, alt, w, h]) => (
            <li key={src} className={s.polaroid}>
              <img src={asset(src)} alt={alt} width={w} height={h} />
            </li>
          ))}
        </ul>
        <p className={s.nomiFinale}>
          Cozzoli Caterina Maria · Domenighini Sara · Gattullo Gaia · Polimeni Alberto
        </p>
        <p className={s.dettaglio}>
          <a href={DEMO} target="_blank" rel="noopener noreferrer">
            caterinacozzoli.github.io/group-project <span aria-hidden="true">↗</span>
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
        </p>
      </>
    ),
  },
];

export default function Presentazione() {
  return <Deck slides={SLIDES} approfondimenti={approfondimenti} className={`${orbit.variable} ${inter.variable}`} />;
}
