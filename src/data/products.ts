export const productCategories = [
  'All',
  'Education',
  'Operations',
  'Analytics',
  'HR',
  'Sports Management',
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
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/timetable-pro',
  },
  {
    id: '3',
    slug: 'star-sports',
    title: 'Star Sports',
    shortDescription:
      'Sports ground booking and management platform for sports facility owners.',
    description:
      'Star Sports helps sports ground owners manage bookings, schedules, customer records, and accounts from a single platform. Owners can track upcoming bookings, prevent booking clashes, manage payments, monitor ground utilization, and maintain complete operational control. The platform simplifies sports facility management and improves the booking experience for customers.',
    category: 'Sports Management',
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
    title: 'Daily Test Manager Pro',
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
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
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
    slug: 'attendance-pro',
    title: 'Attendance Pro',
    shortDescription:
      'Track attendance in real-time with biometric integration, automated reports, and instant parent alerts.',
    description:
      'Attendance Pro provides accurate, real-time tracking for students and staff. Integrate with biometric devices, generate compliance reports, and send automated alerts to parents. Built for institutions that need reliability and instant visibility into attendance patterns.',
    category: 'Analytics',
    features: [
      'Biometric & RFID integration',
      'Real-time attendance tracking',
      'Automated parent notifications',
      'Leave management workflow',
      'Attendance analytics dashboard',
      'Export & compliance reports',
    ],
    benefits: [
      'Achieve 99%+ attendance recording accuracy',
      'Reduce truancy with instant parent alerts',
      'Generate government compliance reports easily',
      'Identify attendance trends early',
      'Save hours on manual attendance work',
    ],
    faqs: [
      {
        question: 'Which biometric devices are supported?',
        answer:
          'We support major fingerprint and face recognition devices. Contact us for a compatibility list.',
      },
      {
        question: 'Can attendance be marked manually?',
        answer:
          'Yes. Teachers can mark attendance via web or mobile when biometric devices are unavailable.',
      },
      {
        question: 'Are SMS alerts included?',
        answer:
          'Automated SMS and email alerts are configurable per institution with customizable templates.',
      },
    ],
    color: '#43A047',
    accentColor: '#E8F5E9',
    screenshots: [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/attendance-pro',
  },
  {
    id: '7',
    slug: 'result-manager-pro',
    title: 'Result Manager Pro',
    shortDescription:
      'Streamline examination workflows, grade entry, and result publication with accuracy and speed.',
    description:
      'Result Manager Pro eliminates the chaos of manual mark sheets and delayed result publication. From exam scheduling to grade calculation and secure result distribution, every step is automated and auditable. Designed for schools and colleges handling high-volume examinations.',
    category: 'Education',
    features: [
      'Exam schedule management',
      'Marks entry & validation',
      'Automated grade calculation',
      'Result publication portal',
      'Transcript generation',
      'Analytics & performance trends',
    ],
    benefits: [
      'Publish results 70% faster than manual processes',
      'Eliminate calculation errors with automated grading',
      'Provide students instant access to results',
      'Track academic performance over time',
      'Reduce paper usage significantly',
    ],
    faqs: [
      {
        question: 'Does it support different grading systems?',
        answer:
          'Yes. Configure percentage, GPA, letter grades, or custom grading schemes per institution.',
      },
      {
        question: 'Can teachers enter marks in bulk?',
        answer:
          'Teachers can enter marks individually or via bulk upload using standardized templates.',
      },
      {
        question: 'Is there an audit trail?',
        answer:
          'Every mark entry and modification is logged with timestamp and user identity for full accountability.',
      },
    ],
    color: '#071A52',
    accentColor: '#E8EAF6',
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/result-manager-pro',
  },
  {
    id: '8',
    slug: 'parent-connect-pro',
    title: 'Parent Connect Pro',
    shortDescription:
      'Bridge the communication gap between schools and parents with real-time updates and engagement tools.',
    description:
      'Parent Connect Pro creates a seamless communication channel between institutions and parents. Share updates, track progress, conduct virtual meetings, and build trust through transparent communication. Essential for modern educational institutions focused on parent engagement.',
    category: 'Education',
    features: [
      'Real-time notifications',
      'Progress reports & analytics',
      'Virtual parent-teacher meetings',
      'Fee payment reminders',
      'Announcement broadcasts',
      'Two-way messaging',
    ],
    benefits: [
      'Increase parent engagement by 80%',
      'Reduce inquiry calls significantly',
      'Build trust through transparency',
      'Improve student outcomes with involved parents',
      'Streamline communication workflows',
    ],
    faqs: [
      {
        question: 'Is there a mobile app for parents?',
        answer:
          'Yes. Parent Connect Pro includes a dedicated mobile app for iOS and Android.',
      },
      {
        question: 'Can we send targeted notifications?',
        answer:
          'Yes. Send notifications to specific classes, sections, or individual parents as needed.',
      },
      {
        question: 'How secure is the communication?',
        answer:
          'All communications are encrypted with role-based access to protect student privacy.',
      },
    ],
    color: '#1E88E5',
    accentColor: '#E1F5FE',
    screenshots: [
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/parent-connect-pro',
  },
  {
    id: '9',
    slug: 'staff-management-pro',
    title: 'Staff Management Pro',
    shortDescription:
      'Comprehensive HR and payroll management system for educational institutions and organizations.',
    description:
      'Staff Management Pro handles all aspects of staff administration from recruitment to retirement. Manage payroll, leave, attendance, performance, and compliance in one unified system. Designed for institutions with complex HR requirements and multiple employee categories.',
    category: 'HR',
    features: [
      'Payroll management',
      'Leave & attendance tracking',
      'Performance evaluation',
      'Recruitment workflow',
      'Document management',
      'Compliance reporting',
    ],
    benefits: [
      'Automate payroll processing completely',
      'Ensure compliance with labor laws',
      'Reduce HR administrative workload',
      'Improve staff satisfaction',
      'Centralized employee records',
    ],
    faqs: [
      {
        question: 'Does it handle different pay structures?',
        answer:
          'Yes. Supports multiple pay structures, allowances, deductions, and payment cycles.',
      },
      {
        question: 'Can employees access their records?',
        answer:
          'Yes. Employees have a self-service portal to view payslips, apply for leave, and update details.',
      },
      {
        question: 'Is tax compliance included?',
        answer:
          'Yes. The system handles tax calculations, deductions, and generates compliance reports.',
      },
    ],
    color: '#071A52',
    accentColor: '#E8EAF6',
    screenshots: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/staff-management-pro',
  },
  {
    id: '10',
    slug: 'campus-connect-pro',
    title: 'Campus Connect Pro',
    shortDescription:
      'Unified campus management platform connecting students, faculty, and administration seamlessly.',
    description:
      'Campus Connect Pro is an all-in-one campus management solution that brings together students, faculty, and administration on a single platform. From learning management to campus events, from library services to hostel management—everything connected in one place.',
    category: 'Education',
    features: [
      'Learning management system',
      'Campus event management',
      'Library management',
      'Hostel management',
      'Transport tracking',
      'Alumni network',
    ],
    benefits: [
      'Create a connected campus ecosystem',
      'Improve student experience significantly',
      'Reduce administrative silos',
      'Enhance campus safety and security',
      'Build strong alumni relationships',
    ],
    faqs: [
      {
        question: 'Can it integrate with existing systems?',
        answer:
          'Yes. Campus Connect Pro offers API integrations with most popular educational tools.',
      },
      {
        question: 'Is there a student mobile app?',
        answer:
          'Yes. Students can access all services through a comprehensive mobile application.',
      },
      {
        question: 'How does it help with alumni engagement?',
        answer:
          'Built-in alumni portal helps maintain connections, share opportunities, and organize events.',
      },
    ],
    color: '#0F5ED7',
    accentColor: '#E3F2FD',
    screenshots: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/campus-connect-pro',
  },
  {
    id: '11',
    slug: 'web-builder-pro',
    title: 'Web Builder Pro',
    shortDescription:
      'School website builder platform with professional templates, drag-and-drop customization, and instant publishing.',
    description:
      'Web Builder Pro is a powerful school website builder platform that enables educational institutions to create stunning, professional websites without any coding knowledge. Choose from multiple professionally designed templates, customize colors, content, galleries, and announcements, and publish your website instantly. Perfect for schools looking to establish a strong online presence and showcase their institution to prospective parents and students.',
    category: 'Education',
    features: [
      'Multiple professional templates',
      'Drag and drop customization',
      'Notice board management',
      'Gallery management',
      'Faculty profiles',
      'Admission pages',
      'Mobile responsive design',
      'SEO optimization',
      'Custom domain support',
      'Cloud hosting',
    ],
    benefits: [
      'Create professional websites without coding',
      'Launch your school website in minutes, not months',
      'Showcase faculty and staff with dedicated profiles',
      'Manage admissions information seamlessly',
      'Publish instantly with one-click deployment',
      'Host websites on our secure cloud platform',
      'Optimize for search engines to attract more visitors',
      'Customize branding with colors and logos',
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
  }
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}