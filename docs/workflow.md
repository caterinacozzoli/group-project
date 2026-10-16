# Workflow – fonte della presentazione

Fonte unica per costruire `/presentazione` (stesso repo, stessa pubblicazione su GitHub Pages).
Slide di riferimento: Figma `ABMNWEBWE5ftPLAqWsr432`, frame Contesto `1:145`, Preparazione `1:98`, Configurazione `1:39`, Esecuzione `1:2`.

## In breve

- **Pubblico:** colleghi del Master Talent Garden, anche senior e più esperti.
- **Durata:** 30 minuti, demo finale compresa.
- **Cosa conta:** il workflow e gli strumenti. La UI serve solo come risultato tangibile.
- **Messaggio:** *fedeltà dove serve, libertà dove aggiunge valore.* Tre risultati:
  1. homepage importata identica al Figma (variabili, componenti, stili, asset);
  2. resa responsive e usabile dal telefono come un'app, senza disegnare i breakpoint;
  3. una feature nuova, Libby, aggiunta con poco.
- **Racconto:** il workflow in ordine, come se lo rifacessimo da zero davanti a loro (con screenshot e brevi video, non dal vivo). Ci si ferma solo sulle cose meno note o sulle scelte da motivare.
- **Tono:** versione pulita. Si racconta un solo intoppo, quello del clipsContent.

## Formato di ogni slide

- **Passo:** cosa abbiamo fatto, in poche righe.
- **Perché:** riquadro breve, solo dove serve. Una riga su cos'è e una sul perché l'abbiamo scelto.
- **+ Approfondimento:** si apre cliccando sulla voce. Contiene un riassunto e i link. Serve all'oratore per le domande e a chi vuole recuperarlo dopo. Lo stesso segnale discreto ("+") su ogni voce che ne ha uno.

## Stile (dalle 4 slide del Figma)

- Fondo bianco; testo `#171717`, testo secondario `#555555` (contrasto circa 7:1), linee `#D7D7D7`.
- Titoli: Bodoni 72 Book nel Figma; sul web **Orbit** (Google Fonts), più leggibile in proiezione. Testi: **Inter**.
- Icone al tratto Lucide (book-open, bot, code-xml, panels-top-left, folder, user, file-text), frecce tratteggiate.
- Testata: `LIBRACCIO / PROGETTO` a sinistra, `MASTER TALENT GARDEN · SETTIMANA AI` a destra. Trattino 40×2 sopra il titolo.
- Leggibilità in proiezione (frame 1920): etichette 13 → **18 px**, dettagli 16 → **20 px**, descrizioni 21 → **24 px**. Titoli invariati (64 / 31 px).

## Tempi

| # | slide | min |
|---|---|---|
| 1 | Copertina | 0,5 |
| 2 | Il contesto del progetto | 2 |
| 3 | Il workflow in tre fasi | 1 |
| 4 | Prompt maker e handoff | 2 |
| 5 | La cartella di progetto | 2 |
| 6 | Antigravity e il ponte con Figma | 2,5 |
| 7 | Le skill | 2,5 |
| 8 | Il prompt di avvio | 1,5 |
| 9 | Dal Figma al codice | 3 |
| 10 | Responsive senza disegnare i breakpoint | 2 |
| 11 | Come un'app sul telefono | 1,5 |
| 12 | Libby, con poco | 2,5 |
| 13 | La verifica | 1,5 |
| 14 | La pubblicazione | 1,5 |
| 15 | Demo | 4 |
| 16 | Chiusura | 0,5 |
| | **totale** | **30** |

---

## 1. Copertina

- **Titolo:** Da Figma al prototipo con Antigravity
- **Sottotitolo:** Copia fedele, responsive, una feature AI. Il workflow della settimana AI.

## 2. Il contesto del progetto

Slide esistente `1:145`.

- **Sintesi:** Una settimana di sperimentazione AI, dalla pagina Libraccio al prototipo HTML.
- **Voci:**
  - Contesto · **Libraccio.it** · Cliente del progetto
  - Strumento · **Antigravity** · Editor di codice con agenti AI
  - Attività · **Generare la pagina** · Dal design Figma a un prototipo HTML funzionante
  - Risultato · **Prototipo + AI** · Homepage Outlet con Libby, la libraia digitale
  - **Settimana AI** · Durante il Master Talent Garden
