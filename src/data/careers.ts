export interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Internship' | 'Contract'
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
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Noida / Remote',
    type: 'Full-time',
    description:
      'Lead React development for our education SaaS products. You will architect component libraries, optimize performance, and mentor junior developers.',
  },
  {
    id: '2',
    title: 'Backend Developer (Node.js)',
    department: 'Engineering',
    location: 'Noida / Remote',
    type: 'Full-time',
    description:
      'Build scalable APIs and microservices using Node.js, Express, and MongoDB. Experience with AWS and Docker is a plus.',
  },
  {
    id: '3',
    title: 'Product Designer',
    department: 'Design',
    location: 'Noida / Hybrid',
    type: 'Full-time',
    description:
      'Design intuitive interfaces for complex education workflows. You will own the design system and conduct user research with partner institutions.',
  },
  {
    id: '4',
    title: 'QA Engineer',
    department: 'Engineering',
    location: 'Noida',
    type: 'Full-time',
    description:
      'Ensure product quality through automated and manual testing. Build test suites and work closely with developers on CI/CD pipelines.',
  },
  {
    id: '5',
    title: 'Software Engineering Intern',
    department: 'Engineering',
    location: 'Noida',
    type: 'Internship',
    description:
      '6-month internship working on live products. Ideal for students in their final year of CS or related programs. Mentorship included.',
  },
  {
    id: '6',
    title: 'UI/UX Design Intern',
    department: 'Design',
    location: 'Noida / Remote',
    type: 'Internship',
    description:
      'Assist the design team with wireframes, prototypes, and user testing. Portfolio required. 3–6 month duration.',
  },
]
