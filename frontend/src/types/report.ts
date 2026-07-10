import type {
  TrackerDeadlineItem,
  TrackerDistributionItem,
  TrackerPipelineGroup,
  TrackerRecentActivityItem,
  TrackerSummaryCard,
} from "./tracker";

export type CareerReportMetadata = {
  report_id: string;
  generated_at: string;
  report_title: string;
  period_label: string;
};

export type CareerReportExecutiveSummary = {
  total_opportunities: number;
  active_opportunities: number;
  closed_opportunities: number;
  applied_count: number;
  screening_count: number;
  interview_count: number;
  offer_count: number;
  rejected_count: number;
};

export type CareerReportPracticalNotes = {
  deterministic_report: boolean;
  generated_from_manual_opportunities: boolean;
  no_scraping: boolean;
  no_external_job_board_ingestion: boolean;
  no_ai_generated_ranking: boolean;
};

export type CareerProgressReport = {
  metadata: CareerReportMetadata;
  executive_summary: CareerReportExecutiveSummary;
  summary_cards: TrackerSummaryCard[];
  status_distribution: TrackerDistributionItem[];
  source_distribution: TrackerDistributionItem[];
  priority_distribution: TrackerDistributionItem[];
  pipeline_groups: TrackerPipelineGroup[];
  upcoming_deadlines: TrackerDeadlineItem[];
  overdue_opportunities: TrackerDeadlineItem[];
  recent_activity: TrackerRecentActivityItem[];
  practical_notes: CareerReportPracticalNotes;
};
