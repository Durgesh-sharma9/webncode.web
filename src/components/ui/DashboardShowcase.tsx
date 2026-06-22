import { motion } from 'framer-motion'

export default function DashboardShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative w-full"
    >
      {/* Outer Browser Window Container with Permanent Neo-Brutalist Border & Heavy Shadow */}
      <div className="overflow-hidden rounded-md border-2 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        
        {/* Browser Header Mac-Style Pills */}
        <div className="flex items-center gap-2 border-b-2 border-slate-900 bg-[#ebebeb] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
          </div>
          <div className="mx-auto flex h-7 w-56 items-center justify-center border-2 border-slate-900 rounded bg-white text-xs font-mono font-black text-slate-800 shadow-[1px_1px_0px_0px_#000]">
            app.webncode.com/dashboard
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Menu Block */}
          <div className="hidden w-48 shrink-0 border-r-2 border-slate-900 bg-[#ebebeb] p-4 sm:block">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-7 w-7 border-2 border-slate-900 bg-[#ff9e7d] shadow-[1px_1px_0px_0px_#000]" />
              <div className="h-3 w-16 border border-slate-900 bg-slate-900" />
            </div>
            <div className="space-y-2">
              {['Dashboard', 'Students', 'Attendance', 'Results', 'Settings'].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 border-2 px-3 py-2 text-xs font-mono font-black uppercase tracking-wider transition-all ${
                    i === 0 
                      ? 'bg-white border-slate-900 text-slate-900 shadow-[2px_2px_0px_0px_#000]' 
                      : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className={`h-2 w-2 border border-slate-900 ${i === 0 ? 'bg-[#86efac]' : 'bg-slate-400'}`} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Core Content Area */}
          <div className="flex-1 bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="h-4 w-32 border border-slate-900 bg-slate-900" />
                <div className="mt-2 h-2.5 w-48 border border-slate-900/30 bg-slate-200" />
              </div>
              <div className="h-8 w-24 border-2 border-slate-900 bg-[#7dd3fc] shadow-[2px_2px_0px_0px_#000]" />
            </div>

            {/* Stat Counters Blocks Grid */}
            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: 'Students', value: '2,847', color: 'bg-[#93c5fd]' },
                { label: 'Attendance', value: '94.2%', color: 'bg-[#c084fc]' },
                { label: 'Fees', value: 'Rs 12.4L', color: 'bg-[#86efac]' },
                { label: 'Pending', value: '23', color: 'bg-[#ff9e7d]' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.color} border-2 border-slate-900 p-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]`}>
                  <div className="text-xl font-black uppercase font-mono text-slate-900">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase font-mono tracking-wider text-slate-700 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Box section layout */}
            <div className="grid gap-3 lg:grid-cols-5">
              {/* Bar Chart Mockup */}
              <div className="border-2 border-slate-900 p-4 lg:col-span-3 bg-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="mb-4 h-3 w-28 border border-slate-900 bg-slate-900" />
                <div className="flex h-28 items-end gap-2 border-b-2 border-l-2 border-slate-900 p-1 bg-[#fafafa]">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 border-t-2 border-x border-slate-900 bg-[#7dd3fc] hover:bg-[#ff9e7d] transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Line/Class Progress Mockup */}
              <div className="border-2 border-slate-900 p-4 lg:col-span-2 bg-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="mb-4 h-3 w-24 border border-slate-900 bg-slate-900" />
                <div className="space-y-3">
                  {['Class 10-A', 'Class 9-B', 'Class 8-C', 'Class 7-A'].map((cls, i) => (
                    <div key={cls} className="flex items-center gap-2">
                      <div className="h-3 flex-1 border-2 border-slate-900 bg-white p-[1px]">
                        <div
                          className="h-full border-r border-slate-900 bg-[#c084fc]"
                          style={{ width: `${85 - i * 12}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase font-mono text-slate-700 w-16 text-right">{cls}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Neo-brutalist Badge (Bottom Left) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 border-2 border-slate-900 bg-white p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:-left-8 max-w-[240px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#86efac] font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000]">
            ✓
          </div>
          <div>
            <div className="text-xs font-black uppercase font-mono text-slate-900 leading-tight">Attendance Logged</div>
            <div className="text-[10px] font-bold font-mono tracking-tight text-slate-600 mt-0.5">2,814 students - Just now</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}