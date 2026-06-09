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
      'School ERP transformed how we manage our 2,000+ students. What used to take our admin team days now happens in hours. The parent portal alone has reduced inquiry calls by 60%.',
    author: 'Dr. Priya Sharma',
    role: 'Principal',
    organization: 'Delhi Public Academy',
  },
  {
    id: '2',
    quote:
      'The Result Management System gave us confidence during board examinations. Zero calculation errors, instant publication, and parents received results before we could even announce them.',
    author: 'Rajesh Mehta',
    role: 'Examination Controller',
    organization: 'St. Xavier\'s College',
  },
  {
    id: '3',
    quote:
      'Timetable scheduling was our biggest headache every semester. Web n Code\'s system generates conflict-free schedules in a single afternoon. Our teachers are genuinely happier.',
    author: 'Anita Verma',
    role: 'Academic Coordinator',
    organization: 'Bright Future Coaching',
  },
  {
    id: '4',
    quote:
      'Reliable products and responsive support. When we needed custom reports for state compliance, the team delivered within a week. That\'s the kind of partner we need.',
    author: 'Suresh Kumar',
    role: 'Director of Operations',
    organization: 'National Education Trust',
  },
]
