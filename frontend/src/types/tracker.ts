import type {
  OpportunityPriority,
  OpportunitySource,
  OpportunityStatus,
} from "./opportunity";

export type TrackerSummaryCard = {
  key: string;
  label: string;
  value: number;
  description: string;
};

export type TrackerDistributionItem = {
  key: string;
  label: string;
  count: number;
  percentage: number;
};

export type TrackerOpportunitySnapshot = {
  id: number;
  company_name: string;
  role_title: string;
  source: OpportunitySource;
  location: string;
  status: OpportunityStatus;
  priority: OpportunityPriority;
  deadline: string | null;
  updated_at: string;
};

export type TrackerPipelineGroup = {
  status: OpportunityStatus;
  label: string;
  count: number;
  opportunities: TrackerOpportunitySnapshot[];
};

export type TrackerDeadlineItem = TrackerOpportunitySnapshot & {
  days_until_deadline: number;
};

export type TrackerRecentActivityItem = TrackerOpportunitySnapshot & {
  activity_label: string;
};

export type TrackerSummaryResponse = {
  summary_cards: TrackerSummaryCard[];
  status_distribution: TrackerDistributionItem[];
  source_distribution: TrackerDistributionItem[];
  priority_distribution: TrackerDistributionItem[];
  pipeline_groups: TrackerPipelineGroup[];
  upcoming_deadlines: TrackerDeadlineItem[];
  overdue_opportunities: TrackerDeadlineItem[];
  recent_activity: TrackerRecentActivityItem[];
};
