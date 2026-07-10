from datetime import UTC, date, datetime

from jobtrackr_api.models.saved_opportunity import (
    EmploymentType,
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunity,
    WorkType,
)
from jobtrackr_api.services.career_reports import build_career_progress_report


GENERATED_AT = datetime(2026, 7, 11, 10, 30, tzinfo=UTC)


def test_career_progress_report_empty_state() -> None:
    report = build_career_progress_report(
        [],
        today=date(2026, 7, 11),
        generated_at=GENERATED_AT,
    )

    assert report.metadata.report_id == "career-progress-20260711T103000Z"
    assert report.executive_summary.total_opportunities == 0
    assert report.executive_summary.active_opportunities == 0
    assert report.executive_summary.closed_opportunities == 0
    assert all(item.count == 0 for item in report.status_distribution)
    assert all(group.count == 0 for group in report.pipeline_groups)
    assert report.upcoming_deadlines == []
    assert report.overdue_opportunities == []
    assert report.recent_activity == []
    assert report.practical_notes.no_scraping is True


def test_career_progress_report_summary_counts() -> None:
    opportunities = [
        make_opportunity(1, status=OpportunityStatus.WISHLIST),
        make_opportunity(2, status=OpportunityStatus.APPLIED),
        make_opportunity(3, status=OpportunityStatus.SCREENING),
        make_opportunity(4, status=OpportunityStatus.INTERVIEW),
        make_opportunity(5, status=OpportunityStatus.OFFER),
        make_opportunity(6, status=OpportunityStatus.REJECTED),
        make_opportunity(7, status=OpportunityStatus.ARCHIVED),
    ]

    report = build_career_progress_report(
        opportunities,
        today=date(2026, 7, 11),
        generated_at=GENERATED_AT,
    )

    assert report.executive_summary.total_opportunities == 7
    assert report.executive_summary.active_opportunities == 5
    assert report.executive_summary.closed_opportunities == 2
    assert report.executive_summary.applied_count == 1
    assert report.executive_summary.screening_count == 1
    assert report.executive_summary.interview_count == 1
    assert report.executive_summary.offer_count == 1
    assert report.executive_summary.rejected_count == 1


def test_career_progress_report_distributions_and_pipeline() -> None:
    opportunities = [
        make_opportunity(
            1,
            source=OpportunitySource.LINKEDIN,
            priority=OpportunityPriority.HIGH,
            status=OpportunityStatus.APPLIED,
        ),
        make_opportunity(
            2,
            source=OpportunitySource.LINKEDIN,
            priority=OpportunityPriority.MEDIUM,
            status=OpportunityStatus.APPLIED,
        ),
        make_opportunity(
            3,
            source=OpportunitySource.DEALLS,
            priority=OpportunityPriority.LOW,
            status=OpportunityStatus.INTERVIEW,
        ),
    ]

    report = build_career_progress_report(
        opportunities,
        today=date(2026, 7, 11),
        generated_at=GENERATED_AT,
    )

    assert _distribution_count(report.status_distribution, "applied") == 2
    assert _distribution_count(report.source_distribution, "linkedin") == 2
    assert _distribution_count(report.priority_distribution, "low") == 1
    assert _distribution_percentage(report.source_distribution, "linkedin") == 66.7
    assert _pipeline_count(report.pipeline_groups, OpportunityStatus.APPLIED) == 2
    assert _pipeline_count(report.pipeline_groups, OpportunityStatus.INTERVIEW) == 1


def test_career_progress_report_deadlines_and_recent_activity() -> None:
    opportunities = [
        make_opportunity(
            1,
            deadline=date(2026, 7, 20),
            updated_at=datetime(2026, 7, 9, tzinfo=UTC),
        ),
        make_opportunity(
            2,
            deadline=date(2026, 7, 10),
            updated_at=datetime(2026, 7, 11, 9, tzinfo=UTC),
        ),
        make_opportunity(
            3,
            deadline=date(2026, 7, 9),
            status=OpportunityStatus.REJECTED,
            updated_at=datetime(2026, 7, 10, tzinfo=UTC),
        ),
    ]

    report = build_career_progress_report(
        opportunities,
        today=date(2026, 7, 11),
        generated_at=GENERATED_AT,
    )

    assert [item.id for item in report.upcoming_deadlines] == [1]
    assert report.upcoming_deadlines[0].days_until_deadline == 9
    assert [item.id for item in report.overdue_opportunities] == [2]
    assert report.overdue_opportunities[0].days_until_deadline == -1
    assert [item.id for item in report.recent_activity] == [2, 3, 1]


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


def _distribution_count(items, key: str) -> int:
    return next(item.count for item in items if item.key == key)


def _distribution_percentage(items, key: str) -> float:
    return next(item.percentage for item in items if item.key == key)


def _pipeline_count(groups, status: OpportunityStatus) -> int:
    return next(group.count for group in groups if group.status is status)
