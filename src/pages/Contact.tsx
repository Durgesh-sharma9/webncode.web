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
      <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" h="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  }
  return <span className="font-bold text-sm">{platform.slice(0, 2).toUpperCase()}</span>
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
    console.log('Form submission started')
    setIsSubmitting(true)

    try {
      // Send form data to backend API
      console.log('Sending data to backend:', formData)
      const response = await axios.post('http://localhost:5000/api/contact', formData)
      console.log('Backend response:', response.data)

      // Show success toast
      showSuccessToast('Message sent successfully! We will get back to you soon.')
      console.log('Success toast shown')

      // Clear form fields (React state only - don't use form.reset() to avoid conflicts)
      setFormData({ name: '', email: '', phone: '', message: '' })
      console.log('Form state cleared')

    } catch (error: any) {
      // Show error toast
      console.error('Error submitting form:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.'
      showErrorToast(errorMessage)
    } finally {
      setIsSubmitting(false)
      console.log('Form submission completed, loading state reset')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden relative selection:bg-sky-100 selection:text-sky-900">
      
      {/* Soft Background Blobs matching Updates Page */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-sky-200/30 via-indigo-100/20 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/20 via-sky-100/30 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Header Section */}
      <section className="relative pt-16 pb-12 bg-white/40 backdrop-blur-md border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-left relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
              CONTACT
            </span>
            {/* Updates page ke matching pure linear text gradient color fix */}
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600">
                Let's start a conversation
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Have questions about our products? Want to schedule a demo? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Content Layout */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid gap-8 lg:grid-cols-5 items-stretch">
          
          {/* Left Side: Form */}
          <div className="lg:col-span-3 flex flex-col justify-stretch">
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-md relative flex flex-col justify-between h-full">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-t-3xl" />
              
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a message</h2>
                
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Name</label>
                    <input
                      id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                    <input
                      id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5"
                      placeholder="you@organization.com"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <input
                    id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5"
                    placeholder="8619574703"
                  />
                </div>

                <div className="mt-5 space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Your Message</label>
                  <textarea
                    id="message" name="message" required rows={4} value={formData.message} onChange={handleInputChange}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/5"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Company Details */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-between">
            
            <div className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-md flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Company Details</h2>
                
                <div className="mt-6 space-y-5">
                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                      <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</div>
                      <a href={`mailto:${companyData.email}`} className="mt-0.5 block font-semibold text-slate-700 hover:text-sky-600 text-sm sm:text-base">{companyData.email}</a>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.58c0-1.017.822-1.839 1.839-1.839h3.113c.465 0 .89.262 1.09.683l1.375 2.91a1.033 1.033 0 0 1-.166 1.132L7.618 11.41a14.94 14.94 0 0 0 6.136 6.136l1.713-1.78a1.033 1.033 0 0 1 1.132-.166l2.91 1.375c.42.201.683.626.683 1.09v3.113c0 1.017-.822 1.839-1.839 1.839h-3.113a15.356 15.356 0 0 1-11.833-11.833V6.58z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</div>
                      <a href={`tel:${companyData.phone}`} className="mt-0.5 block font-semibold text-slate-700 hover:text-indigo-600 text-sm sm:text-base">{companyData.phone}</a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                      <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">HQ Address</div>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">{companyData.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials Block */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Follow Our Journey</div>
                <div className="flex gap-2.5">
                  {Object.entries(companyData.social).map(([platform, url]) => (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-sky-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                    >
                      {getSocialIcon(platform)}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="rounded-3xl bg-slate-900 p-6 border border-slate-900 shadow-md relative overflow-hidden">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-sky-400">⏰</span> Business Hours
              </h3>
              <div className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2.5 font-medium">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Monday – Friday</span> 
                  <span className="text-white font-semibold">9:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saturday</span> 
                  <span className="text-white font-semibold">10:00 AM – 2:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}