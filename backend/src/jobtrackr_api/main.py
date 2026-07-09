from fastapi import FastAPI

from jobtrackr_api import __version__

app = FastAPI(
    title="JobTrackr API",
    summary="Backend API for deterministic job discovery and application tracking workflows.",
    version=__version__,
)


@app.get("/health", tags=["System"])
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "jobtrackr-api",
        "version": __version__,
    }

