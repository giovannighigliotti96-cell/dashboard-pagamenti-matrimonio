import { useState } from "react";
import { getUpcomingReminders, generateEmailContent, generateMailtoUrl, EMAIL_CONFIG } from "../utils/emailHelper";
import { formatCurrency } from "../utils/currencyHelpers";
import { formatDateIT, formatCountdown } from "../utils/dateHelpers";

export default function EmailModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const upcomingRate = getUpcomingReminders(10);

  if (!isOpen) return null;

  function copyToClipboard(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-amber-500/30 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
              📧
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Promemoria Email Scadenze (10 giorni)</h2>
              <p className="text-xs text-slate-400">Invio automatico promemoria rate imminenti</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Config Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Impostazioni Notifiche Predefinite
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-400 block">Mittente:</span>
              <strong className="text-slate-100">{EMAIL_CONFIG.mittente}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Destinatari:</span>
              <strong className="text-slate-100">{EMAIL_CONFIG.destinatari.join(", ")}</strong>
            </div>
          </div>
        </div>

        {/* Active Reminders List */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Rate in Scadenza Entro 10 Giorni ({upcomingRate.length})
          </h3>

          {upcomingRate.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-3xl block mb-2">🎉</span>
              <p className="font-bold text-slate-200 text-sm">Nessuna rata in scadenza nei prossimi 10 giorni</p>
              <p className="text-xs text-slate-400 mt-1">Tutte le rate imminenti risultano gia saldate o programmate piu avanti.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingRate.map((rata, idx) => {
                const { subject, body } = generateEmailContent(rata);
                const mailtoUrl = generateMailtoUrl(rata);

                return (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-base">{rata.fornitore}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {formatCountdown(rata.scadenza)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Rata: {rata.nome} · Scadenza: {formatDateIT(rata.scadenza)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-lg font-black text-amber-400">{formatCurrency(rata.importo)}</span>
                        <span className="text-[11px] text-slate-400 block">
                          Silvia: {formatCurrency(rata.dettaglio.silvia)} | Fabio & Esther: {formatCurrency(rata.dettaglio.fabioEsther)}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => copyToClipboard(body, idx)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                      >
                        {copiedIndex === idx ? "✅ Testo Copiato!" : "📋 Copia Testo Email"}
                      </button>

                      <a
                        href={mailtoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <span>✉️ Invia Email Ora</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Automated Script Instructions */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-200 block">⚡ Invio Automatico Via Script Node.js</span>
          <p className="text-slate-400 leading-relaxed">
            Per inviare le email automaticamente in background a Silvia e Fabio & Esther tramite il tuo account Gmail, puoi eseguire il comando:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300">
            node scripts/send_email_reminders.js
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Chiudi
          </button>
        </div>

      </div>
    </div>
  );
}
