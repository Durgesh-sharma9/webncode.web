import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

export type PortalTheme = 'light' | 'dark' | 'emerald'

interface PortalThemeContextType {
  theme: PortalTheme
  setTheme: (theme: PortalTheme) => void
}

const PortalThemeContext = createContext<PortalThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'wnc_portal_theme'

export function PortalThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PortalTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'dark' || saved === 'emerald' || saved === 'light') {
        return saved
      }
    } catch (e) {
      // Local storage inaccessible
    }
    return 'light'
  })

  const setTheme = (newTheme: PortalTheme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch (e) {
      // Ignore
    }
  }

  return (
    <PortalThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </PortalThemeContext.Provider>
  )
}

export function usePortalTheme() {
  const context = useContext(PortalThemeContext)
  if (!context) {
    throw new Error('usePortalTheme must be used within a PortalThemeProvider')
  }
  return context
}

/**
 * Single Expandable Theme Button for Affiliate & SuperAdmin Portals.
 * Clicking this button expands a sleek neo-brutalist theme menu with 3 options:
 * 1. ☀️ Light (Clean Paper Neo-Brutalist)
 * 2. 🌙 Dark (Cyber Midnight Obsidian)
 * 3. 💎 Emerald (Royale FinTech Matrix)
 */
export function PortalThemeSwitcher() {
  const { theme, setTheme } = usePortalTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes: {
    id: PortalTheme
    name: string
    subtitle: string
    icon: string
    badgeColor: string
  }[] = [
    {
      id: 'light',
      name: 'Light Paper',
      subtitle: 'Crisp Neo-Brutalist Paper',
      icon: '☀️',
      badgeColor: 'bg-white border-slate-900 text-slate-900',
    },
    {
      id: 'dark',
      name: 'Cyber Dark',
      subtitle: 'Midnight Obsidian Dark',
      icon: '🌙',
      badgeColor: 'bg-slate-900 border-slate-700 text-white',
    },
    {
      id: 'emerald',
      name: 'Emerald Royale',
      subtitle: 'Matrix FinTech Luxury',
      icon: '💎',
      badgeColor: 'bg-[#064e3b] border-emerald-500 text-emerald-100',
    },
  ]

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0]

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      {/* Single Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer portal-theme-trigger-btn"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentThemeObj.icon}</span>
        <span className="hidden sm:inline font-black">{currentThemeObj.name}</span>
        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {/* Expanded Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-100 portal-theme-dropdown-panel font-mono">
          <div className="px-2.5 py-1 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span>Theme Mode</span>
            <span className="text-[9px] lowercase font-bold text-slate-400">portal only</span>
          </div>

          <div className="space-y-1 pt-1">
            {themes.map((t) => {
              const isSelected = theme === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-100 shadow-[2px_2px_0px_0px_#000] font-black'
                      : 'border-transparent hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base p-1.5 rounded-md border border-slate-900 bg-white shadow-[1px_1px_0px_0px_#000] leading-none shrink-0">
                      {t.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-black uppercase tracking-wide truncate text-slate-900">
                        {t.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold truncate">
                        {t.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-1.5 py-0.5 bg-[#86efac] border border-slate-900 rounded text-[9px] font-black text-slate-950 uppercase shrink-0">
                      ✓ Active
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
