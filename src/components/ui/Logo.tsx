import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import logo from '../../assets/onlylogoo.png'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  textClassName?: string
}

export default function Logo({
  className = '',
  showText = true,
  size = 'md',
  textClassName = '',
}: LogoProps) {
  const logoSizeClasses = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Web n Code Technologies"
        className={`${logoSizeClasses[size]} w-auto object-contain`}
      />

      {showText && (
        <div className={`hidden sm:block ${textClassName}`}>
          <div
            className={`${textSizeClasses[size]} font-bold text-text-primary leading-tight tracking-tight`}
          >
            {company.name}
          </div>

          <div className="text-xs font-medium text-muted tracking-wide">
            {company.tagline}
          </div>
        </div>
      )}
    </Link>
  )
}