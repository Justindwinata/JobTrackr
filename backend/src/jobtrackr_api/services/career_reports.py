from datetime import UTC, date, datetime

from jobtrackr_api.models.report import (
    CareerProgressReport,
    CareerReportExecutiveSummary,
    CareerReportMetadata,
    CareerReportPracticalNotes,
)
from jobtrackr_api.models.saved_opportunity import OpportunityStatus, SavedOpportunity
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository
from jobtrackr_api.services.tracker_analytics import build_tracker_summary


class CareerReportService:
    def __init__(self, repository: SavedOpportunityRepository) -> None:
        self.repository = repository

    def get_career_progress_report(
        self,
        *,
        today: date | None = None,
        generated_at: datetime | None = None,
    ) -> CareerProgressReport:
        generated_timestamp = generated_at or datetime.now(UTC)
        return build_career_progress_report(
            self.repository.list(),
            today=today or generated_timestamp.date(),
            generated_at=generated_timestamp,
        )


def build_career_progress_report(
    opportunities: list[SavedOpportunity],
    *,
    today: date,
    generated_at: datetime,
) -> CareerProgressReport:
    tracker_summary = build_tracker_summary(opportunities, today=today)

    return CareerProgressReport(
        metadata=CareerReportMetadata(
            report_id=_report_id(generated_at),
            generated_at=generated_at,
            report_title="Career Progress Report",
            period_label="All saved opportunities",
        ),
        executive_summary=CareerReportExecutiveSummary(
            total_opportunities=_card_value(tracker_summary.summary_cards, "total"),
            active_opportunities=_card_value(tracker_summary.summary_cards, "active"),
            closed_opportunities=_card_value(tracker_summary.summary_cards, "closed"),
            applied_count=_card_value(tracker_summary.summary_cards, "applied"),
            screening_count=_status_count(opportunities, OpportunityStatus.SCREENING),
            interview_count=_card_value(tracker_summary.summary_cards, "interviews"),
            offer_count=_card_value(tracker_summary.summary_cards, "offers"),
            rejected_count=_card_value(tracker_summary.summary_cards, "rejected"),
        ),
        summary_cards=tracker_summary.summary_cards,
        status_distribution=tracker_summary.status_distribution,
        source_distribution=tracker_summary.source_distribution,
        priority_distribution=tracker_summary.priority_distribution,
        pipeline_groups=tracker_summary.pipeline_groups,
        upcoming_deadlines=tracker_summary.upcoming_deadlines,
        overdue_opportunities=tracker_summary.overdue_opportunities,
        recent_activity=tracker_summary.recent_activity,
        practical_notes=CareerReportPracticalNotes(
            deterministic_report=True,
            generated_from_manual_opportunities=True,
            no_scraping=True,
            no_external_job_board_ingestion=True,
            no_ai_generated_ranking=True,
        ),
    )


def _report_id(generated_at: datetime) -> str:
    utc_timestamp = generated_at.astimezone(UTC)
    return f"career-progress-{utc_timestamp.strftime('%Y%m%dT%H%M%SZ')}"


def _card_value(cards, key: str) -> int:
    return next(card.value for card in cards if card.key == key)


def _status_count(
    opportunities: list[SavedOpportunity],
    status: OpportunityStatus,
) -> int:
    return sum(1 for opportunity in opportunities if opportunity.status is status)
