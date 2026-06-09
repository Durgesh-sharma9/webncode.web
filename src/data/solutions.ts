export interface Solution {
  id: string
  industry: string
  headline: string
  problems: string[]
  solutions: string[]
  products: string[]
}

export const solutions: Solution[] = [
  {
    id: 'schools',
    industry: 'Schools',
    headline: 'Unified management for K-12 institutions',
    problems: [
      'Scattered data across spreadsheets and paper records',
      'Manual fee collection and receipt generation',
      'Poor parent-teacher communication channels',
      'Time-consuming admission and enrollment processes',
    ],
    solutions: [
      'Centralized student information system with role-based access',
      'Automated fee management with online payment integration',
      'Parent portal with real-time updates and announcements',
      'Streamlined admission workflow from inquiry to enrollment',
    ],
    products: ['School ERP', 'Attendance Management System', 'Result Management System'],
  },
  {
    id: 'colleges',
    industry: 'Colleges',
    headline: 'University-grade systems for higher education',
    problems: [
      'Complex examination and grading across departments',
      'Difficulty managing large student populations',
      'Inefficient timetable scheduling for multiple programs',
      'Lack of academic performance analytics',
    ],
    solutions: [
      'End-to-end examination management with automated grading',
      'Department-wise student lifecycle management',
      'Intelligent timetable generation with conflict resolution',
      'Analytics dashboards for academic performance tracking',
    ],
    products: ['Result Management System', 'Timetable Management System', 'School ERP'],
  },
  {
    id: 'coaching',
    industry: 'Coaching Institutes',
    headline: 'Operational excellence for coaching centers',
    problems: [
      'Batch and schedule management across multiple courses',
      'Manual attendance tracking for large batches',
      'Limited visibility into student performance trends',
      'Fee tracking and installment management challenges',
    ],
    solutions: [
      'Batch management with flexible scheduling',
      'Biometric attendance with instant parent notifications',
      'Performance analytics and progress reports',
      'Integrated fee management with installment plans',
    ],
    products: ['Attendance Management System', 'School ERP', 'Result Management System'],
  },
  {
    id: 'organizations',
    industry: 'Organizations',
    headline: 'Enterprise tools for operational efficiency',
    problems: [
      'Fragmented tools for different operational needs',
      'Lack of real-time reporting and dashboards',
      'Security concerns with sensitive organizational data',
      'Difficulty scaling systems as the organization grows',
    ],
    solutions: [
      'Integrated platform covering multiple operational workflows',
      'Real-time dashboards with exportable reports',
      'Enterprise-grade security with audit trails',
      'Scalable architecture supporting multi-branch operations',
    ],
    products: ['School ERP', 'Attendance Management System', 'Timetable Management System'],
  },
]
