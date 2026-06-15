import { useState } from 'react'

/**
 * Simple Toast Notification Component
 * Custom implementation to avoid react-toastify rendering issues
 */
export default function Toast() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Expose functions globally for use in other components
  if (typeof window !== 'undefined') {
    (window as any).showSuccessToast = (message: string) => {
      console.log('Showing success toast:', message)
      setNotification({ message, type: 'success' })
      setTimeout(() => setNotification(null), 5000)
    }

    (window as any).showErrorToast = (message: string) => {
      console.log('Showing error toast:', message)
      setNotification({ message, type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  if (!notification) return null

  const bgColor = notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-300">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <span className="text-2xl">
          {notification.type === 'success' ? '✓' : '✕'}
        </span>
        <p className="font-medium">{notification.message}</p>
      </div>
    </div>
  )
}

/**
 * Show success toast notification
 * @param {string} message - Success message to display
 */
export const showSuccessToast = (message: string) => {
  console.log('showSuccessToast called:', message)
  if (typeof window !== 'undefined' && (window as any).showSuccessToast) {
    (window as any).showSuccessToast(message)
  }
}

/**
 * Show error toast notification
 * @param {string} message - Error message to display
 */
export const showErrorToast = (message: string) => {
  console.log('showErrorToast called:', message)
  if (typeof window !== 'undefined' && (window as any).showErrorToast) {
    (window as any).showErrorToast(message)
  }
}
