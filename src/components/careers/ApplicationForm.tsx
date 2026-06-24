import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { showSuccessToast, showErrorToast } from '../ui/Toast'
import type { JobPosition } from '../../data/careers'

interface ApplicationFormProps {
  job: JobPosition
  onBack: () => void
}

export default function ApplicationForm({ job, onBack }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    // Section 1
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    state: '',
    gender: '',
    // Section 2
    linkedin: '',
    github: '',
    portfolio: '',
    // Section 3
    position: job.title,
    experience: '',
    currentCompany: '',
    currentRole: '',
    noticePeriod: '',
    // Section 4
    builtProduct: '',
    projectLinks: '',
    whyJoin: '',
    // Section 5 (Academic/Internship)
    college: '',
    course: '',
    currentYear: '',
    graduationYear: '',
    // Section 6
    resumeBase64: '',
    resumeName: '',
    // Section 7
    declaration: false,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('File size should not exceed 5MB')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Convert to Base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        resumeBase64: reader.result as string,
        resumeName: file.name
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.resumeBase64) {
      showErrorToast('Please upload your resume.')
      return
    }
    if (!formData.declaration) {
      showErrorToast('Please confirm the declaration.')
      return
    }

    setIsSubmitting(true)
    try {
      await axios.post('http://localhost:5000/api/careers', formData)
      showSuccessToast('Application submitted successfully! Check your email.')
      onBack()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit application.'
      showErrorToast(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Unified visual polish classes for all inputs (compact, slightly rounded, clean focus)
  const inputStyles = "w-full rounded-lg border-2 border-black bg-white py-2 px-3 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] focus:-translate-y-[1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] focus:ring-2 focus:ring-[#c084fc]/30"

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-white border-2 border-black p-5 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] rounded-xl"
    >
      {/* HEADER - Clean and Compact */}
      <div className="border-b-2 border-black/10 pb-5 mb-6">
        <button
          onClick={onBack}
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black/50 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </button>
        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-black">
          Apply for <span className="text-[#ff9e7d]">{job.title}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Personal Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            <h3 className="text-lg font-black uppercase text-black">1. Personal Details</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Full Name *</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Mobile Number *</label>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">City *</label>
              <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">State *</label>
              <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Gender *</label>
              <select required name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputStyles} appearance-none cursor-pointer`}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Professional Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <h3 className="text-lg font-black uppercase text-black">2. Professional Links</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">LinkedIn Profile</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className={inputStyles} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">GitHub Profile</label>
              <input type="url" name="github" value={formData.github} onChange={handleInputChange} className={inputStyles} placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Portfolio Website</label>
              <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className={inputStyles} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* SECTION 3: Career Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
            <h3 className="text-lg font-black uppercase text-black">3. Career Details</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Position Applying For</label>
              <input type="text" readOnly value={formData.position} className="w-full rounded-lg border-2 border-black bg-black/5 py-2 px-3 text-sm text-black/70 cursor-not-allowed font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Experience *</label>
              <select required name="experience" value={formData.experience} onChange={handleInputChange} className={`${inputStyles} appearance-none cursor-pointer`}>
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Notice Period *</label>
              <select required name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} className={`${inputStyles} appearance-none cursor-pointer`}>
                <option value="">Select Notice Period</option>
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Current Company (Optional)</label>
              <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Current Role (Optional)</label>
              <input type="text" name="currentRole" value={formData.currentRole} onChange={handleInputChange} className={inputStyles} />
            </div>
          </div>
        </div>

        {/* SECTION 4: Product Builder Questions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
            <h3 className="text-lg font-black uppercase text-black">4. Product Builder Questions</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Have you built a software product before? *</label>
              <select required name="builtProduct" value={formData.builtProduct} onChange={handleInputChange} className={`${inputStyles} appearance-none cursor-pointer`}>
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Currently Building One">Currently Building One</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Project / Product Links (If any)</label>
              <textarea name="projectLinks" rows={2} value={formData.projectLinks} onChange={handleInputChange} className={`${inputStyles} resize-none`} placeholder="Paste links to live projects or repos..." />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Why do you want to join Web n Code? *</label>
              <textarea required name="whyJoin" rows={3} value={formData.whyJoin} onChange={handleInputChange} className={`${inputStyles} resize-none`} />
            </div>
          </div>
        </div>

        {/* SECTION 5: Academic Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
            <h3 className="text-lg font-black uppercase text-black">5. Academic Details <span className="text-xs font-bold text-black/40 tracking-normal capitalize ml-1">(Optional)</span></h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">College Name</label>
              <input type="text" name="college" value={formData.college} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Course</label>
              <input type="text" name="course" value={formData.course} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Current Year</label>
              <input type="text" name="currentYear" value={formData.currentYear} onChange={handleInputChange} className={inputStyles} />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-black/70">Graduation Year</label>
              <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} className={inputStyles} />
            </div>
          </div>
        </div>

        {/* SECTION 6: Resume */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black/10 pb-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            <h3 className="text-lg font-black uppercase text-black">6. Resume</h3>
          </div>
          <div 
            className="rounded-xl border-2 border-dashed border-black/40 bg-black/[0.02] p-6 text-center cursor-pointer hover:bg-black/[0.04] hover:border-black transition-all flex flex-col items-center justify-center gap-2 group" 
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.resumeName ? (
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center mb-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <span className="block text-sm font-black text-black">{formData.resumeName}</span>
                <span className="text-[10px] font-bold text-black/50 uppercase tracking-wider mt-1 group-hover:text-black transition-colors">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <svg className="w-8 h-8 text-black/60 group-hover:text-black transition-colors mb-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                <span className="block text-sm font-black text-black">UPLOAD RESUME (PDF)</span>
                <span className="text-[10px] font-bold text-black/50 uppercase tracking-wider">Max file size: 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 7: Declaration Notice Card */}
        <div className="pt-2">
          <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-black bg-[#fefce8] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <input 
              required 
              type="checkbox" 
              name="declaration" 
              id="declaration"
              checked={formData.declaration} 
              onChange={handleInputChange} 
              className="h-5 w-5 border-2 border-black accent-[#c084fc] cursor-pointer rounded-sm"
            />
            <label htmlFor="declaration" className="text-sm font-bold text-black cursor-pointer leading-tight pt-0.5">
              I confirm that the information provided is accurate and authentic.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-xl bg-[#c084fc] text-black font-black uppercase tracking-wider px-10 py-3.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base flex justify-center items-center"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}