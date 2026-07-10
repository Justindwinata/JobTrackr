from datetime import UTC, date, datetime

from jobtrackr_api.models.saved_opportunity import (
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
)
from jobtrackr_api.models.tracker import (
    TrackerDeadlineItem,
    TrackerDistributionItem,
    TrackerPipelineGroup,
    TrackerRecentActivityItem,
    TrackerSummaryCard,
    TrackerSummaryResponse,
)


def test_tracker_summary_response_shape() -> None:
    updated_at = datetime(2026, 7, 11, tzinfo=UTC)
    opportunity = {
        "id": 1,
        "company_name": "Acme Indonesia",
        "role_title": "Frontend Developer",
        "source": OpportunitySource.LINKEDIN,
        "location": "Jakarta",
        "status": OpportunityStatus.APPLIED,
        "priority": OpportunityPriority.HIGH,
        "deadline": date(2026, 7, 20),
        "updated_at": updated_at,
    }

    response = TrackerSummaryResponse(
        summary_cards=[
            TrackerSummaryCard(
                key="total",
                label="Total saved",
                value=1,
                description="All manually saved opportunities.",
            )
        ],
        status_distribution=[
            TrackerDistributionItem(key="applied", label="Applied", count=1, percentage=100)
        ],
        source_distribution=[
            TrackerDistributionItem(key="linkedin", label="LinkedIn", count=1, percentage=100)
        ],
        priority_distribution=[
            TrackerDistributionItem(key="high", label="High", count=1, percentage=100)
        ],
        pipeline_groups=[
            TrackerPipelineGroup(
                status=OpportunityStatus.APPLIED,
                label="Applied",
                count=1,
                opportunities=[opportunity],
            )
        ],
        upcoming_deadlines=[
            TrackerDeadlineItem(**opportunity, days_until_deadline=9)
        ],
        overdue_opportunities=[],
        recent_activity=[
            TrackerRecentActivityItem(**opportunity, activity_label="Updated recently")
        ],
    )

    assert response.summary_cards[0].key == "total"
    assert response.pipeline_groups[0].opportunities[0].company_name == "Acme Indonesia"
    assert response.upcoming_deadlines[0].days_until_deadline == 9
