import { useMemo } from "react";
import { expenses } from "../data/expenses";
import { formatCurrency } from "../utils/currencyHelpers";

export default function KpiCards() {
  const { totale, pagato, daPagare, percentuale, rateTotali, ratePagate } = useMemo(() => {
    let totale = 0;
    let pagato = 0;
    let rateTotali = 0;
    let ratePagate = 0;

    expenses.forEach((exp) => {
      exp.rate.forEach((rata) => {
        totale += rata.importo;
        rateTotali += 1;
        if (rata.pagato) {
          pagato += rata.importo;
          ratePagate += 1;
        }
      });
    });

    const daPagare = totale - pagato;
    const percentuale = totale > 0 ? Math.round((pagato / totale) * 100) : 0;
    return { totale, pagato, daPagare, percentuale, rateTotali, ratePagate };
  }, []);

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* 3 Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        {/* Card 1: TOTALE */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <p className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-400">
                Totale Matrimonio
              </p>
            </div>
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight">
            {formatCurrency(totale)}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs text-slate-400">
            <span>Contratti attivi</span>
            <span className="font-semibold text-slate-300">{expenses.length} fornitori</span>
          </div>
        </div>

        {/* Card 2: GIÀ PAGATO */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden group border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 bg-gradient-to-b from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-emerald-400">
                Già Versato
              </p>
            </div>
            <span className="text-xl">✅</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-300 tracking-tight">
            {formatCurrency(pagato)}
          </p>
          <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] sm:text-xs text-emerald-400/80">
            <span>Rate saldate</span>
            <span className="font-semibold text-emerald-300">{ratePagate} su {rateTotali} ({percentuale}%)</span>
          </div>
        </div>

        {/* Card 3: DA PAGARE */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden group border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 bg-gradient-to-b from-amber-950/20 to-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <p className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-amber-400">
                Ancora Da Pagare
              </p>
            </div>
            <span className="text-xl">⏳</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300 tracking-tight">
            {formatCurrency(daPagare)}
          </p>
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] sm:text-xs text-amber-400/80">
            <span>Rimanente futuro</span>
            <span className="font-semibold text-amber-300">{100 - percentuale}% del budget</span>
          </div>
        </div>

      </div>

      {/* Progress Bar Panel */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-200">Stato Avanzamento Budget</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Percentuale complessiva delle rate già saldate</p>
          </div>
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-xl sm:text-2xl font-black text-amber-400">{percentuale}%</span>
            <span className="text-[11px] text-slate-400">completato</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3.5 sm:h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 shadow-lg shadow-amber-500/20"
            style={{ width: `${percentuale}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-3 text-[11px] sm:text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Versati: <strong className="text-slate-200">{formatCurrency(pagato)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Rimanenti: <strong className="text-slate-200">{formatCurrency(daPagare)}</strong>
          </span>
        </div>
      </div>

    </div>
  );
}
