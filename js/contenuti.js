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
    email: 'info@ciropizzo.art',            // usata anche dal pulsante "Prenota"
    instagram: 'ciropizzo.art',                       // ★ solo il nome del profilo, senza @ (es. 'ciropizzo.photographer')
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

  /* ---------- POKER D'AUTORE (camera Pittura e arte) ----------
     Le carte del mazzo: ogni carta mostra un nudo d'arte di Ciro.
     Metti la foto in foto/carte/ e scrivi qui il percorso.
     Formato consigliato: JPG verticale 2:3, lato lungo ~1200 px.
     foto vuota '' = la carta mostra "Coming soon". */
  carte: [
    { foto: '', titolo: '' }, { foto: '', titolo: '' }, { foto: '', titolo: '' },
    { foto: '', titolo: '' }, { foto: '', titolo: '' }, { foto: '', titolo: '' },
    { foto: '', titolo: '' }, { foto: '', titolo: '' }, { foto: '', titolo: '' },
    { foto: '', titolo: '' }, { foto: '', titolo: '' }, { foto: '', titolo: '' }
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
  /* ---------- LO STUDIO nel juke-box: un disco per ogni parte dello studio ----------
     Numero = 101, 102, ... nell'ordine dell'elenco. foto = immagine (orizzontale va benissimo). */
  studio: [
    { foto: 'foto/studio/mistero.jpg',  titolo: 'Il sipario',  testo: 'Velluto rosso e oro: qui comincia ogni servizio, come a teatro.',
      en: { titolo: 'The curtain', testo: 'Red velvet and gold: every session begins here, as in a theatre.' } },
    { foto: 'foto/studio/stile.jpg',    titolo: 'Il salotto',  testo: 'Poltrone in pelle, cornici antiche, luce calda: dove ci si conosce davanti a un caffè.',
      en: { titolo: 'The parlour', testo: 'Leather armchairs, antique frames, warm light: where we meet over a coffee.' } },
    { foto: 'foto/galleria/set.jpg',    titolo: 'Il set',      testo: 'Il fondale, le luci, il silenzio: lo spazio dove nasce lo scatto.',
      en: { titolo: 'The set', testo: 'The backdrop, the lights, the silence: the space where the shot is born.' } },
    { foto: 'foto/galleria/loggia.jpg', titolo: 'La loggia',   testo: 'La balconata sospesa sopra lo studio, tra stucchi dorati e tende rosse.',
      en: { titolo: 'The loggia', testo: 'The balcony suspended above the studio, among gilded stucco and red curtains.' } },
    { foto: 'foto/studio/arte.jpg',     titolo: 'Il portale',  testo: 'Un portale di pietra antica incastonato nel tufo, acceso dal basso.',
      en: { titolo: 'The portal', testo: 'An ancient stone portal set into the tufa, lit from below.' } },
    { foto: 'foto/galleria/jukebox.jpg', titolo: 'La sala',    testo: 'Lo studio visto dall’alto: un salotto d’altri tempi sotto le volte di tufo.',
      en: { titolo: 'The hall', testo: 'The studio from above: a parlour from another time beneath the tufa vaults.' } }
  ],

  /* ---------- PENSIERI: il blog di Ciro ----------
     Ogni articolo: gruppo ('maestri' o 'spirito', decide il filtro), titolo, tema (la riga piccola sopra), minuti di lettura e testo
     (un paragrafo per riga dell'elenco). La versione inglese va in en: { ... }.
     Il primo dell'elenco è il più recente. ★ Bozze da rivedere con Ciro. */
  pensieri: [
    {
      gruppo: 'spirito', tema: 'Carl Gustav Jung · L’Ombra', minuti: 3,
      titolo: 'L’Ombra davanti all’obiettivo',
      testo: [
        'Jung chiamava Ombra la parte di noi che non vogliamo vedere: desideri, fragilità, forze che teniamo al buio perché non somigliano all’immagine che mostriamo al mondo.',
        'Per lui la maturità non consiste nel cancellare l’Ombra, ma nell’integrarla. Diventare interi, non perfetti.',
        'In studio succede qualcosa di simile. Un ritratto vero non elimina l’ombra: la illumina quanto basta perché diventi forma. Il boudoir, quando è arte e non costume, è proprio questo: una donna che smette di nascondere una parte di sé e scopre che quella parte è bella.',
        'Io non fotografo la maschera. Aspetto il momento in cui cade.'
      ],
      en: {
        tema: 'Carl Gustav Jung · The Shadow', titolo: 'The Shadow in front of the lens',
        testo: [
          'Jung called the Shadow the part of ourselves we would rather not see: desires, fragilities, forces we keep in the dark because they do not resemble the image we show the world.',
          'For him, maturity does not mean erasing the Shadow but integrating it. Becoming whole, not perfect.',
          'Something similar happens in the studio. A true portrait does not remove the shadow: it lights it just enough for it to take shape. Boudoir, when it is art and not costume, is exactly this: a woman who stops hiding part of herself and discovers that part is beautiful.',
          'I do not photograph the mask. I wait for the moment it falls.'
        ]
      }
    },
    {
      gruppo: 'spirito', tema: 'G. I. Gurdjieff · Il ricordo di sé', minuti: 2,
      titolo: 'Ricordarsi di essere qui',
      testo: [
        'Gurdjieff sosteneva che l’essere umano passa quasi tutta la vita in una specie di sonno: agisce, parla, reagisce, ma raramente si accorge di esserci. Chiamava “ricordo di sé” quei rari istanti di presenza piena.',
        'Davanti alla macchina fotografica quasi tutti, all’inizio, recitano. Sorridono come hanno visto fare, si mettono in posa come pensano si debba. È il sonno di cui parlava Gurdjieff.',
        'Poi, a un certo punto, qualcosa cambia. Lo sguardo si ferma, il respiro rallenta, la persona si ricorda di essere lì. È un attimo, e il mio lavoro è non perderlo.',
        'Un buon ritratto è un istante di veglia.'
      ],
      en: {
        tema: 'G. I. Gurdjieff · Self-remembering', titolo: 'Remembering to be here',
        testo: [
          'Gurdjieff held that human beings spend almost their whole life in a kind of sleep: they act, speak and react, but rarely notice that they are there. He called those rare moments of full presence “self-remembering”.',
          'In front of the camera almost everyone performs at first. They smile the way they have seen others smile, they pose the way they think they should. That is the sleep Gurdjieff spoke of.',
          'Then, at some point, something shifts. The gaze settles, the breath slows, the person remembers being there. It lasts an instant, and my job is not to miss it.',
          'A good portrait is a moment of wakefulness.'
        ]
      }
    },
    {
      gruppo: 'spirito', tema: 'Il Conte di Saint-Germain · Il tempo', minuti: 2,
      titolo: 'L’uomo che non invecchiava',
      testo: [
        'Nel Settecento le corti d’Europa parlavano di un gentiluomo misterioso, il Conte di Saint-Germain: musicista, conoscitore di pietre preziose, alchimista. Si diceva che non invecchiasse mai, e che possedesse il segreto per fermare il tempo.',
        'Nessuno ha mai trovato il suo elisir. Ma da quando esiste la fotografia, un modo per fermare il tempo lo abbiamo.',
        'Un volto a trent’anni, la luce di un pomeriggio, una mano appoggiata sul velluto: tutto passa, tranne quella frazione di secondo che la luce ha scritto sulla pellicola o sul sensore.',
        'Il tempo passa, una foto resta. È la sola immortalità che posso promettere, e la prendo molto sul serio.'
      ],
      en: {
        tema: 'The Count of Saint-Germain · Time', titolo: 'The man who never aged',
        testo: [
          'In the eighteenth century the courts of Europe whispered about a mysterious gentleman, the Count of Saint-Germain: musician, connoisseur of precious stones, alchemist. It was said he never aged and held the secret of stopping time.',
          'No one ever found his elixir. But since photography was invented, we do have a way to stop time.',
          'A face at thirty, the light of an afternoon, a hand resting on velvet: everything passes, except the fraction of a second that light has written onto film or sensor.',
          'Time passes, a photograph remains. It is the only immortality I can promise, and I take it very seriously.'
        ]
      }
    },
    {
      gruppo: 'spirito', tema: 'L’alchimista · Nigredo, albedo, rubedo', minuti: 3,
      titolo: 'Dal nero all’oro',
      testo: [
        'Gli alchimisti descrivevano la Grande Opera in tre fasi: la nigredo, il nero della materia che si dissolve; l’albedo, il bianco della purificazione; la rubedo, il rosso della materia trasformata. Solo alla fine, l’oro.',
        'Jung vi lesse una mappa dell’anima, prima ancora che della chimica: ogni trasformazione vera passa dal buio.',
        'Nero, rosso e oro sono i colori di questo studio, e non per caso. Una tela comincia bianca, si sporca di nero, si accende di rosso. Un servizio fotografico comincia con l’imbarazzo e finisce, se va bene, con una persona che si riconosce più preziosa di quanto pensasse.',
        'Non trasformo il piombo in oro. Aiuto a vedere l’oro che c’era già.'
      ],
      en: {
        tema: 'The alchemist · Nigredo, albedo, rubedo', titolo: 'From black to gold',
        testo: [
          'The alchemists described the Great Work in three stages: nigredo, the black of matter dissolving; albedo, the white of purification; rubedo, the red of matter transformed. Only at the end, gold.',
          'Jung read in it a map of the soul even before one of chemistry: every true transformation passes through darkness.',
          'Black, red and gold are the colours of this studio, and not by chance. A canvas begins white, is stained with black, catches fire with red. A photo session begins with awkwardness and ends, when it goes well, with a person who finds herself more precious than she thought.',
          'I do not turn lead into gold. I help you see the gold that was already there.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Leonardo da Vinci · Lo sfumato', minuti: 2,
      titolo: 'Leonardo e la luce che non ha bordi',
      testo: [
        'Leonardo studiava la luce come uno scienziato: nei suoi quaderni annotava come l’ombra cambia sul volto a seconda della finestra, dell’ora, dell’aria. Da quegli studi nasce lo sfumato, il passaggio dalla luce all’ombra senza linee né confini.',
        'La Gioconda non ha un contorno: il viso nasce dal buio come il fumo, ed è per questo che sembra respirare.',
        'In studio, la luce morbida che avvolge un volto senza tagliarlo è ancora sua. Ogni volta che sposto un pannello di qualche centimetro per addolcire un’ombra sotto lo zigomo, sto facendo una piccola lezione di Leonardo.',
        'Il ritratto non si disegna: si illumina.'
      ],
      en: {
        tema: 'Leonardo da Vinci · Sfumato', titolo: 'Leonardo and the light without edges',
        testo: [
          'Leonardo studied light like a scientist: in his notebooks he recorded how shadow changes on a face depending on the window, the hour, the air. From those studies came sfumato, the passage from light to shadow without lines or borders.',
          'The Mona Lisa has no outline: the face rises from the dark like smoke, and that is why she seems to breathe.',
          'In the studio, the soft light that wraps a face without cutting it is still his. Every time I move a panel a few centimetres to soften a shadow beneath the cheekbone, I am taking a small lesson from Leonardo.',
          'A portrait is not drawn: it is lit.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Michelangelo Buonarroti · Il marmo', minuti: 2,
      titolo: 'Togliere il superfluo',
      testo: [
        'Michelangelo scrisse in un suo sonetto: «Non ha l’ottimo artista alcun concetto / c’un marmo solo in sé non circonscriva». La figura è già dentro la pietra: lo scultore deve solo togliere ciò che è di troppo.',
        'Aveva poco più di vent’anni quando scolpì la Pietà, e meno di trenta quando il David uscì da un blocco di marmo che altri avevano rinunciato a lavorare.',
        'Fotografare una persona è un lavoro simile. Non aggiungo niente: tolgo. La posa forzata, la tensione delle spalle, il sorriso di circostanza. Quando il superfluo cade, resta la figura che c’era già.',
        'La bellezza non si costruisce. Si libera.'
      ],
      en: {
        tema: 'Michelangelo Buonarroti · Marble', titolo: 'Taking away the superfluous',
        testo: [
          'Michelangelo wrote in one of his sonnets that the finest artist has no idea that a single block of marble does not already contain. The figure is already inside the stone: the sculptor only has to remove what is too much.',
          'He was barely over twenty when he carved the Pietà, and under thirty when David emerged from a block of marble that others had given up on.',
          'Photographing a person is similar work. I add nothing: I take away. The forced pose, the tension in the shoulders, the polite smile. When the superfluous falls away, the figure that was already there remains.',
          'Beauty is not built. It is set free.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Caravaggio · Il chiaroscuro', minuti: 2,
      titolo: 'Caravaggio, il primo fotografo',
      testo: [
        'Caravaggio dipingeva in stanze buie, con una sola fonte di luce che cadeva dall’alto. I suoi modelli erano gente di strada, e lui li trasformava in santi e apostoli senza togliere loro neanche una ruga.',
        'Nella Vocazione di San Matteo un fascio di luce taglia la stanza e indica un uomo: è tutto lì, in quella diagonale. Il buio non è vuoto, è il palcoscenico della luce.',
        'Molti lo chiamano il pittore più fotografico della storia, e lo capisco. Ancora oggi, quando spengo tutte le luci dello studio e ne accendo una sola, sto lavorando come lui.',
        'Una luce sola, e la verità di un volto.'
      ],
      en: {
        tema: 'Caravaggio · Chiaroscuro', titolo: 'Caravaggio, the first photographer',
        testo: [
          'Caravaggio painted in dark rooms, with a single source of light falling from above. His models were people from the street, and he turned them into saints and apostles without removing a single wrinkle.',
          'In The Calling of Saint Matthew a beam of light cuts across the room and points to a man: everything is there, in that diagonal. Darkness is not empty; it is the stage for light.',
          'Many call him the most photographic painter in history, and I understand why. Even today, when I switch off every light in the studio and turn on just one, I am working the way he did.',
          'One light, and the truth of a face.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Tiziano · La Venere di Urbino', minuti: 2,
      titolo: 'Tiziano e lo sguardo che non si abbassa',
      testo: [
        'Nel 1538 Tiziano dipinse la Venere di Urbino, oggi agli Uffizi. Una donna distesa su lenzuola bianche, in una stanza di casa, che guarda dritto chi la osserva. Non è una dea lontana: è una donna vera, e lo sa.',
        'È uno dei grandi antenati del boudoir. Non c’è nulla di nascosto e nulla di volgare: c’è una persona a suo agio con il proprio corpo, e un pittore che la rispetta.',
        'È questo l’equilibrio che cerco in ogni servizio boudoir. Sensualità sì, ma con la dignità di un quadro. La donna non è oggetto dello sguardo: è lei che guarda.',
        'L’eleganza è uno sguardo che non si abbassa.'
      ],
      en: {
        tema: 'Titian · The Venus of Urbino', titolo: 'Titian and the gaze that does not drop',
        testo: [
          'In 1538 Titian painted the Venus of Urbino, now in the Uffizi. A woman lying on white sheets, in a domestic room, looking straight at whoever is looking at her. She is not a distant goddess: she is a real woman, and she knows it.',
          'She is one of boudoir’s great ancestors. Nothing is hidden and nothing is vulgar: there is a person at ease with her own body, and a painter who respects her.',
          'That is the balance I look for in every boudoir session. Sensuality, yes, but with the dignity of a painting. The woman is not the object of the gaze: she is the one who looks.',
          'Elegance is a gaze that does not drop.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Artemisia Gentileschi · La forza', minuti: 2,
      titolo: 'Artemisia, il pennello di una donna',
      testo: [
        'Nel Seicento dipingere era un mestiere da uomini. Artemisia Gentileschi lo fece meglio di molti di loro, e nel 1616 fu la prima donna ammessa all’Accademia delle Arti del Disegno di Firenze.',
        'Le sue eroine, Giuditta prima di tutte, non sono fragili né decorative: sono donne che agiscono, con le maniche rimboccate e lo sguardo deciso.',
        'Penso spesso a lei quando una donna entra in studio un po’ intimidita. Il ritratto più bello non è quello in cui sembra più giovane o più magra: è quello in cui sembra più forte.',
        'La forza, in un ritratto, è la forma più alta della bellezza.'
      ],
      en: {
        tema: 'Artemisia Gentileschi · Strength', titolo: 'Artemisia, a woman’s brush',
        testo: [
          'In the seventeenth century painting was a man’s trade. Artemisia Gentileschi did it better than many of them, and in 1616 she became the first woman admitted to the Accademia delle Arti del Disegno in Florence.',
          'Her heroines, Judith above all, are neither fragile nor decorative: they are women who act, sleeves rolled up and gaze steady.',
          'I often think of her when a woman walks into the studio a little intimidated. The most beautiful portrait is not the one where she looks younger or thinner: it is the one where she looks stronger.',
          'Strength, in a portrait, is the highest form of beauty.'
        ]
      }
    },
    {
      gruppo: 'maestri', tema: 'Vincent van Gogh · Gli autoritratti', minuti: 2,
      titolo: 'Van Gogh davanti allo specchio',
      testo: [
        'Van Gogh dipinse più di trenta autoritratti. Spesso non aveva i soldi per pagare un modello, e allora si metteva davanti allo specchio: il soggetto più vicino e più difficile di tutti.',
        'Nelle lettere al fratello Theo scriveva di voler dipingere le persone con qualcosa di eterno, che i pittori antichi esprimevano con l’aureola e lui cercava nel colore.',
        'In vita vendette quasi niente. Oggi i suoi volti sono tra i più amati del mondo, perché non sono belli: sono veri, e il colore li fa vibrare.',
        'Un ritratto non deve piacere. Deve essere vivo.'
      ],
      en: {
        tema: 'Vincent van Gogh · Self-portraits', titolo: 'Van Gogh in front of the mirror',
        testo: [
          'Van Gogh painted more than thirty self-portraits. He often had no money to pay a model, so he sat in front of the mirror: the closest and most difficult subject of all.',
          'In his letters to his brother Theo he wrote of wanting to paint people with something of the eternal, which the old painters expressed with the halo and he sought in colour.',
          'He sold almost nothing in his lifetime. Today his faces are among the most loved in the world, because they are not pretty: they are true, and colour makes them vibrate.',
          'A portrait does not have to please. It has to be alive.'
        ]
      }
    }
  ],

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
