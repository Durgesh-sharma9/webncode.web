import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { techStack } from '../../data/company'
import { FaReact, FaNodeJs, FaDocker, FaAws } from 'react-icons/fa'
import { SiMongodb, SiExpress } from 'react-icons/si'

// Dynamic high-contrast background tokens for technological stacks 
const stackAccents = ['bg-[#7dd3fc]', 'bg-[#ff9e7d]', 'bg-[#86efac]', 'bg-[#c084fc]', 'bg-[#93c5fd]']

// Technology icon mapping
const techIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'React': FaReact,
  'Node.js': FaNodeJs,
  'MongoDB': SiMongodb,
  'Express': SiExpress,
  'Docker': FaDocker,
  'AWS': FaAws,
}

export default function TechStack() {
  return (
    <section className="py-12 lg:py-16 bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Technology"
          title="Built on a Modern Stack"
          description="Our products are engineered with proven technologies for reliability, performance, and scale."
        />
        
        {/* Tech Stack Columns Loop */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col items-center text-center"
            >
              {/* Technology Logo Block */}
              <div className={`mb-5 flex h-16 w-16 items-center justify-center border-2 border-slate-900 ${stackAccents[i % stackAccents.length]} shadow-[2px_2px_0px_0px_#000]`}
              >
                {(() => {
                  const Icon = techIcons[tech.name]
                  return Icon ? <Icon className="h-10 w-10" /> : <span className="font-mono text-xl font-black text-slate-900">{tech.name.charAt(0).toUpperCase()}</span>
                })()}
              </div>

              {/* Title Identity Block */}
              <h3 className="text-lg font-black uppercase font-mono tracking-tight text-slate-900">
                {tech.name}
              </h3>
              
              {/* Stack Architecture Notes */}
              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}