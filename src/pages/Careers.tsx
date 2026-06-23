import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { whyJoin, positions, benefits, type JobPosition } from '../data/careers'
import ApplicationForm from '../components/careers/ApplicationForm'

const typeColors: Record<string, string> = {
  'Full-time': 'bg-[#93c5fd] text-black border border-black',
  'Internship': 'bg-[#c084fc] text-black border border-black',
  'Contract': 'bg-[#fde047] text-black border border-black',
}

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null)

  return (
    <>
      {/* HERO SECTION - Neo-brutalist Style matching the screenshot */}
      <section className="relative overflow-hidden bg-[#fafafa] border-b-2 border-black py-16 md:py-24">
        {/* Dotted Grid Pattern Background effect matching image */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        <div className="container-wide relative px-5 md:px-8 lg:px-12 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Top Pill badge */}
            <span className="inline-flex items-center rounded-md border-2 border-black bg-white px-4 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000]">
              WEB N CODE TECHNOLOGIES SPECTRUM
            </span>
            
            {/* Main Neo-Brutalist Heading */}
            <h1 className="mt-6 text-4xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
              BUILD PRODUCTS THAT <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_#000]">
                SCALE & MATTER
              </span>
            </h1>
            
            {/* Description Subtext */}
            <p className="mt-8 text-base md:text-lg font-bold uppercase tracking-wide text-black/80 max-w-3xl leading-relaxed mx-auto">
              Join an elite team of engineers, designers, and system thinkers in Mahapura, Jaipur, building next-generation SaaS ecosystems used all over India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHY JOIN US SECTION */}
      <section className="py-16 bg-white border-b-2 border-black">
        <div className="container-wide px-5 md:px-8">
          <SectionHeading title="Why Join Us" description="More than just a standard workspace—a product sandbox designed to maximize human potential." />
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {whyJoin.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
              >
                {/* Numeric block style like the cards in image */}
                <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-[#c084fc] text-black font-black text-lg shadow-[2px_2px_0px_0px_#000]">
                  0{i + 1}
                </div>
                <h3 className="mt-5 text-xl font-black uppercase text-black">{item.title}</h3>
                <p className="mt-3 text-sm font-medium text-black/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS SECTION */}
      <section className="py-16 bg-[#fafafa] border-b-2 border-black">
        <div className="container-wide px-5 md:px-8">
          <SectionHeading title={selectedJob ? "Application Form" : "Open Positions"} description={selectedJob ? "Fill out the form below to apply. Show us what you can build." : "Explore job openings across various tech domains. Your next challenge is waiting."} />
          
          <div className="mt-12">
            <AnimatePresence mode="wait">
              {selectedJob ? (
                <ApplicationForm key="form" job={selectedJob} onBack={() => setSelectedJob(null)} />
              ) : (
                <motion.div key="list" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {positions.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                      className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all"
                    >
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3 max-w-3xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-black uppercase text-black">{job.title}</h3>
                            <span className={`rounded-md px-3 py-1 text-xs font-black uppercase ${typeColors[job.type] || 'bg-white text-black border border-black'}`}>
                              {job.type}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-xs font-black uppercase tracking-wider text-black/60">
                            <span>{job.department}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-black" />
                            <span className="text-black">{job.location}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-black" />
                            <span className="text-black font-bold">Exp: {job.experience}</span>
                          </div>
                          
                          <p className="mt-2 text-sm font-medium text-black/70 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        <div className="shrink-0 pt-2 lg:pt-0">
                          <button 
                            onClick={() => setSelectedJob(job)}
                            className="w-full lg:w-auto border-2 border-black px-6 py-3 bg-white text-black font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:bg-[#ff9e7d] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000] transition-all"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 bg-white border-b-2 border-black">
        <div className="container-wide px-5 md:px-8">
          <SectionHeading title="Benefits & Perks" description="We invest heavily in our team's mental health, technical stack setup, and holistic happiness." />
          
          <div className="mt-12 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-center gap-3.5 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-[#24/7/365 color template like green #86efac] bg-[#86efac] text-black">
                  <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-black uppercase tracking-tight text-black">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FOOTER SECTION */}
      <section className="relative overflow-hidden bg-[#ff9e7d] border-t-2 border-b-2 border-black py-20 text-center text-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
        
        <div className="container-wide relative px-5">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
            Ready to Build Your Legacy?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base md:text-lg font-bold uppercase tracking-wide text-black/80">
            Drop your resume, portfolio link, or GitHub handle. We don't care about paper certificates; we care about the clean code you build.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button to="/contact" size="lg" className="w-full sm:w-auto bg-white text-black font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#c084fc] transition-all">
              Upload Resume
            </Button>
            <span className="text-xs font-black uppercase tracking-wider border-2 border-black bg-white/50 px-3 py-1">
              Or mail us at hr@webncode.com
            </span>
          </div>
        </div>
      </section>
    </>
  )
}