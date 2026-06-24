import { motion } from 'framer-motion'

interface SectionHeadingProps {
  label?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`mb-12 max-w-6xl flex flex-col ${alignClass}`}
    >
      {/* Top Pill Label - Boxy indicator with offset shadow */}
      {label && (
        <span
          className={`mb-4 inline-block rounded border-2 border-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
            light ? 'bg-[#7dd3fc] text-slate-900' : 'bg-white text-slate-900'
          }`}
        >
          {label}
        </span>
      )}

      {/* Main Structural Title Heading */}
      <h2
        className={`text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight ${
          light 
            ? 'text-white drop-shadow-[2px_2px_0px_#000]' 
            : 'text-slate-900'
        }`}
      >
        {/* Title text embedded in a rigid inline highlighter block if center aligned */}
        {align === 'center' ? (
          <span className={`inline-block border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${light ? 'bg-slate-900 border-white text-white shadow-[4px_4px_0px_0px_#fff]' : 'bg-[#ff9e7d]'}`}>
            {title}
          </span>
        ) : (
          title
        )}
      </h2>

      {/* Subtext Description Block */}
      {description && (
        <p
          className={`mt-5 text-sm md:text-base font-bold uppercase tracking-wide leading-relaxed max-w-4xl md:whitespace-nowrap ${
            light ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}