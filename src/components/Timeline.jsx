import { useMemo } from "react";
import { expenses } from "../data/expenses";
import { getPaymentStatus, getDaysRemaining } from "../utils/dateHelpers";
import TimelineCard from "./TimelineCard";

export default function Timeline({ filterCategoria, filterStato }) {
  const items = useMemo(() => {
    const list = [];
    expenses.forEach((exp) => {
      if (filterCategoria && filterCategoria !== "tutte" && exp.categoria !== filterCategoria) return;
      exp.rate.forEach((rata) => {
        const status = getPaymentStatus(rata);
        if (filterStato && filterStato !== "tutti" && status !== filterStato) return;
        list.push({ rata, expense: exp, status });
      });
    });

    const statusOrder = { scaduto: 0, urgente: 1, in_scadenza: 2, futuro: 3, pagato: 4 };
    list.sort((a, b) => {
      const sA = statusOrder[a.status] ?? 5;
      const sB = statusOrder[b.status] ?? 5;
      if (sA !== sB) return sA - sB;
      const dA = a.rata.scadenza ? getDaysRemaining(a.rata.scadenza) : 99999;
      const dB = b.rata.scadenza ? getDaysRemaining(b.rata.scadenza) : 99999;
      return (dA ?? 99999) - (dB ?? 99999);
    });

    return list;
  }, [filterCategoria, filterStato]);

  // Group by year/month
  const groups = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      const key = item.status === "pagato" || item.rata.pagato
        ? "pagato"
        : item.rata.scadenza
          ? item.rata.scadenza.substring(0, 7)
          : "nessuna-data";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [items]);

  const groupKeys = useMemo(() => {
    return Object.keys(groups).sort((a, b) => {
      if (a === "pagato") return 1;
      if (b === "pagato") return -1;
      if (a === "nessuna-data") return 1;
      if (b === "nessuna-data") return -1;
      return a.localeCompare(b);
    });
  }, [groups]);

  function groupLabel(key) {
    if (key === "nessuna-data") return "📅 Data Da Definire";
    if (key === "pagato") return "✅ Rate Saldate";
    const [year, month] = key.split("-");
    const months = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
    ];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  }

  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-base font-bold text-slate-200">Nessuna rata trovata</p>
        <p className="text-xs text-slate-400 mt-1">Prova a disattivare o modificare i filtri selezionati</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupKeys.map((key) => (
        <div key={key} className="space-y-4">

          {/* Timeline Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50"></div>
            <h2 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest">
              {groupLabel(key)}
            </h2>
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {groups[key].length} {groups[key].length === 1 ? "rata" : "rate"}
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {groups[key].map((item, i) => (
              <TimelineCard key={`${item.expense.id}-${i}`} rata={item.rata} expense={item.expense} />
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
