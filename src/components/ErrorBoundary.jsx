import React from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert, Trash2 } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CHEM-SHIELD Runtime Exception:', error, errorInfo);
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
        <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white border border-red-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-100 text-red-700">
                  SYSTEM RECOVERY MODE
                </span>
                <h1 className="text-lg font-bold text-slate-900 mt-0.5">
                  An Unexpected Application State Occurred
                </h1>
                <p className="text-xs text-slate-500">
                  CHEM-SHIELD Industrial Safety Platform
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-red-700 space-y-1.5 overflow-x-auto">
              <p className="font-semibold">{this.state.error?.toString() || 'Unknown runtime error'}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-slate-500 max-h-32 overflow-y-auto pt-2 border-t border-slate-200">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                You can reload the application, or clear saved browser storage to restore clean default stock records.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload Application</span>
                </button>

                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs flex items-center space-x-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Reset to Default State</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>CHEM-SHIELD</span>
              <span>OSHA 1910.1200 / CPCB Compliant</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
