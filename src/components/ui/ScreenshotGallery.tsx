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
    <div className="space-y-4 w-full">
      {/* Main Image Viewport Wrapper with Sharp Borders & Hard Shadows */}
      <div className="relative overflow-hidden rounded-md border-2 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={screenshots[currentIndex]}
            alt={`${productName} screenshot ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-auto object-cover max-h-[480px]"
          />
        </AnimatePresence>

        {/* Structural Navigation Arrows Block */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-[#ff9e7d] hover:translate-y-[-52%] active:translate-y-[-48%] active:shadow-[1px_1px_0px_0px_#000] transition-all"
              aria-label="Previous screenshot"
            >
              <svg className="h-5 w-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-[#ff9e7d] hover:translate-y-[-52%] active:translate-y-[-48%] active:shadow-[1px_1px_0px_0px_#000] transition-all"
              aria-label="Next screenshot"
            >
              <svg className="h-5 w-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Flat Solid Frame Counter Badge */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-4 right-4 border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black font-mono uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_#000]">
            {currentIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Grid Thumbnail Controls Panel */}
      {screenshots.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 overflow-hidden rounded border-2 transition-all duration-150 ${
                index === currentIndex
                  ? 'border-slate-900 bg-[#7dd3fc] p-0.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-y-[-2px]'
                  : 'border-slate-900/40 opacity-70 hover:opacity-100 hover:border-slate-900'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            >
              <img
                src={screenshot}
                alt={`${productName} thumbnail ${index + 1}`}
                className="h-14 w-20 object-cover rounded-xs"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}