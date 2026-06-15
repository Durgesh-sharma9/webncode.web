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
  // Logo ka size thoda bada kar diya hai (h-14 se h-16 aur h-16 se h-20)
  const logoSizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  }

  // Text size ko bhi logo ke bade size ke sath match kar diya hai
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
  }

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Web n Code Technologies"
        className={`${logoSizeClasses[size]} w-auto object-contain block`}
      />

      {showText && (
        // flex-col ke sath items-start aur self-center lagane se text image ke center me align ho jayega
        <div className={`hidden sm:flex flex-col justify-center items-start gap-1 ${textClassName}`}>
          <div
            className={`${textSizeClasses[size]} font-extrabold text-text-primary leading-tight tracking-tight`}
          >
            {company.name}
          </div>

          <div className="text-[11px] font-semibold text-muted tracking-wide leading-none">
            {company.tagline}
          </div>
        </div>
      )}
    </Link>
  )
}