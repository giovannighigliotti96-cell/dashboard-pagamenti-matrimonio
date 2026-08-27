import { useState } from "react";

export default function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  function copyCurrentUrl() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow rounded-2xl w-full max-w-xl p-6 border border-amber-500/30 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
              🌐
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Condividi Dashboard Online</h2>
              <p className="text-xs text-slate-400">Come accedere e condividere il link a chiunque</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3 Sharing Options */}
        <div className="space-y-4 text-xs">
          
          {/* Option 1: LocalTunnel Instant Link */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
              ⚡ OPZIONE 1: Link Pubblico Istantaneo Gratuità (LocalTunnel)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Per creare un link pubblico aperto a tutti internet in 5 secondi, esegui nel terminale:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300">
              npx localtunnel --port 5173
            </div>
            <p className="text-slate-400 text-[11px]">
              Ti genererà un link tipo <code className="text-slate-200">https://xxxx.loca.lt</code> condivisibile via WhatsApp/Email con chiunque!
            </p>
          </div>

          {/* Option 2: Wi-Fi Local Network */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              📱 OPZIONE 2: Accesso da Smartphone sulla stessa Wi-Fi
            </span>
            <p className="text-slate-300 leading-relaxed">
              Il server dev è già configurato con <code className="text-slate-200">host: 0.0.0.0</code>. Per aprire la dashboard da qualunque telefono o tablet connesso alla stessa rete Wi-Fi della casa, usa l'indirizzo IP locale:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300">
              http://&lt;IP-del-tuo-PC&gt;:5173
            </div>
          </div>

          {/* Option 3: Permanent Vercel/Netlify Deployment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              🚀 OPZIONE 3: Pubblicazione Permanente Gratuita (Vercel / Netlify)
            </span>
            <p className="text-slate-300 leading-relaxed">
              Per pubblicare un sito vero e proprio con link permanente per sempre (es. <code className="text-slate-200">https://matrimonio2027.vercel.app</code>):
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              npm run build<br/>
              npx vercel (oppure npx netlify-cli deploy)
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={copyCurrentUrl}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? "✅ Link Copiato!" : "🔗 Copia Indirizzo Corrente"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
          >
            Capito!
          </button>
        </div>

      </div>
    </div>
  );
}
