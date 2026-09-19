import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import SectionHeading from '../ui/SectionHeading'
import { updates as fallbackUpdates, formatDate, type Update } from '../../data/updates'
import { ArrowRightIcon } from '../ui/Icons'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Strict Neo-brutalist solid tone tracking cards mapping
const categoryColors: Record<string, string> = {
  Product: 'bg-[#93c5fd] text-slate-900 border border-slate-900',
  Company: 'bg-[#c084fc] text-slate-900 border border-slate-900',
  Careers: 'bg-[#86efac] text-slate-900 border border-slate-900',
}

export default function LatestUpdates() {
  const [featured, setFeatured] = useState<Update[]>(() =>
    fallbackUpdates.filter((u) => u.featured).slice(0, 3)
  )

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/updates?featured=true`)
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: Update[] = res.data.data.slice(0, 3).map((u: any) => ({
            id: u._id || u.id || u.slug,
            slug: u.slug,
            title: u.title,
            excerpt: u.excerpt,
            content: u.content,
            date: u.date,
            category: u.category,
            featured: u.featured,
          }))
          setFeatured(mapped)
        }
      } catch (err) {
        console.warn('Could not load dynamic featured updates, using static fallback:', err)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="What's New"
          title="Latest Updates"
          description="Product releases, company milestones, and opportunities from Web n Code Technologies."
        />
        
        {/* News Feed Grid Blocks Wrapper */}
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          {featured.map((update, i) => (
            <motion.article
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded px-2.5 py-0.5 text-[9px] font-black uppercase font-mono tracking-wider ${categoryColors[update.category]}`}>
                    {update.category}
                  </span>
                  <time className="text-[10px] font-black uppercase font-mono text-slate-500">{formatDate(update.date)}</time>
                </div>
                
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {update.title}
                </h3>
                
                <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700 line-clamp-3">
                  {update.excerpt}
                </p>
              </div>

              {/* Action Trigger Block Link */}
              <div className="mt-5 pt-3 border-t border-slate-900/10">
                <Link
                  to="/updates"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase font-mono tracking-wider text-slate-900 group-hover:bg-[#ff9e7d] border border-transparent group-hover:border-slate-900 px-2 py-1 transition-all"
                >
                  <span>Read More</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}