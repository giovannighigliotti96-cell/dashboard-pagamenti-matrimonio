import { useState } from "react";
import { getPaymentStatus, formatDateIT, formatCountdown } from "../utils/dateHelpers";
import { formatCurrency } from "../utils/currencyHelpers";
import { famiglie, getEffectiveDettaglio } from "../data/expenses";

const STATUS_CONFIG = {
  pagato: {
    label: "Pagato",
    icon: "✅",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderClass: "border-l-emerald-500",
  },
  scaduto: {
    label: "Scaduto",
    icon: "🔴",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    borderClass: "border-l-rose-500",
  },
  urgente: {
    label: "Urgente",
    icon: "⚡",
    badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    borderClass: "border-l-amber-500",
  },
  in_scadenza: {
    label: "In Scadenza",
    icon: "🟡",
    badgeClass: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    borderClass: "border-l-amber-400",
  },
  futuro: {
    label: "Programmato",
    icon: "⚪",
    badgeClass: "bg-slate-800 text-slate-400 border-slate-700",
    borderClass: "border-l-slate-600",
  },
};

function FamilySplitBar({ dettaglio, isExplicit }) {
  if (!dettaglio) return null;
  const entries = Object.entries(dettaglio);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-800/80">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
          <span>Ripartizione Quote Famiglia</span>
          {!isExplicit && (
            <span className="text-[9px] font-normal text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
              (50% / 50%)
            </span>
          )}
        </span>
        <span className="text-slate-400">{entries.length} soggetti coinvolti</span>
      </div>

      {/* Segmented bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-950 p-0.5 gap-0.5 mb-2.5 border border-slate-800">
        {entries.map(([key, val]) => {
          const famiglia = famiglie[key];
          const pct = (val / total) * 100;
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, backgroundColor: famiglia?.colore || "#64748B" }}
              className="h-full rounded-sm transition-all duration-300"
              title={`${famiglia?.nome}: ${formatCurrency(val)}`}
            />
          );
        })}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {entries.map(([key, val]) => {
          const famiglia = famiglie[key];
          const pct = Math.round((val / total) * 100);
          return (
            <div key={key} className="flex items-center justify-between bg-slate-900/60 rounded-lg px-2.5 py-1.5 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: famiglia?.colore || "#64748B" }}
                />
                <span className="text-xs font-semibold text-slate-300">
                  {famiglia?.nome}
                </span>
              </div>
              <div className="text-xs">
                <strong className="text-slate-200">{formatCurrency(val)}</strong>
                <span className="text-slate-400 ml-1">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TimelineCard({ rata, expense }) {
  const [expanded, setExpanded] = useState(false);
  const status = getPaymentStatus(rata);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.futuro;
  const isNoContract = expense.contrattoNonAncoraFirmato;
  
  // Get effective family split (custom if defined, or 50/50 fallback)
  const dettaglio = getEffectiveDettaglio(rata, expense);
  const isExplicit = Boolean(rata.dettaglioPagamento);

  return (
    <div
      className={`glass-panel rounded-2xl border-l-4 transition-all duration-200 hover:border-slate-700 ${config.borderClass} ${
        isNoContract ? "border-dashed border-slate-700" : ""
      }`}
    >
      <div className="p-5">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-slate-950 shadow-sm"
              style={{ backgroundColor: expense.colore || "#E2B93B" }}
            >
              {expense.categoria}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${config.badgeClass}`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </span>
            {rata.urgente && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                SCADENZA IMMINENTE
              </span>
            )}
          </div>

          {isNoContract && (
            <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              📋 Contratto da firmare
            </span>
          )}
        </div>

        {/* Main Card Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Fornitore & Rata info */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              {expense.fornitore}
            </h3>
            <p className="text-sm font-medium text-slate-400 mt-0.5">
              Rata: <span className="text-slate-200">{rata.nome}</span>
            </p>
          </div>

          {/* Amount & Date Column */}
          <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            <div>
              <div className="text-2xl font-black text-amber-400 md:text-right tracking-tight">
                {formatCurrency(rata.importo)}
              </div>
              <div className="text-xs text-slate-400 md:text-right font-medium mt-0.5">
                {rata.scadenza ? formatDateIT(rata.scadenza) : "Data da definire"}
                {rata.scadenza && (
                  <span className={`ml-2 font-bold ${
                    status === "scaduto" ? "text-rose-400" : status === "urgente" || status === "in_scadenza" ? "text-amber-300" : "text-emerald-400"
                  }`}>
                    ({rata.pagato ? "Saldata" : formatCountdown(rata.scadenza)})
                  </span>
                )}
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <span>{expanded ? "Chiudi" : "Dettagli"}</span>
              <span>{expanded ? "▲" : "▼"}</span>
            </button>
          </div>

        </div>

        {/* Family Split Bar (shows on all cards now) */}
        <FamilySplitBar dettaglio={dettaglio} isExplicit={isExplicit} />

      </div>

      {/* Expanded Accordion Details */}
      {expanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-800/80 bg-slate-950/40 rounded-b-2xl space-y-3">
          {rata.note && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Note & Clausole
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {rata.note}
              </p>
            </div>
          )}

          {isNoContract && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
              ⚠️ <strong>Promemoria:</strong> Questa voce richiede la firma formale del contratto prima del versamento.
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>ID Categoria: <code className="text-slate-300">{expense.id}</code></span>
            <span>Importo Totale Servizio: <strong className="text-slate-200">{formatCurrency(expense.totale)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
