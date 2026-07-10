from datetime import UTC, datetime

from jobtrackr_api.models.report import (
    CareerProgressReport,
    CareerReportExecutiveSummary,
    CareerReportMetadata,
    CareerReportPracticalNotes,
)


def test_career_progress_report_model_accepts_empty_report_shape() -> None:
    report = CareerProgressReport(
        metadata=CareerReportMetadata(
            report_id="career-progress-20260711T000000Z",
            generated_at=datetime(2026, 7, 11, tzinfo=UTC),
            report_title="Career Progress Report",
            period_label="All saved opportunities",
        ),
        executive_summary=CareerReportExecutiveSummary(
            total_opportunities=0,
            active_opportunities=0,
            closed_opportunities=0,
            applied_count=0,
            screening_count=0,
            interview_count=0,
            offer_count=0,
            rejected_count=0,
        ),
        summary_cards=[],
        status_distribution=[],
        source_distribution=[],
        priority_distribution=[],
        pipeline_groups=[],
        upcoming_deadlines=[],
        overdue_opportunities=[],
        recent_activity=[],
        practical_notes=CareerReportPracticalNotes(
            deterministic_report=True,
            generated_from_manual_opportunities=True,
            no_scraping=True,
            no_external_job_board_ingestion=True,
            no_ai_generated_ranking=True,
        ),
    )

    assert report.metadata.report_title == "Career Progress Report"
    assert report.executive_summary.total_opportunities == 0
    assert report.practical_notes.no_scraping is True
