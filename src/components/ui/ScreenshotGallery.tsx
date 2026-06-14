import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScreenshotGalleryProps {
  screenshots: string[]
  productName: string
}

export default function ScreenshotGallery({ screenshots, productName }: ScreenshotGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!screenshots || screenshots.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={screenshots[currentIndex]}
            alt={`${productName} screenshot ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-auto object-cover"
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              aria-label="Previous screenshot"
            >
              <svg className="h-5 w-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"
              aria-label="Next screenshot"
            >
              <svg className="h-5 w-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Slide Counter */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {currentIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? 'border-primary scale-105 shadow-md'
                  : 'border-border opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            >
              <img
                src={screenshot}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-16 w-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
