Leggi `BRIEF.md` e i file in `docs/` e `companion/`: contengono tutte le decisioni già prese.

Poi converti in un progetto Next.js (App Router, TypeScript, `tokens.css` + CSS Modules, Bitter/Poppins con `next/font`) la homepage Figma `2294:25887` del file `uAE3KllIWOwc9GiiqPU4D6`. Usa il bridge MCP **figma-ui-mcp** già attivo, non il connettore Figma ufficiale, che ha esaurito le chiamate.

- Parti da `docs/design/tokens-estratti.css` per creare `styles/tokens.css`.
- Leggi ogni sezione elencata al §3 del brief. Il design è mobile (393 px): riproducilo fedelmente, status bar inclusa, poi costruisci tablet e desktop con layout allargato.
- I dati vanno in `data/*.json`. Le immagini che trovi in `asset/` vanno rinominate e smistate in `public/assets/` come da §6.
- Copia il design **paro paro**: non attivare skill che ne cambiano l'aspetto. Usa solo la skill **caveman** per rispondermi in modo sintetico.
- Il companion Libby (`companion/`) è la fase finale: per ora non va toccato.
- Questa è solo la fase 1 (token + homepage). Il resto del UI kit lo facciamo dopo, una sezione per volta.
- Prima di scrivere codice fammi le domande che ti servono. Alla fine dimmi come avviarlo ed elenca tutto ciò che hai dovuto ipotizzare.
