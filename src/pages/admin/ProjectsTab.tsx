import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type ProjectItem, API_BASE } from './types'

const CATEGORY_COLORS: Record<string, string> = {
  Education:  'bg-blue-200 border-blue-700 text-blue-900',
  Sports:     'bg-orange-200 border-orange-700 text-orange-900',
  HR:         'bg-purple-200 border-purple-700 text-purple-900',
  Services:   'bg-emerald-200 border-emerald-700 text-emerald-900',
  Analytics:  'bg-pink-200 border-pink-700 text-pink-900',
  Operations: 'bg-amber-200 border-amber-700 text-amber-900',
}

const getCatColor = (cat: string) =>
  CATEGORY_COLORS[cat] ?? 'bg-slate-200 border-slate-700 text-slate-900'

export default function ProjectsTab() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [projectSearch, setProjectSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true)
      const res = await axios.get(`${API_BASE}/api/projects`)
      if (res.data?.success && Array.isArray(res.data.data)) {
        setProjects(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to load projects:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch projects list')
    } finally {
      setIsLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleToggleFeatured = async (proj: ProjectItem) => {
    try {
      const next = !proj.isFeatured
      const res = await axios.patch(
        `${API_BASE}/api/projects/${proj._id}/feature`,
        { isFeatured: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        showSuccessToast(
          next
            ? `"${proj.title}" is now featured in the Homepage Hero window!`
            : `"${proj.title}" removed from Homepage Hero window`
        )
        setProjects((prev) =>
          prev.map((p) => (p._id === proj._id ? { ...p, isFeatured: next } : p))
        )
      }
    } catch (err) {
      console.error('Failed to toggle featured project:', err)
      showErrorToast('Failed to toggle feature status')
    }
  }

  const handleDeleteProject = async (id: string, projTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${projTitle}"?`)) {
      return
    }
    try {
      const res = await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Project deleted successfully')
        setProjects((prev) => prev.filter((p) => p._id !== id))
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete project')
    }
  }

  // Derive unique categories from loaded projects
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category))).sort()]

  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase()
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchFeatured = !featuredOnly || p.isFeatured
    return matchSearch && matchCategory && matchFeatured
  })

  const featuredCount = projects.filter((p) => p.isFeatured).length

  return (
    <div className="space-y-4 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <span className="px-2.5 py-0.5 bg-[#86efac] border-2 border-slate-900 rounded text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
            PORTFOLIO DIRECTORY
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 mt-1">
            Projects &amp; Products ({projects.length})
          </h2>
          <p className="text-xs text-slate-600 font-bold">
            Manage your SaaS products, live demos, and feature items in the Homepage 3D window
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchProjects}
            disabled={isLoadingProjects}
            className="px-3 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg transition-all shadow-[2px_2px_0px_0px_#000]"
          >
            🔄
          </button>
          <Link
            to="/admin/projects/new"
            className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-950 text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <span>+</span>
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Search + Featured Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
        <div className="relative flex-1">
          <input
            type="text"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search by title, category, features..."
            className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          {projectSearch && (
            <button
              onClick={() => setProjectSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setFeaturedOnly((f) => !f)}
          className={`px-3 py-2 border-2 border-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            featuredOnly
              ? 'bg-amber-300 hover:bg-amber-400 text-slate-900'
              : 'bg-white hover:bg-amber-50 text-slate-700'
          }`}
        >
          ⭐ Hero Showcase {featuredOnly ? `(${featuredCount})` : ''}
        </button>

        <div className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
          {filteredProjects.length} / {projects.length} shown
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 border-2 border-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#6366f1]'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                {cat}
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                    isActive ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Projects Grid */}
      {isLoadingProjects ? (
        <div className="py-14 text-center text-slate-600 text-xs font-bold">
          Loading portfolio projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="text-3xl mb-2">📁</div>
          <h3 className="text-sm font-black text-slate-900 uppercase">No Projects Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold mb-4">
            {projectSearch || activeCategory !== 'All' || featuredOnly
              ? 'No projects match your current filters.'
              : 'Add your first SaaS software or client solution!'}
          </p>
          {!projectSearch && activeCategory === 'All' && !featuredOnly && (
            <Link
              to="/admin/projects/new"
              className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000] inline-block"
            >
              + Create First Project
            </Link>
          )}
          {(projectSearch || activeCategory !== 'All' || featuredOnly) && (
            <button
              onClick={() => { setProjectSearch(''); setActiveCategory('All'); setFeaturedOnly(false) }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id}
              className="bg-white border-2 border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
            >
              <div>
                {/* Project Screenshot Banner */}
                {proj.images && proj.images.length > 0 ? (
                  <div className="w-full h-36 mb-3 rounded-lg overflow-hidden border-2 border-slate-900 bg-slate-100">
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 mb-3 rounded-lg border-2 border-slate-900 bg-amber-50 flex items-center justify-center text-xs font-bold text-slate-500">
                    No Screenshot
                  </div>
                )}

                {/* Category & Hero Showcase Tag */}
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`px-2 py-0.5 border-2 text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000] ${getCatColor(proj.category)}`}>
                      {proj.category}
                    </span>
                    {proj.isFeatured && (
                      <span className="px-2 py-0.5 bg-amber-300 border-2 border-slate-900 text-slate-950 text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1">
                        <span>🌟</span> Hero
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1 mb-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {proj.shortDescription}
                </p>

                {/* Features list */}
                {proj.features && proj.features.length > 0 && (
                  <div className="space-y-1 mb-3">
                    {proj.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <span className="text-emerald-600 font-black">✓</span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                    {proj.features.length > 2 && (
                      <div className="text-[10px] text-slate-400 font-bold">
                        +{proj.features.length - 2} more features
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-3 border-t-2 border-slate-900/15 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/products/${proj.slug}`}
                    target="_blank"
                    className="text-xs font-black text-blue-700 hover:underline"
                  >
                    View ↗
                  </Link>
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-emerald-700 hover:underline"
                    >
                      Demo ↗
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(proj)}
                    className={`px-2.5 py-1.5 border-2 border-slate-900 text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer transition-all ${
                      proj.isFeatured
                        ? 'bg-amber-300 hover:bg-amber-400 text-slate-950'
                        : 'bg-white hover:bg-amber-50 text-slate-700'
                    }`}
                    title="Toggle whether this product appears in the Homepage Hero Browser Window"
                  >
                    {proj.isFeatured ? '⭐ In Hero' : '☆ Hero'}
                  </button>

                  <button
                    onClick={() => navigate(`/admin/projects/edit/${proj._id}`)}
                    className="px-3 py-1.5 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDeleteProject(proj._id, proj.title)}
                    className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 border-2 border-rose-600 text-rose-900 text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
