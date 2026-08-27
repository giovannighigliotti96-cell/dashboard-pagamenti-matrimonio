import { formatCurrency } from "../utils/currencyHelpers";
import { formatDateIT, formatCountdown, getDaysRemaining } from "../utils/dateHelpers";
import { expenses } from "../data/expenses";

function getNextDuePayment() {
  const allRate = [];
  expenses.forEach((exp) => {
    exp.rate.forEach((rata) => {
      if (!rata.pagato && rata.scadenza) {
        const days = getDaysRemaining(rata.scadenza);
        if (days !== null && days >= 0) {
          allRate.push({
            ...rata,
            fornitore: exp.fornitore,
            categoria: exp.categoria,
            colore: exp.colore,
            giorni: days
          });
        }
      }
    });
  });
  allRate.sort((a, b) => a.giorni - b.giorni);
  return allRate[0] || null;
}

export default function Header({ activeTab, setActiveTab }) {
  const next = getNextDuePayment();

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 md:py-4 gap-3">

          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-amber-500/30 border border-amber-500/30 flex items-center justify-center text-xl md:text-2xl shadow-lg shrink-0">
              💍
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
                  Matrimonio 2027
                </h1>
                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  Scadenze & Budget
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Dashboard Silvia e Fabio & Esther
              </p>
            </div>
          </div>

          {/* Next Due Payment Banner Ticker */}
          {next && (
            <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 px-3.5 shadow-inner text-xs">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  Prossima Rata In Uscita
                </span>
                <p className="font-bold text-slate-200 truncate">
                  {next.fornitore}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {next.nome} · {formatDateIT(next.scadenza)}
                </p>
              </div>

              <div className="text-right border-l border-slate-800 pl-3 shrink-0">
                <div className="text-base font-extrabold text-amber-400 tracking-tight">
                  {formatCurrency(next.importo)}
                </div>
                <div className="text-[10px] font-bold text-rose-400">
                  {formatCountdown(next.scadenza)}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Scrollable Touch-Friendly Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {[
            { id: "overview", label: "📊 Panoramica", fullLabel: "📊 Panoramica & KPI" },
            { id: "timeline", label: "📅 Scadenzario", fullLabel: "📅 Scadenzario Rate" },
            { id: "famiglia", label: "👨‍👩‍👧 Per Famiglia", fullLabel: "👨‍👩‍👧 Quote Per Famiglia" },
            { id: "suppliers", label: "📋 Fornitori", fullLabel: "📋 Fornitori & Contratti" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[40px] flex items-center ${isActive
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
              >
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
