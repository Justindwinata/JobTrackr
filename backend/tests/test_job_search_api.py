from fastapi.testclient import TestClient

from jobtrackr_api.main import app
from jobtrackr_api.models.job_search import JobBoardSource


client = TestClient(app)


def test_create_job_search_recommendations_returns_results() -> None:
    response = client.post(
        "/job-search/recommendations",
        json={
            "skills": [{"name": "React"}, {"name": "TypeScript"}, {"name": "SQL"}],
            "target_roles": [{"title": "Frontend Developer"}],
            "preferred_locations": [{"name": "Jakarta"}],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["recommendations"]) == 1
    recommendation = payload["recommendations"][0]
    assert recommendation["query"] == "Frontend Developer React TypeScript SQL"
    assert recommendation["target_role"] == {"title": "Frontend Developer"}
    assert recommendation["location"] == {"name": "Jakarta"}


def test_create_job_search_recommendations_accepts_empty_skills() -> None:
    response = client.post(
        "/job-search/recommendations",
        json={
            "skills": [],
            "target_roles": [{"title": "Backend Developer"}],
            "preferred_locations": [{"name": "Remote"}],
        },
    )

    assert response.status_code == 200
    recommendation = response.json()["recommendations"][0]
    assert recommendation["query"] == "Backend Developer"
    assert recommendation["matched_skills"] == []


def test_create_job_search_recommendations_accepts_empty_roles() -> None:
    response = client.post(
        "/job-search/recommendations",
        json={
            "skills": [{"name": "Python"}],
            "target_roles": [],
            "preferred_locations": [{"name": "Bandung"}],
        },
    )

    assert response.status_code == 200
    assert response.json() == {"recommendations": []}


def test_create_job_search_recommendations_accepts_empty_locations() -> None:
    response = client.post(
        "/job-search/recommendations",
        json={
            "skills": [{"name": "Python"}],
            "target_roles": [{"title": "Data Analyst"}],
            "preferred_locations": [],
        },
    )

    assert response.status_code == 200
    assert response.json() == {"recommendations": []}


def test_create_job_search_recommendations_covers_all_job_board_sources() -> None:
    response = client.post(
        "/job-search/recommendations",
        json={
            "skills": [{"name": "JavaScript"}],
            "target_roles": [{"title": "Web Developer"}],
            "preferred_locations": [{"name": "Jakarta"}],
        },
    )

    links = response.json()["recommendations"][0]["source_links"]
    assert {link["source"] for link in links} == {source.value for source in JobBoardSource}

