from fastapi import APIRouter

from jobtrackr_api.models.job_search import (
    JobSearchRecommendationRequest,
    JobSearchRecommendationResponse,
)
from jobtrackr_api.services.job_search_recommendations import (
    build_job_search_recommendations,
)

router = APIRouter(prefix="/job-search", tags=["Job Search"])


@router.post("/recommendations", response_model=JobSearchRecommendationResponse)
def create_job_search_recommendations(
    request: JobSearchRecommendationRequest,
) -> JobSearchRecommendationResponse:
    return build_job_search_recommendations(request)

