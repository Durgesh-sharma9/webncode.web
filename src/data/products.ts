import ttp1 from '../assets/projects/time-table-pro/ttp1.jpeg'
import ttp2 from '../assets/projects/time-table-pro/ttp2.jpeg'
import ttp3 from '../assets/projects/time-table-pro/ttp3.jpeg'

import tmp1 from '../assets/projects/daily-test-pro/tmp1.png'
import tmp2 from '../assets/projects/daily-test-pro/tmp2.png'
import tmp3 from '../assets/projects/daily-test-pro/tmp3.png'

import sap1 from '../assets/projects/sports-academy-pro/sap1.png'
import sap2 from '../assets/projects/sports-academy-pro/sap2.png'
import sap3 from '../assets/projects/sports-academy-pro/sap3.png'

export const productCategories = [
  'All',
  'Education',
  'Operations',
  'Analytics',
  'HR',
  'Sports',
  'Services',
] as const


export interface Product {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  category: typeof productCategories[number]
  features: string[]
  benefits: string[]
  faqs: { question: string; answer: string }[]
  color: string
  accentColor: string
  screenshots: string[]
  demoUrl: string
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'web-builder-pro',
    title: 'Web Builder Pro',
    shortDescription:
      'Professional school website builder with customizable templates and instant publishing.',
    description:
      'Web Builder Pro enables schools to create, customize, and launch professional websites without coding. Schools can select templates, manage pages, galleries, notices, faculty information, admissions content, and publish their website with ease. The platform also provides secure hosting and a user-friendly content management experience.',
    category: 'Education',
    features: [
      'Multiple website templates',
      'Drag and drop customization',
      'School profile management',
      'Notice board management',
      'Gallery management',
      'Faculty profiles',
      'Admission pages',
      'News and announcements',
      'Mobile responsive design',
      'SEO optimization',
      'Custom domain support',
      'Cloud hosting'
    ],
    benefits: [
      'No coding required',
      'Professional school websites',
      'Easy customization',
      'Instant publishing',
      'Mobile-friendly design',
      'Improved online presence',
      'Secure cloud hosting'
    ],
    faqs: [
      {
        question: 'Do I need coding skills to use Web Builder Pro?',
        answer:
          'No. Web Builder Pro is designed for non-technical users. Our drag-and-drop interface makes website creation simple and intuitive.',
      },
      {
        question: 'Can I use my own domain name?',
        answer:
          'Yes. Web Builder Pro supports custom domain integration. You can connect your existing domain or purchase a new one through our platform.',
      },
      {
        question: 'Are the templates mobile-responsive?',
        answer:
          'All our templates are fully responsive and optimized for mobile devices, ensuring your website looks great on any screen size.',
      },
      {
        question: 'Can I update content after publishing?',
        answer:
          'Yes. You can update content, add new pages, manage galleries, and publish changes instantly at any time.',
      },
      {
        question: 'Is hosting included?',
        answer:
          'Yes. Web Builder Pro includes secure cloud hosting with SSL certificates, automatic backups, and 99.9% uptime guarantee.',
      },
    ],
    color: '#7C3AED',
    accentColor: '#EDE9FE',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/web-builder-pro',
  },
  {
    id: '2',
    slug: 'timetable-pro',
    title: 'Timetable Pro',
    
    shortDescription:
      'Smart timetable and academic management platform for schools and educational institutions.',
    description:
      'Timetable Pro helps schools manage faculty schedules, class timetables, homework assignments, and teaching activities. Teachers can view schedules, submit daily reports, assign homework, track completed topics, and stay organized through a centralized dashboard. The system reduces scheduling conflicts and improves academic coordination across the institution.',
    category: 'Education',
    features: [
      'Faculty timetable management',
      'Class timetable scheduling',
      'Teacher dashboard',
      'Homework assignment',
      'Daily teaching reports',
      'Period management',
      'Class-wise schedules',
      'Academic planning',
      'Teacher activity tracking',
      'Notifications and updates'
    ],
    benefits: [
      'Reduce timetable conflicts',
      'Improve academic planning',
      'Assign homework digitally',
      'Track teacher activities',
      'Centralized timetable management',
      'Save administrative time'
    ],
    faqs: [],
    color: '#2563EB',
    accentColor: '#DBEAFE',
    screenshots: [
      ttp1,
      ttp2,
      ttp3,
    ],
    demoUrl: 'https://demo.webncode.com/timetable-pro',
  },
  {
    id: '3',
    slug: 'star-sports',
    title: 'Start Sports',
    shortDescription:
      'Sports ground booking and management platform for sports facility owners.',
    description:
      'Star Sports helps sports ground owners manage bookings, schedules, customer records, and accounts from a single platform. Owners can track upcoming bookings, prevent booking clashes, manage payments, monitor ground utilization, and maintain complete operational control. The platform simplifies sports facility management and improves the booking experience for customers.',
    category: 'Sports',
    features: [
      'Ground booking management',
      'Booking calendar',
      'Clash-free scheduling',
      'Customer management',
      'Payment tracking',
      'Account management',
      'Booking history',
      'Ground availability tracking',
      'Daily revenue reports',
      'Dashboard analytics'
    ],
    benefits: [
      'Prevent double bookings',
      'Manage bookings efficiently',
      'Track customer history',
      'Monitor revenue and accounts',
      'Improve ground utilization',
      'Simplify daily operations',
      'Save administrative time'
    ],
    faqs: [],
    color: '#F97316',
    accentColor: '#FFEDD5',
    screenshots: [
      'https://images.unsplash.com/photo-151749763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/star-sports',
  },
  {
    id: '4',
    slug: 'daily-test-manager-pro',
    title: 'Test Manager Pro',
    shortDescription:
      'Complete daily test, assessment, ranking, and student performance tracking platform for schools.',
    description:
      'Daily Test Manager Pro helps schools conduct and manage daily tests, periodic assessments, and student performance tracking. Teachers can assign subjects, enter marks, generate rankings, monitor class performance, and analyze academic progress. Parents can view their child’s results, rankings, attendance, and performance reports in real time through a dedicated parent portal.',
    category: 'Education',
    features: [
      'Daily test management',
      'Periodic assessment management',
      'Subject-wise marks entry',
      'Automatic rank calculation',
      'Class and section rankings',
      'Teacher subject assignment',
      'Student performance analytics',
      'Parent portal access',
      'Result publishing',
      'Progress reports',
      'Performance comparison',
      'Academic dashboards'
    ],
    benefits: [
      'Automated ranking system',
      'Track student performance easily',
      'Reduce manual result preparation',
      'Real-time parent engagement',
      'Better academic monitoring',
      'Detailed performance insights',
      'Faster result generation'
    ],
    faqs: [
      {
        question: 'Can ranks be generated automatically?',
        answer:
          'Yes, the system automatically calculates ranks based on marks and configured ranking rules.'
      },
      {
        question: 'Can parents view results?',
        answer:
          'Yes, parents can access their child’s performance, rankings, and reports through the parent portal.'
      },
      {
        question: 'Can teachers manage multiple subjects?',
        answer:
          'Yes, teachers can be assigned multiple subjects and classes.'
      }
    ],
    color: '#059669',
    accentColor: '#D1FAE5',
    screenshots: [
      tmp1,
      tmp2,
      tmp3
    ],
    demoUrl: 'https://demo.webncode.com/daily-test-manager-pro',
  },
  {
    id: '5',
    slug: 'hirehub',
    title: 'HireHub',
    shortDescription:
      'Candidate and recruitment management platform for employers, consultants, and job seekers.',
    description:
      'HireHub streamlines the hiring process by helping organizations manage job postings, candidate applications, interviews, and recruitment workflows. Employers can track applicants, shortlist candidates, schedule interviews, and manage hiring activities from a single dashboard.',
    category: 'HR',
    features: [
      'Job posting management',
      'Candidate database',
      'Resume management',
      'Interview scheduling',
      'Applicant tracking',
      'Recruitment dashboard',
      'Employer portal',
      'Candidate profiles',
      'Status tracking',
      'Hiring analytics'
    ],
    benefits: [
      'Faster hiring process',
      'Centralized candidate management',
      'Improved recruitment tracking',
      'Better hiring decisions',
      'Reduced manual work'
    ],
    faqs: [],
    color: '#8B5CF6',
    accentColor: '#EDE9FE',
    screenshots: [
      'https://images.unsplash.com/photo-1521737711867-e3b90473bd58?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop'
    ],
    demoUrl: 'https://demo.webncode.com/hirehub',
  },
   {
    id: '6',
    slug: 'star-sports',
    title: 'Sports Academy Pro',
    shortDescription:
      'Sports ground booking and management platform for sports facility owners.',
    description:
      'Star Sports helps sports ground owners manage bookings, schedules, customer records, and accounts from a single platform. Owners can track upcoming bookings, prevent booking clashes, manage payments, monitor ground utilization, and maintain complete operational control. The platform simplifies sports facility management and improves the booking experience for customers.',
    category: 'Sports',
    features: [
      'Ground booking management',
      'Booking calendar',
      'Clash-free scheduling',
      'Customer management',
      'Payment tracking',
      'Account management',
      'Booking history',
      'Ground availability tracking',
      'Daily revenue reports',
      'Dashboard analytics'
    ],
    benefits: [
      'Prevent double bookings',
      'Manage bookings efficiently',
      'Track customer history',
      'Monitor revenue and accounts',
      'Improve ground utilization',
      'Simplify daily operations',
      'Save administrative time'
    ],
    faqs: [],
    color: '#F97316',
    accentColor: '#FFEDD5',
    screenshots: [
     sap1,
     sap2,
     sap3
    ],
    demoUrl: 'https://demo.webncode.com/star-sports',
  },
{
    id: '7',
    slug: 'timetable-pro',
    title: 'Syllabus Tracker',
    
    shortDescription:
      'Smart timetable and academic management platform for schools and educational institutions.',
    description:
      'Timetable Pro helps schools manage faculty schedules, class timetables, homework assignments, and teaching activities. Teachers can view schedules, submit daily reports, assign homework, track completed topics, and stay organized through a centralized dashboard. The system reduces scheduling conflicts and improves academic coordination across the institution.',
    category: 'Education',
    features: [
      'Faculty timetable management',
      'Class timetable scheduling',
      'Teacher dashboard',
      'Homework assignment',
      'Daily teaching reports',
      'Period management',
      'Class-wise schedules',
      'Academic planning',
      'Teacher activity tracking',
      'Notifications and updates'
    ],
    benefits: [
      'Reduce timetable conflicts',
      'Improve academic planning',
      'Assign homework digitally',
      'Track teacher activities',
      'Centralized timetable management',
      'Save administrative time'
    ],
    faqs: [],
    color: '#2563EB',
    accentColor: '#DBEAFE',
    screenshots: [
      ttp1,
      ttp2,
      ttp3,
    ],
    demoUrl: 'https://demo.webncode.com/timetable-pro',
  },
  {
    id: '8',
    slug: 'broker-connect',
    title: 'Broker Connect',
    
    shortDescription:
      'Smart timetable and academic management platform for schools and educational institutions.',
    description:
      'Timetable Pro helps schools manage faculty schedules, class timetables, homework assignments, and teaching activities. Teachers can view schedules, submit daily reports, assign homework, track completed topics, and stay organized through a centralized dashboard. The system reduces scheduling conflicts and improves academic coordination across the institution.',
    category: 'Services',
    features: [
      'Faculty timetable management',
      'Class timetable scheduling',
      'Teacher dashboard',
      'Homework assignment',
      'Daily teaching reports',
      'Period management',
      'Class-wise schedules',
      'Academic planning',
      'Teacher activity tracking',
      'Notifications and updates'
    ],
    benefits: [
      'Reduce timetable conflicts',
      'Improve academic planning',
      'Assign homework digitally',
      'Track teacher activities',
      'Centralized timetable management',
      'Save administrative time'
    ],
    faqs: [],
    color: '#2563EB',
    accentColor: '#DBEAFE',
    screenshots: [
      ttp1,
      ttp2,
      ttp3,
    ],
    demoUrl: 'https://demo.webncode.com/timetable-pro',
  },

  
  
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}