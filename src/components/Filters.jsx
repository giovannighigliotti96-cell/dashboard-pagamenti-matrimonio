import { expenses } from "../data/expenses";

const CATEGORIE = ["tutte", ...new Set(expenses.map((e) => e.categoria))];
const STATI = [
  { value: "tutti", label: "Tutti" },
  { value: "urgente", label: "⚡ Imminenti" },
  { value: "in_scadenza", label: "🟡 In scadenza" },
  { value: "futuro", label: "⚪ Programmati" },
  { value: "pagato", label: "✅ Saldate" },
];

export default function Filters({ filterCategoria, setFilterCategoria, filterStato, setFilterStato }) {
  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Filter by Category */}
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
            Filtra per Categoria
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIE.map((cat) => {
              const isActive = filterCategoria === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategoria(cat)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {cat === "tutte" ? "Tutte le categorie" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter by Status */}
        <div className="space-y-2 lg:border-l lg:border-slate-800 lg:pl-6">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">
            Filtra per Stato Rata
          </span>
          <div className="flex flex-wrap gap-2">
            {STATI.map((s) => {
              const isActive = filterStato === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setFilterStato(s.value)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
