import { motion } from 'framer-motion'

export default function DashboardShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative"
    >
      <div className="card-shadow-hover overflow-hidden rounded-2xl border border-border bg-white">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>
          <div className="mx-auto flex h-7 w-48 items-center justify-center rounded-md bg-white text-xs text-muted">
            app.webncode.com/dashboard
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-48 shrink-0 border-r border-border bg-navy p-4 sm:block">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary" />
              <div className="h-2.5 w-16 rounded bg-white/20" />
            </div>
            <div className="space-y-2">
              {['Dashboard', 'Students', 'Attendance', 'Results', 'Settings'].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    i === 0 ? 'bg-primary/20 text-white' : 'text-white/50'
                  }`}
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-primary-light' : 'bg-white/30'}`} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="h-3 w-32 rounded bg-navy/80" />
                <div className="mt-1.5 h-2 w-48 rounded bg-muted/30" />
              </div>
              <div className="h-8 w-24 rounded-lg bg-primary" />
            </div>

            {/* Stats row */}
            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: 'Students', value: '2,847', color: 'bg-primary' },
                { label: 'Attendance', value: '94.2%', color: 'bg-accent' },
                { label: 'Revenue', value: '₹12.4L', color: 'bg-primary-light' },
                { label: 'Pending', value: '23', color: 'bg-navy' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border p-3">
                  <div className={`mb-2 h-1 w-8 rounded ${stat.color}`} />
                  <div className="text-lg font-bold text-navy">{stat.value}</div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="grid gap-3 lg:grid-cols-5">
              <div className="rounded-xl border border-border p-4 lg:col-span-3">
                <div className="mb-3 h-2.5 w-28 rounded bg-navy/60" />
                <div className="flex h-28 items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-primary/20 transition-colors hover:bg-primary/40"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border p-4 lg:col-span-2">
                <div className="mb-3 h-2.5 w-24 rounded bg-navy/60" />
                <div className="space-y-2.5">
                  {['Class 10-A', 'Class 9-B', 'Class 8-C', 'Class 7-A'].map((cls, i) => (
                    <div key={cls} className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-surface">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${85 - i * 12}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted">{cls}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 card-shadow rounded-xl border border-border bg-white p-4 sm:-left-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <div className="h-4 w-4 rounded-full bg-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold text-navy">Attendance Recorded</div>
            <div className="text-xs text-muted">2,814 students · Just now</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
