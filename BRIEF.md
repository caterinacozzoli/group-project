# Libby × Libraccio.it — Brief di progetto

Documento di passaggio: riassume tutte le decisioni prese finora. Chi lavora al progetto (persona o AI) parte da qui.

---

## 1. Obiettivo

Trasformare il design Figma della **homepage "Offerte e Outlet" di Libraccio.it** in un progetto **Next.js** funzionante, fedele al design e responsive. In seguito il progetto ospiterà **Libby**, l'AI companion: una libraia digitale che consiglia libri (vedi `companion/libby-anima.md`).

## 2. Fonti Figma

File: `uAE3KllIWOwc9GiiqPU4D6` — "Offerte e Outlet - TAG x Libraccio.it (Copy)"

| Cosa | Node ID | Note |
|---|---|---|
| **Homepage da convertire** | `2294:25887` (`homepage.searchbar.log`) | Mobile, 393 × 5585 px. ⚠️ Il link `2294:25891` è solo il titolo "Bentornata Marica!" dentro questo frame |
| Style guide / design system | `0:1` (pagina "Style guide") | Sezioni utili: `2861:189` DesignSystem (colori `1:2`, Headings `74:3180`, Body `74:3229`), `748:925` Colour Primitives, `824:3674` Background, `824:3810` Text, `824:3900` Icon, `824:4007` Border, `96:51131` icone Solar |
| UI kit componenti e asset | `57:450` (pagina "UI Kit - componenti") | Circa 100 componenti in 14 sezioni, elencate al §7 |

**Limiti del connettore Figma ufficiale:** il piano Starter ha esaurito le chiamate MCP. Usare il bridge locale **figma-ui-mcp** (`npx -y figma-ui-mcp`, porta 38451, plugin "Figma UI MCP Bridge" aperto in Figma Desktop con il pallino verde).

## 3. Struttura della homepage (dall'alto in basso)

| # | Sezione | Node ID | Contenuto |
|---|---|---|---|
| 0 | Status bar iPhone | `2294:25888` | **Da riprodurre** (scelta per i mockup) |
| 1 | Tab bar (header) | `2294:26675` | Logo Libraccio, icone cerca / profilo / preferiti / carrello. Pillola bianca, raggio 999, padding 12, ombra "Sospensione" |
| 2 | Saluto + chips | `2294:25890` | "Bentornata Marica!" (Bitter Bold 32), 5 chips categorie scorrevoli |
| 3 | Card profilo | `2294:25901` | Istanza "Card profilo" |
| 4 | Da qui, tutto | `2368:21806` | Carosello servizi: Vendi i tuoi libri / Ultime occasioni, tutto al 50% / Scuola e Università / E-reader. Card 283 × 400 con bottone Secondary Filled |
| 5 | Scelti per te | `2368:21843` | Titolo + "vedi tutti", carosello di card libro (267 × 368) |
| 6 | Carosello | `2368:21842` | Istanza `card.carosello` |
| 7 | Bestseller | `2368:21745` | Titolo + "vedi tutti" + 5 card libro |
| 8 | Se non sai cosa leggere | `2368:21755` | `card.mysterybox` |
| 9 | Ultime uscite | `2368:21758` | 5 card libro ("vedi tutti" nascosto nel design) |
| 10 | Offerte del momento | `2368:21768` | 4 `card.promo` (219 × 251) |
| 11 | Ultima occasione >50% | `2368:21775` | Outlet, 5 card libro |
| 12 | Libri usati | `2368:21785` | 5 card libro |
| 13 | Libri prenotabili | `2368:21795` | Pre-order, 5 card libro |
| 14 | Footer | `2368:21805` | Istanza footer (393 × 556) |

Margini laterali 16 px. Spazio tra le sezioni circa 32 px. Titoli di sezione in Bitter Bold.

## 4. Decisioni prese

| Tema | Decisione |
|---|---|
| Stack | **Next.js (App Router) + React + TypeScript** |
| Stili | **`tokens.css`** (variabili CSS globali) + **CSS Modules** (un `.module.css` per componente). Niente Tailwind |
| Variabili | CSS, non JSON. Un JSON servirà solo se un giorno andranno sincronizzate con Figma o con un'app |
| Font | **Bitter** (titoli) e **Poppins** (testo), da Google Fonts tramite `next/font/google` |
| Responsive | Il design è solo mobile. **Tablet e desktop: layout allargato**, con contenuto centrato (max circa 1280 px), header più ampio e caroselli che mostrano più card. Ogni scelta va segnalata |
| Interazioni | In React: caroselli scorrevoli (scroll-snap + frecce su desktop), chips scorrevoli, hover sulle card, stati dei bottoni |
| Dati | **File JSON di prova** in `/data/*.json` (libri, promo, servizi, utente), con testi presi dal Figma. I componenti li ricevono come props, così in futuro si passa a un'API senza toccarli |
| Immagini | Già esportate dall'utente in `asset/` (nomi = varianti Figma, es. `State=Fantasy.png`, `promo=estesa.png`), poi rinominate e smistate in `public/assets/` (vedi §6) |
| AI companion | **Fase finale.** Niente nell'interfaccia per ora. Il progetto deve però poterlo accogliere (route API Next.js, chiave lato server). Documenti già pronti in `companion/` |
| Design system | **Tutto**, ma a fasi (§7). Fase 1: token + homepage. Poi una sezione del UI kit alla volta, visibili in una pagina `/componenti` |
| Fedeltà | **Copiare il design paro paro.** Non attivare skill che modificano o "migliorano" il design (es. frontend-design o altre skill estetiche). Unica skill ammessa: **caveman**, per avere risposte sintetiche |
| Fine lavoro | Elencare **tutto ciò che si è dovuto ipotizzare** |

