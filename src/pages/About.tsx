import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckIcon, MapPinIcon, MailIcon, PhoneIcon, ClockIcon } from '../components/ui/Icons'

// TEAM DATA STUDS
const founders = [
  {
    name: 'Founder & CEO',
    role: 'Vision & Growth Strategy',
    description: 'Leads company vision, client relationships, product planning, and business growth initiatives.',
    avatar: '👤',
    linkedin: 'https://linkedin.com/in/username',
    email: 'mailto:founder@webncode.com',
    youtube: 'https://youtube.com/@channel',
    twitter: 'https://x.com/username'
  },
  {
    name: 'Co-Founder & CTO',
    role: 'Architecture & Scalability',
    description: 'Responsible for software architecture, backend systems, scalability, security, and technical leadership.',
    avatar: '👤',
    linkedin: 'https://linkedin.com/in/username',
    email: 'mailto:cto@webncode.com',
    youtube: 'https://youtube.com/@channel',
    twitter: 'https://x.com/username'
  }
]

const developers = [
  {
    name: 'Bhawana Sharma',
    role: 'Full Stack Developer',
    description: 'Develops robust frontend interfaces and scalable backend systems. Specialized in React, Node.js, and implementing optimized product features.',
    avatar: '💻',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username',
    twitter: 'https://x.com/username',
    instagram: 'https://instagram.com/username'
  },
  {
    name: 'Rahul Verma',
    role: 'Frontend Developer',
    description: 'Crafts highly responsive web applications with fine-tuned interactive designs. Focuses on performance, modular UI kits, and user experience.',
    avatar: '🎨',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username',
    twitter: 'https://x.com/username',
    instagram: 'https://instagram.com/username'
  },
  {
    name: 'Amit Patel',
    role: 'Backend Developer',
    description: 'Architects database schemes, manages secure SaaS microservices, and designs system integrations. Expert in RESTful APIs and server logic.',
    avatar: '⚙️',
    linkedin: 'https://linkedin.com/in/username',
    github: 'https://github.com/username',
    twitter: 'https://x.com/username',
    instagram: 'https://instagram.com/username'
  }
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#eef5ff] text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200/50 py-16 lg:py-24">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 via-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm">
              About Web n Code Technologies
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Building Software That{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                Solves Real Problems
              </span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-slate-600 font-normal max-w-3xl mx-auto">
              Web n Code Technologies develops SaaS products and custom software solutions that help schools, sports academies, businesses, and organizations streamline operations and grow efficiently.
            </p>
          </motion.div>

          {/* Company Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { label: 'Products Built', value: '12+' },
              { label: 'Organizations Served', value: '150+' },
              { label: 'Support', value: '24/7' },
              { label: 'Client Satisfaction', value: '99%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200/60 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="section-padding section-light">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="display-md gradient-text">Our Story</h2>
            <div className="mt-6 space-y-6 text-base leading-relaxed text-text-secondary">
              <p>
                <strong className="text-text-primary">Web n Code Technologies</strong> was founded with a clear mission: build world-class software products that solve real operational problems for schools, colleges, and organizations across India.
              </p>
              <p>
                Operating from our main product hub in <span className="font-semibold text-text-primary">Mahapura, Jaipur (Rajasthan)</span>, what started as a small team of passionate engineers has grown into a high-octane product powerhouse serving over 150 organizations. We don't build one-off projects—we engineer robust SaaS ecosystems.
              </p>
              <p>
                Today, our suite powers student management, automated examinations, smart timetabling, and AI-driven attendance—designed to work independently or as one unified platform.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/60 bg-card p-6 card-shadow sm:p-8">
              {[
                { label: 'Founded', value: '2020' },
                { label: 'Team Size', value: '3+' },
                { label: 'SaaS Products', value: '12+' },
                { label: 'Happy Clients', value: '150+' },
              ].map((item) => (
                <div key={item.label} className="group rounded-2xl bg-surface/50 p-5 text-center transition-all duration-300 hover:bg-primary/5">
                  <div className="text-3xl font-extrabold gradient-text transition-transform duration-300 group-hover:scale-105 sm:text-4xl">
                    {item.value}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE FOUNDERS */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Meet The Founders</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              The driving force behind Web n Code's architecture, vision, and growth engineering.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
            {founders.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />
                <div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center mb-1">{member.name}</h3>
                  <div className="text-xs font-bold text-blue-600 text-center uppercase tracking-wider mb-3">{member.role}</div>
                  <p className="text-sm text-slate-600 leading-relaxed text-center">{member.description}</p>
                </div>

                {/* Branded Social Icons */}
                <div className="mt-6 flex justify-center gap-4 border-t border-slate-100 pt-4">
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  </a>
                  <a href={member.email} className="text-slate-400 hover:text-red-500 transition-colors" title="Email">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </a>
                  <a href={member.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-600 transition-colors" title="YouTube">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href={member.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-black transition-colors" title="X (Twitter)">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET THE DEVELOPERS */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-t border-b border-slate-200/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Meet The Developers</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              The engineers building and improving our products every day.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {developers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500" />
                <div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center mb-1">{member.name}</h3>
                  <div className="text-xs font-bold text-blue-600 text-center uppercase tracking-wider mb-3">{member.role}</div>
                  <p className="text-sm text-slate-600 leading-relaxed text-center">{member.description}</p>
                </div>

                {/* Branded Social Icons */}
                <div className="mt-6 flex justify-center gap-4 border-t border-slate-100 pt-4">
                  <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="LinkedIn">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="GitHub">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
                  </a>
                  <a href={member.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-black transition-colors" title="X (Twitter)">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href={member.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors" title="Instagram">
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m11.15 2c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM VALUES */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Team Values</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Innovation', description: 'Building practical software solutions.' },
              { title: 'Quality', description: 'Clean, scalable, and maintainable code.' },
              { title: 'Reliability', description: 'Delivering products clients can trust.' },
              { title: 'Growth', description: 'Helping organizations improve through technology.' },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-4 group-hover:scale-110 transition-transform">
                  <CheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE STARTED */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Why We Started</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-8 lg:p-12 shadow-sm"
          >
            <p className="text-lg leading-relaxed text-slate-600 text-center">
              Web n Code Technologies was started with a simple goal: to build software that solves real operational problems. Instead of creating generic applications, we focus on practical SaaS products that help schools, sports academies, and businesses automate their daily work and improve efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Contact Information</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Get in touch with our team
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 lg:p-12 shadow-sm">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Web n Code Technologies</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MailIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Email</div>
                          <a href="mailto:contact@webncode.com" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                            contact@webncode.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <PhoneIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm text-slate-500">Phone</div>
                          <a href="tel:+91XXXXXXXXXX" className="text-slate-900 font-semibold hover:text-blue-600 transition-colors">
                            +91 XXXXX XXXXX
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-slate-600">
                        <p>Mahapura Road, Bhankrota,</p>
                        <p>Ajmer Road, Jaipur,</p>
                        <p>Rajasthan 302026, India</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Working Hours</h3>
                    <div className="flex items-start gap-3">
                      <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-slate-600">
                        <p>Mon - Sat</p>
                        <p>9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION MAP */}
      <section className="py-16 lg:py-20 bg-white/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Visit Our Office</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Come meet our team in person
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
              <div className="relative h-[400px] lg:h-[500px] bg-slate-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.6575987654321!2d75.7872!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ2LjYiTiA3NcKwNDcnMTMuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">Web n Code Technologies</div>
                      <div className="text-sm text-slate-600">Mahapura Road, Bhankrota, Ajmer Road, Jaipur, Rajasthan 302026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Ready to transform your organization with our software solutions? Get in touch with our team today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                Contact Us
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}