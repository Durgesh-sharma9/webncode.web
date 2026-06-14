export interface Product {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  category: string
  features: string[]
  benefits: string[]
  faqs: { question: string; answer: string }[]
  color: string
  accentColor: string
  screenshots: string[]
  demoUrl: string
}

export const productCategories = [
  'All',
  'Education',
  'Operations',
  'Analytics',
  'HR',
] as const

export const products: Product[] = [
  {
    id: '1',
    slug: 'timetable-pro',
    title: 'Timetable Pro',
    shortDescription:
      'AI-powered smart scheduling engine that eliminates clashes and optimizes teacher workloads automatically.',
    description:
      'Timetable Pro transforms the complex puzzle of scheduling into a streamlined process. Our AI-powered engine automatically detects conflicts, balances teacher workloads, and publishes schedules to all stakeholders. Perfect for institutions managing hundreds of classes across multiple sections and campuses.',
    category: 'Operations',
    features: [
      'AI-powered schedule generation',
      'Intelligent conflict detection & resolution',
      'Teacher workload balancing',
      'Room & resource allocation',
      'Substitute teacher management',
      'Mobile schedule access',
      'Multi-campus support',
    ],
    benefits: [
      'Generate timetables in hours, not weeks',
      'Reduce scheduling conflicts to near zero',
      'Improve teacher satisfaction with fair workloads',
      'Instant updates when changes occur',
      'Save 80% of administrative time on scheduling',
    ],
    faqs: [
      {
        question: 'Can we handle lab and practical sessions?',
        answer:
          'Yes. The system supports room types, equipment requirements, and consecutive period blocks.',
      },
      {
        question: 'What happens when a teacher is absent?',
        answer:
          'Substitute management workflows help assign replacements and notify affected classes automatically.',
      },
      {
        question: 'Can students view their timetable?',
        answer:
          'Students and parents can access personalized timetables through the portal or mobile app.',
      },
    ],
    color: '#0F5ED7',
    accentColor: '#E3F2FD',
    screenshots: [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/timetable-pro',
  },
  {
    id: '2',
    slug: 'syllabus-tracker-pro',
    title: 'Syllabus Tracker Pro',
    shortDescription:
      'Track syllabus completion in real-time with automated progress reports and teacher accountability.',
    description:
      'Syllabus Tracker Pro gives institutions complete visibility into curriculum progress. Track chapter completion, identify gaps, and ensure syllabus is completed on time. Perfect for coaching centers and schools that need to maintain consistent teaching standards across multiple batches.',
    category: 'Education',
    features: [
      'Real-time syllabus tracking',
      'Chapter-wise progress monitoring',
      'Teacher accountability reports',
      'Automated progress alerts',
      'Batch comparison analytics',
      'Parent progress visibility',
    ],
    benefits: [
      'Ensure 100% syllabus completion',
      'Identify underperforming batches early',
      'Improve teaching consistency',
      'Reduce administrative monitoring time',
      'Data-driven parent communication',
    ],
    faqs: [
      {
        question: 'Can we customize the syllabus structure?',
        answer:
          'Yes. You can define custom chapters, topics, and weightage for each subject and batch.',
      },
      {
        question: 'How do teachers update progress?',
        answer:
          'Teachers can update progress via mobile app or web portal in under 30 seconds per class.',
      },
      {
        question: 'Can parents see syllabus progress?',
        answer:
          'Yes, parents receive weekly progress reports and can view real-time completion status.',
      },
    ],
    color: '#1E88E5',
    accentColor: '#E1F5FE',
    screenshots: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/syllabus-tracker-pro',
  },
  {
    id: '3',
    slug: 'test-master-pro',
    title: 'Test Master Pro',
    shortDescription:
      'Comprehensive online & offline assessment platform with instant analytical reports for students.',
    description:
      'Test Master Pro is a complete examination management system for online and offline assessments. Create tests, conduct exams, auto-grade answers, and generate detailed performance analytics. Ideal for coaching institutes, schools, and colleges conducting regular assessments and competitive exam preparation.',
    category: 'Education',
    features: [
      'Online & offline test modes',
      'Question bank management',
      'Auto-grading with answer keys',
      'Detailed performance analytics',
      'Comparative ranking reports',
      'Mobile test-taking interface',
    ],
    benefits: [
      'Conduct tests 10x faster',
      'Eliminate manual grading errors',
      'Provide instant results to students',
      'Identify weak areas with analytics',
      'Reduce paper usage by 90%',
    ],
    faqs: [
      {
        question: 'Does it support different question types?',
        answer:
          'Yes. Supports MCQs, true/false, fill-in-the-blanks, and descriptive questions with manual grading.',
      },
      {
        question: 'Can we conduct offline tests?',
        answer:
          'Yes. OMR sheet scanning and manual entry modes are available for pen-and-paper tests.',
      },
      {
        question: 'How are results shared?',
        answer:
          'Results are instantly available on student portals with detailed performance breakdowns.',
      },
    ],
    color: '#071A52',
    accentColor: '#E8EAF6',
    screenshots: [
      'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/test-master-pro',
  },
  {
    id: '4',
    slug: 'hirehub',
    title: 'HireHub',
    shortDescription:
      'SaaS ATS (Applicant Tracking System) for universities and corporations to manage college placements and recruitment smoothly.',
    description:
      'HireHub is a modern Applicant Tracking System designed for university placement cells and corporate HR teams. Streamline job postings, applications, interview scheduling, and offer management in one unified platform. Built to handle high-volume recruitment with ease.',
    category: 'HR',
    features: [
      'Resume parsing & screening',
      'Interview scheduling automation',
      'Candidate pipeline management',
      'Offer letter generation',
      'Placement drive analytics',
      'Company-student matching',
    ],
    benefits: [
      'Reduce placement cycle time by 60%',
      'Improve candidate screening accuracy',
      'Centralize all recruitment data',
      'Better candidate experience',
      'Data-driven placement decisions',
    ],
    faqs: [
      {
        question: 'Is it suitable for both universities and companies?',
        answer:
          'Yes. HireHub has dedicated workflows for placement cells and corporate HR teams.',
      },
      {
        question: 'Does it integrate with job portals?',
        answer:
          'Yes. We support integration with major job portals and LinkedIn for seamless job posting.',
      },
      {
        question: 'Can we customize the recruitment workflow?',
        answer:
          'Yes. Workflows are fully customizable to match your organization\'s recruitment process.',
      },
    ],
    color: '#43A047',
    accentColor: '#E8F5E9',
    screenshots: [
      'https://images.unsplash.com/photo-1521737711867-e3b90473bd58?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/hirehub',
  },
  {
    id: '5',
    slug: 'school-erp-pro',
    title: 'School ERP Pro',
    shortDescription:
      'Complete school management platform to handle admissions, academics, finance, and communication seamlessly.',
    description:
      'School ERP Pro is our flagship education management platform designed for K-12 institutions. It unifies admissions, student records, fee management, parent communication, and administrative workflows into a single, intuitive system. Built for administrators who need clarity and parents who need transparency.',
    category: 'Education',
    features: [
      'Student & staff management',
      'Fee collection & receipts',
      'Parent-teacher communication',
      'Admission workflow automation',
      'Report card generation',
      'Transport & hostel modules',
      'Library management',
    ],
    benefits: [
      'Reduce administrative workload by up to 40%',
      'Improve parent engagement with real-time updates',
      'Centralize data across departments',
      'Generate compliance reports instantly',
      'Streamline admission processes',
    ],
    faqs: [
      {
        question: 'Is School ERP Pro suitable for multi-campus schools?',
        answer:
          'Yes. School ERP Pro supports multi-branch configurations with centralized reporting and branch-level autonomy.',
      },
      {
        question: 'Can parents access the system on mobile?',
        answer:
          'Parents can access a dedicated portal and mobile-friendly interface for fees, attendance, and announcements.',
      },
      {
        question: 'How is data secured?',
        answer:
          'We use encrypted connections, role-based access control, and regular security audits to protect your data.',
      },
    ],
    color: '#0F5ED7',
    accentColor: '#E3F2FD',
    screenshots: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    ],
    demoUrl: 'https://demo.webncode.com/school-erp-pro',
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
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
