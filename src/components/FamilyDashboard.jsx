import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { expenses, famiglie, getEffectiveDettaglio } from "../data/expenses";
import { formatCurrency } from "../utils/currencyHelpers";
import { formatDateIT, getDaysRemaining, getPaymentStatus } from "../utils/dateHelpers";

function buildFamilyData() {
  const data = {};
  Object.keys(famiglie).forEach((key) => {
    data[key] = { pagato: 0, daPagare: 0, prossima: null, rateList: [] };
  });

  expenses.forEach((exp) => {
    exp.rate.forEach((rata) => {
      const dettaglio = getEffectiveDettaglio(rata, exp);
      if (dettaglio) {
        Object.entries(dettaglio).forEach(([key, val]) => {
          if (!data[key]) return;

          const isCustomSplit = Boolean(rata.dettaglioPagamento);

          const familyRateItem = {
            fornitore: exp.fornitore,
            categoria: exp.categoria,
            colore: exp.colore,
            nomeRata: rata.nome,
            quotaFamiglia: val,
            importoRataTotale: rata.importo,
            scadenza: rata.scadenza,
            pagato: rata.pagato,
            note: rata.note,
            urgente: rata.urgente,
            isCustomSplit,
            status: getPaymentStatus(rata),
          };

          data[key].rateList.push(familyRateItem);

          if (rata.pagato) {
            data[key].pagato += val;
          } else {
            data[key].daPagare += val;
            if (rata.scadenza) {
              const days = getDaysRemaining(rata.scadenza);
              if (
                days !== null &&
                days >= 0 &&
                (data[key].prossima === null ||
                  days < getDaysRemaining(data[key].prossima.scadenza))
              ) {
                data[key].prossima = familyRateItem;
              }
            }
          }
        });
      }
    });
  });

  Object.keys(data).forEach((key) => {
    data[key].rateList.sort((a, b) => {
      if (a.pagato !== b.pagato) return a.pagato ? 1 : -1;
      const dA = a.scadenza ? getDaysRemaining(a.scadenza) : 99999;
      const dB = b.scadenza ? getDaysRemaining(b.scadenza) : 99999;
      return (dA ?? 99999) - (dB ?? 99999);
    });
  });

  return data;
}

