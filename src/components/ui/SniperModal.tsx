import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import devImage from '../../assets/team/dev_stage2_sniper.png'

interface SniperModalProps {
  isOpen: boolean
  onClose: () => void
  onReload: () => void
}

// 1. High-tech Helmet Visor Equip & Lock Sound
export function playHelmetEquipSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    // Servo whoosh / slide
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12)
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.22)
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)
    
    // Lowpass filter for metallic helmet resonance
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1500, ctx.currentTime)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)

    // Digital visor confirmation chirp
    setTimeout(() => {
      try {
        const chirp = ctx.createOscillator()
        const chirpGain = ctx.createGain()
        chirp.type = 'sine'
        chirp.frequency.setValueAtTime(1200, ctx.currentTime)
        chirp.frequency.setValueAtTime(1800, ctx.currentTime + 0.06)
        chirpGain.gain.setValueAtTime(0.18, ctx.currentTime)
        chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        chirp.connect(chirpGain)
        chirpGain.connect(ctx.destination)
        chirp.start()
        chirp.stop(ctx.currentTime + 0.15)
      } catch {
        // ignore
      }
    }, 180)
  } catch (e) {
    console.error('Audio error:', e)
  }
}

// 2. Heavy Bolt Action & Scope Laser Lock Sound
export function playSniperAimSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    // Bolt slide click 1
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(900, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06)
    gain1.gain.setValueAtTime(0.3, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start()
    osc1.stop(ctx.currentTime + 0.07)

    // Heavy bolt lock click 2
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(400, ctx.currentTime)
        osc2.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.05)
        gain2.gain.setValueAtTime(0.35, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.08)
      } catch {
        // ignore
      }
    }, 90)

    // Laser sight lock beep
    setTimeout(() => {
      try {
        const laser = ctx.createOscillator()
        const laserGain = ctx.createGain()
        laser.type = 'sine'
        laser.frequency.setValueAtTime(2200, ctx.currentTime)
        laserGain.gain.setValueAtTime(0.12, ctx.currentTime)
        laserGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
        laser.connect(laserGain)
        laserGain.connect(ctx.destination)
        laser.start()
        laser.stop(ctx.currentTime + 0.12)
      } catch {
        // ignore
      }
    }, 180)
  } catch (e) {
    console.error('Audio error:', e)
  }
}

export function playChamberClickSound() {
  playSniperAimSound()
}

export function playSniperShotSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    // 1. Initial Explosive White Noise Crack
    const bufferSize = ctx.sampleRate * 0.4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(1200, ctx.currentTime)
    noiseFilter.Q.setValueAtTime(2.5, ctx.currentTime)
    
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.7, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start()

    // 2. Heavy Sub-Bass Sniper Thump (Recoil Impact)
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(160, ctx.currentTime)
    subOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.4)
    
    subGain.gain.setValueAtTime(0.8, ctx.currentTime)
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    
    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start()
    subOsc.stop(ctx.currentTime + 0.55)

    // 3. Resonant Shell Casing / Tail Echo
    setTimeout(() => {
      try {
        const shellOsc = ctx.createOscillator()
        const shellGain = ctx.createGain()
        shellOsc.type = 'sine'
        shellOsc.frequency.setValueAtTime(2400, ctx.currentTime)
        shellOsc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15)
        shellGain.gain.setValueAtTime(0.12, ctx.currentTime)
        shellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
        shellOsc.connect(shellGain)
        shellGain.connect(ctx.destination)
        shellOsc.start()
        shellOsc.stop(ctx.currentTime + 0.2)
      } catch {
        // ignore
      }
    }, 380)

  } catch (e) {
    console.error('Sniper audio error:', e)
  }
}

