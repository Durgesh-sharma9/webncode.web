import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] text-center space-y-4">
            <span className="text-4xl block">⚠️</span>
            <h2 className="text-xl font-black uppercase text-slate-900">
              {this.props.fallbackTitle || 'Something Went Wrong'}
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded text-left text-[11px] font-mono text-rose-800 break-words overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-lg font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000] hover:bg-[#4ade80] cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border-2 border-slate-900 rounded-lg font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000] hover:bg-slate-100 cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
