from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from jobtrackr_api.api.opportunities import get_saved_opportunity_repository
from jobtrackr_api.main import app
from jobtrackr_api.persistence.database import connect, initialize_database
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    database_path = tmp_path / "jobtrackr-api-test.sqlite3"

    def override_repository() -> Iterator[SavedOpportunityRepository]:
        connection = connect(database_path)
        initialize_database(connection)
        try:
            yield SavedOpportunityRepository(connection)
        finally:
            connection.close()

    app.dependency_overrides[get_saved_opportunity_repository] = override_repository
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def opportunity_payload(company_name: str = "Acme Indonesia") -> dict[str, object]:
    return {
        "company_name": company_name,
        "role_title": "Frontend Developer",
        "source": "linkedin",
        "job_url": "https://www.linkedin.com/jobs/view/123",
        "location": "Jakarta",
        "work_type": "hybrid",
        "employment_type": "full_time",
        "status": "wishlist",
        "priority": "high",
        "required_skills": ["React", "TypeScript"],
        "notes": "Manual save from an external job board.",
    }


def test_create_opportunity(client: TestClient) -> None:
    response = client.post("/opportunities", json=opportunity_payload())

    assert response.status_code == 201
    payload = response.json()
    assert payload["id"] == 1
    assert payload["company_name"] == "Acme Indonesia"
    assert payload["status"] == "wishlist"
    assert payload["required_skills"] == ["React", "TypeScript"]


def test_list_opportunities(client: TestClient) -> None:
    client.post("/opportunities", json=opportunity_payload("Acme Indonesia"))
    client.post("/opportunities", json=opportunity_payload("Beta Tech"))

    response = client.get("/opportunities")

    assert response.status_code == 200
    assert [item["company_name"] for item in response.json()["opportunities"]] == [
        "Beta Tech",
        "Acme Indonesia",
    ]


def test_get_opportunity_detail(client: TestClient) -> None:
    created = client.post("/opportunities", json=opportunity_payload()).json()

    response = client.get(f"/opportunities/{created['id']}")

    assert response.status_code == 200
    assert response.json()["role_title"] == "Frontend Developer"


def test_update_opportunity(client: TestClient) -> None:
    created = client.post("/opportunities", json=opportunity_payload()).json()

    response = client.put(
        f"/opportunities/{created['id']}",
        json={
            "status": "interview",
            "notes": "Technical interview scheduled.",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "interview"
    assert payload["notes"] == "Technical interview scheduled."


def test_delete_opportunity(client: TestClient) -> None:
    created = client.post("/opportunities", json=opportunity_payload()).json()

    delete_response = client.delete(f"/opportunities/{created['id']}")
    get_response = client.get(f"/opportunities/{created['id']}")

    assert delete_response.status_code == 204
    assert get_response.status_code == 404


def test_create_opportunity_returns_validation_errors(client: TestClient) -> None:
    response = client.post(
        "/opportunities",
        json={
            "company_name": "",
            "role_title": "",
            "source": "linkedin",
            "job_url": "not-a-url",
            "location": "Jakarta",
        },
    )

    assert response.status_code == 422


def test_list_opportunities_filters_by_status_source_and_search(
    client: TestClient,
) -> None:
    first = client.post("/opportunities", json=opportunity_payload("Acme Indonesia")).json()
    client.post("/opportunities", json=opportunity_payload("Beta Tech"))
    client.put(f"/opportunities/{first['id']}", json={"status": "applied"})

    response = client.get(
        "/opportunities",
        params={
            "status": "applied",
            "source": "linkedin",
            "search": "acme",
        },
    )

    assert response.status_code == 200
    opportunities = response.json()["opportunities"]
    assert len(opportunities) == 1
    assert opportunities[0]["company_name"] == "Acme Indonesia"

