import { useEffect, useRef, useState } from 'react'
import { useInView, motion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  label?: string
  // Naye style ke liye dynamic block colors accept karne ka option add kiya
  bgColorClass?: string 
}

export default function AnimatedCounter({ value, suffix = '', label, bgColorClass = 'bg-white' }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setCount(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      // Card wrapper ko flat colored blocks, solid black borders, aur hard shadow de di
      className={`w-full ${bgColorClass} border-2 border-slate-900 p-6 text-center shadow-[4px_4px_0px_0px_#000] transition-all`}
    >
      {/* Numbers ko clean tech font-black aur structural text color diya */}
      <div className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900">
        {count}
        <span className="text-slate-900">{suffix}</span>
      </div>
      
      {/* Label divider line aur bold monotone subtext */}
      <hr className="my-3 border-t-2 border-slate-900/20" />
      
      <p className="text-xs font-black uppercase tracking-wider font-mono text-slate-700">
        {label}
      </p>
    </motion.div>
  )
}