## 5. Token già estratti

In `docs/design/tokens-estratti.css` (base per `styles/tokens.css`). Contiene:

- **Primary (verde):** 10–100 (`#F1FFF6` → `#214E3A`). Brand: `#0F7E39`
- **Secondary (arancio):** 10–100. Brand: `#DE633B`
- **Accent (lime):** 10–100 (`#C5FB20`, `#D6FF53`…)
- **Neutrals**, semantici (background, testo, success / warning / error / info), `--bg-paper #F5F4EE`
- **Tipografia "Mobile/…":**

  | Stile | Font, peso, dimensione |
  |---|---|
  | H3 | Bitter 700, 32 |
  | SubH1 | Bitter 700, 28 |
  | SubH2 | Bitter 700, 24 |
  | SubH3 | Bitter 700, 20 |
  | Body 1 | Poppins 400/600, 12 |
  | Body 2 | Poppins 400/600, 16 |
  | Body 2,5 | Poppins 600, 20 |
  | Body 4 | Poppins 600, 30 |

  Line-height 100%.
- **Raggi:** 8 / 12 / 16 / 24 / 999. **Ombre:** "Sospensione" `0 2px 4px #0000000D`, Drop Shadow/200

⚠️ Incongruenza da verificare: lo style guide mostra la scala "body" in **Gill Sans Light**, mentre le variabili e il design usano **Poppins**. Decisione presa: **Poppins**.

## 6. Organizzazione cartelle (prevista)

```
libby/
├─ BRIEF.md                 ← questo file
├─ PROMPT-ANTIGRAVITY.md    ← prompt per avviare il lavoro
├─ docs/
│  ├─ architettura-informazioni.md ← 8 categorie del catalogo + aree trasversali
│  └─ design/tokens-estratti.css
├─ companion/               ← tutto ciò che riguarda l'AI companion Libby
│  ├─ libby-anima.md        ← personalità e regole (system prompt)
│  ├─ kb-libraccio.md       ← knowledge base operativa Libraccio.it (contatti, resi, ecc.)
│  └─ libby.svg             ← possibile aspetto di Libby (vedi §8)
├─ asset/                   ← export grezzi da Figma (originali, non toccare)
└─ (progetto Next.js)
   ├─ app/                  ← layout.tsx (font), page.tsx (homepage), componenti/page.tsx
   ├─ components/           ← TabBar, StatusBar, Chips, CardProfilo, SectionHeader, Carousel,
   │                          CardLibro, CardPromo, CardServizio, MysteryBox, Footer, Button…
   ├─ data/                 ← books.json, promos.json, services.json, user.json
   ├─ styles/               ← tokens.css, globals.css
   └─ public/assets/
      ├─ brand/  icons/  covers/  services/  promo/  profile/
```

## 7. Fasi del design system (UI kit `57:450`)

1. **Fase 1:** token + homepage completa con i suoi componenti.
2. **Le basi** (`688:4837`): chips, toggle, card libro, breadcrumbs, tab bar, card agenda, radio, fab "torna su", card carosello, card promo, footer, status tab, carosello servizi.
3. **Bottoni** (`1293:1662`) e **badge** (`1293:1661`).
4. **Offerte** (`1883:12573`), **mystery e bundle** (`1778:9206`), **carrello** (`2158:17926`), **modale search** (`2369:22076`).
5. **Outlet scheda prodotto** (`1778:9205`) e **drop down** (`1574:6604`).
6. **Filtri** (`1429:9141`) e **wishlist** (`1577:3021`).
7. **Area personale** (`1577:3020`): card recensioni / missioni / distintivi, quiz, stepper, gamification, login.
8. **Fase finale: AI companion Libby.** Avatar (`companion/libby.svg`), chat, route API con chiave lato server, comportamento da `companion/libby-anima.md` e knowledge base da `companion/kb-libraccio.md`.

## 8. Uso dei documenti in `docs/` e `companion/`

- **`architettura-informazioni.md`**: fonte per i menu e le chips categorie (Narrativa e letteratura, Ragazzi e fumetti, Società storia e politica, Arte e spettacolo, Lifestyle e sport, Scienza e tecnologia, Economia diritto e lavoro, Lingue). Usato, scolastico, audiolibri ed ebook sono **filtri trasversali**, non categorie.
- **`kb-libraccio.md`**: contatti e testi del footer (servizio clienti +39 02 91435530, customerservice@libraccio.it, link assistenza). In futuro, knowledge base di Libby per le domande operative.
- **`libby.svg`**: possibile aspetto del companion, 367 × 490. ⚠️ Al momento è una **immagine raster (PNG) incorporata in un SVG**, non un disegno vettoriale: non si possono animare o modificare le singole parti (occhi, bocca, braccia). Per l'interazione serve un export vettoriale (da Figma o Illustrator, con i livelli separati e nominati). Da usare solo nella fase finale.
- **`libby-anima.md`**: system prompt di Libby (massimo 3 libri, 80–120 parole, priorità a outlet e promo, mai titoli inventati, distinzione tra utente loggato e non loggato). Da usare quando si costruirà il companion.

## 9. Ipotesi aperte (da confermare con l'utente)

- Layout tablet e desktop: inventato, non presente in Figma.
- Comportamento dei caroselli su desktop (frecce, numero di card visibili).
- Destinazione dei link (vedi tutti, chips, icone header): per ora `#` o route segnaposto.
- Gill Sans contro Poppins per il corpo del testo.
- Contenuto esatto di card profilo, mystery box e footer: da leggere dal Figma.
