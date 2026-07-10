from datetime import UTC, date, datetime

from jobtrackr_api.models.saved_opportunity import (
    EmploymentType,
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunity,
    WorkType,
)
from jobtrackr_api.services.tracker_analytics import build_tracker_summary


def test_tracker_summary_empty_state() -> None:
    summary = build_tracker_summary([], today=date(2026, 7, 11))

    assert _card_value(summary.summary_cards, "total") == 0
    assert _card_value(summary.summary_cards, "active") == 0
    assert all(item.count == 0 for item in summary.status_distribution)
    assert all(group.count == 0 for group in summary.pipeline_groups)
    assert summary.upcoming_deadlines == []
    assert summary.overdue_opportunities == []
    assert summary.recent_activity == []


def test_tracker_summary_counts_statuses_and_pipeline_groups() -> None:
    opportunities = [
        make_opportunity(1, status=OpportunityStatus.WISHLIST),
        make_opportunity(2, status=OpportunityStatus.APPLIED),
        make_opportunity(3, status=OpportunityStatus.SCREENING),
        make_opportunity(4, status=OpportunityStatus.INTERVIEW),
        make_opportunity(5, status=OpportunityStatus.OFFER),
        make_opportunity(6, status=OpportunityStatus.REJECTED),
        make_opportunity(7, status=OpportunityStatus.ARCHIVED),
    ]

    summary = build_tracker_summary(opportunities, today=date(2026, 7, 11))

    assert _card_value(summary.summary_cards, "total") == 7
    assert _card_value(summary.summary_cards, "active") == 5
    assert _card_value(summary.summary_cards, "closed") == 2
    assert _card_value(summary.summary_cards, "interviews") == 1
    assert _card_value(summary.summary_cards, "offers") == 1
    assert _card_value(summary.summary_cards, "rejected") == 1
    assert _distribution_count(summary.status_distribution, "applied") == 1
    assert _pipeline_count(summary.pipeline_groups, OpportunityStatus.INTERVIEW) == 1


def test_tracker_summary_counts_source_and_priority_distribution() -> None:
    opportunities = [
        make_opportunity(
            1,
            source=OpportunitySource.LINKEDIN,
            priority=OpportunityPriority.HIGH,
        ),
        make_opportunity(
            2,
            source=OpportunitySource.LINKEDIN,
            priority=OpportunityPriority.MEDIUM,
        ),
        make_opportunity(
            3,
            source=OpportunitySource.GLINTS,
            priority=OpportunityPriority.LOW,
        ),
    ]

    summary = build_tracker_summary(opportunities, today=date(2026, 7, 11))

    assert _distribution_count(summary.source_distribution, "linkedin") == 2
    assert _distribution_count(summary.source_distribution, "glints") == 1
    assert _distribution_count(summary.priority_distribution, "high") == 1
    assert _distribution_percentage(summary.source_distribution, "linkedin") == 66.7


def test_tracker_summary_classifies_upcoming_and_overdue_deadlines() -> None:
    opportunities = [
        make_opportunity(1, deadline=date(2026, 7, 20)),
        make_opportunity(2, deadline=date(2026, 7, 10)),
        make_opportunity(
            3,
            deadline=date(2026, 7, 9),
            status=OpportunityStatus.REJECTED,
        ),
    ]

    summary = build_tracker_summary(opportunities, today=date(2026, 7, 11))

    assert [item.id for item in summary.upcoming_deadlines] == [1]
    assert summary.upcoming_deadlines[0].days_until_deadline == 9
    assert [item.id for item in summary.overdue_opportunities] == [2]
    assert summary.overdue_opportunities[0].days_until_deadline == -1
    assert _card_value(summary.summary_cards, "upcoming_deadlines") == 1
    assert _card_value(summary.summary_cards, "overdue") == 1


def test_tracker_summary_orders_recent_activity_by_updated_at() -> None:
    opportunities = [
        make_opportunity(1, updated_at=datetime(2026, 7, 9, tzinfo=UTC)),
        make_opportunity(2, updated_at=datetime(2026, 7, 11, 9, tzinfo=UTC)),
        make_opportunity(3, updated_at=datetime(2026, 7, 10, tzinfo=UTC)),
    ]

    summary = build_tracker_summary(opportunities, today=date(2026, 7, 11))

    assert [item.id for item in summary.recent_activity] == [2, 3, 1]
    assert summary.recent_activity[0].activity_label == "Updated wishlist opportunity"


def make_opportunity(
    opportunity_id: int,
    *,
    source: OpportunitySource = OpportunitySource.LINKEDIN,
    status: OpportunityStatus = OpportunityStatus.WISHLIST,
    priority: OpportunityPriority = OpportunityPriority.MEDIUM,
    deadline: date | None = None,
    updated_at: datetime | None = None,
) -> SavedOpportunity:
    return SavedOpportunity(
        id=opportunity_id,
        company_name=f"Company {opportunity_id}",
        role_title=f"Role {opportunity_id}",
        source=source,
        job_url="https://example.com/jobs/role",
        location="Jakarta",
        work_type=WorkType.UNKNOWN,
        employment_type=EmploymentType.UNKNOWN,
        status=status,
        priority=priority,
        deadline=deadline,
        salary_range=None,
        required_skills=[],
        notes=None,
        created_at=datetime(2026, 7, 1, tzinfo=UTC),
        updated_at=updated_at or datetime(2026, 7, opportunity_id, tzinfo=UTC),
    )


def _card_value(cards, key: str) -> int:
    return next(card.value for card in cards if card.key == key)


def _distribution_count(items, key: str) -> int:
    return next(item.count for item in items if item.key == key)


def _distribution_percentage(items, key: str) -> float:
    return next(item.percentage for item in items if item.key == key)


def _pipeline_count(groups, status: OpportunityStatus) -> int:
    return next(group.count for group in groups if group.status is status)
