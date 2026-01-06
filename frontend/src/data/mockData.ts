// Mock data for InterviewAI platform

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  aiExplanation: string;
  status: 'new' | 'matched' | 'interview_scheduled' | 'interview_completed' | 'hired' | 'rejected';
  resumeSummary: string;
  interviewDate?: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  candidates: number;
}

export interface InterviewMessage {
  id: string;
  type: 'ai' | 'candidate';
  content: string;
  timestamp: string;
}

export interface InterviewEvaluation {
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  communicationScore: number;
  technicalScore: number;
  roleFitScore: number;
  recommendation: 'hire' | 'consider' | 'reject';
  summary: string;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    description: 'We are looking for a Senior Frontend Engineer to join our team and help build the next generation of our product.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'State management expertise'],
    candidates: 45,
  },
  {
    id: '2',
    title: 'ML Engineer',
    department: 'AI/ML',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: 'Join our AI team to build and deploy machine learning models at scale.',
    requirements: ['Python expertise', 'PyTorch/TensorFlow', 'MLOps experience'],
    candidates: 32,
  },
  {
    id: '3',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'full-time',
    description: 'Design beautiful, intuitive user experiences for our SaaS platform.',
    requirements: ['Figma expertise', 'Design systems', 'User research'],
    candidates: 28,
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'full-time',
    description: 'Build and maintain our cloud infrastructure and CI/CD pipelines.',
    requirements: ['AWS/GCP', 'Kubernetes', 'Terraform'],
    candidates: 19,
  },
];

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Senior Frontend Engineer',
    matchScore: 94,
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS'],
    experience: '7 years',
    education: 'MS Computer Science, Stanford',
    aiExplanation: 'Exceptional match with strong React expertise and proven track record building complex SPAs. TypeScript proficiency and component architecture experience align perfectly with role requirements.',
    status: 'matched',
    resumeSummary: 'Senior Frontend Engineer with 7 years of experience building scalable web applications. Led frontend architecture at Series B startup, improving performance by 40%.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    phone: '+1 (555) 234-5678',
    location: 'Austin, TX',
    role: 'Senior Frontend Engineer',
    matchScore: 89,
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS-in-JS', 'Testing'],
    experience: '6 years',
    education: 'BS Computer Science, UT Austin',
    aiExplanation: 'Strong frontend foundation with excellent testing practices. Vue.js background demonstrates adaptability. Minor gap in TypeScript but shows quick learning ability.',
    status: 'interview_scheduled',
    resumeSummary: 'Full-stack developer specializing in frontend technologies. Built design systems used by 50+ developers. Strong focus on accessibility and performance.',
    interviewDate: '2024-01-15T14:00:00Z',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    location: 'Remote',
    role: 'Senior Frontend Engineer',
    matchScore: 85,
    skills: ['React', 'TypeScript', 'Redux', 'Node.js', 'AWS'],
    experience: '5 years',
    education: 'BS Software Engineering, MIT',
    aiExplanation: 'Solid React and TypeScript skills with full-stack capabilities. AWS experience adds value for frontend deployment. Slightly less experience than ideal but high potential.',
    status: 'matched',
    resumeSummary: 'Frontend engineer passionate about user experience. Contributed to open-source React libraries. Experience with micro-frontends and module federation.',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Seattle, WA',
    role: 'ML Engineer',
    matchScore: 92,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLOps', 'Kubernetes'],
    experience: '4 years',
    education: 'PhD Machine Learning, Carnegie Mellon',
    aiExplanation: 'Outstanding ML background with production deployment experience. PhD research in NLP directly applicable to current projects. Strong MLOps foundation.',
    status: 'interview_completed',
    resumeSummary: 'ML Engineer with expertise in NLP and computer vision. Published 5 papers in top conferences. Built ML pipelines processing 10M+ requests daily.',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@email.com',
    phone: '+1 (555) 567-8901',
    location: 'New York, NY',
    role: 'Product Designer',
    matchScore: 91,
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Motion Design'],
    experience: '6 years',
    education: 'MFA Design, Parsons',
    aiExplanation: 'Exceptional design portfolio with strong systems thinking. User research experience ensures data-driven design decisions. Motion design skills add polish.',
    status: 'matched',
    resumeSummary: 'Product Designer who bridges aesthetics and functionality. Created design systems adopted by Fortune 500 companies. Advocate for inclusive design.',
  },
];

