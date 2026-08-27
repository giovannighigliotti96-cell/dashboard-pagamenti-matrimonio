import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080B10] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#121824] border border-red-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-2xl mx-auto border border-red-500/20">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-100">Si è verificato un errore</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              La visualizzazione di un componente ha riscontrato un problema imprevisto. 
              Nessun dato è andato perso.
            </p>
            {this.state.error && (
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-red-400 overflow-x-auto text-left max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Ricarica la Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
