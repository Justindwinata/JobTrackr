from fastapi import APIRouter, Depends

from jobtrackr_api.api.opportunities import get_saved_opportunity_repository
from jobtrackr_api.models.tracker import TrackerSummaryResponse
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository
from jobtrackr_api.services.tracker_analytics import TrackerAnalyticsService

router = APIRouter(prefix="/tracker", tags=["Application Tracker"])


@router.get("/summary", response_model=TrackerSummaryResponse)
def get_tracker_summary(
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> TrackerSummaryResponse:
    return TrackerAnalyticsService(repository).get_summary()