function buildDonutData(familyData) {
  return Object.entries(familyData)
    .map(([key, val]) => ({
      name: famiglie[key].nome,
      value: val.pagato + val.daPagare,
      pagato: val.pagato,
      daPagare: val.daPagare,
      colore: famiglie[key].colore,
      key,
    }))
    .filter((d) => d.value > 0);
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 shadow-2xl text-xs space-y-1.5 min-w-[200px]">
        <p className="font-bold text-slate-100 text-sm">{d.name}</p>
        <div className="border-t border-slate-800 pt-1.5 space-y-1">
          <p className="flex justify-between text-slate-300">
            <span>Quota Totale:</span>
            <strong className="text-amber-400 font-extrabold">{formatCurrency(d.value)}</strong>
          </p>
          <p className="flex justify-between text-emerald-400">
            <span>Già Pagato:</span>
            <strong className="font-bold">{formatCurrency(d.pagato)}</strong>
          </p>
          <p className="flex justify-between text-amber-300">
            <span>Ancora Da Pagare:</span>
            <strong className="font-bold">{formatCurrency(d.daPagare)}</strong>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function FamilyDashboard() {
  const [selectedFamilyKey, setSelectedFamilyKey] = useState("tutti");
  const familyData = useMemo(() => buildFamilyData(), []);
  const donutData = useMemo(() => buildDonutData(familyData), [familyData]);
  const totalAll = donutData.reduce((s, d) => s + d.value, 0);
  const totalPaidAll = donutData.reduce((s, d) => s + d.pagato, 0);
  const totalRemainingAll = donutData.reduce((s, d) => s + d.daPagare, 0);

  // Single Family stats
  const selectedStats = selectedFamilyKey !== "tutti" ? familyData[selectedFamilyKey] : null;
  const selectedConfig = selectedFamilyKey !== "tutti" ? famiglie[selectedFamilyKey] : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner info */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Ripartizione Spese Matrimonio</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Confronto quote tra <strong className="text-amber-400">Silvia</strong> e <strong className="text-rose-400">Fabio & Esther</strong> (50% generale con quote personalizzate su Banqueting e Fotografo)
          </p>
        </div>

        {/* Family Selector Pills */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setSelectedFamilyKey("tutti")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              selectedFamilyKey === "tutti"
                ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            👥 Tutti (Silvia + Fabio & Esther)
          </button>
          {Object.entries(famiglie).map(([key, fam]) => {
            const isSelected = selectedFamilyKey === key;
            const stats = familyData[key];
            const tot = stats.pagato + stats.daPagare;
            return (
              <button
                key={key}
                onClick={() => setSelectedFamilyKey(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fam.colore }} />
                <span>{fam.nome}</span>
                <span className={`text-[11px] opacity-80 ${isSelected ? "text-slate-950" : "text-slate-400"}`}>
                  ({formatCurrency(tot)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 MAIN COMPARISON CARDS FOR SILVIA AND FABIO & ESTHER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(famiglie).map(([key, fam]) => {
          const stats = familyData[key];
          const tot = stats.pagato + stats.daPagare;
          const pctPaid = tot > 0 ? Math.round((stats.pagato / tot) * 100) : 0;
          const isSelected = selectedFamilyKey === key;

          return (
            <div
              key={key}
              onClick={() => setSelectedFamilyKey(key)}
              className={`glass-panel rounded-2xl p-6 relative overflow-hidden space-y-5 border transition-all duration-300 cursor-pointer ${
                isSelected ? "border-amber-400 ring-2 ring-amber-400/20" : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Color bar top accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: fam.colore }} />

              {/* Title & Quota */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-extrabold text-slate-100 text-2xl">{fam.nome}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quota complessiva dovuta: <strong className="text-amber-400 font-extrabold text-sm">{formatCurrency(tot)}</strong>
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md shrink-0"
                  style={{ backgroundColor: fam.colore }}
                >
                  {fam.nome.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                    ✅ Già Pagato
                  </span>
                  <span className="text-xl font-black text-emerald-300">
                    {formatCurrency(stats.pagato)}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 block mt-0.5">{pctPaid}% saldato</span>
                </div>

                <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    ⏳ Ancora Da Pagare
                  </span>
                  <span className="text-xl font-black text-amber-300">
                    {formatCurrency(stats.daPagare)}
                  </span>
                  <span className="text-[10px] text-amber-400/80 block mt-0.5">{100 - pctPaid}% rimanente</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Avanzamento saldi</span>
                  <span className="font-bold text-slate-200">{pctPaid}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pctPaid}%`, backgroundColor: fam.colore }}
                  />
                </div>
              </div>

              {/* Prossima scadenza personale */}
              {stats.prossima ? (
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">
                    Prossima Scadenza Personale
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-200">{stats.prossima.fornitore}</p>
                      <p className="text-slate-400">{stats.prossima.nomeRata}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-amber-300">{formatCurrency(stats.prossima.quotaFamiglia)}</p>
                      <p className="text-slate-400">{formatDateIT(stats.prossima.scadenza)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5 text-center text-xs text-emerald-400 font-semibold">
                  🎉 Tutti i pagamenti risultano saldati
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-amber-400 pt-1 font-semibold">
                <span>Vedi estratto conto completo rate</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DONUT CHART & RECAP TABLE */}
      {selectedFamilyKey === "tutti" && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Distribuzione Percentuale Quota Totale</h3>
            <p className="text-xs text-slate-400">Ripartizione del budget totale ({formatCurrency(totalAll)}) tra i due nuclei</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.key} fill={entry.colore} stroke="#080B10" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 700 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Summary Table */}
            <div className="w-full lg:w-1/2 space-y-3">
              {donutData.map((d) => {
                const pct = totalAll > 0 ? ((d.value / totalAll) * 100).toFixed(1) : 0;
                return (
                  <div key={d.key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: d.colore }} />
                        <span className="font-extrabold text-slate-100 text-sm">{d.name}</span>
                      </div>
                      <span className="text-base font-black text-amber-400">{formatCurrency(d.value)} ({pct}%)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Già Versato:</span>
                        <strong className="text-emerald-400 font-bold">{formatCurrency(d.pagato)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block">Rimanente:</span>
                        <strong className="text-amber-300 font-bold">{formatCurrency(d.daPagare)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RATE LEDGER FOR SELECTED FAMILY */}
      {selectedFamilyKey !== "tutti" && selectedStats && selectedConfig && (
        <div className="glass-panel-glow rounded-2xl p-6 space-y-4 border border-amber-500/30">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-extrabold text-slate-100">
                Estratto Conto Rate Assegnate a {selectedConfig.nome}
              </h3>
              <p className="text-xs text-slate-400">
                Tutte le rate a carico di {selectedConfig.nome} con importi specifici e scadenze
              </p>
            </div>
            <button
              onClick={() => setSelectedFamilyKey("tutti")}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              Chiudi estratto conto ×
            </button>
          </div>

          {/* List of all rate items */}
          <div className="space-y-3">
            {selectedStats.rateList.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 gap-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.colore }}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-sm">{item.fornitore}</span>
                      <span className="text-xs text-slate-400">({item.categoria})</span>
                      {item.isCustomSplit && (
                        <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded font-semibold">
                          Quota personalizzata
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Rata: {item.nomeRata}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-base font-black text-amber-400 block">
                      {formatCurrency(item.quotaFamiglia)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      su totale rata {formatCurrency(item.importoRataTotale)}
                    </span>
                  </div>

                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    item.pagato
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-950 text-amber-300 border border-amber-500/30"
                  }`}>
                    {item.pagato ? "✅ PAGATO" : item.scadenza ? formatDateIT(item.scadenza) : "DATA TBD"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
