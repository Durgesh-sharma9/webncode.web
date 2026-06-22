import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop Utility Component
 * Forces the browser layout engine to reset screen coordinates to (0,0)
 * perfectly syncing page renders during snappy Neo-brutalist custom transitions.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Sharp scroll reset with immediate jumping effect matching the clean tech theme
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'smooth' ke badle 'auto' fast state changes ke liye ideal hai
    })
  }, [pathname])

  return null
}