export const mockInterviewTranscript: InterviewMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! Welcome to your interview for the Senior Frontend Engineer position. I\'m an AI interviewer, and I\'ll be asking you some questions about your experience and technical skills. Are you ready to begin?',
    timestamp: '14:00:00',
  },
  {
    id: '2',
    type: 'candidate',
    content: 'Yes, I\'m ready. Thank you for having me.',
    timestamp: '14:00:15',
  },
  {
    id: '3',
    type: 'ai',
    content: 'Great! Let\'s start with your experience. Can you tell me about a complex React application you\'ve built and the architectural decisions you made?',
    timestamp: '14:00:25',
  },
  {
    id: '4',
    type: 'candidate',
    content: 'At my previous company, I led the development of a real-time collaboration tool similar to Figma. We used React with TypeScript and implemented a custom state management solution using React Context and useReducer for local state, combined with WebSockets for real-time synchronization across clients.',
    timestamp: '14:01:00',
  },
  {
    id: '5',
    type: 'ai',
    content: 'Interesting approach. How did you handle performance optimization with multiple users editing simultaneously?',
    timestamp: '14:01:45',
  },
  {
    id: '6',
    type: 'candidate',
    content: 'We implemented several strategies: virtualization for large lists, debounced updates for real-time changes, and used React.memo and useMemo strategically. We also implemented Operational Transformation to handle concurrent edits without conflicts.',
    timestamp: '14:02:30',
  },
];

export const mockEvaluation: InterviewEvaluation = {
  strengths: [
    'Deep understanding of React architecture and state management',
    'Strong experience with real-time collaborative applications',
    'Excellent problem-solving approach with clear communication',
    'Demonstrated leadership in technical decision-making',
  ],
  weaknesses: [
    'Limited experience with GraphQL (primarily REST background)',
    'Could improve on testing strategy explanation',
  ],
  skillGaps: [
    'GraphQL and Apollo Client',
    'Advanced testing patterns (E2E with Playwright)',
  ],
  communicationScore: 92,
  technicalScore: 88,
  roleFitScore: 90,
  recommendation: 'hire',
  summary: 'Strong candidate with excellent React expertise and proven ability to build complex, scalable applications. Minor gaps in GraphQL can be addressed through onboarding. Recommend proceeding to final round with engineering leadership.',
};

export const mockAnalytics = {
  totalJobs: 12,
  resumesProcessed: 1247,
  avgMatchScore: 76.3,
  interviewsScheduled: 89,
  interviewsCompleted: 67,
  hireRate: 23.4,
  rejectRate: 45.2,
  considerRate: 31.4,
  matchDistribution: [
    { range: '90-100', count: 45 },
    { range: '80-89', count: 123 },
    { range: '70-79', count: 287 },
    { range: '60-69', count: 389 },
    { range: '50-59', count: 256 },
    { range: '<50', count: 147 },
  ],
  outcomesByJob: [
    { job: 'Frontend Engineer', hired: 3, rejected: 12, pending: 5 },
    { job: 'ML Engineer', hired: 2, rejected: 8, pending: 4 },
    { job: 'Product Designer', hired: 1, rejected: 6, pending: 3 },
    { job: 'DevOps Engineer', hired: 2, rejected: 5, pending: 2 },
  ],
  hiringFunnel: [
    { stage: 'Resumes Received', count: 1247 },
    { stage: 'AI Matched', count: 456 },
    { stage: 'Interview Scheduled', count: 89 },
    { stage: 'Interview Completed', count: 67 },
    { stage: 'Offer Extended', count: 24 },
    { stage: 'Hired', count: 18 },
  ],
};
