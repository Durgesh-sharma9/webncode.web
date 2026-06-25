import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckIcon } from '../components/ui/Icons'

// Premium Asset Imports
import founderImg from '../assets/team/founder.png'
import founderSeriousImg from '../assets/team/founder2.png'

import aryan1 from '../assets/team/aryann1.png'
import aryan2 from '../assets/team/aryann2.png'

import pranav1 from '../assets/team/pranav1.png'
import pranav2 from '../assets/team/pranav2.png'

import dev1 from '../assets/team/dev1.png'

// const amitImg = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"

const themeGradients = [
  { bg: 'bg-[#ffa07a]', border: 'border-orange-500', bannerBg: 'bg-[#ff6c4a]' },
  { bg: 'bg-[#7dd3fc]', border: 'border-blue-500', bannerBg: 'bg-[#3b82f6]' },
  { bg: 'bg-[#c084fc]', border: 'border-purple-500', bannerBg: 'bg-[#a855f7]' },
  { bg: 'bg-[#6ee7b7]', border: 'border-emerald-500', bannerBg: 'bg-[#10b981]' },
  { bg: 'bg-[#fda4af]', border: 'border-rose-500', bannerBg: 'bg-[#f43f5e]' }
]

interface ProfileMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  hoverImage: string;
  location: string;
  flag: string;
  team: string;
  linkedin?: string;
  email?: string;
  youtube?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
}

const founders: ProfileMember[] = [
  {
    id: 'NARENDRA SINGH CHOUDHARY',
    name: 'NARENDRA SINGH CHOUDHARY',
    role: 'CEO & FOUNDER',
    bio: 'Leads global product benchmarks, company vision, and scaling initiatives across enterprise segments.',
    image: founderImg,
    hoverImage: founderSeriousImg, 
    location: 'JAIPUR RAJASTHAN, INDIA',
    flag: '',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/narendra-singh-choudhary-135a97418/',
    email: 'mailto:nnarendra695@gmail.com',
    youtube: 'https://youtube.com',
    twitter: 'https://x.com',
    instagram: 'https://www.instagram.com/aaryankumarswain'
  }
]

const developers: ProfileMember[] = [
  {
    id: 'aryan',
    name: 'ARYAN KUMAR SWAIN',
    role: 'FULL STACK DEVELOPER',
    bio: 'Develops robust frontend interfaces and scalable backend systems. Specialized in React, Node.js, and compiler logic.',
    image: aryan1,
    hoverImage: aryan2,
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/aryan-ks/',
    github: 'https://github.com/AryanKumarSwain',
    twitter: 'https://x.com/Aryannn_KS',
    instagram: 'https://www.instagram.com/aaryankumarswain'
  },
  {
    id: 'pranav',
    name: 'PRANAV KUMAR SWAIN',
    role: 'FULL STACK DEVELOPER',
    bio: 'Crafts responsive UI modules with fine-tuned interactive designs. Focused on app speeds and modular architecture.',
    image: pranav1,
    hoverImage: pranav2,
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/pranav-kumar-swain?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    github: ' https://share.google/sVbf9n3YHbstO82w8',
    twitter: 'https://x.com/PrnvSwain',
    instagram: 'https://www.instagram.com/pranavkumarswain?igsh=bTlpd2E5ZXFnZGVr'
  },
  {
    id: 'dev',
    name: 'DURGESH SHARMA ',
    role: 'FULL STACK DEVELOPER',
    bio: 'Architects database schemas, secure RESTful API nodes, and optimized real-time synchronization hooks.',
    image: dev1,
    hoverImage: dev1,
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/durgesh-sharma-508762339/',
    github: 'https://github.com/Durgesh-sharma9',
    twitter: 'https://x.com/Dev_sharma_ai',
    instagram: 'https://www.instagram.com/dev998889?igsh=aDhjd2FqeWlveHRr'
  },
  {
    id: 'dev',
    name: 'DURGESH SHARMA ',
    role: 'FULL STACK DEVELOPER',
    bio: 'Architects database schemas, secure RESTful API nodes, and optimized real-time synchronization hooks.',
    image: dev1,
    hoverImage: dev1,
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/durgesh-sharma-508762339/',
    github: 'https://github.com/Durgesh-sharma9',
    twitter: 'https://x.com/Dev_sharma_ai',
    instagram: 'https://www.instagram.com/dev998889?igsh=aDhjd2FqeWlveHRr'
  },
  {
    id: 'dev',
    name: 'DURGESH SHARMA ',
    role: 'FULL STACK DEVELOPER',
    bio: 'Architects database schemas, secure RESTful API nodes, and optimized real-time synchronization hooks.',
    image: dev1,
    hoverImage: dev1,
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/durgesh-sharma-508762339/',
    github: 'https://github.com/Durgesh-sharma9',
    twitter: 'https://x.com/Dev_sharma_ai',
    instagram: 'https://www.instagram.com/dev998889?igsh=aDhjd2FqeWlveHRr'
  }
]

