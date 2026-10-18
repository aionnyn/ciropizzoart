# Ciro Pizzo Art

*Il tempo passa, una foto resta.* — *Time passes, a photograph remains.*

Sito-esperienza di Ciro Pizzo: fotografia, pittura, ritratto, boudoir. Sacro e profano. **Bilingue italiano / inglese** (selettore IT | EN in alto a destra).

Il visitatore apre un sipario, entra nell’obiettivo (2D → 5D) e arriva davanti a una nicchia di tufo da cui sgorga acqua azzurra luminosa con la scritta “Ciro Pizzo”: la luce si avvicina e si entra (tocca per saltare; la foto è `foto/studio/soglia.jpg`). Poi attraversa le camere una alla volta:

| # | Pagina | Cosa succede |
|---|--------|--------------|
| · | Benvenuto | presentazione |
| ∞ | Lo Studio | “Il tempo si è fermato alle …” con l’ora esatta; il coperchio dell’orologio da taschino si stacca, diventa 100 lire e vola nel mega juke-box; si tocca un titolo o si digita 101–106 e sullo schermo compare quella parte dello studio |
| | **Le arti di Ciro** | |
| I | Fotografia e ritratto | entrando, un dito dalle unghie rosse preme lo scatto da solo: flash, esce una polaroid; poi si può scattare anche a mano |
| II | Boudoir · Sfumature di Pizzo | si arriva con un telo di velluto rosso che scivola sullo schermo; pizzo nero con medaglione ricamato “Ciro Pizzo art”; scendendo la gamba si porta al centro e appena si scorre giù la mano dalle unghie rosse tira su la calza da sola |
| III | Pittura | un pennello scorre sulla tela liscia e scrive “Pittura e arte” in vernice; poi si sceglie il colore dalla tavolozza e si dipinge con il dito |
| IV | Galleria | i lavori in cornici dorate |
| | **Esperienze** | |
| V | Poker d’autore | tavolo verde a schermo intero, 5 carte grandi con i nudi d’arte; toccando una carta si ingrandisce |
| VI | Sacro e profano | si accende un cero e appare un ex-voto |
| | **Il blog** | |
| VII | Pensieri | articoli di Ciro: i grandi maestri (Leonardo, Michelangelo, Caravaggio, Tiziano, Artemisia Gentileschi, Van Gogh) e spirito e alchimia (Jung, Gurdjieff, Saint-Germain), con filtri: si aprono a tutta pagina |
| | **Prenota** | |
| VIII | Pacchetti e regali | tre pacchetti e il buono regalo |
| IX | La prima volta | come funziona e domande frequenti |
| | **Contatti** | |
| X | Contatti (la Grotta) | mare, cielo e roccia; contatti e collaborazioni |
| — | **Shop** (pagina a parte, senza numero) | si apre dal carrello in alto o dal Menu: calendari, libro, stampe, dipinti, buoni |

**Navigare senza frecce:** nella pagina d’ingresso c’è la mappa con una tessera per ogni pagina (si tocca e si va); in fondo a ogni pagina c’è “Continua → pagina successiva” e “Tutte le pagine”; sul telefono si scorre di lato con il dito; toccando il nome della pagina in basso si apre il Menu.

Il tasto **Menu** apre una pagina intera con tutte le sezioni divise per gruppi, lo Shop, il tasto "Prenota una sessione", indirizzo, telefono, email, Instagram e la lingua.

## Pensieri (il blog)

Gli articoli sono in `js/contenuti.js` → `pensieri`. Per aggiungerne uno copia un blocco `{ ... }` e cambia `tema` (la riga piccola sopra il titolo), `titolo`, `minuti` e `testo` (un paragrafo per riga). La traduzione inglese va in `en: { ... }`. Il primo dell’elenco compare per primo. `gruppo` decide il filtro: `maestri` o `spirito` (i maestri compaiono per primi). ★ I dieci articoli attuali sono bozze da far rivedere a Ciro.

