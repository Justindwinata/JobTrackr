from jobtrackr_api.models.job_search import (
    JobBoardSource,
    JobSearchRecommendationRequest,
    PreferredLocation,
    Skill,
    TargetRole,
)
from jobtrackr_api.services.job_search_recommendations import (
    build_external_search_url,
    build_job_search_recommendations,
)


def test_build_external_search_url_encodes_query_and_location() -> None:
    url = build_external_search_url(
        JobBoardSource.LINKEDIN,
        "Frontend Developer React TypeScript",
        "Jakarta",
    )

    assert str(url) == (
        "https://www.linkedin.com/jobs/search/?"
        "keywords=Frontend+Developer+React+TypeScript&location=Jakarta"
    )


def test_build_job_search_recommendations_returns_expected_shape() -> None:
    request = JobSearchRecommendationRequest(
        skills=[Skill(name="React"), Skill(name="TypeScript"), Skill(name="SQL")],
        target_roles=[
            TargetRole(title="Frontend Developer"),
            TargetRole(title="Web Developer"),
        ],
        preferred_locations=[
            PreferredLocation(name="Jakarta"),
            PreferredLocation(name="Remote"),
        ],
    )

    response = build_job_search_recommendations(request)

    assert len(response.recommendations) == 4
    first = response.recommendations[0]
    assert first.title == "Frontend Developer roles in Jakarta"
    assert first.query == "Frontend Developer React TypeScript SQL"
    assert [skill.name for skill in first.matched_skills] == [
        "React",
        "TypeScript",
        "SQL",
    ]
    assert first.target_role.title == "Frontend Developer"
    assert first.location.name == "Jakarta"
    assert {link.source for link in first.source_links} == set(JobBoardSource)

