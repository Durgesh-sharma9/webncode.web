import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  to?: string
  href?: string
  type?: 'button' | 'submit'
  className?: string
  onClick?: () => void
}

// Neo-brutalist custom design tokens for variants matching your global theme palette
const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[#ff9e7d] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]',
  secondary:
    'bg-[#7dd3fc] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]',
  outline:
    'bg-white text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-[#ebebeb] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
  ghost:
    'text-slate-700 bg-transparent border-2 border-transparent hover:border-slate-900 hover:bg-white',
}

// Clean bold geometric structural sizing
const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs rounded-md',
  md: 'px-5 py-3 text-sm rounded-md',
  lg: 'px-7 py-3.5 text-base rounded-md',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className = '',
  onClick,
}: ButtonProps) {
  // Added standard uppercase tracking, heavy font weights and monospaced engine style
  const classes = `inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider font-mono transition-all duration-150 select-none ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}