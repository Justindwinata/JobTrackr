from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse

from jobtrackr_api.api.opportunities import get_saved_opportunity_repository
from jobtrackr_api.models.report import CareerProgressReport
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository
from jobtrackr_api.services.career_reports import CareerReportService
from jobtrackr_api.services.report_html import render_career_progress_report_html

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/career-progress", response_model=CareerProgressReport)
def get_career_progress_report(
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> CareerProgressReport:
    return CareerReportService(repository).get_career_progress_report()


@router.get("/career-progress.html", response_class=HTMLResponse)
def get_career_progress_report_html(
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> HTMLResponse:
    report = CareerReportService(repository).get_career_progress_report()
    return HTMLResponse(
        content=render_career_progress_report_html(report),
        media_type="text/html",
    )
