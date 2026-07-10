from collections.abc import Iterator
from datetime import date, timedelta
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from jobtrackr_api.api.opportunities import get_saved_opportunity_repository
from jobtrackr_api.main import app
from jobtrackr_api.persistence.database import connect, initialize_database
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    database_path = tmp_path / "jobtrackr-reports-api-test.sqlite3"

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


def test_career_progress_report_json_empty_state(client: TestClient) -> None:
    response = client.get("/reports/career-progress")

    assert response.status_code == 200
    payload = response.json()
    assert payload["metadata"]["report_title"] == "Career Progress Report"
    assert payload["executive_summary"]["total_opportunities"] == 0
    assert payload["upcoming_deadlines"] == []
    assert payload["overdue_opportunities"] == []
    assert payload["practical_notes"]["no_scraping"] is True


def test_career_progress_report_json_with_saved_opportunities(
    client: TestClient,
) -> None:
    today = date.today()
    first = client.post(
        "/opportunities",
        json=opportunity_payload(
            "Acme Indonesia",
            "Frontend Developer",
            source="linkedin",
            priority="high",
            deadline=(today + timedelta(days=4)).isoformat(),
        ),
    ).json()
    second = client.post(
        "/opportunities",
        json=opportunity_payload(
            "Beta Tech",
            "Backend Developer",
            source="glints",
            priority="low",
            deadline=(today - timedelta(days=2)).isoformat(),
        ),
    ).json()
    client.put(f"/opportunities/{first['id']}", json={"status": "interview"})
    client.put(f"/opportunities/{second['id']}", json={"status": "rejected"})

    response = client.get("/reports/career-progress")

    assert response.status_code == 200
    payload = response.json()
    assert payload["executive_summary"]["total_opportunities"] == 2
    assert payload["executive_summary"]["active_opportunities"] == 1
    assert payload["executive_summary"]["closed_opportunities"] == 1
    assert payload["executive_summary"]["interview_count"] == 1
    assert payload["executive_summary"]["rejected_count"] == 1
    assert _distribution_count(payload["source_distribution"], "linkedin") == 1
    assert _distribution_count(payload["priority_distribution"], "high") == 1
    assert [item["id"] for item in payload["upcoming_deadlines"]] == [first["id"]]
    assert payload["overdue_opportunities"] == []
    assert {item["id"] for item in payload["recent_activity"]} == {
        first["id"],
        second["id"],
    }


def test_career_progress_report_html_response(client: TestClient) -> None:
    client.post(
        "/opportunities",
        json=opportunity_payload("Acme Indonesia", "Frontend Developer"),
    )

    response = client.get("/reports/career-progress.html")

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/html")
    assert "JobTrackr" in response.text
    assert "Career Progress Report" in response.text
    assert "Acme Indonesia" in response.text
    assert "No scraping" in response.text


def test_career_progress_report_html_escapes_user_content(client: TestClient) -> None:
    client.post(
        "/opportunities",
        json=opportunity_payload(
            "<script>alert('x')</script>",
            "Frontend <Developer>",
        ),
    )

    response = client.get("/reports/career-progress.html")

    assert response.status_code == 200
    assert "<script>alert('x')</script>" not in response.text
    assert "&lt;script&gt;alert(&#x27;x&#x27;)&lt;/script&gt;" in response.text
    assert "Frontend &lt;Developer&gt;" in response.text


def opportunity_payload(
    company_name: str,
    role_title: str,
    *,
    source: str = "linkedin",
    priority: str = "medium",
    deadline: str | None = None,
) -> dict[str, object]:
    payload: dict[str, object] = {
        "company_name": company_name,
        "role_title": role_title,
        "source": source,
        "job_url": "https://example.com/jobs/role",
        "location": "Jakarta",
        "status": "wishlist",
        "priority": priority,
        "required_skills": ["React"],
    }
    if deadline is not None:
        payload["deadline"] = deadline
    return payload


def _distribution_count(items: list[dict[str, object]], key: str) -> int:
    return next(item["count"] for item in items if item["key"] == key)
