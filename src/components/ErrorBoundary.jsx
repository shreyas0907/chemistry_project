import React from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert, Trash2, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CHEM-SHIELD Uncaught Runtime Exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear storage:', e);
    }
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050a0e] text-slate-100 flex items-center justify-center p-6 selection:bg-cyan-500 selection:text-black">
          <div className="max-w-2xl w-full bg-[#08121a] border border-red-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-400">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-400 border border-red-800">
                  SYSTEM RECOVERY MODE
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  CHEM-SHIELD Encountered an Unexpected State
                </h1>
                <p className="text-xs text-slate-400 font-mono">
                  Active Floor-Safety &amp; Compliance Copilot
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-red-300 space-y-2 overflow-x-auto">
              <div className="flex items-center space-x-2 text-slate-400 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Error Diagnostic Trace:</span>
              </div>
              <p className="text-red-400 font-semibold">{this.state.error?.toString() || 'Unknown runtime error'}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-slate-400 max-h-40 overflow-y-auto pt-2 border-t border-slate-800/80">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                This can occur if an outdated local browser cache is incompatible with new safety formulas. You can reload the app, or clear your cached state to restore clean verified industrial defaults.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={this.handleReload}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-cyan-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reload Application</span>
                </button>

                <button
                  onClick={this.handleReset}
                  className="px-5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-200 font-bold text-xs flex items-center space-x-2 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Clear Cache &amp; Reset Verified Data</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>CHEM-SHIELD SME COPILOT v5.0</span>
              <span>OSHA 1910.1200 / NFPA 400 Compliant</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
