export type OpportunitySource =
  | "linkedin"
  | "jobstreet_indonesia"
  | "glints"
  | "karir"
  | "dealls"
  | "other";

export type WorkType = "remote" | "hybrid" | "on_site" | "unknown";

export type EmploymentType =
  | "internship"
  | "full_time"
  | "part_time"
  | "contract"
  | "freelance"
  | "unknown";

export type OpportunityStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

export type OpportunityPriority = "low" | "medium" | "high";

export type SavedOpportunity = {
  id: number;
  company_name: string;
  role_title: string;
  source: OpportunitySource;
  job_url: string;
  location: string;
  work_type: WorkType;
  employment_type: EmploymentType;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  deadline: string | null;
  salary_range: string | null;
  required_skills: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedOpportunityCreate = {
  company_name: string;
  role_title: string;
  source: OpportunitySource;
  job_url: string;
  location: string;
  work_type: WorkType;
  employment_type: EmploymentType;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  deadline?: string | null;
  salary_range?: string | null;
  required_skills: string[];
  notes?: string | null;
};

export type SavedOpportunityUpdate = Partial<SavedOpportunityCreate>;

export type SavedOpportunityListResponse = {
  opportunities: SavedOpportunity[];
};

export type OpportunityFilters = {
  status?: OpportunityStatus;
  source?: OpportunitySource;
  search?: string;
};

