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
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 max-w-3xl ${alignClass}`}
    >
      {label && (
        <span
          className={`mb-4 inline-block text-xs font-bold uppercase tracking-widest ${
            light ? 'text-primary-light' : 'text-primary'
          }`}
        >
          {label}
        </span>
      )}
      <h2
        className={`display-sm ${
          light ? 'text-white' : 'text-text-primary'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 text-lg leading-relaxed ${
            light ? 'text-white/70' : 'text-text-secondary'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}
