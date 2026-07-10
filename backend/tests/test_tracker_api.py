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
    database_path = tmp_path / "jobtrackr-tracker-api-test.sqlite3"

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


def test_tracker_summary_empty_state(client: TestClient) -> None:
    response = client.get("/tracker/summary")

    assert response.status_code == 200
    payload = response.json()
    assert _card_value(payload, "total") == 0
    assert payload["upcoming_deadlines"] == []
    assert payload["overdue_opportunities"] == []
    assert all(group["count"] == 0 for group in payload["pipeline_groups"])


def test_tracker_summary_with_multiple_statuses_and_pipeline_groups(
    client: TestClient,
) -> None:
    first = client.post(
        "/opportunities",
        json=opportunity_payload("Acme Indonesia", "Frontend Developer"),
    ).json()
    second = client.post(
        "/opportunities",
        json=opportunity_payload("Beta Tech", "QA Engineer"),
    ).json()
    client.put(f"/opportunities/{first['id']}", json={"status": "interview"})
    client.put(f"/opportunities/{second['id']}", json={"status": "rejected"})

    response = client.get("/tracker/summary")

    assert response.status_code == 200
    payload = response.json()
    assert _card_value(payload, "total") == 2
    assert _card_value(payload, "active") == 1
    assert _card_value(payload, "closed") == 1
    assert _card_value(payload, "interviews") == 1
    assert _card_value(payload, "rejected") == 1
    assert _pipeline_count(payload, "interview") == 1
    assert _pipeline_count(payload, "rejected") == 1


def test_tracker_summary_distributions_deadlines_and_recent_activity(
    client: TestClient,
) -> None:
    today = date.today()
    upcoming = client.post(
        "/opportunities",
        json=opportunity_payload(
            "Acme Indonesia",
            "Frontend Developer",
            source="linkedin",
            priority="high",
            deadline=(today + timedelta(days=5)).isoformat(),
        ),
    ).json()
    overdue = client.post(
        "/opportunities",
        json=opportunity_payload(
            "Beta Tech",
            "Backend Developer",
            source="glints",
            priority="low",
            deadline=(today - timedelta(days=2)).isoformat(),
        ),
    ).json()
    client.put(f"/opportunities/{upcoming['id']}", json={"status": "applied"})

    response = client.get("/tracker/summary")

    assert response.status_code == 200
    payload = response.json()
    assert _distribution_count(payload["source_distribution"], "linkedin") == 1
    assert _distribution_count(payload["source_distribution"], "glints") == 1
    assert _distribution_count(payload["priority_distribution"], "high") == 1
    assert _distribution_count(payload["priority_distribution"], "low") == 1
    assert [item["id"] for item in payload["upcoming_deadlines"]] == [upcoming["id"]]
    assert [item["id"] for item in payload["overdue_opportunities"]] == [overdue["id"]]
    assert {item["id"] for item in payload["recent_activity"]} == {
        upcoming["id"],
        overdue["id"],
    }


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


def _card_value(payload: dict[str, object], key: str) -> int:
    return next(
        card["value"]
        for card in payload["summary_cards"]
        if card["key"] == key
    )


def _pipeline_count(payload: dict[str, object], status: str) -> int:
    return next(
        group["count"]
        for group in payload["pipeline_groups"]
        if group["status"] == status
    )


def _distribution_count(items: list[dict[str, object]], key: str) -> int:
    return next(item["count"] for item in items if item["key"] == key)
