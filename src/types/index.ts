// Job Types
export interface Job {
  id: string
  _id?: string
  title: string
  slug: string
  company: Company
  companyId: string
  companyName?: string
  description: string
  requirements: string
  salaryMin?: number
  salaryMax?: number
  salary?: number
  salaryCurrency?: string
  location: string
  remoteType: RemoteType
  contractType: ContractType
  experienceLevel: ExperienceLevel
  category: Category
  categoryId: string
  status: JobStatus
  featured: boolean
  policyTags: PolicyTag[]
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  applyLink?: string
  source?: string
  plan?: string
  blockAIApplications?: boolean
  contactEmail?: string
  contactName?: string
  contactPhone?: string
  seniority?: string
}

export interface Company {
  id: string
  name: string
  slug: string
  logoUrl?: string
  description?: string
  website?: string
  location: string
  size?: CompanySize
  industry: string
  verified: boolean
  createdAt: Date
  goals?: string
  interests?: string[]
  levelsOfInterest?: string[]
  registrationCategory?: string
  acronym?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  jobCount?: number
}

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: Date
}

export interface JobSeeker {
  id: string
  userId: string
  firstName: string
  lastName: string
  headline?: string
  bio?: string
  cvUrl?: string
  linkedinUrl?: string
  location?: string
  skills: string[]
}

export interface Application {
  id: string
  jobId: string
  job?: Job
  jobSeekerId: string
  jobSeeker?: JobSeeker
  coverLetter?: string
  cvUrl?: string
  status: ApplicationStatus
  createdAt: Date
}

export interface JobAlert {
  id: string
  userId: string
  keywords?: string
  categoryId?: string
  location?: string
  contractType?: ContractType
  frequency: AlertFrequency
  createdAt: Date
}

// Enums
export type RemoteType = 'onsite' | 'hybrid' | 'remote'

export type ContractType =
  | 'permanent'
  | 'fixed-term'
  | 'traineeship'
  | 'freelance'
  | 'temporary-agent'
  | 'contract-agent'

export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'executive'

export type JobStatus = 'draft' | 'active' | 'expired' | 'closed'

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+'

export type UserRole = 'jobseeker' | 'employer' | 'admin'

export type ApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn'

export type AlertFrequency = 'daily' | 'weekly' | 'instant'

export type PolicyTag =
  | 'energy'
  | 'environment'
  | 'digital'
  | 'trade'
  | 'agriculture'
  | 'transport'
  | 'health'
  | 'finance'
  | 'defence'
  | 'migration'
  | 'legal'
  | 'education'
  | 'competition'
  | 'development'
  | 'foreign-affairs'

export const POLICY_TAG_LABELS: Record<PolicyTag, string> = {
  'energy': 'Energy',
  'environment': 'Environment',
  'digital': 'Digital',
  'trade': 'Trade',
  'agriculture': 'Agriculture',
  'transport': 'Transport',
  'health': 'Health',
  'finance': 'Finance',
  'defence': 'Defence',
  'migration': 'Migration',
  'legal': 'Legal',
  'education': 'Education',
  'competition': 'Competition',
  'development': 'Development',
  'foreign-affairs': 'Foreign Affairs',
}

// Filter Types
export interface JobFilters {
  search?: string
  category?: string
  location?: string
  contractType?: ContractType
  experienceLevel?: ExperienceLevel
  remoteType?: RemoteType
  policyTag?: PolicyTag
  salaryMin?: number
  salaryMax?: number
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
