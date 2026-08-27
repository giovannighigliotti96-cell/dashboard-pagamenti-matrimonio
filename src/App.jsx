import { useState } from "react";
import Header from "./components/Header";
import KpiCards from "./components/KpiCards";
import AlertBanner from "./components/AlertBanner";
import Timeline from "./components/Timeline";
import FamilyDashboard from "./components/FamilyDashboard";
import SupplierView from "./components/SupplierView";
import Filters from "./components/Filters";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterCategoria, setFilterCategoria] = useState("tutte");
  const [filterStato, setFilterStato] = useState("tutti");

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Header with Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Tab 1: Overview & KPIs */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            <AlertBanner />
            <KpiCards />
            
            {/* Quick Timeline Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Prossime Scadenze In Programma</h2>
                  <p className="text-xs text-slate-400">Prime rate da saldare nei prossimi mesi</p>
                </div>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Vedi tutto lo scadenzario completo</span>
                  <span>→</span>
                </button>
              </div>
              <Timeline filterCategoria="tutte" filterStato="tutti" />
            </div>
          </div>
        )}

        {/* Tab 2: Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-100">Scadenzario Rate Cronologico</h2>
                <p className="text-xs text-slate-400">Lista completa delle rate organizzate per data e stato</p>
              </div>
            </div>
            <Filters
              filterCategoria={filterCategoria}
              setFilterCategoria={setFilterCategoria}
              filterStato={filterStato}
              setFilterStato={setFilterStato}
            />
            <Timeline filterCategoria={filterCategoria} filterStato={filterStato} />
          </div>
        )}

        {/* Tab 3: Per Famiglia */}
        {activeTab === "famiglia" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Ripartizione Quote Per Famiglia</h2>
              <p className="text-xs text-slate-400">Analisi dettagliata di quanto versato e quanto dovuto da ciascun gruppo</p>
            </div>
            <FamilyDashboard />
          </div>
        )}

        {/* Tab 4: Fornitori & Contratti */}
        {activeTab === "suppliers" && (
          <div className="space-y-6 animate-fadeIn">
            <SupplierView />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💍</span>
            <span className="font-bold text-slate-300">Dashboard Pagamenti Matrimonio 2027</span>
          </div>
          <p className="text-slate-400">
            Dati aggiornati al {new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </footer>

    </div>
  );
}
