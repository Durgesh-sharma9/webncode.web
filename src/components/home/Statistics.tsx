import SectionHeading from '../ui/SectionHeading'
import AnimatedCounter from '../ui/AnimatedCounter'
import { stats } from '../../data/company'

export default function Statistics() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <SectionHeading
          label="By the Numbers"
          title="Trusted by Organizations Nationwide"
          description="Our track record speaks to the reliability and impact of our software products."
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
