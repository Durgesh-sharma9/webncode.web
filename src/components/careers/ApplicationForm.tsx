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
    employmentType: job.type,
    experience: '',
    currentCompany: '',
    currentRole: '',
    noticePeriod: '',
    // Section 4
    builtProduct: '',
    projectLinks: '',
    whyJoin: '',
    // Section 5 (Internship)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-2 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_#000]"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-6 mb-8">
        <div>
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/60 hover:text-black transition-colors"
          >
            ← Back to Jobs
          </button>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black">
            Apply for <span className="text-[#ff9e7d]">{job.title}</span>
          </h2>
        </div>
        <div className="bg-[#93c5fd] border-2 border-black px-4 py-2 font-black uppercase shadow-[2px_2px_0px_0px_#000]">
          {job.type}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">1. Personal Details</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Full Name *</label>
              <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Mobile Number *</label>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">City *</label>
              <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">State *</label>
              <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Gender *</label>
              <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none bg-white appearance-none cursor-pointer">
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
          <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">2. Professional Links</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">LinkedIn Profile</label>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">GitHub Profile</label>
              <input type="url" name="github" value={formData.github} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Portfolio Website</label>
              <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* SECTION 3: Career Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">3. Career Details</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Position Applying For</label>
              <input type="text" readOnly value={formData.position} className="w-full border-2 border-black bg-black/5 p-2.5 text-black/70 cursor-not-allowed font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Employment Type</label>
              <input type="text" readOnly value={formData.employmentType} className="w-full border-2 border-black bg-black/5 p-2.5 text-black/70 cursor-not-allowed font-bold" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Experience *</label>
              <select required name="experience" value={formData.experience} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none bg-white appearance-none cursor-pointer">
                <option value="">Select Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 Years">0-1 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Notice Period *</label>
              <select required name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none bg-white appearance-none cursor-pointer">
                <option value="">Select Notice Period</option>
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Current Company (Optional)</label>
              <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Current Role (Optional)</label>
              <input type="text" name="currentRole" value={formData.currentRole} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 4: Product Builder Questions */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">4. Product Builder Questions</h3>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Have you built a software product before? *</label>
              <select required name="builtProduct" value={formData.builtProduct} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none bg-white appearance-none cursor-pointer">
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Currently Building One">Currently Building One</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Project / Product Links (If any)</label>
              <textarea name="projectLinks" rows={2} value={formData.projectLinks} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none resize-none" placeholder="Paste links to live projects or repos..." />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black/70">Why do you want to join Web n Code? *</label>
              <textarea required name="whyJoin" rows={3} value={formData.whyJoin} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* SECTION 5: Internship Fields (Conditional) */}
        {job.type === 'Internship' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">5. Internship Details</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black/70">College Name *</label>
                <input required type="text" name="college" value={formData.college} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black/70">Course *</label>
                <input required type="text" name="course" value={formData.course} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black/70">Current Year *</label>
                <input required type="text" name="currentYear" value={formData.currentYear} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-black/70">Graduation Year *</label>
                <input required type="text" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} className="w-full border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: Resume */}
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase border-b-2 border-black/10 pb-2 inline-block text-black">{job.type === 'Internship' ? '6' : '5'}. Resume</h3>
          <div className="border-2 border-dashed border-black bg-[#fafafa] p-8 text-center cursor-pointer hover:bg-black/5 transition-colors relative group" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.resumeName ? (
              <div>
                <span className="block font-black text-black">{formData.resumeName}</span>
                <span className="text-xs font-bold text-black/60 uppercase tracking-wider mt-2 block group-hover:text-black transition-colors">Click to change file</span>
              </div>
            ) : (
              <div>
                <span className="block font-black text-black">UPLOAD RESUME (PDF)</span>
                <span className="text-xs font-bold text-black/60 uppercase tracking-wider mt-2 block">Max file size: 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 7: Declaration */}
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3 p-4 border-2 border-black bg-[#fafafa]">
            <input 
              required 
              type="checkbox" 
              name="declaration" 
              id="declaration"
              checked={formData.declaration} 
              onChange={handleInputChange} 
              className="mt-1 h-5 w-5 border-2 border-black accent-[#c084fc] cursor-pointer"
            />
            <label htmlFor="declaration" className="text-sm font-bold text-black cursor-pointer leading-tight">
              I confirm that the information provided is accurate.
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t-2 border-black/10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#c084fc] text-black font-black uppercase tracking-wider px-10 py-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
