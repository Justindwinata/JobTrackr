from collections import Counter
from datetime import date

from jobtrackr_api.models.saved_opportunity import (
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunity,
)
from jobtrackr_api.models.tracker import (
    TrackerDeadlineItem,
    TrackerDistributionItem,
    TrackerOpportunitySnapshot,
    TrackerPipelineGroup,
    TrackerRecentActivityItem,
    TrackerSummaryCard,
    TrackerSummaryResponse,
)
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository


STATUS_LABELS: dict[OpportunityStatus, str] = {
    OpportunityStatus.WISHLIST: "Wishlist",
    OpportunityStatus.APPLIED: "Applied",
    OpportunityStatus.SCREENING: "Screening",
    OpportunityStatus.INTERVIEW: "Interview",
    OpportunityStatus.OFFER: "Offer",
    OpportunityStatus.REJECTED: "Rejected",
    OpportunityStatus.ARCHIVED: "Archived",
}

SOURCE_LABELS: dict[OpportunitySource, str] = {
    OpportunitySource.LINKEDIN: "LinkedIn",
    OpportunitySource.JOBSTREET_INDONESIA: "JobStreet Indonesia",
    OpportunitySource.GLINTS: "Glints",
    OpportunitySource.KARIR: "Karir.com",
    OpportunitySource.DEALLS: "Dealls",
    OpportunitySource.OTHER: "Other",
}

PRIORITY_LABELS: dict[OpportunityPriority, str] = {
    OpportunityPriority.LOW: "Low",
    OpportunityPriority.MEDIUM: "Medium",
    OpportunityPriority.HIGH: "High",
}

ACTIVE_STATUSES = {
    OpportunityStatus.WISHLIST,
    OpportunityStatus.APPLIED,
    OpportunityStatus.SCREENING,
    OpportunityStatus.INTERVIEW,
    OpportunityStatus.OFFER,
}
CLOSED_STATUSES = {OpportunityStatus.REJECTED, OpportunityStatus.ARCHIVED}


class TrackerAnalyticsService:
    def __init__(self, repository: SavedOpportunityRepository) -> None:
        self.repository = repository

    def get_summary(self, *, today: date | None = None) -> TrackerSummaryResponse:
        return build_tracker_summary(
            self.repository.list(),
            today=today or date.today(),
        )


