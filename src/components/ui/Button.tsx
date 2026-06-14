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

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
  secondary:
    'bg-navy text-white hover:bg-navy-light shadow-lg shadow-navy/25 hover:shadow-xl hover:shadow-navy/30',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:border-primary',
  ghost:
    'text-text-primary hover:bg-surface border border-border hover:border-primary/30',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm rounded-xl',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
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
  const classes = `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`

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
