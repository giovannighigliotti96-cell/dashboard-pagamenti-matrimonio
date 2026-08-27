import { expenses } from "../data/expenses";
import { formatCurrency } from "../utils/currencyHelpers";
import { formatDateIT, getPaymentStatus, formatCountdown } from "../utils/dateHelpers";

export default function SupplierView() {
  return (
    <div className="space-y-6">
      
      {/* Top Header info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Fornitori & Contratti Servizio</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Riepilogo contrattuale per ogni partner commerciale del matrimonio
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
            Fornitori attivi: <strong className="text-amber-400">{expenses.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-semibold">
            Da firmare: <strong className="text-amber-400">{expenses.filter(e => e.contrattoNonAncoraFirmato).length}</strong>
          </span>
        </div>
      </div>

      {/* Supplier List Grid */}
      <div className="grid grid-cols-1 gap-6">
        {expenses.map((exp) => {
          let totalePagato = 0;
          exp.rate.forEach((r) => {
            if (r.pagato) totalePagato += r.importo;
          });
          const totaleDaPagare = exp.totale - totalePagato;
          const pct = exp.totale > 0 ? Math.round((totalePagato / exp.totale) * 100) : 0;

          return (
            <div
              key={exp.id}
              className={`glass-panel rounded-2xl p-6 border transition-all duration-300 space-y-5 ${
                exp.contrattoNonAncoraFirmato ? "border-amber-500/40 border-dashed bg-amber-950/10" : "border-slate-800"
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-12 rounded-lg shrink-0"
                    style={{ backgroundColor: exp.colore }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-100">{exp.fornitore}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {exp.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Stato contrattuale:{" "}
                      {exp.contrattoNonAncoraFirmato ? (
                        <span className="text-amber-400 font-bold">📋 Bozza / In attesa di firma</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">✅ Contratto Firmato & Confermato</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-left md:text-right">
                  <span className="text-2xl font-black text-amber-400 tracking-tight">
                    {formatCurrency(exp.totale)}
                  </span>
                  <p className="text-xs text-slate-400">Quota complessiva fornito</p>
                </div>
              </div>

              {/* Progress & Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Rate totali</span>
                  <span className="text-lg font-bold text-slate-200">{exp.rate.length} scadenze</span>
                </div>
                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Versato ({pct}%)</span>
                  <span className="text-lg font-bold text-emerald-300">{formatCurrency(totalePagato)}</span>
                </div>
                <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-500/20 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">Rimanente</span>
                  <span className="text-lg font-bold text-amber-300">{formatCurrency(totaleDaPagare)}</span>
                </div>
              </div>

              {/* Installment breakdown table */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                  Piano Rate Fornitore
                </span>
                <div className="space-y-2">
                  {exp.rate.map((rata, idx) => {
                    const status = getPaymentStatus(rata);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${rata.pagato ? "bg-emerald-400" : "bg-amber-400"}`} />
                          <span className="font-bold text-slate-200">{rata.nome}</span>
                          {rata.note && (
                            <span className="text-slate-400 text-[11px] italic">({rata.note})</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <strong className="text-amber-300 font-extrabold text-sm">{formatCurrency(rata.importo)}</strong>
                          <span className="text-slate-400">
                            {rata.scadenza ? formatDateIT(rata.scadenza) : "Data TBD"}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rata.pagato ? "bg-emerald-950 text-emerald-300" : "bg-amber-950 text-amber-300"
                          }`}>
                            {rata.pagato ? "SALDATO" : formatCountdown(rata.scadenza) || "PENDENTE"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
