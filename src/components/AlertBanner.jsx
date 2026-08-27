import { useMemo } from "react";
import { expenses } from "../data/expenses";
import { getPaymentStatus, formatCountdown, getDaysRemaining } from "../utils/dateHelpers";
import { formatCurrency } from "../utils/currencyHelpers";

export default function AlertBanner() {
  const alerts = useMemo(() => {
    const list = [];
    expenses.forEach((exp) => {
      exp.rate.forEach((rata) => {
        if (rata.pagato) return;
        const status = getPaymentStatus(rata);
        if (status === "scaduto" || status === "urgente") {
          list.push({
            ...rata,
            fornitore: exp.fornitore,
            categoria: exp.categoria,
            status,
          });
        }
      });
    });
    list.sort((a, b) => {
      const dA = getDaysRemaining(a.scadenza) ?? 9999;
      const dB = getDaysRemaining(b.scadenza) ?? 9999;
      return dA - dB;
    });
    return list;
  }, []);

  if (alerts.length === 0) return null;

  const hasScaduto = alerts.some((a) => a.status === "scaduto");

  return (
    <div
      className={`rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 shadow-xl ${hasScaduto
          ? "bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-rose-950/20"
          : "bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-amber-950/20"
        }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${hasScaduto ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}>
          {hasScaduto ? "🚨" : "⚠️"}
        </div>
        <div>
          <h3 className={`font-bold text-base ${hasScaduto ? "text-rose-300" : "text-amber-300"}`}>
            {hasScaduto ? "Attenzione: Scadenze Superate!" : "Attenzione: Pagamenti Imminenti (entro 14 giorni)"}
          </h3>
          <p className="text-xs text-slate-400">
            Richiesta verifica o saldi tempestivi per evitare problemi con i fornitori
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 gap-3"
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${a.status === "scaduto"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                {a.status === "scaduto" ? "SCADUTO" : "URGENTE"}
              </span>
              <div>
                <span className="font-bold text-slate-100 text-sm">{a.fornitore}</span>
                <span className="text-xs text-slate-400 block sm:inline sm:ml-2">({a.nome})</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <span className="text-base font-extrabold text-amber-400">
                {formatCurrency(a.importo)}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${a.status === "scaduto" ? "bg-rose-950 text-rose-400" : "bg-amber-950 text-amber-300"
                }`}>
                {formatCountdown(a.scadenza)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