export function SniperModal({ isOpen, onClose, onReload }: SniperModalProps) {
  const [activeTab, setActiveTab] = useState<'intel' | 'arsenal' | 'stats'>('intel')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono">
          {/* Backdrop with cyber grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
            style={{
              backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-400 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.35),10px_10px_0px_0px_rgba(15,23,42,1)] overflow-hidden z-10 my-auto text-slate-100"
          >
            {/* Top Military Banner Header */}
            <div className="bg-slate-950 border-b-2 border-emerald-500/40 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  CONFIDENTIAL // DOSSIER 001
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  TARGET: DURGESH SHARMA [HEADSHOT CONFIRMED 🎯]
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer font-bold text-sm"
                title="Close Dossier"
              >
                ✕
              </button>
            </div>

            {/* Main Body Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Portrait & Crosshair Frame */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-56 h-64 sm:w-64 sm:h-72 bg-gradient-to-b from-emerald-950/60 to-slate-950 rounded-xl border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.2)] overflow-hidden group">
                  
                  {/* Sniper Crosshairs Overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20 opacity-60">
                    {/* Circle */}
                    <div className="absolute inset-8 rounded-full border border-dashed border-emerald-400/50" />
                    {/* Vertical line */}
                    <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-emerald-400/40 -translate-x-1/2" />
                    {/* Horizontal line */}
                    <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-emerald-400/40 -translate-y-1/2" />
                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>

                  {/* Character Illustration with Finger Gun */}
                  <img
                    src={devImage}
                    alt="Durgesh Sharma"
                    className="w-full h-full object-cover object-top filter brightness-105 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] relative z-10 transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status Banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 border-t border-emerald-400/40 py-1.5 px-3 flex items-center justify-between text-[10px] z-30 font-bold">
                    <span className="text-emerald-400 tracking-widest uppercase">CALLSIGN: DEV_SNIPER</span>
                    <span className="text-yellow-400">STATUS: 100% LETHAL</span>
                  </div>
                </div>

                {/* Quick Social Badges */}
                <div className="flex items-center gap-2 mt-4">
                  <a
                    href="https://www.linkedin.com/in/durgesh-sharma-508762339/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded border border-slate-700 text-xs font-bold transition-all"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Durgesh-sharma9"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded border border-slate-700 text-xs font-bold transition-all"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://x.com/Dev_sharma_ai"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded border border-slate-700 text-xs font-bold transition-all"
                  >
                    X / Twitter
                  </a>
                  <a
                    href="https://www.instagram.com/dev998889?igsh=aDhjd2FqeWlveHRr"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded border border-slate-700 text-xs font-bold transition-all"
                  >
                    Insta
                  </a>
                </div>
              </div>

              {/* Right Column: Detailed Info Tabs */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Name & Primary Role */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-extrabold uppercase tracking-widest mb-1">
                    <span>OPERATIVE #03</span>
                    <span>//</span>
                    <span>WnC CORE ENGINE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-mono flex items-center gap-2">
                    Durgesh Sharma
                    <span className="text-xl">🎯</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wide">
                    Full Stack Developer & Backend Architecture Sniper
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveTab('intel')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold uppercase transition-all ${
                      activeTab === 'intel'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎯 Mission Intel
                  </button>
                  <button
                    onClick={() => setActiveTab('arsenal')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold uppercase transition-all ${
                      activeTab === 'arsenal'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Tech Arsenal
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold uppercase transition-all ${
                      activeTab === 'stats'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📊 Combat Stats
                  </button>
                </div>

                {/* Tab Content Box */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-h-[170px] text-xs font-sans">
                  
                  {/* TAB 1: INTEL */}
                  {activeTab === 'intel' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-slate-300 leading-relaxed font-medium">
                        <strong className="text-emerald-400 font-bold">Bio Directive:</strong> Specialized in hunting down complex server-side bugs and architecting rock-solid backend infrastructure. From zero-latency RESTful APIs to distributed data schemas, ensuring 100% precision execution for enterprise institutions.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                          <span className="text-slate-500 block uppercase font-bold text-[9px]">Location</span>
                          <span className="text-emerald-300 font-black">Jaipur, India 🇮🇳</span>
                        </div>
                        <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                          <span className="text-slate-500 block uppercase font-bold text-[9px]">Specialty</span>
                          <span className="text-emerald-300 font-black">APIs & Microservices</span>
                        </div>
                        <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                          <span className="text-slate-500 block uppercase font-bold text-[9px]">Shooting Style</span>
                          <span className="text-yellow-300 font-black">Finger-Gun Headshot 👉</span>
                        </div>
                        <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                          <span className="text-slate-500 block uppercase font-bold text-[9px]">Easter Egg</span>
                          <span className="text-rose-400 font-black">Unlocked via 3x Tap</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: ARSENAL */}
                  {activeTab === 'arsenal' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2.5 font-mono"
                    >
                      <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider">
                        Weaponry & Framework Loadout:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Node.js (Heavy Artillery)',
                          'Express.js (Rapid Dispatch)',
                          'React & TypeScript (Precision UI)',
                          'MongoDB Atlas (Data Fortress)',
                          'RESTful APIs (Direct Pipeline)',
                          'Realtime WebSockets (Instant Recon)',
                          'State Optimization (Zero Lag)',
                          'Security Protocols (Armor Plating)',
                          'Python & AI Integrations',
                          'Git Version Control'
                        ].map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: STATS */}
                  {activeTab === 'stats' && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 font-mono text-[11px]"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Bug Elimination Precision:</span>
                          <span className="text-emerald-400 font-bold">99.9%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[99.9%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>API Throughput Efficiency:</span>
                          <span className="text-emerald-400 font-bold">100%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[100%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Database Architecture Stability:</span>
                          <span className="text-emerald-400 font-bold">99.8%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[99.8%]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Coffee Consumed per Release:</span>
                          <span className="text-yellow-400 font-bold">∞ Cups</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-yellow-400 h-full w-[100%]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      onReload()
                      onClose()
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs tracking-wider uppercase flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-y-0.5 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>RELOAD SNIPER (FIRE AGAIN)</span>
                  </button>

                  <a
                    href="https://github.com/Durgesh-sharma9"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg text-xs tracking-wider uppercase border border-slate-700 transition-colors"
                  >
                    GITHUB DOSSIER ↗
                  </a>
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Fullscreen Sniper Fire Overlay Effect
export function SniperShotEffect({ isFiring }: { isFiring: boolean }) {
  if (!isFiring) return null

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* 1. Recoil Flash */}
      <motion.div
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-white"
      />

      {/* 2. Red Blood / Target Hit Vignette */}
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-red-600/30"
      />

      {/* 3. Bullet Hole & Glass Cracks */}
      <motion.div
        initial={{ scale: 0.4, opacity: 1, rotate: -15 }}
        animate={{ scale: 1.2, opacity: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className="relative z-20 flex flex-col items-center"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-48 h-48 sm:w-64 sm:h-64 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
        >
          {/* Bullet Entry Hole */}
          <circle cx="100" cy="100" r="14" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
          <circle cx="100" cy="100" r="7" fill="#000000" />
          
          {/* Glass Fracture Cracks */}
          <path
            d="M 100 100 L 20 30 M 100 100 L 180 20 M 100 100 L 190 140 M 100 100 L 130 190 M 100 100 L 30 170 M 100 100 L 10 110 M 100 100 L 90 10 M 100 100 L 160 80 M 100 100 L 70 180"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 50 55 L 75 35 M 150 45 L 135 70 M 160 130 L 175 165 M 65 145 L 45 130 M 80 160 L 110 175"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-rose-600 text-white font-mono font-black text-sm sm:text-base px-4 py-1.5 rounded-lg border-2 border-white shadow-[0_0_25px_rgba(225,29,72,0.8)] uppercase tracking-widest mt-2"
        >
          💥 HEADSHOT CONFIRMED! 🎯
        </motion.div>
      </motion.div>
    </div>
  )
}
