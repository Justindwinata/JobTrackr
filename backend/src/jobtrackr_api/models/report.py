from datetime import datetime

from pydantic import BaseModel

from jobtrackr_api.models.tracker import (
    TrackerDeadlineItem,
    TrackerDistributionItem,
    TrackerPipelineGroup,
    TrackerRecentActivityItem,
    TrackerSummaryCard,
)


class CareerReportMetadata(BaseModel):
    report_id: str
    generated_at: datetime
    report_title: str
    period_label: str


class CareerReportExecutiveSummary(BaseModel):
    total_opportunities: int
    active_opportunities: int
    closed_opportunities: int
    applied_count: int
    screening_count: int
    interview_count: int
    offer_count: int
    rejected_count: int


class CareerReportPracticalNotes(BaseModel):
    deterministic_report: bool
    generated_from_manual_opportunities: bool
    no_scraping: bool
    no_external_job_board_ingestion: bool
    no_ai_generated_ranking: bool


class CareerProgressReport(BaseModel):
    metadata: CareerReportMetadata
    executive_summary: CareerReportExecutiveSummary
    summary_cards: list[TrackerSummaryCard]
    status_distribution: list[TrackerDistributionItem]
    source_distribution: list[TrackerDistributionItem]
    priority_distribution: list[TrackerDistributionItem]
    pipeline_groups: list[TrackerPipelineGroup]
    upcoming_deadlines: list[TrackerDeadlineItem]
    overdue_opportunities: list[TrackerDeadlineItem]
    recent_activity: list[TrackerRecentActivityItem]
    practical_notes: CareerReportPracticalNotes