- **Perché Antigravity:** conta dove gira l'agente. In Antigravity Claude lavora sul nostro computer: raggiunge il file Figma aperto, avvia il sito e lo controlla nel browser.
- **+ Approfondimento:**
  - Antigravity è l'editor di codice di Google, costruito su VS Code, con agenti AI integrati. Nel suo terminale abbiamo usato **Claude Code**, l'agente di Anthropic.
  - Differenza con Claude Desktop: lì l'agente lavora in un ambiente cloud e vede solo le cartelle collegate. Non raggiunge i programmi in esecuzione sul Mac (per esempio il ponte di Figma su `localhost:38451`) e non può avviare il sito in locale per guardarlo.
  - Link: [Antigravity](https://antigravity.google) · [Claude Code](https://code.claude.com/docs/en/overview)
- **Materiale:** screenshot della homepage Figma di Gaia (già nella slide).
- **Da correggere:** "feature AI da definire" diventa Libby; refuso "funzionanate".

## 3. Il workflow in tre fasi

Nuova slide: ridisegnare in stile minimal il diagramma `1:267`.

- **Schema:** Preparazione → Configurazione → Esecuzione → **Prototipo online**
  - **Fase 1 · Preparazione, in Claude Desktop (pensare):** spazio Prompt maker, handoff in file, cartella di progetto.
  - **Fase 2 · Configurazione, in Antigravity (collegare):** ponte con Figma, skill.
  - **Fase 3 · Esecuzione, con Claude Code in Antigravity (costruire):** homepage, responsive, app da telefono, Libby, verifica, pubblicazione.
- **Perché due strumenti:** Claude Desktop per decidere, conversando e leggendo il Figma con il connettore. Antigravity per costruire, perché lì l'agente lavora sul computer.
- **Da correggere rispetto ai vecchi diagrammi:** prompt maker in uno spazio **Claude** (non Perplexity); avatar **Meta AI + Vizcom** (non solo Meta AI); variabili in **CSS** (non JSON).

## 4. Prompt maker e handoff

Slide esistente `1:98`, parte sinistra.

- **Sintesi:** Abbiamo deciso cosa fare in una conversazione, poi l'abbiamo trasformata in file.
- **Voci:**
  - Spazio · **Prompt maker** · Uno spazio Claude con istruzioni fisse, che genera i prompt di ogni passo
  - Fonte · **Figma di Gaia** · Letto con il connettore Figma di Claude Desktop
  - Output · **Handoff** · `BRIEF.md`, `libby-anima.md`, `PROMPT-ANTIGRAVITY.md`
- **Perché l'handoff:** le decisioni non restano nella memoria di una chat. Stanno in file che si rileggono, si versionano e si passano a un altro agente o a un collega.
- **+ Approfondimento:**
  - Uno spazio (Progetto) di Claude conserva istruzioni e file di riferimento per tutte le conversazioni: in pratica funziona come una skill personale.
  - Dal prompt maker sono usciti il brief per Antigravity, il prompt per l'avatar e l'anima di Libby.
  - Link: [Cosa sono i Progetti di Claude](https://support.claude.com/en/articles/9517075-what-are-projects)
- **Materiale:** screenshot dello spazio Claude "Prompt maker".
- **Da correggere:** lo screenshot attuale mostra l'interfaccia di Perplexity, va sostituito.

## 5. La cartella di progetto

- **Sintesi:** Tutto quello che serve all'agente, in un'unica cartella.
- **Schema:**

  ```
  libby/
  ├── BRIEF.md               decisioni, link Figma, struttura, cartelle
  ├── PROMPT-ANTIGRAVITY.md  prompt di avvio
  ├── asset/                 immagini esportate dal Figma
  ├── companion/             libby-anima.md + libby.svg
  └── docs/                  architettura delle informazioni + variabili CSS
  ```

- **Voci:**
  - **asset/** · Ogni immagine del Figma, esportata come indicato dal prompt maker
  - **companion/** · L'anima di Libby (tono, regole, limiti) e il suo avatar
  - **docs/** · Architettura delle informazioni di Libraccio e variabili del design (`tokens-estratti.css`, dal connettore Figma)
  - **Avatar** · Generato con Meta AI, ritoccato, poi vettorializzato con Vizcom in SVG
- **Perché:** l'agente parte da file, non da spiegazioni a voce: meno ambiguità e un risultato ripetibile.
- **+ Approfondimento:**
  - Le variabili le abbiamo preparate in Claude Desktop, ma si possono leggere anche direttamente in Antigravity con figma-ui-mcp, come abbiamo fatto per parte delle variabili e degli elementi.
  - SVG: immagine vettoriale, nitida a ogni dimensione e leggera.
  - Link: [Meta AI](https://www.meta.ai) · [Vizcom](https://vizcom.com)
- **Materiale:** screenshot della cartella; `companion/libby.svg`.

## 6. Antigravity e il ponte con Figma

Slide esistente `1:98`, parte destra (schema Antigravity ↔ MCP ↔ Figma).

- **Sintesi:** Apriamo la cartella in Antigravity e colleghiamo l'agente a Figma.
- **Voci:**
  - Agente · **Claude Code** · Avviato con `claude` nel terminale di Antigravity
  - Server · **figma-ui-mcp** · `claude mcp add --scope user figma-ui-mcp -- npx figma-ui-mcp`
  - Plugin · **Figma UI MCP Bridge** · Figma desktop → Plugins → Development → Import plugin from manifest
  - Lettura · **Dal file aperto** · Variabili, componenti, stili e immagini
- **Perché MCP:** è uno standard aperto per collegare un agente AI a strumenti esterni (Figma, browser, GitHub), come una presa universale.
- **Perché figma-ui-mcp:** gira in locale, non chiede API key e non ha limiti di chiamate legati al piano Figma.
- **Cos'è GitHub:** la piattaforma dove si salva e si condivide il codice con tutta la sua storia. figma-ui-mcp è un progetto open source che si prende da lì.
- **+ Approfondimento:**
  - Installazione (dal README del progetto):
    1. aggiungere il server a Claude Code;
    2. riavviare l'editor;
    3. scaricare `plugin.zip` e importare `manifest.json` in Figma desktop (la versione web non raggiunge il computer);
    4. avviare il plugin: il pallino verde indica che è collegato.
  - In Antigravity lo stesso server si configura da "Manage MCP Servers" → `mcp_config.json`.
  - Link: [figma-ui-mcp su GitHub](https://github.com/TranHoaiHung/figma-ui-mcp) · [Model Context Protocol](https://modelcontextprotocol.io) · [MCP in Claude Code](https://code.claude.com/docs/en/mcp)
- **Materiale:** screenshot di Antigravity con il terminale; plugin Figma con il pallino verde.

## 7. Le skill

Slide esistente `1:39`, colonna SKILL.

- **Sintesi:** Istruzioni pronte che insegnano all'agente un mestiere.
- **Voci (cosa fa · quando l'abbiamo usata):**
  - **Caveman** · Risposte asciutte, meno token · Sempre
  - **Impeccable** · Linguaggio di design per l'AI · Solo su Libby
  - **UI/UX Pro Max** · Regole UX per interfacce professionali · Solo su Libby
  - **Playwright** · L'agente usa il browser · Verifiche
  - **Accessibility agents** · Revisione WCAG 2.2 AA · A ogni modifica dell'interfaccia
  - Installazione: `/plugin marketplace add <utente/repo>`, poi `/plugin install`
- **Perché le skill:** sono istruzioni che l'agente carica quando servono, così ha competenze specifiche senza riscriverle ogni volta nel prompt.
- **Perché queste:** sulla homepage niente skill che ne cambino l'aspetto (doveva restare identica). Le skill di design le abbiamo usate solo per Libby.
- **+ Approfondimento** (descrizioni dai repo):
  - **Caveman:** "why use many token when few token do trick". Secondo il repo riduce i token di circa il 65%. [GitHub](https://github.com/JuliusBrussee/caveman)
  - **Impeccable:** "The design language that makes your AI harness better at design." Comandi come critique, polish e audit; file `PRODUCT.md` con personalità e principi del prodotto. [GitHub](https://github.com/pbakaus/impeccable)
  - **UI/UX Pro Max:** "design intelligence for building professional UI/UX across multiple platforms": stili, palette e regole UX (per esempio bottoni da almeno 44 px, margini per notch e barra home). [GitHub](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
  - **Playwright:** il server MCP di Microsoft, installato dal marketplace ufficiale di Anthropic. [Playwright MCP](https://github.com/microsoft/playwright-mcp) · [Marketplace](https://github.com/anthropics/claude-plugins-official)
  - **Accessibility agents:** "Eleven specialists that enforce WCAG 2.2 AA compliance so AI coding tools stop generating inaccessible code." [GitHub](https://github.com/community-access/accessibility-agents)
  - Guide: [Plugin](https://code.claude.com/docs/en/plugins) · [Skill](https://code.claude.com/docs/en/skills)
- **Materiale:** screenshot di `/plugin` nel terminale.
- **Da correggere:** nella slide c'è "Skill anima Libby", ma l'anima è un file in `companion/`, non una skill.

## 8. Il prompt di avvio

- **Sintesi:** Un prompt breve che rimanda ai file.
- **Estratto da `PROMPT-ANTIGRAVITY.md`:** "Leggi `BRIEF.md`… converti la homepage Figma… Copia il design **paro paro**… Prima di scrivere codice fammi le domande… Alla fine elenca tutto ciò che hai dovuto ipotizzare."
- **Perché:** domande prima del codice e ipotesi dichiarate alla fine. Il controllo resta a chi progetta, senza decisioni nascoste.
- **+ Approfondimento:**
  - Il testo completo del prompt.
  - Le domande che Claude ha fatto: export delle immagini, segnaposto, status bar, breakpoint.
- **Materiale:** screenshot del terminale con le domande.

## 9. Dal Figma al codice

Slide esistente `1:2` (Esecuzione: cartella, prima e dopo).

- **Sintesi:** La homepage importata identica: variabili, componenti, stili, asset.
- **Voci:**
  - **Variabili** → `styles/tokens.css` (da `tokens-estratti.css`, completato leggendo il Figma)
  - **Componenti** → un componente per ogni componente Figma (card, carosello, tab bar…)
  - **Stili di testo** → Bitter e Poppins, come nel Figma
  - **Asset** → immagini esportate, rinominate e smistate in `public/assets/`
  - **Dati** → testi e libri in `data/*.json`
- **Perché i token:** un'unica fonte per colori, testi e spazi. Se cambia un valore cambia ovunque, come nel Figma.
- **L'intoppo:** alcune immagini uscivano vuote perché il frame aveva attivo "ritaglia contenuto" (clipsContent). L'abbiamo disattivato, riesportato le immagini e riattivato.
- **+ Approfondimento:**
  - Stack: Next.js (App Router), TypeScript, CSS Modules.
  - Perché CSS Modules e token: i valori del Figma vengono copiati 1:1, senza un framework che li reinterpreta.
  - Posizioni verificate entro 1–3 px dal Figma.
- **Materiale:** cartella in Antigravity; prima = Figma a 393 px; dopo = prototipo.

## 10. Responsive senza disegnare i breakpoint

- **Sintesi:** Dal solo mobile (393 px) a tablet e desktop.
- **Voci:**
  - **Mobile 393** · Identico al Figma
  - **Tablet ≥ 768** · Margini più ampi, griglie più larghe
  - **Desktop ≥ 1024** · Contenuto fino a 1280 px
  - **⌘D** · Anteprima mobile → tablet → desktop dentro cornici iPhone e iPad
- **Perché ⌘D:** è uno strumento su misura. L'abbiamo chiesto in una frase e l'agente l'ha costruito per questo progetto. Ogni progetto può avere le sue scorciatoie e i suoi strumenti.
- **+ Approfondimento:** l'anteprima carica la pagina vera alla larghezza del dispositivo e la rimpicciolisce per farla stare nello schermo. Al primo accesso un pop up spiega la scorciatoia.
- **Materiale:** `cmdD-mobile.png`, `cmdD-tablet.png`, `tip.png`; breve video di ⌘D.

## 11. Come un'app sul telefono

- **Sintesi:** Aperto dal telefono, niente cornici: sembra un'app.
- **Voci:**
  - **Status bar** · Quella finta del Figma si nasconde sui telefoni veri
  - **Margini** · Rispettano notch, Dynamic Island e barra home
  - **Aggiungi a Home** · Icona Libraccio, si apre a tutto schermo
- **Perché la PWA:** una Progressive Web App è un sito che si installa sulla Home senza passare dallo store. Bastano un manifest e un'icona.
- **+ Approfondimento:** [PWA su web.dev](https://web.dev/learn/pwa)
- **Materiale:** `phone-home.png`, `pages-iphone.png`; breve video di "Aggiungi a Home".

## 12. Libby, con poco

- **Sintesi:** Una feature nuova: la libraia digitale.
- **Voci:**
  - **Anima** · `libby-anima.md`: tono, regole e limiti (al massimo 3 libri, mai titoli inventati)
  - **Motore** · Regole locali che seguono l'anima, senza API
  - **Interfaccia** · A tutto schermo sul telefono, pannello su desktop
  - **Design** · Impeccable e UI/UX Pro Max, solo qui
- **Perché senza API:** zero costi, nessuna chiave nel repo pubblico, risposte prevedibili e testabili (`npm run check:libby`). L'interfaccia resta la stessa: domani si collega a un modello AI vero.
- **Perché le skill solo qui:** la homepage è il Figma e non si tocca. La libertà di design va dove aggiunge valore.
- **+ Approfondimento:**
  - `PRODUCT.md`: personalità "libraia di fiducia"; da evitare il chatbot dell'assistenza clienti, l'AI generica e l'estetica infantile.
  - Chat: risposte rapide, card libro con carrello, trascina giù per chiudere.
- **Materiale:** `libby-welcome.png`, `phone-chat-1..3.png`, `desk-panel.png`.

## 13. La verifica

- **Sintesi:** L'agente controlla da solo quello che ha fatto.
- **Voci:**
  - **Playwright** · Apre il sito, simula un iPhone, clicca, scrive, fotografa e confronta con il Figma
  - **Accessibility agents** · Alt text, tastiera, screen reader, contrasti (WCAG 2.2 AA)
  - **Test** · `check:libby` controlla le regole di Libby
- **Perché:** la verifica è ripetibile e veloce, senza test a mano. L'accessibilità si controlla mentre si scrive, non dopo.
- **+ Approfondimento:** [Playwright](https://playwright.dev) · [Playwright MCP](https://github.com/microsoft/playwright-mcp) · [Accessibility agents](https://github.com/community-access/accessibility-agents)
- **Materiale:** screenshot dalla cartella `.playwright-mcp/`.

## 14. La pubblicazione

- **Sintesi:** Dal computer a un link pubblico.
- **Schema:** `gh auth login` → `git push` → GitHub Actions compila → GitHub Pages pubblica
- **Perché `gh auth login`:** login dal browser, nessun token da copiare, credenziale salvata nel portachiavi del Mac.
- **Perché GitHub Actions e Pages:** a ogni push il sito si ricompila e si aggiorna da solo, gratis. Il sito è statico, quindi non serve un server.
- **+ Approfondimento:**
  - Permessi del login: `repo` e `workflow` (il secondo serve per pubblicare con Actions).
  - Alternativa possibile: Vercel (non usato).
  - Link: [gh auth login](https://cli.github.com/manual/gh_auth_login) · [GitHub Pages](https://docs.github.com/en/pages) · [Export statico Next.js](https://nextjs.org/docs/app/guides/static-exports) · [Repo del progetto](https://github.com/caterinacozzoli/group-project)
- **Materiale:** screenshot del repo e di Actions con la spunta verde.

## 15. Demo

- **QR** → https://caterinacozzoli.github.io/group-project/
- **Sequenza:**
  1. Dal telefono: homepage, poi Libby (chiedere un consiglio, aggiungere al carrello).
  2. Desktop: la stessa pagina allargata, con il pannello di Libby.
  3. ⌘D: mobile → tablet → desktop.
- **Piano B:** video registrato, se la rete non regge.

## 16. Chiusura

- **Cosa si riusa domani:** struttura della cartella, brief e prompt di avvio, skill, ponte con Figma, pubblicazione automatica.
- **Messaggio:** fedeltà dove serve, libertà dove aggiunge valore.

---

## Materiale disponibile

- **Screenshot** in `.playwright-mcp/`:
  - anteprima ⌘D: `cmdD-mobile`, `cmdD-tablet`, `iphone`, `ipad`, `tip`;
  - Libby: `libby-welcome`, `libby-chat`, `phone-chat-1..3`, `desk-panel`, `desk-chat`;
  - telefono: `phone-home`, `pages-iphone`.
- **Avatar:** `companion/libby.svg`.
- **Prototipo online:** https://caterinacozzoli.github.io/group-project/
- **Da produrre:**
  - screenshot dello spazio Claude "Prompt maker";
  - screenshot della cartella in Antigravity e del plugin Figma con il pallino verde;
  - screenshot di `/plugin` nel terminale;
  - screenshot di GitHub Actions;
  - video di ⌘D e di "Aggiungi a Home".