Per cambiare l’ordine basta spostare le `<section>` in `index.html` e cambiare `data-num` (il numero romano) e `data-gruppo` (`inizio`, `arti`, `esperienze`, `pensieri`, `servizi`, `contatti`); con `data-fuori="1"` una pagina resta fuori dal percorso numerato, come lo Shop: i numeri nelle etichette e il menu si aggiornano da soli.

**Stile:** le pagine dove contano le fotografie e le informazioni (ingresso, Fotografia, Galleria, Pensieri, Pacchetti, La prima volta, Shop) hanno fondo avorio e schede bianche, come i siti dei grandi fotografi di moda; le stanze-esperienza (Studio, Boudoir, Pittura, Poker, Sacro, Grotta) restano nei loro colori. Il motivo che lega tutto è il pizzo Chantilly nero (rete, rose, foglie, smerlo con le ciglia), solo nella pagina Boudoir: sotto il titolo, con al centro un medaglione ricamato “Ciro Pizzo art” in corsivo, e in fondo alla pagina. Per rendere chiara o scura una pagina: aggiungi o togli `chiara` nella `class` della sua `<section>`.

È un sito statico (HTML + CSS + JavaScript): niente da installare e niente database.

---

## Struttura

```
index.html          ← la struttura delle camere
js/testi.js         ← ★ i testi delle camere, in italiano e in inglese
css/style.css       ← colori, caratteri, animazioni
js/contenuti.js     ← ★ IL FILE DA MODIFICARE: galleria, contatti, juke-box, ex-voto, oracolo
js/app.js           ← la logica (non serve toccarlo)
foto/galleria/      ← ★ le fotografie di Ciro
foto/studio/        ← foto d'ambiente: stile.jpg, mistero.jpg, arte.jpg (camera Lo Studio) e grotta.jpg
                      (per cambiarle basta sostituire il file con lo stesso nome)
```

---

## Aggiungere un lavoro alla galleria

Adesso la galleria ha **6 caselle vuote "Coming soon"**: ognuna è una riga con `foto: ''`. Per riempirne una, metti il percorso della foto e il titolo; per aggiungerne altre, aggiungi righe. Anche nello Shop i prodotti mostrano "Coming soon" finché `foto` è vuoto.

1. Prepara la foto in JPG, verticale, con il lato lungo tra 1600 e 2000 px (sotto 500 KB se possibile).
2. Mettila nella cartella `foto/galleria/`, per esempio `foto/galleria/diva-2026.jpg`.
3. Apri `js/contenuti.js` e aggiungi una riga nella lista `galleria`:

```js
{ foto: 'foto/galleria/diva-2026.jpg', titolo: 'La diva', tipo: 'boudoir', anno: '2026', en: { titolo: 'The diva' } },
{ foto: 'foto/galleria/venere.jpg', titolo: 'Venere nel tufo', tipo: 'pittura', tecnica: 'olio su tela, 70×100 cm', anno: '2025', en: { titolo: 'Venus in the tufa', tecnica: 'oil on canvas, 70×100 cm' } },
```

`tipo` decide il filtro in cui compare l'opera: `foto`, `pittura`, `boudoir`, `ritratto`, `misto` (l'elenco è in `tecniche`, sempre in `js/contenuti.js`). I filtri sopra la galleria compaiono da soli appena ci sono opere di almeno due tipi diversi. `tecnica` è facoltativa e si legge quando si apre l'opera. Per i dipinti basta una buona foto della tela, dritta e con luce uniforme.

L’ordine delle righe è l’ordine dei quadri sulla parete. Per togliere un quadro cancella la sua riga.

Da GitHub, senza programmi: apri la cartella `foto/galleria` → **Add file → Upload files**, poi apri `js/contenuti.js` → icona matita → aggiungi la riga → **Commit changes**. Se il sito è collegato a Netlify, dopo circa un minuto è online.

## Contatti

In `js/contenuti.js`, nella sezione `contatti`, compila indirizzo, telefono, email e Instagram. Se inserisci `whatsapp` (es. `393331234567`), il pulsante **Prenota** apre WhatsApp; altrimenti apre una mail.

