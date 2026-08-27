export const expenses = [
  {
    id: "location",
    fornitore: "Villa Riviera Resort",
    categoria: "Location",
    colore: "#8B9D77",
    totale: 23000,
    rate: [
      {
        nome: "Acconto Iniziale",
        importo: 6900,
        scadenza: "2026-03-23",
        pagato: true,
        dettaglioPagamento: { silvia: 3450, fabioEsther: 3450 },
      },
      {
        nome: "Seconda Rata",
        importo: 8050,
        scadenza: "2027-01-30",
        pagato: false,
      },
      {
        nome: "Saldo Finale",
        importo: 8050,
        scadenza: "2027-05-10",
        pagato: false,
      },
    ],
  },
  {
    id: "fotografo",
    fornitore: "Luca D'Urzo Photography",
    categoria: "Fotografo/Video",
    colore: "#C9A227",
    totale: 2800,
    rate: [
      {
        nome: "Acconto alla firma",
        importo: 1150,
        scadenza: "2026-07-17",
        pagato: true,
        dettaglioPagamento: { silvia: 630, fabioEsther: 520 },
      },
      {
        nome: "Rata 1 settimana prima evento",
        importo: 1150,
        scadenza: "2027-07-03",
        pagato: false,
      },
      {
        nome: "Saldo alla consegna lavoro",
        importo: 500,
        scadenza: null,
        pagato: false,
        note: "Data esatta da definire, circa 60gg dopo l'evento",
      },
    ],
  },
  {
    id: "musica",
    fornitore: "MarshMallow Quartet",
    categoria: "Musica",
    colore: "#B85C38",
    totale: 2500,
    rate: [
      {
        nome: "Caparra",
        importo: 750,
        scadenza: "2026-07-31",
        pagato: true,
        dettaglioPagamento: { silvia: 375, fabioEsther: 375 },
      },
      {
        nome: "Saldo",
        importo: 1750,
        scadenza: "2027-07-10",
        pagato: false,
      },
    ],
  },
  {
    id: "banqueting",
    fornitore: "Villa Riviera - Banqueting & Servizi Extra",
    categoria: "Catering",
    colore: "#5B7C99",
    totale: 29685,
    contrattoNonAncoraFirmato: true,
    rate: [
      {
        nome: "Banqueting",
        importo: 28085,
        scadenza: "2027-06-20",
        pagato: false,
        dettaglioPagamento: { silvia: 12300, fabioEsther: 15785 },
        note: "Contratto di Banqueting da firmare entro 20gg prima dell'evento (art. 2.2.e)",
      },
      {
        nome: "Ore extra",
        importo: 1000,
        scadenza: "2027-06-20",
        pagato: false,
        note: "Da Contratto Servizio Accessorio (art. 2.2.f)",
      },
      {
        nome: "Sicurezza",
        importo: 300,
        scadenza: "2027-06-20",
        pagato: false,
        note: "Da Contratto Servizio Accessorio (art. 2.2.f)",
      },
      {
        nome: "Rito simbolico",
        importo: 300,
        scadenza: "2027-06-20",
        pagato: false,
        note: "Da Contratto Servizio Accessorio (art. 2.2.f)",
      },
    ],
  },
  {
    id: "fiorista",
    fornitore: "Fiorista",
    categoria: "Fiori & Addobbi",
    colore: "#E879F9",
    totale: 4050,
    rate: [
      {
        nome: "Acconto",
        importo: 800,
        scadenza: "2026-10-15",
        pagato: true,
        note: "Acconto di 800€ già comprensivo di IVA",
        dettaglioPagamento: { silvia: 400, fabioEsther: 400 },
      },
      {
        nome: "Saldo",
        importo: 3250,
        scadenza: "2027-06-15",
        pagato: false,
        note: "Saldo finale - Quota di 3.250€ non soggetta ad IVA",
        dettaglioPagamento: { silvia: 1625, fabioEsther: 1625 },
      },
    ],
  },
];

export const famiglie = {
  silvia: { nome: "Silvia", colore: "#C9A227" },
  fabioEsther: { nome: "Fabio & Esther", colore: "#B85C38" },
};

/**
 * Returns explicit dettaglioPagamento if present, or calculates a default 50%/50% split between Silvia and Fabio & Esther
 */
export function getEffectiveDettaglio(rata, expense) {
  if (rata.dettaglioPagamento) {
    return rata.dettaglioPagamento;
  }

  const half = Math.round(rata.importo / 2);
  const otherHalf = rata.importo - half;

  return {
    silvia: half,
    fabioEsther: otherHalf,
  };
}
