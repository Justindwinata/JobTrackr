from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from jobtrackr_api import __version__
from jobtrackr_api.api.job_search import router as job_search_router
from jobtrackr_api.api.opportunities import router as opportunities_router
from jobtrackr_api.api.tracker import router as tracker_router

app = FastAPI(
    title="JobTrackr API",
    summary="Backend API for deterministic job discovery and application tracking workflows.",
    version=__version__,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_origin_regex=r"^http://(127\.0\.0\.1|localhost):517[4-9]$",
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(job_search_router)
app.include_router(opportunities_router)
app.include_router(tracker_router)


@app.get("/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "jobtrackr-api",
        "version": __version__,
    }
