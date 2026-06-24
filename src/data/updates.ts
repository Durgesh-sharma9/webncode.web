export interface Update {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: 'Product' | 'Company' | 'Careers'
  featured?: boolean
}

export const updates: Update[] = [
  {
    id: '1',
    slug: 'web-builder-pro-launched',
    title: 'Web Builder Pro Launched',
    excerpt:
      'Schools can now create and manage professional websites using customizable templates without coding knowledge.',
    content:
      'Web Builder Pro allows schools to build, customize, and publish modern websites using ready-made templates. Schools can manage pages, galleries, notices, admissions, and announcements without depending on developers.',
    date: '2026-05-15',
    category: 'Product',
    featured: true,
  },

  {
    id: '2',
    slug: 'start-sports-booking-system-live',
    title: 'Start Sports Booking System Live',
    excerpt:
      'Ground owners can manage bookings, view occupied slots, and accept online payments seamlessly.',
    content:
      'Start Sports simplifies sports facility management with real-time slot booking, booking history, payment tracking, customer management, and automated scheduling.',
    date: '2026-04-22',
    category: 'Product',
    featured: true,
  },

  {
    id: '3',
    slug: 'internship-program-open',
    title: 'Internship Program Open',
    excerpt:
      'Join our internship program and work on real SaaS products used by schools and organizations.',
    content:
      'Selected interns will work alongside our development team on live projects including School ERP, Web Builder Pro, HireHub, and Sports Academy Pro. Positions are available for Frontend, Backend, and Full Stack Development.',
    date: '2026-04-01',
    category: 'Careers',
    featured: true,
  },

  {
    id: '4',
    slug: 'sports-academy-pro-released',
    title: 'Sports Academy Pro Released',
    excerpt:
      'Manage coaches, students, fees, attendance, and performance tracking from one platform.',
    content:
      'Sports Academy Pro helps academies digitize operations with coach management, player records, fee collection, attendance monitoring, performance tracking, and reporting dashboards.',
    date: '2026-03-10',
    category: 'Product',
  },

  {
    id: '5',
    slug: 'web-n-code-ecosystem-growth',
    title: 'Web n Code Product Ecosystem Expands',
    excerpt:
      'Our software ecosystem now supports schools, academies, sports facilities, and organizations.',
    content:
      'Web n Code Technologies continues expanding its SaaS ecosystem with products focused on education management, recruitment, sports operations, website building, and business automation.',
    date: '2026-02-14',
    category: 'Company',
  },

  {
    id: '6',
    slug: 'hirehub-platform-update',
    title: 'HireHub Recruitment Platform Updated',
    excerpt:
      'Advanced candidate search, talent pool access, and recruiter productivity tools are now available.',
    content:
      'HireHub now includes enhanced candidate filtering, shared talent pool access, profile management improvements, and streamlined recruitment workflows for schools and organizations.',
    date: '2026-01-28',
    category: 'Product',
  },
]

export function getUpdateBySlug(slug: string): Update | undefined {
  return updates.find((u) => u.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
