# Product

## Register

product

## Users
Clienti di Libraccio.it: lettori, studenti, famiglie che comprano libri nuovi, usati e scolastici. Usano il sito soprattutto da telefono, nei ritagli di tempo (sui mezzi, in pausa, la sera sul divano), spesso senza un titolo preciso in mente. Possono essere loggati (profilo lettore con gusti e livello, es. Marica, "Novellino") oppure no.

Job to be done: trovare in fretta il libro giusto per sé o da regalare, idealmente a buon prezzo (outlet, promo, usato).

## Product Purpose
Homepage "Offerte e Outlet" di Libraccio.it (fedele al design Figma) più **Libby**, la libraia digitale: una chat che consiglia al massimo 3 libri del catalogo incrociando gusti, mood e sconti attivi. Successo = l'utente esce dalla chat con un titolo che lo convince, senza sentirsi spinto a comprare.

Il companion è oggi un motore locale a regole (`lib/libby.ts`) che segue `companion/libby-anima.md`; in futuro passerà a un LLM con la stessa interfaccia.

## Brand Personality
**Libraia di fiducia.** Calda, colta, entusiasta ma mai invadente: parla come una libraia appassionata, non come un assistente tecnico. Tre parole: *accogliente, competente, discreta*.

Nella chat i libri consigliati sono i protagonisti (copertine, titolo, perché leggerlo, prezzo); la conversazione resta leggera e breve (80–120 parole per risposta).

## Anti-references
- **Chatbot dell'assistenza clienti**: widget freddo "come posso aiutarti?", bolle grigie, tono da ticket.
- **Assistente AI generico**: estetica ChatGPT, schermo vuoto, muri di testo, gradienti viola, scintille "AI".
- **Troppo infantile**: mascotte e colori da app per bambini, nonostante punti e livelli del profilo.

## Design Principles
1. **La homepage è intoccabile**: è la copia del Figma. Le scelte di design libere valgono solo per Libby e per l'involucro da app su telefono.
2. **Il libro prima della chat**: ogni risposta di Libby deve far vedere e toccare il libro (copertina, prezzo, azione), non solo descriverlo.
3. **Come un'app sul telefono**: gesti, spazi e reazioni da app nativa (safe area, bottom sheet, tastiera gestita, tap generosi), mai da widget incollato su un sito.
4. **Consigliare, non spingere**: priorità a outlet e promo senza urgenza artificiale; massimo 3 libri, mai titoli inventati.
5. **Il tono di Libby è nel design**: calore e cultura arrivano da tipografia (Bitter), ritmo e microcopy, non da decorazioni.

## Accessibility & Inclusion
WCAG 2.2 AA. Chat in `<dialog>` con focus gestito, messaggi in una regione live, nomi accessibili in italiano su tutti i controlli, target touch ≥ 44 px, `prefers-reduced-motion` rispettato su ogni animazione, contrasto ≥ 4.5:1 anche per placeholder e testi secondari.
