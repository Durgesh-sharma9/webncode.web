export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  organization: string
}

export const testimonials: Testimonial[] = [
  {
  id: '1',
  quote:
    'Start Sports simplified our entire ground booking process. Customers can see live slot availability, reserve grounds instantly, and complete payments without any hassle. Double bookings have been eliminated and customer satisfaction has improved significantly.',
  author: 'Rahul Singh',
  role: 'Head Coach',
  organization: 'Champion Sports Academy',
},
  {
  id: '2',
  quote:
    'Web Builder Pro allowed us to launch a professional school website without hiring a development team. We selected a template, customized colors, pages, galleries, and content to match our branding, and published our website within days.',
  author: 'Pooja Agarwal',
  role: 'School Administrator',
  organization: 'Sunrise International School',
},
  {
    id: '3',
    quote:
      'Timetable scheduling was our biggest headache every session. Web n Code\'s system generates conflict-free schedules. Our teachers are genuinely happier.',
    author: 'Sanjay Sharma',
    role: 'Director',
    organization: 'Global Wisdom International School',
  },
 {
  id: '4',
  quote:
    'Sports Academy Pro has simplified the way we manage our academy. From coach assignments and student attendance to fee collection and performance tracking, everything is now organized in one place. It has significantly reduced our administrative workload and improved communication with students and parents.',
  author: 'Disha Pandya',
  role: 'Academy Director',
  organization: 'Disha Sports Academy',
},
]
