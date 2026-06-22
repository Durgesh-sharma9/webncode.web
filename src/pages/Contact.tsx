import { useState, type FormEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { showSuccessToast, showErrorToast } from '../components/ui/Toast'

const companyData = {
  email: 'wnc@gmail.com',
  phone: '8619574703',
  address: 'Mahapura Road, Bhankrota, Ajmer Road, Jaipur, Rajasthan 302026, India',
  social: {
    linkedin: '#',
    twitter: '#',
    facebook: '#',
    instagram: '#'
  }
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  }
  if (p.includes('facebook')) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
      </svg>
    )
  }
  if (p.includes('instagram')) {
    return (
      <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" h="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  }
  return <span className="font-black text-xs">{platform.slice(0, 2).toUpperCase()}</span>
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post('http://localhost:5000/api/contact', formData)
      showSuccessToast('Message sent successfully!')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send message.'
      showErrorToast(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative selection:bg-[#ff9e7d]">
      
      {/* Background Micro Grid Pattern Asset */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Hero Header Section */}
      <section className="relative pt-16 pb-12 bg-[#ebebeb] border-b-2 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-left relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#000]">
              CONTACT SYSTEM
            </span>
            
            <h1 className="mt-5 text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-900 leading-none">
              LET'S START A <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-0.5 shadow-[4px_4px_0px_0px_#000]">
                CONVERSATION
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm sm:text-base text-slate-700 font-bold uppercase tracking-wide">
              Have questions about our products? Want to schedule a demo? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Content Layout */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-8 lg:grid-cols-5 items-stretch">
          
          {/* Left Side: Form Container */}
          <div className="lg:col-span-3 flex flex-col justify-stretch">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-900 p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between h-full">
              
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-6 border-b-2 border-slate-900 pb-2 inline-block font-mono">
                  Send us a message
                </h2>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider font-mono text-slate-500">Name</label>
                    <input
                      id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-slate-900 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                      placeholder="YOUR FULL NAME"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider font-mono text-slate-500">Email Address</label>
                    <input
                      id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange}
                      className="w-full rounded-md border-2 border-slate-900 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                      placeholder="YOU@ORGANIZATION.COM"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider font-mono text-slate-500">Phone Number</label>
                  <input
                    id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                    className="w-full rounded-md border-2 border-slate-900 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    placeholder="8619574703"
                  />
                </div>

                <div className="mt-5 space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider font-mono text-slate-500">Your Message</label>
                  <textarea
                    id="message" name="message" required rows={4} value={formData.message} onChange={handleInputChange}
                    className="w-full resize-none rounded-md border-2 border-slate-900 bg-white px-4 py-3 text-sm text-slate-900 font-mono outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    placeholder="TELL US ABOUT YOUR REQUIREMENTS..."
                  />
                </div>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#86efac] text-slate-900 font-black uppercase font-mono tracking-wider px-8 py-3 rounded-md border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Company Info Columns */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-between">
            
            <div className="bg-white border-2 border-slate-900 p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 border-b-2 border-slate-900 pb-1 inline-block font-mono">
                  Company Details
                </h2>
                
                <div className="mt-6 space-y-6">
                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#93c5fd] text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                      <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400">Email</div>
                      <a href={`mailto:${companyData.email}`} className="mt-0.5 block font-black font-mono text-slate-800 hover:underline text-sm sm:text-base">{companyData.email}</a>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#c084fc] text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                      <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.58c0-1.017.822-1.839 1.839-1.839h3.113c.465 0 .89.262 1.09.683l1.375 2.91a1.033 1.033 0 0 1-.166 1.132L7.618 11.41a14.94 14.94 0 0 0 6.136 6.136l1.713-1.78a1.033 1.033 0 0 1 1.132-.166l2.91 1.375c.42.201.683.626.683 1.09v3.113c0 1.017-.822 1.839-1.839 1.839h-3.113a15.356 15.356 0 0 1-11.833-11.833V6.58z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400">Phone</div>
                      <a href={`tel:${companyData.phone}`} className="mt-0.5 block font-black font-mono text-slate-800 hover:underline text-sm sm:text-base">{companyData.phone}</a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#7dd3fc] text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                      <svg className="w-5 h-5 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400">HQ Address</div>
                      <p className="mt-1 text-xs sm:text-sm font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{companyData.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials Connection Row */}
              <div className="mt-6 border-t-2 border-slate-900/10 pt-5">
                <div className="text-[10px] font-black uppercase tracking-widest font-mono text-slate-400 mb-3">Follow Our Journey</div>
                <div className="flex gap-3">
                  {Object.entries(companyData.social).map(([platform, url]) => (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      className="flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-[#ff9e7d] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                    >
                      {getSocialIcon(platform)}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Hours Permanent Card Grid Block */}
            <div className="border-2 border-slate-900 bg-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden rounded-md">
              <h3 className="text-sm font-black uppercase font-mono tracking-wider text-white flex items-center gap-2">
                ⚡ Business Hours
              </h3>
              <div className="mt-4 text-xs font-mono uppercase tracking-wide text-slate-300 leading-relaxed space-y-2.5">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Monday – Friday</span> 
                  <span className="text-white font-black">9:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saturday</span> 
                  <span className="text-white font-black">10:00 AM – 2:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}