from urllib.parse import urlencode

from jobtrackr_api.models.job_search import (
    ExternalSearchLink,
    JobBoardSource,
    JobSearchRecommendation,
    JobSearchRecommendationRequest,
    JobSearchRecommendationResponse,
)


JOB_BOARD_LABELS: dict[JobBoardSource, str] = {
    JobBoardSource.LINKEDIN: "LinkedIn",
    JobBoardSource.JOBSTREET_INDONESIA: "JobStreet Indonesia",
    JobBoardSource.GLINTS: "Glints",
    JobBoardSource.KARIR: "Karir.com",
    JobBoardSource.DEALLS: "Dealls",
}


def build_external_search_url(
    source: JobBoardSource,
    query: str,
    location: str,
) -> str:
    if source is JobBoardSource.LINKEDIN:
        params = urlencode({"keywords": query, "location": location})
        return f"https://www.linkedin.com/jobs/search/?{params}"

    if source is JobBoardSource.JOBSTREET_INDONESIA:
        params = urlencode({"keywords": query, "location": location})
        return f"https://id.jobstreet.com/id/jobs?{params}"

    if source is JobBoardSource.GLINTS:
        params = urlencode({"keyword": query, "locationName": location})
        return f"https://glints.com/id/opportunities/jobs/explore?{params}"

    if source is JobBoardSource.KARIR:
        params = urlencode({"q": query, "location": location})
        return f"https://www.karir.com/search?{params}"

    if source is JobBoardSource.DEALLS:
        params = urlencode({"keyword": query, "location": location})
        return f"https://dealls.com/jobs?{params}"

    raise ValueError(f"Unsupported job board source: {source}")


def build_job_search_recommendations(
    request: JobSearchRecommendationRequest,
) -> JobSearchRecommendationResponse:
    recommendations: list[JobSearchRecommendation] = []
    skill_names = [skill.name.strip() for skill in request.skills if skill.name.strip()]

    for role in request.target_roles:
        role_title = role.title.strip()
        if not role_title:
            continue

        for location in request.preferred_locations:
            location_name = location.name.strip()
            if not location_name:
                continue

            query_parts = [role_title, *skill_names]
            query = " ".join(query_parts)
            source_links = [
                ExternalSearchLink(
                    source=source,
                    label=JOB_BOARD_LABELS[source],
                    url=build_external_search_url(source, query, location_name),
                )
                for source in JobBoardSource
            ]

            recommendations.append(
                JobSearchRecommendation(
                    title=f"{role_title} roles in {location_name}",
                    query=query,
                    matched_skills=request.skills,
                    target_role=role,
                    location=location,
                    source_links=source_links,
                )
            )

    return JobSearchRecommendationResponse(recommendations=recommendations)

