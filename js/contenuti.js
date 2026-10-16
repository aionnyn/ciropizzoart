/* =============================================================
   CONTENUTI DEL SITO — Ciro Pizzo Art
   -------------------------------------------------------------
   Qui si aggiornano: contatti, quadri della galleria, dischi del
   juke-box, grazie dell'ex-voto e domande dell'oracolo.
   (I testi delle camere sono in js/testi.js)

   Bilingue: dove vedi  en: { ... }  c'è la versione inglese.
   Se manca, il sito usa l'italiano anche in inglese.

   Regole d'oro:
   - ogni voce sta tra { } e finisce con una virgola
   - i testi vanno tra apici '...'; per l'apostrofo usa quello
     tipografico ’ (es. d’autore) oppure scrivi \'
   ============================================================= */

window.SITO = {

  /* ---------- CONTATTI (camera finale "La Grotta") ---------- */
  contatti: {
    indirizzo: 'Via Enrico De Marinis 14, Cava de’ Tirreni (SA)',   // diventa un link a Google Maps
    telefono: '+39 348 033 6791',
    email: 'ciro_pizzo@libero.it',            // usata anche dal pulsante "Prenota"
    instagram: 'ciropizzo_photos',                       // ★ solo il nome del profilo, senza @ (es. 'ciropizzo.photographer')
    whatsapp: '393480336791'                         // ★ numero con prefisso, senza + e spazi (es. '393331234567')
  },

  /* ---------- TECNICHE: i filtri sopra la galleria ----------
     Un filtro compare solo se c'è almeno un'opera di quel tipo. */
  tecniche: [
    { id: 'foto',     it: 'Fotografia', en: 'Photography' },
    { id: 'pittura',  it: 'Pittura',    en: 'Painting' },
    { id: 'boudoir',  it: 'Boudoir',    en: 'Boudoir' },
    { id: 'ritratto', it: 'Ritratto',   en: 'Portrait' },
    { id: 'misto',    it: 'Tecnica mista', en: 'Mixed media' }
  ],

  /* ---------- GALLERIA: le opere in cornice dorata ----------
     Metti l'immagine (foto o dipinto fotografato) in  foto/galleria/
     e aggiungi una riga qui.
     tipo:    uno degli id qui sopra (foto, pittura, boudoir, ritratto, misto)
     tecnica: facoltativa, es. 'olio su tela, 70×100 cm' / 'stampa fine-art'
     vendita: true per mostrare "Lo voglio" (si apre WhatsApp con il titolo dell'opera)
     prezzo:  facoltativo, es. '€ 450'; vuoto = solo il simbolo €
     Formato consigliato: JPG, lato lungo 1600–2000 px. */
  galleria: [
    // ★ Caselle vuote "Coming soon": quando arrivano le opere di Ciro,
    //   scrivi il percorso in foto e il titolo, per esempio:
    //   { foto: 'foto/galleria/diva.jpg', titolo: 'La diva', tipo: 'boudoir', anno: '2026', en: { titolo: 'The diva' } },
    { foto: '', titolo: '', tipo: 'foto' },
    { foto: '', titolo: '', tipo: 'foto' },
    { foto: '', titolo: '', tipo: 'foto' },
    { foto: '', titolo: '', tipo: 'foto' },
    { foto: '', titolo: '', tipo: 'foto' },
    { foto: '', titolo: '', tipo: 'foto' }
  ],

  /* ---------- PACCHETTI (camera "Regala una scena") ----------
     ★ DA CONFERMARE CON CIRO: contenuti e prezzi.
     prezzo vuoto ''  →  sul sito appare solo il simbolo €. */
  pacchetti: [
    { nome: 'Velluto', sotto: 'Il primo passo', prezzo: '',
      include: ['Una stanza dello studio', 'Uno o due outfit', 'Selezione di foto ritoccate'],
      en: { sotto: 'The first step', include: ['One room of the studio', 'One or two outfits', 'A selection of retouched photos'] } },
    { nome: 'Oro', sotto: 'Ritratto e boudoir', prezzo: '',
      include: ['Due stanze a scelta', 'Più cambi d’abito', 'Una stampa fine-art in cornice'],
      en: { sotto: 'Portrait and boudoir', include: ['Two rooms of your choice', 'Several outfit changes', 'A framed fine-art print'] } },
    { nome: 'Sipario', sotto: 'L’esperienza completa', prezzo: '',
      include: ['Tutto lo studio', 'Album d’arte', 'Un ritratto dipinto da Ciro dalla tua foto preferita'],
      en: { sotto: 'The full experience', include: ['The whole studio', 'Art album', 'A portrait painted by Ciro from your favourite photo'] } }
  ],

  /* ---------- SHOP ----------
     Prezzi nascosti: con prezzo null sul sito appare solo il simbolo €.
     Per mostrare un prezzo scrivi il numero in euro, es. prezzo: 25
     varianti: facoltative, ognuna con il suo prezzo (es. i formati delle stampe)
     link_pagamento: facoltativo. Se Ciro crea un link di pagamento (Stripe, PayPal,
       SumUp…) incollalo qui: compare il tasto "Compra subito".
     tipo: decide il disegno del prodotto (calendario, libro, stampa, quadro, buono) */
  shop: [
    { id: 'calendario', tipo: 'calendario', nome: 'Calendario 2027', prezzo: null, foto: '',
      descr: '12 mesi, 12 scene dello studio. Formato A3, rilegatura a spirale.',
      en: { nome: '2027 Calendar', descr: '12 months, 12 scenes from the studio. A3 format, spiral bound.' } },
    { id: 'libro', tipo: 'libro', nome: 'Il libro fotografico', prezzo: null, foto: '',
      descr: 'Volume d’arte con le opere di Ciro: fotografia, pittura, boudoir. Copertina rigida.',
      en: { nome: 'The photo book', descr: 'An art book of Ciro’s work: photography, painting, boudoir. Hardcover.' } },
    { id: 'stampa', tipo: 'stampa', nome: 'Stampa fine-art', foto: '',
      descr: 'Un’opera della galleria su carta cotone, firmata e numerata.',
      varianti: [ { nome: '30×40 cm', prezzo: null }, { nome: '50×70 cm', prezzo: null }, { nome: '70×100 cm', prezzo: null } ],
      en: { nome: 'Fine-art print', descr: 'A work from the gallery on cotton paper, signed and numbered.' } },
    { id: 'quadro', tipo: 'quadro', nome: 'Dipinto originale', prezzo: null, foto: '',
      descr: 'Opere uniche su tela. Disponibilità e prezzo su richiesta.',
      en: { nome: 'Original painting', descr: 'One-of-a-kind works on canvas. Availability and price on request.' } },
    { id: 'buono', tipo: 'buono', nome: 'Buono regalo', prezzo: null,
      descr: 'Una scena nello studio, chiusa in una busta di ceralacca.',
      en: { nome: 'Gift voucher', descr: 'A scene in the studio, sealed in a wax-sealed envelope.' } }
  ],

  /* ---------- LA PRIMA VOLTA: domande frequenti ----------
     ★ DA CONFERMARE CON CIRO */
  faq: [
    { d: 'Non ho mai posato. Va bene lo stesso?', r: 'Sì. Ciro ti guida in ogni posa, con calma, una luce alla volta. Non serve essere modelle.',
      en: { d: 'I’ve never posed. Is that OK?', r: 'Yes. Ciro guides you through every pose, calmly, one light at a time. You don’t need to be a model.' } },
    { d: 'Chi vedrà le mie foto?', r: 'Solo tu. Le immagini sono tue e nulla viene pubblicato senza il tuo consenso scritto.',
      en: { d: 'Who will see my photos?', r: 'Only you. The images are yours and nothing is published without your written consent.' } },
    { d: 'Cosa devo portare?', r: 'Lingerie, abiti e oggetti che ti somigliano. Lo studio ha velluti, tessuti e accessori di scena: ne parliamo prima, su WhatsApp.',
      en: { d: 'What should I bring?', r: 'Lingerie, clothes and objects that feel like you. The studio has velvets, fabrics and props: we’ll talk about it beforehand on WhatsApp.' } },
    { d: 'Posso venire con qualcuno?', r: 'Sì, puoi portare un’amica o il partner, se ti fa sentire a tuo agio.',
      en: { d: 'Can I bring someone?', r: 'Yes, you can bring a friend or your partner if it helps you feel at ease.' } },
    { d: 'Quanto dura una sessione?', r: 'Dipende dalla scena che scegli: te lo diciamo prima, quando la prepariamo insieme.',
      en: { d: 'How long does a session last?', r: 'It depends on the scene you choose: we’ll tell you beforehand, while we plan it together.' } },
    { d: 'Posso regalarla a qualcuno?', r: 'Sì, con il buono regalo: una scena nello studio chiusa in una busta di ceralacca.',
      en: { d: 'Can I give it as a gift?', r: 'Yes, with the gift voucher: a scene in the studio sealed in a wax-sealed envelope.' } }
  ],

  /* ---------- COLLABORAZIONI (nella Grotta) ---------- */
  collaborazioni: [
    { nome: 'Brand e stilisti',   chi: 'un brand di moda',                   en: { nome: 'Brands & designers', chi: 'a fashion brand' } },
    { nome: 'Modelle e modelli',  chi: 'una modella o un modello',           en: { nome: 'Models',             chi: 'a model' } },
    { nome: 'Make-up e hair',     chi: 'un make-up artist',                  en: { nome: 'Make-up & hair',     chi: 'a make-up artist' } },
    { nome: 'Riviste e stampa',   chi: 'una rivista',                        en: { nome: 'Magazines & press',  chi: 'a magazine' } },
    { nome: 'Gallerie ed eventi', chi: 'una galleria o un organizzatore di eventi', en: { nome: 'Galleries & events', chi: 'a gallery or event organiser' } }
  ],

  /* ---------- JUKE-BOX: 8 dischi = 8 situazioni ---------- */
  situazioni: [
    { titolo: 'Dolce Vita', colore: '#F2A33A',
      testo: 'Una diva anni Sessanta sulla poltrona di velluto: occhiali scuri, perle, la sigaretta spenta tra le dita.', luce: 'ambra', camera: 'Il Juke-box',
      en: { titolo: 'Dolce Vita', testo: 'A sixties diva on the velvet armchair: dark glasses, pearls, an unlit cigarette between her fingers.', luce: 'amber', camera: 'The Jukebox' } },
    { titolo: 'Il Simposio', colore: '#C4683A',
      testo: 'Lino bianco sulla pelle, una coppa di vino e foglie d’alloro tra i capelli. Gli dèi guardano da lontano.', luce: 'terracotta', camera: 'L’Oracolo',
      en: { titolo: 'The Symposium', testo: 'White linen on bare skin, a cup of wine and laurel leaves in her hair. The gods watch from afar.', luce: 'terracotta', camera: 'The Oracle' } },
    { titolo: 'Noir in cantina', colore: '#D9D2C4',
      testo: 'Bianco e nero, fumo, un solo taglio di luce che scende dalla volta di tufo.', luce: 'un solo spot', camera: 'Il Set',
      en: { titolo: 'Cellar Noir', testo: 'Black and white, smoke, a single blade of light falling from the tufa vault.', luce: 'a single spot', camera: 'The Set' } },
    { titolo: 'Il velo di Psiche', colore: '#E8C6A0',
      testo: 'Un drappo che scivola, una lanterna, due ombre che quasi si sfiorano.', luce: 'candela', camera: 'La Grotta',
      en: { titolo: 'Psyche’s Veil', testo: 'A sliding drape, a lantern, two shadows that almost touch.', luce: 'candlelight', camera: 'The Grotto' } },
    { titolo: 'Sacro e profano', colore: '#D9B866',
      testo: 'Oro, candele e roccia viva: un ritratto da pala d’altare, con uno sguardo che non è affatto devoto.', luce: 'oro caldo', camera: 'La Grotta',
      en: { titolo: 'Sacred and Profane', testo: 'Gold, candles and living rock: an altarpiece portrait with a gaze that is anything but devout.', luce: 'warm gold', camera: 'The Grotto' } },
    { titolo: 'Twist party', colore: '#E0306E',
      testo: 'Flash diretto, colori saturi, gonne che girano davanti al juke-box acceso.', luce: 'flash pieno', camera: 'Il Juke-box',
      en: { titolo: 'Twist Party', testo: 'Direct flash, saturated colours, skirts twirling in front of the glowing jukebox.', luce: 'full flash', camera: 'The Jukebox' } },
    { titolo: 'Specchio barocco', colore: '#C9A24B',
      testo: 'Il tuo riflesso moltiplicato nelle cornici dorate del salotto, a lume di candela.', luce: 'candela', camera: 'Il Salotto',
      en: { titolo: 'Baroque Mirror', testo: 'Your reflection multiplied in the gilded frames of the parlour, by candlelight.', luce: 'candlelight', camera: 'The Parlour' } },
    { titolo: 'Sipario', colore: '#B8203A',
      testo: 'Il velluto rosso si apre e la scena è tua: un ritratto a figura intera, come prima dell’applauso.', luce: 'occhio di bue', camera: 'Il Sipario',
      en: { titolo: 'Curtain Call', testo: 'The red velvet opens and the stage is yours: a full-length portrait, just before the applause.', luce: 'spotlight', camera: 'The Curtain' } }
  ],
  premioJukebox: '[CODICE PREMIO]',      // appare quando si sbloccano tutti i dischi

  /* ---------- EX-VOTO: "Per grazia ricevuta" ---------- */
  grazie: {
    it: [
      'uno sguardo che ti ha fatto arrossire.',
      'il coraggio di guardarti allo specchio, e piacerti.',
      'un peccato veniale, ma fotografato benissimo.',
      'una notte che nessuno dovrà mai sapere.',
      'un rossetto rosso che resiste fino all’alba.',
      'un ritratto in cui finalmente ti riconosci.',
      'la tentazione, accettata con eleganza.',
      'tacchi alti e nessun rimpianto.',
      'la santa pazienza di chi ti aspetta.'
    ],
    en: [
      'a glance that made you blush.',
      'the courage to look in the mirror, and like what you see.',
      'a venial sin, but beautifully photographed.',
      'a night no one will ever need to know about.',
      'a red lipstick that lasts until dawn.',
      'a portrait in which you finally recognise yourself.',
      'temptation, accepted with elegance.',
      'high heels and no regrets.',
      'the saintly patience of whoever is waiting for you.'
    ]
  },

  /* ---------- L'ORACOLO DI EROS ----------
     Ogni risposta assegna un punto a una divinità: A, D, E, P.
     "camera" = la camera dove porta il risultato (non tradurre). */
  oracolo: {
    it: {
      domande: [
        { domanda: 'Al simposio la notte è ancora giovane. Cosa versi nella coppa?', risposte: [
          ['A', 'Ambrosia e miele, lentamente'], ['D', 'Vino puro, senza acqua'],
          ['E', 'Un solo sorso, guardando qualcuno negli occhi'], ['P', 'Nulla: aspetti chi non è ancora arrivato'] ] },
        { domanda: 'Quale dono lasci sull’altare del tempio?', risposte: [
          ['A', 'Una conchiglia e una rosa'], ['D', 'Una maschera e un tralcio d’edera'],
          ['E', 'Una freccia dorata'], ['P', 'Una lettera mai spedita'] ] },
        { domanda: 'Che cosa ti fa arrossire?', risposte: [
          ['A', 'Il tuo riflesso in uno specchio antico'], ['D', 'Una risata in penombra'],
          ['E', 'Uno sguardo che dura un secondo di troppo'], ['P', 'Un profumo che ricorda qualcuno'] ] }
      ],
      risultati: {
        A: { greco: 'ΑΦΡΟΔΙΤΗ', nome: 'Afrodite', testo: 'Nata dalla spuma del mare. Il tuo fascino è bellezza che si lascia guardare: eleganza, lentezza, un velo che scivola appena.', scena: 'Camera dell’Oro', camera: 'oro' },
        D: { greco: 'ΔΙΟΝΥΣΟΣ', nome: 'Dioniso',  testo: 'Maschere, edera e musica fino all’alba. Per te il desiderio è festa, gioco e un pizzico di follia.', scena: 'Lo Studio e il suo juke-box', camera: 'studio' },
        E: { greco: 'ΕΡΩΣ',     nome: 'Eros',     testo: 'La freccia arriva senza preavviso. Passione diretta, sguardi che bruciano, nessuna mezza misura.', scena: 'Camera del Velluto', camera: 'boudoir' },
        P: { greco: 'ΠΟΘΟΣ',    nome: 'Pothos',   testo: 'Il dio del desiderio per chi è lontano. Attesa, malinconia, una bellezza che non si lascia mai afferrare del tutto.', scena: 'La Grotta', camera: 'grotta' }
      }
    },
    en: {
      domande: [
        { domanda: 'The symposium night is still young. What do you pour into your cup?', risposte: [
          ['A', 'Ambrosia and honey, slowly'], ['D', 'Pure wine, unwatered'],
          ['E', 'A single sip, looking someone in the eye'], ['P', 'Nothing: you’re waiting for someone who hasn’t arrived yet'] ] },
        { domanda: 'What gift do you leave on the temple altar?', risposte: [
          ['A', 'A seashell and a rose'], ['D', 'A mask and a sprig of ivy'],
          ['E', 'A golden arrow'], ['P', 'A letter never sent'] ] },
        { domanda: 'What makes you blush?', risposte: [
          ['A', 'Your reflection in an antique mirror'], ['D', 'Laughter in the half-light'],
          ['E', 'A glance that lasts a second too long'], ['P', 'A scent that reminds you of someone'] ] }
      ],
      risultati: {
        A: { greco: 'ΑΦΡΟΔΙΤΗ', nome: 'Aphrodite', testo: 'Born from the sea foam. Your allure is beauty that lets itself be looked at: elegance, slowness, a veil that barely slips.', scena: 'The Golden Room', camera: 'oro' },
        D: { greco: 'ΔΙΟΝΥΣΟΣ', nome: 'Dionysus',  testo: 'Masks, ivy and music until dawn. For you, desire is a feast, a game and a touch of madness.', scena: 'The Studio and its jukebox', camera: 'studio' },
        E: { greco: 'ΕΡΩΣ',     nome: 'Eros',      testo: 'The arrow strikes without warning. Direct passion, burning glances, no half measures.', scena: 'The Velvet Room', camera: 'boudoir' },
        P: { greco: 'ΠΟΘΟΣ',    nome: 'Pothos',    testo: 'The god of longing for someone far away. Waiting, melancholy, a beauty that never lets itself be fully grasped.', scena: 'The Grotto', camera: 'grotta' }
      }
    }
  }
};