function CollectibleCard({ member, themeIndex, isFounder }: { member: ProfileMember; themeIndex: number; isFounder: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const theme = themeGradients[themeIndex % themeGradients.length]

  // Conditional sizing for 4-grid layout (making devs slightly smaller)
  const cardHeight = isFounder ? 'h-[450px]' : 'h-[380px]'
  const imgHeight = isFounder ? 'h-[320px]' : 'h-[270px]'

  return (
    <Link 
      to={`/people/${member.id}`} 
      className="relative block pt-10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-full ${cardHeight} bg-white rounded-xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col relative overflow-visible select-none z-20 transition-all duration-300 group-hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]`}>
        
        {/* UPPER AVATAR BOX LAYER */}
        <div className={`h-[62%] w-full ${theme.bg} relative shrink-0 overflow-visible rounded-t-lg`}>
          
          {/* MASK CONTROL */}
          <div className="absolute inset-x-0 bottom-0 top-[-140px] overflow-x-hidden overflow-y-visible rounded-t-lg pointer-events-none">
            <motion.img
              src={isHovered ? member.hoverImage : member.image}
              alt={member.name}
              animate={{ 
                y: 0, 
                scale: isHovered ? 1.15 : 1 
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] ${imgHeight} object-cover object-top origin-bottom`}
            />
          </div>

          {/* DYNAMIC ICONS & TOOLTIPS */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            <div className="relative group/tooltip">
              <div className="w-7 h-7 rounded-md bg-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center text-xs cursor-help">
                {isFounder ? '👑' : '🍕'}
              </div>
              <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-md whitespace-nowrap z-50 border border-slate-700 shadow-xl font-mono uppercase tracking-wide">
                {isFounder ? 'Founder & Vision Leader' : 'Powered by coffee, pizza and code'}
              </div>
            </div>
            <div className="relative group/tooltip">
              <div className="w-7 h-7 rounded-md bg-white border border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center text-xs cursor-help">
                {isFounder ? '🎂' : '⚙️'}
              </div>
              <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-md whitespace-nowrap z-50 border border-slate-700 shadow-xl font-mono uppercase tracking-wide">
                {isFounder ? 'Building products that solve real problems' : 'Building and improving products daily'}
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SWAPPING CONTROL CONTAINER TRACK */}
        <div className="relative flex-1 bg-white overflow-hidden rounded-b-xl border-t-2 border-slate-900">
          
          {/* PANEL A: DEFAULT BASE DATA SPEC VIEW */}
          <motion.div
            animate={{ y: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute inset-0 p-4 flex flex-col justify-between bg-white z-10 pb-12"
          >
            <div className="text-center space-y-1">
              <h3 className={`${isFounder ? 'text-2xl' : 'text-xl'} font-black text-slate-900 tracking-tight uppercase font-mono leading-none`}>
                {member.name}
              </h3>
              <p className="text-[10px] sm:text-xs font-extrabold text-slate-500 tracking-wider uppercase">
                {member.role}
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black text-slate-800 tracking-wide uppercase font-mono">
              <span>{member.flag}</span>
              <span>{member.location}</span>
            </div>
          </motion.div>

          {/* PANEL B: BRIEF EXTRA DETAILS SLIDEOVER */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: isHovered ? '0%' : '100%' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute inset-0 p-4 bg-slate-950 text-white z-20 flex flex-col justify-start pb-14 text-left"
          >
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-1">Brief Spectrum</h4>
            <p className="text-[11px] text-slate-200 font-medium leading-relaxed font-sans line-clamp-4">
              {member.bio}
            </p>
          </motion.div>

          {/* BOTTOM ATTACHED PERMANENT ACCENT BANNER STRIP BAR */}
          <div className={`absolute bottom-0 left-0 right-0 h-11 ${theme.bannerBg} border-t-2 border-slate-900 flex items-center justify-between px-4 rounded-b-lg z-30`}>
            
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.span
                  key="team-label"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-white text-xs font-black tracking-widest uppercase font-mono"
                >
                  {member.team}
                </motion.span>
              ) : (
                <motion.div
                  key="social-icons"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-3 text-white"
                  onClick={(e) => e.stopPropagation()} 
                >
                  {isFounder ? (
                    <>
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg></a>}
                      {member.email && <a href={member.email} className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>}
                      {member.youtube && <a href={member.youtube} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>}
                      {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>}
                    </>
                  ) : (
                    <>
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg></a>}
                      {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.50-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg></a>}
                      {member.instagram && <a href={member.instagram} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m11.15 2c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg></a>}
                      {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors"><svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-lg text-white translate-y-[-2px]">☕</div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function About() {
  return (
    <div className="min-h-screen bg-[#ebebeb] text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b-2 border-slate-900 pt-20 pb-[25px] bg-[#f4f4f4]">
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-4"
          >
            <span className="inline-flex items-center rounded-md bg-white border-2 border-slate-900 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              Web n Code Technologies Spectrum
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase font-mono">
              Engineering SaaS That{' '}
              <span className="bg-[#ffa07a] px-3 py-1 inline-block border-2 border-slate-900 rounded-lg transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mt-2 lg:mt-0">
                Solves Real Problems
              </span>
            </h1>
            <p className="text-md sm:text-lg leading-relaxed text-slate-700 font-bold max-w-3xl mx-auto pt-2 uppercase tracking-wide">
              We engineer custom modular infrastructure and dedicated multi-tenant cloud pipelines that help schools, academies, and enterprise segments automate workflows.
            </p>
          </motion.div>

          {/* Company Stats (60px gap from text) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-[60px] grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              { label: 'Products Built', value: '12+', color: 'bg-[#7dd3fc]' },
              { label: 'Organizations Served', value: '100+', color: 'bg-[#c084fc]' },
              { label: 'Support System', value: '24/7/365', color: 'bg-[#6ee7b7]' },
              { label: 'Client Retention', value: '99%', color: 'bg-[#fda4af]' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border-2 border-slate-900 ${stat.color} p-5 text-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]`}>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter font-mono">
                  {stat.value}
                </div>
                <div className="mt-2 text-[10px] font-black text-slate-800 uppercase tracking-widest border-t border-slate-900/30 pt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. COMPREHENSIVE TEAM SHOWCASE GRIDS */}
      <section className="pt-[25px] pb-[30px] bg-[#ebebeb] border-b-2 border-slate-900 overflow-visible">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-0 space-y-2"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono uppercase">Meet The Team</h2>
            <p className="text-xs text-slate-600 font-black uppercase tracking-widest">
              The engineers building Web n Code Technologies
            </p>
          </motion.div>

          {/* Founders Row */}
          <div className="mb-[20px] overflow-visible">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-12 max-w-6xl mx-auto items-end overflow-visible relative">
              
              {/* Left Side: CEO Card */}
              <div className="md:col-span-4 relative z-30">
                {founders.map((member, i) => (
                  <CollectibleCard key={member.id} member={member} themeIndex={i} isFounder={true} />
                ))}
              </div>

              {/* Right Side: Details Box */}
              <div className="md:col-span-8 relative z-20 overflow-visible">
                <div className="w-full md:h-[400px] h-auto bg-slate-950 text-white rounded-xl border-2 border-slate-900 p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] font-mono relative overflow-visible">
                  
                  <div className="absolute top-[60px] left-[-14px] w-0 h-0 border-t-[14px] border-t-transparent border-r-[14px] border-r-slate-900 border-b-[14px] border-b-transparent hidden md:block z-40">
                    <div className="absolute top-[-12px] left-[2px] w-0 h-0 border-t-[12px] border-t-transparent border-r-[12px] border-r-slate-950 border-b-[12px] border-b-transparent" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                      <span className="text-[10px] sm:text-xs text-orange-400 font-bold tracking-widest uppercase">CEO & FOUNDER PROFILE</span>
                      <span className="text-[10px] sm:text-xs bg-slate-900 px-3 py-1 rounded-md border border-slate-800 text-slate-400">ROLE // HEAD OF PRODUCT</span>
                    </div>
                    
                    <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Narendra Singh Choudhary</h4>
                    
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                     Narendra Singh Choudhary is the founder of Web n Code Technologies and leads the vision behind the company's SaaS products. With a strong focus on solving real-world challenges faced by schools, academies, and organizations, he is dedicated to building practical, user-friendly, and scalable software solutions. His goal is to make technology simple, accessible, and impactful for institutions across India.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-[10px] sm:text-xs">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <span className="text-slate-500 block mb-1 font-bold">CORE DIRECTIVE</span>
                        <span className="text-orange-300 font-extrabold">Web n Code Technologies</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <span className="text-slate-500 block mb-1 font-bold">ECOSYSTEM OPS</span>
                        <span className="text-slate-200 font-extrabold">Institutional Tech</span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]">
                        <span className="text-slate-500 block mb-1 font-bold">SUPPORT PIPELINES</span>
                        <span className="text-slate-200 font-extrabold">24/7 Redundant SLA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-6 md:mt-auto relative z-10">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>DIRECTORATE STATUS:</span>
                      <span className="text-emerald-400 font-black">ONLINE & ACTIVE</span>
                    </div>
                    <div className="text-xl">💼</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* NEW: DEVELOPERS SECTION HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-[40px] pt-12 space-y-4"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono uppercase inline-block bg-[#fda4af] px-5 py-2 rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              Our Developers & Team Members
            </h3>
            <p className="text-xs text-slate-600 font-black uppercase tracking-widest block">
              The engineers, designers and innovators behind Web N Code Technologies.
            </p>
          </motion.div>

          {/* Developers Row (UPDATED TO 4 COLUMNS ON DESKTOP) */}
          <div>
            <div className="grid gap-x-6 gap-y-12 sm:gap-y-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
              {developers.map((member, i) => (
                <CollectibleCard key={member.id} member={member} themeIndex={founders.length + i} isFounder={false} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY / CORE VECTOR */}
      <section className="pt-[30px] pb-[40px] bg-white border-b-2 border-slate-900">
        <div className="container mx-auto px-4 max-w-7xl grid gap-8 lg:gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl font-mono uppercase bg-[#7dd3fc] inline-block px-4 py-1 rounded-md border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">Our Core Vector</h2>
            <div className="mt-4 space-y-4 text-sm font-bold leading-relaxed text-slate-700 uppercase tracking-wide">
              <p>
                <strong className="text-slate-900 underline decoration-wavy decoration-[#ff6c4a]">Web n Code Technologies</strong> was founded with a non-negotiable objective: compile clean custom software products that resolve enterprise architecture gaps for institutes pan-India.
              </p>
              <p>
                Operating out of our technical command base in <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-900">Jaipur (Rajasthan)</span>, we map complex operational logics into production-ready platforms.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border-2 border-slate-900 bg-[#ebebeb] p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              {[
                { label: 'Company Founded', value: '2026' },
                { label: 'Team Size', value: '10+' },
                { label: 'Software Platforms', value: '12+' },
                { label: 'Institutions Served', value: '100+' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-white border-2 border-slate-900 p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM VALUES */}
      <section className="py-[40px] bg-white border-b-2 border-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div className="text-center mb-8 lg:mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono uppercase">System Values</h2>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Innovation', description: 'Building practical software solutions that solve real business challenges.', color: 'bg-[#ffa07a]' },
              { title: 'Quality Matrix', description: 'Developing clean, scalable, and maintainable products built for long-term growth.', color: 'bg-[#7dd3fc]' },
              { title: 'Reliability', description: 'Delivering dependable platforms that organizations can trust every day.', color: 'bg-[#6ee7b7]' },
              { title: 'Strategic Growth', description: 'Helping institutions scale operations through smart automation and technology.', color: 'bg-[#fda4af]' },
            ].map((value) => (
              <div key={value.title} className={`border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${value.color} transition-all`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white border-2 border-slate-900 text-slate-900 mb-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <CheckIcon className="h-5 w-5 stroke-[3]" />
                </div>
                <h3 className="text-md font-black text-slate-900 font-mono uppercase mb-2">{value.title}</h3>
                <p className="text-[11px] text-slate-800 font-bold uppercase tracking-wide leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY WE STARTED */}
      <section className="py-[40px] bg-[#f4f4f4]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono uppercase mb-5">Why We Started</h2>
          <div className="bg-white rounded-xl border-2 border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <p className="text-xs sm:text-sm text-slate-700 font-bold uppercase tracking-wide leading-relaxed">
             We started Web n Code Technologies with a simple mission: create software that solves real-world operational challenges.

By building practical SaaS products for schools, academies, and organizations, we help teams automate routine tasks, improve efficiency, and manage their operations with confidence.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}