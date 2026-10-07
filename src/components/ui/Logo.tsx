import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import logo from '../../assets/logoooo.png'

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
  // Responsive logo sizing
  const logoSizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11',
  }

  // Matching typography scale
  const textSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base', 
    lg: 'text-base sm:text-lg',
  }

  return (
    <Link to="/" className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <img
        src={logo}
        alt="Web n Code Technologies"
        className={`${logoSizeClasses[size]} w-auto object-contain block`}
      />

      {showText && (
        // Align text vertically centered with logo
        <div className={`flex flex-col justify-center items-start gap-0.5 sm:gap-1 ${textClassName}`}>
          <div
            className={`${textSizeClasses[size]} font-extrabold text-text-primary leading-tight tracking-tight whitespace-nowrap`}
          >
            {company.name}
          </div>

          <div className="text-[10px] sm:text-[11px] font-semibold text-muted tracking-wide leading-none whitespace-nowrap">
            {company.tagline}
          </div>
        </div>
      )}
    </Link>
  )
}