def build_tracker_summary(
    opportunities: list[SavedOpportunity],
    *,
    today: date,
) -> TrackerSummaryResponse:
    total = len(opportunities)
    active_count = sum(1 for item in opportunities if item.status in ACTIVE_STATUSES)
    closed_count = sum(1 for item in opportunities if item.status in CLOSED_STATUSES)
    applied_count = sum(1 for item in opportunities if item.status is OpportunityStatus.APPLIED)
    interview_count = sum(
        1 for item in opportunities if item.status is OpportunityStatus.INTERVIEW
    )
    offer_count = sum(1 for item in opportunities if item.status is OpportunityStatus.OFFER)
    rejected_count = sum(
        1 for item in opportunities if item.status is OpportunityStatus.REJECTED
    )

    upcoming_deadlines = _deadline_items(
        [
            item
            for item in opportunities
            if item.deadline is not None
            and item.deadline >= today
            and item.status not in CLOSED_STATUSES
        ],
        today=today,
    )
    overdue_opportunities = _deadline_items(
        [
            item
            for item in opportunities
            if item.deadline is not None
            and item.deadline < today
            and item.status not in CLOSED_STATUSES
        ],
        today=today,
    )

    return TrackerSummaryResponse(
        summary_cards=[
            TrackerSummaryCard(
                key="total",
                label="Total saved",
                value=total,
                description="All manually saved opportunities.",
            ),
            TrackerSummaryCard(
                key="active",
                label="Active applications",
                value=active_count,
                description="Wishlist, applied, screening, interview, and offer.",
            ),
            TrackerSummaryCard(
                key="applied",
                label="Applied",
                value=applied_count,
                description="Opportunities currently marked as applied.",
            ),
            TrackerSummaryCard(
                key="interviews",
                label="Interviews",
                value=interview_count,
                description="Opportunities in interview stage.",
            ),
            TrackerSummaryCard(
                key="offers",
                label="Offers",
                value=offer_count,
                description="Opportunities marked as offer.",
            ),
            TrackerSummaryCard(
                key="rejected",
                label="Rejected",
                value=rejected_count,
                description="Opportunities marked as rejected.",
            ),
            TrackerSummaryCard(
                key="upcoming_deadlines",
                label="Upcoming deadlines",
                value=len(upcoming_deadlines),
                description="Active opportunities with future deadlines.",
            ),
            TrackerSummaryCard(
                key="overdue",
                label="Overdue",
                value=len(overdue_opportunities),
                description="Active opportunities past their deadline.",
            ),
            TrackerSummaryCard(
                key="closed",
                label="Closed",
                value=closed_count,
                description="Rejected or archived opportunities.",
            ),
        ],
        status_distribution=_distribution(
            Counter(item.status for item in opportunities),
            STATUS_LABELS,
            total=total,
        ),
        source_distribution=_distribution(
            Counter(item.source for item in opportunities),
            SOURCE_LABELS,
            total=total,
        ),
        priority_distribution=_distribution(
            Counter(item.priority for item in opportunities),
            PRIORITY_LABELS,
            total=total,
        ),
        pipeline_groups=_pipeline_groups(opportunities),
        upcoming_deadlines=upcoming_deadlines,
        overdue_opportunities=overdue_opportunities,
        recent_activity=_recent_activity(opportunities),
    )


def _distribution(
    counts: Counter,
    labels: dict,
    *,
    total: int,
) -> list[TrackerDistributionItem]:
    return [
        TrackerDistributionItem(
            key=item.value,
            label=label,
            count=counts[item],
            percentage=_percentage(counts[item], total),
        )
        for item, label in labels.items()
    ]


def _percentage(count: int, total: int) -> float:
    if total == 0:
        return 0
    return round((count / total) * 100, 1)


def _pipeline_groups(opportunities: list[SavedOpportunity]) -> list[TrackerPipelineGroup]:
    return [
        TrackerPipelineGroup(
            status=status,
            label=label,
            count=len(grouped),
            opportunities=[_snapshot(item) for item in grouped],
        )
        for status, label in STATUS_LABELS.items()
        for grouped in [
            sorted(
                [item for item in opportunities if item.status is status],
                key=lambda item: (item.updated_at, item.id),
                reverse=True,
            )
        ]
    ]


def _deadline_items(
    opportunities: list[SavedOpportunity],
    *,
    today: date,
) -> list[TrackerDeadlineItem]:
    return [
        TrackerDeadlineItem(
            **_snapshot(item).model_dump(),
            days_until_deadline=(item.deadline - today).days,
        )
        for item in sorted(opportunities, key=lambda item: (item.deadline, item.updated_at))
    ]


def _recent_activity(opportunities: list[SavedOpportunity]) -> list[TrackerRecentActivityItem]:
    recent = sorted(
        opportunities,
        key=lambda item: (item.updated_at, item.id),
        reverse=True,
    )[:5]
    return [
        TrackerRecentActivityItem(
            **_snapshot(item).model_dump(),
            activity_label=f"Updated {STATUS_LABELS[item.status].lower()} opportunity",
        )
        for item in recent
    ]


def _snapshot(opportunity: SavedOpportunity) -> TrackerOpportunitySnapshot:
    return TrackerOpportunitySnapshot(
        id=opportunity.id,
        company_name=opportunity.company_name,
        role_title=opportunity.role_title,
        source=opportunity.source,
        location=opportunity.location,
        status=opportunity.status,
        priority=opportunity.priority,
        deadline=opportunity.deadline,
        updated_at=opportunity.updated_at,
    )
