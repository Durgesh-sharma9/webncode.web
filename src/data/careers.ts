export interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Internship' | 'Contract'
  experience: string
  description: string
}

export const benefits = [
  'Competitive salary & performance bonuses',
  'Flexible work arrangements',
  'Health insurance for you and family',
  'Learning & development budget',
  'Modern tools & equipment',
  'Collaborative team culture',
  'Paid time off & holidays',
  'Stock options for early team members',
]

export const whyJoin = [
  {
    title: 'Build Real Products',
    description:
      'Work on SaaS products used by real organizations—not throwaway prototypes or client projects.',
  },
  {
    title: 'Grow Your Craft',
    description:
      'Learn from experienced engineers, participate in code reviews, and ship features that matter.',
  },
  {
    title: 'Ownership Culture',
    description:
      'Take ownership of modules end-to-end. Your ideas shape the product roadmap.',
  },
  {
    title: 'Impact at Scale',
    description:
      'Your code reaches thousands of users across schools, colleges, and organizations.',
  },
]

export const positions: JobPosition[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Jaipur / Remote',
    type: 'Full-time',
    experience: '2+ Years',
    description:
      'Lead React development for our SaaS products. You will architect component libraries, optimize performance, and deliver exceptional user experiences.',
  },
  {
    id: '2',
    title: 'Backend Developer',
    department: 'Engineering',
    location: 'Jaipur / Remote',
    type: 'Full-time',
    experience: '2+ Years',
    description:
      'Build scalable APIs and microservices using Node.js and MongoDB. Focus on high performance and secure backend architecture.',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Jaipur / Remote',
    type: 'Full-time',
    experience: '3+ Years',
    description:
      'Own end-to-end product features. Work seamlessly across React frontend and Node.js backend to deliver complete solutions.',
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Jaipur / Hybrid',
    type: 'Full-time',
    experience: '2+ Years',
    description:
      'Design intuitive interfaces for complex workflows. You will own the design system and ensure our products look and feel incredible.',
  },
  {
    id: '5',
    title: 'QA Tester',
    department: 'Engineering',
    location: 'Jaipur',
    type: 'Full-time',
    experience: '1+ Years',
    description:
      'Ensure product quality through automated and manual testing. Identify bugs before they reach production and improve test coverage.',
  },
  {
    id: '6',
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    location: 'Jaipur',
    type: 'Full-time',
    experience: '1+ Years',
    description:
      'Drive growth for our SaaS products. Manage campaigns, analyze metrics, and optimize conversion funnels across multiple channels.',
  },
  {
    id: '7',
    title: 'Content Writer',
    department: 'Marketing',
    location: 'Jaipur / Remote',
    type: 'Full-time',
    experience: '1+ Years',
    description:
      'Craft compelling narratives for our products. Write blog posts, documentation, and marketing copy that resonates with our audience.',
  }
]
