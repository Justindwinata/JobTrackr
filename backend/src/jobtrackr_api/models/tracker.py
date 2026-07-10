from datetime import date, datetime

from pydantic import BaseModel, Field

from jobtrackr_api.models.saved_opportunity import (
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
)


class TrackerSummaryCard(BaseModel):
    key: str
    label: str
    value: int
    description: str


class TrackerDistributionItem(BaseModel):
    key: str
    label: str
    count: int
    percentage: float = Field(ge=0, le=100)


class TrackerOpportunitySnapshot(BaseModel):
    id: int
    company_name: str
    role_title: str
    source: OpportunitySource
    location: str
    status: OpportunityStatus
    priority: OpportunityPriority
    deadline: date | None = None
    updated_at: datetime


class TrackerPipelineGroup(BaseModel):
    status: OpportunityStatus
    label: str
    count: int
    opportunities: list[TrackerOpportunitySnapshot]


class TrackerDeadlineItem(TrackerOpportunitySnapshot):
    days_until_deadline: int


class TrackerRecentActivityItem(TrackerOpportunitySnapshot):
    activity_label: str


class TrackerSummaryResponse(BaseModel):
    summary_cards: list[TrackerSummaryCard]
    status_distribution: list[TrackerDistributionItem]
    source_distribution: list[TrackerDistributionItem]
    priority_distribution: list[TrackerDistributionItem]
    pipeline_groups: list[TrackerPipelineGroup]
    upcoming_deadlines: list[TrackerDeadlineItem]
    overdue_opportunities: list[TrackerDeadlineItem]
    recent_activity: list[TrackerRecentActivityItem]
