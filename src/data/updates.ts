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
    slug: 'new-school-erp-released',
    title: 'New School ERP Released',
    excerpt:
      'We are excited to announce the launch of School ERP 2.0 with a redesigned dashboard, faster performance, and new parent communication features.',
    content:
      'After months of development and feedback from partner institutions, School ERP 2.0 is now available. The new release features a completely redesigned admin dashboard, 40% faster page loads, enhanced parent portal with push notifications, and a new fee management module with installment tracking. Existing customers will receive a guided migration path with dedicated support.',
    date: '2026-05-15',
    category: 'Product',
    featured: true,
  },
  {
    id: '2',
    slug: 'timetable-module-added',
    title: 'New Timetable Module Added',
    excerpt:
      'Our Timetable Management System now includes AI-assisted conflict resolution and substitute teacher workflows.',
    content:
      'The latest update to our Timetable Management System introduces intelligent conflict detection, one-click schedule optimization, and a complete substitute teacher management workflow. Institutions can now generate conflict-free timetables in a fraction of the time, with automatic notifications to affected teachers and students.',
    date: '2026-04-22',
    category: 'Product',
    featured: true,
  },
  {
    id: '3',
    slug: 'internship-program-open',
    title: 'Internship Program Open',
    excerpt:
      'Join our 2026 internship cohort and work on real SaaS products used by organizations across India.',
    content:
      'Web n Code Technologies is opening applications for our 2026 Summer Internship Program. Interns will work alongside our engineering team on live products, participate in code reviews, and present a capstone project. Positions are available in frontend development, backend development, and product design. Applications close June 30, 2026.',
    date: '2026-04-01',
    category: 'Careers',
    featured: true,
  },
  {
    id: '4',
    slug: 'result-system-analytics',
    title: 'Result System Analytics Dashboard',
    excerpt:
      'New analytics capabilities in Result Management System help institutions track academic performance trends.',
    content:
      'The Result Management System now includes a comprehensive analytics dashboard. Administrators can view class-wise performance trends, identify at-risk students early, and generate board-ready reports. The dashboard supports custom date ranges and export to PDF and Excel.',
    date: '2026-03-10',
    category: 'Product',
  },
  {
    id: '5',
    slug: '150-organizations-milestone',
    title: '150+ Organizations Milestone',
    excerpt:
      'We have reached a significant milestone—over 150 organizations now trust Web n Code products.',
    content:
      'We are proud to announce that Web n Code Technologies now serves over 150 organizations across schools, colleges, and coaching institutes. This milestone reflects the trust our customers place in our products and our commitment to building software that makes a real difference in daily operations.',
    date: '2026-02-14',
    category: 'Company',
  },
  {
    id: '6',
    slug: 'attendance-biometric-update',
    title: 'Attendance System Biometric Update',
    excerpt:
      'Expanded biometric device support and real-time sync improvements in our Attendance Management System.',
    content:
      'The Attendance Management System now supports 15 additional biometric device models with plug-and-play configuration. Real-time sync latency has been reduced to under 2 seconds, and a new offline mode ensures attendance is captured even during network interruptions.',
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
