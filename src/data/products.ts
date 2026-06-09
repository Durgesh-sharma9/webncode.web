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
}

export const productCategories = [
  'All',
  'Education',
  'Operations',
  'Analytics',
] as const

export const products: Product[] = [
  {
    id: '1',
    slug: 'school-erp',
    title: 'School ERP',
    shortDescription:
      'A comprehensive platform to manage admissions, academics, finance, and communication for schools.',
    description:
      'School ERP is our flagship education management platform designed for K-12 institutions. It unifies admissions, student records, fee management, parent communication, and administrative workflows into a single, intuitive system. Built for administrators who need clarity and parents who need transparency.',
    category: 'Education',
    features: [
      'Student & staff management',
      'Fee collection & receipts',
      'Parent-teacher communication',
      'Admission workflow automation',
      'Report card generation',
      'Transport & hostel modules',
    ],
    benefits: [
      'Reduce administrative workload by up to 40%',
      'Improve parent engagement with real-time updates',
      'Centralize data across departments',
      'Generate compliance reports instantly',
    ],
    faqs: [
      {
        question: 'Is School ERP suitable for multi-campus schools?',
        answer:
          'Yes. School ERP supports multi-branch configurations with centralized reporting and branch-level autonomy.',
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
  },
  {
    id: '2',
    slug: 'result-management',
    title: 'Result Management System',
    shortDescription:
      'Streamline examination workflows, grade entry, and result publication with accuracy and speed.',
    description:
      'Result Management System eliminates the chaos of manual mark sheets and delayed result publication. From exam scheduling to grade calculation and secure result distribution, every step is automated and auditable. Designed for schools and colleges handling high-volume examinations.',
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
  },
  {
    id: '3',
    slug: 'timetable-management',
    title: 'Timetable Management System',
    shortDescription:
      'Create conflict-free schedules for classes, teachers, and rooms with intelligent automation.',
    description:
      'Timetable Management System transforms the complex puzzle of scheduling into a streamlined process. Automatically detect conflicts, balance teacher workloads, and publish schedules to all stakeholders. Perfect for institutions managing hundreds of classes across multiple sections.',
    category: 'Operations',
    features: [
      'Automated schedule generation',
      'Conflict detection & resolution',
      'Teacher workload balancing',
      'Room & resource allocation',
      'Substitute teacher management',
      'Mobile schedule access',
    ],
    benefits: [
      'Generate timetables in hours, not weeks',
      'Reduce scheduling conflicts to near zero',
      'Improve teacher satisfaction with fair workloads',
      'Instant updates when changes occur',
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
    color: '#1E88E5',
    accentColor: '#E1F5FE',
  },
  {
    id: '4',
    slug: 'attendance-management',
    title: 'Attendance Management System',
    shortDescription:
      'Track attendance in real-time with biometric integration, reports, and automated alerts.',
    description:
      'Attendance Management System provides accurate, real-time tracking for students and staff. Integrate with biometric devices, generate compliance reports, and send automated alerts to parents. Built for institutions that need reliability and instant visibility into attendance patterns.',
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
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
