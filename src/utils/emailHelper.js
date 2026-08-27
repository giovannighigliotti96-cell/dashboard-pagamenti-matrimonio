import { expenses, getEffectiveDettaglio } from "../data/expenses";
import { getDaysRemaining, formatDateIT, formatCountdown } from "./dateHelpers";
import { formatCurrency } from "./currencyHelpers";

export const EMAIL_CONFIG = {
  mittente: "giovannighigliotti96@gmail.com",
  destinatari: ["giuseppini.fabio@libero.it", "silvia.pizzorno@alice.it"],
  giorniPreavviso: 10,
};

/**
 * Returns list of installments due within <= 10 days that are not paid
 */
export function getUpcomingReminders(daysThreshold = 10) {
  const reminders = [];

  expenses.forEach((exp) => {
    exp.rate.forEach((rata) => {
      if (!rata.pagato && rata.scadenza) {
        const days = getDaysRemaining(rata.scadenza);
        if (days !== null && days >= 0 && days <= daysThreshold) {
          const dettaglio = getEffectiveDettaglio(rata, exp);
          reminders.push({
            ...rata,
            fornitore: exp.fornitore,
            categoria: exp.categoria,
            giorniRimanenti: days,
            dettaglio,
          });
        }
      }
    });
  });

  reminders.sort((a, b) => a.giorniRimanenti - b.giorniRimanenti);
  return reminders;
}

/**
 * Formats email subject and body text for a reminder
 */
export function generateEmailContent(rata) {
  const dataFormattata = formatDateIT(rata.scadenza);
  const countdown = formatCountdown(rata.scadenza);
  const quotaSilvia = rata.dettaglio?.silvia ?? Math.round(rata.importo / 2);
  const quotaFabioEsther = rata.dettaglio?.fabioEsther ?? (rata.importo - quotaSilvia);

  const subject = `💍 PROMEMORIA MATRIMONIO: Scadenza Rata ${rata.fornitore} (${formatCurrency(rata.importo)}) - ${dataFormattata}`;

  const body = `Ciao Silvia, Fabio & Esther,

Questo è un promemoria per la prossima rata in scadenza per il matrimonio:

📌 FORNITORE: ${rata.fornitore} (${rata.categoria})
📝 RATA: ${rata.nome}
💰 IMPORTO TOTALE: ${formatCurrency(rata.importo)}
📅 DATA SCADENZA: ${dataFormattata} (${countdown})

---------------------------------------------------
📊 RIPARTIZIONE QUOTE DA SALDARE:
- Quota Silvia: ${formatCurrency(quotaSilvia)}
- Quota Fabio & Esther: ${formatCurrency(quotaFabioEsther)}
---------------------------------------------------

${rata.note ? `ℹ️ NOTE: ${rata.note}\n` : ""}
Dashboard Pagamenti Matrimonio 2027
Mittente: ${EMAIL_CONFIG.mittente}`;

  return { subject, body, destinatarii: EMAIL_CONFIG.destinatari.join(",") };
}

/**
 * Generates mailto URL to open native mail client prefilled with sender/recipients/subject/body
 */
export function generateMailtoUrl(rata) {
  const { subject, body, destinatarii } = generateEmailContent(rata);
  return `mailto:${destinatarii}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
