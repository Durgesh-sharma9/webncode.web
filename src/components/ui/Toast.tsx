import { useState } from 'react'

/**
 * Simple Toast Notification Component
 * Styled with rigid Neo-brutalist custom tokens
 */
export default function Toast() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  if (typeof window !== 'undefined') {
    (window as any).showSuccessToast = (message: string) => {
      console.log('Showing success toast:', message)
      setNotification({ message, type: 'success' })
      setTimeout(() => setNotification(null), 4000) // Fast auto dismissal
    }

    (window as any).showErrorToast = (message: string) => {
      console.log('Showing error toast:', message)
      setNotification({ message, type: 'error' })
      setTimeout(() => setNotification(null), 4000)
    }
  }

  if (!notification) return null

  // Flat background choices mapping the exact palette rules
  const bgColor = notification.type === 'success' ? 'bg-[#86efac]' : 'bg-[#ff9e7d]'

  return (
    // Fixed positioning with snappy, rigid tracking offsets instead of complex blurred flows
    <div className="fixed top-6 right-6 z-[9999]">
      <div 
        className={`${bgColor} border-2 border-slate-900 text-slate-900 px-5 py-4 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center gap-3.5 min-w-[320px] select-none`}
      >
        {/* Rigid Check/Cross Block Container */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-slate-900 bg-white font-mono text-sm font-black shadow-[1px_1px_0px_0px_#000]">
          {notification.type === 'success' ? '✓' : '✕'}
        </div>
        
        {/* Core Monospaced Messaging Details */}
        <p className="text-xs font-black uppercase font-mono tracking-wide leading-tight">
          {notification.message}
        </p>
      </div>
    </div>
  )
}

/**
 * Show success toast notification
 */
export const showSuccessToast = (message: string) => {
  console.log('showSuccessToast called:', message)
  if (typeof window !== 'undefined' && (window as any).showSuccessToast) {
    (window as any).showSuccessToast(message)
  }
}

/**
 * Show error toast notification
 */
export const showErrorToast = (message: string) => {
  console.log('showErrorToast called:', message)
  if (typeof window !== 'undefined' && (window as any).showErrorToast) {
    (window as any).showErrorToast(message)
  }
}