## Cambiare i testi (italiano e inglese)

Tutti i testi sono in `js/testi.js`: in alto la sezione `it`, sotto la sezione `en`, con le stesse chiavi. Per cambiare una frase la modifichi in tutte e due le lingue (per esempio `motto`, `benv_testo`, `boud_testo`).

Nei contenuti (`js/contenuti.js`) la versione inglese di ogni voce sta in `en: { ... }`. Se manca, in inglese si vede il testo italiano.

La lingua si sceglie da sola in base al telefono del visitatore e resta memorizzata. Si può anche forzare con un link: `tuosito.it/?lang=en` oppure `?lang=it`.

Il colore di ogni camera è in `index.html`, negli attributi `data-sfondo` (sfondo) e `data-inchiostro` (testo).

## Vendita e contatti

- **WhatsApp sempre visibile**: un tasto verde in basso a destra in ogni camera.
- **I giochi portano a WhatsApp con il messaggio già scritto**: il risultato dell'Oracolo, la situazione del juke-box, il pacchetto scelto, il buono regalo, l'opera della galleria, la collaborazione.
- **Pacchetti**: in `js/contenuti.js` → `pacchetti`. ★ Da confermare con Ciro contenuti e prezzi (`prezzo: ''` = solo €).
- **Domande frequenti**: `faq` in `js/contenuti.js`. ★ Da confermare con Ciro.
- **Opere in vendita**: in `galleria` aggiungi `vendita: true` (e se vuoi `prezzo: '€ 450'`) e nell'opera aperta compare "Lo voglio".
- **Collaborazioni**: `collaborazioni` in `js/contenuti.js` (brand, modelle, make-up, riviste, gallerie).

## Shop

I prodotti sono in `js/contenuti.js` → `shop`. Per ora i prezzi sono nascosti: sul sito si vede solo il simbolo €.

- `prezzo: 25` (in euro) per mostrarlo, oppure `prezzo: null` per lasciare solo €
- `varianti`: formati con prezzi diversi (come le stampe 30×40, 50×70, 70×100)
- `foto`: l'immagine usata nel disegno del prodotto
- `link_pagamento`: se Ciro crea un link di pagamento (Stripe, PayPal, SumUp…) e lo incolla qui, compare **"Compra subito"** per pagare online.

Il carrello resta salvato sul telefono del visitatore. **Ordina su WhatsApp** manda a Ciro la lista completa con quantità e totale; pagamento e spedizione si concordano in chat.

## Poker d’autore

Le carte sono in `js/contenuti.js` → `carte` (12 caselle). Metti le foto di nudo artistico di Ciro in `foto/carte/` (JPG verticale 2:3) e scrivi il percorso in `foto`. Finché `foto` è vuoto la carta mostra "Coming soon". Valori e semi delle carte escono a caso a ogni mescolata.

## Lo Studio nel juke-box

I dischi sono in `js/contenuti.js` → `studio`: ogni riga è una parte dello studio con `foto`, `titolo` e `testo` (e la versione inglese in `en`). Il primo è il 101, il secondo il 102 e così via. Per cambiare una foto basta mettere il nuovo file e scrivere il percorso.

## Ex-voto

Sono tutti in `js/contenuti.js`: `situazioni` (8 dischi, dal 101 al 108), `premioJukebox`, `grazie` e `oracolo`.

---

## Provarlo sul computer

Apri `index.html` con il browser (doppio clic) e funziona.

## Metterlo online con Netlify

1. Su netlify.com scegli **Add new site → Import an existing project → GitHub** e seleziona questo repository.
2. Lascia vuoto il *build command*; come *publish directory* indica la radice (`.`).
3. **Deploy**. Ogni modifica salvata su GitHub va online da sola.
4. Per usare il dominio di Ciro: **Domain settings → Add custom domain**.

Link diretti alle camere: `tuosito.it/#galleria`, `#oracolo`, `#grotta`, … (anche `tuosito.it/?lang=en#galleria`)
