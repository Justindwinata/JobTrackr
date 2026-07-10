from pathlib import Path

import pytest

from jobtrackr_api.models.saved_opportunity import (
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunityCreate,
    SavedOpportunityUpdate,
    WorkType,
)
from jobtrackr_api.persistence.database import connect, initialize_database
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository


@pytest.fixture
def repository(tmp_path: Path) -> SavedOpportunityRepository:
    connection = connect(tmp_path / "jobtrackr-test.sqlite3")
    initialize_database(connection)
    return SavedOpportunityRepository(connection)


def make_opportunity(company_name: str = "Acme Indonesia") -> SavedOpportunityCreate:
    return SavedOpportunityCreate(
        company_name=company_name,
        role_title="Frontend Developer",
        source=OpportunitySource.LINKEDIN,
        job_url="https://www.linkedin.com/jobs/view/123",
        location="Jakarta",
        work_type=WorkType.HYBRID,
        priority=OpportunityPriority.HIGH,
        required_skills=["React", "TypeScript"],
        notes="Manual save from external job board.",
    )


def test_repository_creates_and_gets_saved_opportunity(
    repository: SavedOpportunityRepository,
) -> None:
    created = repository.create(make_opportunity())

    found = repository.get(created.id)

    assert found is not None
    assert found.company_name == "Acme Indonesia"
    assert found.role_title == "Frontend Developer"
    assert found.source is OpportunitySource.LINKEDIN
    assert found.required_skills == ["React", "TypeScript"]
    assert found.created_at == found.updated_at


def test_repository_lists_saved_opportunities(repository: SavedOpportunityRepository) -> None:
    repository.create(make_opportunity("Acme Indonesia"))
    repository.create(make_opportunity("Beta Tech"))

    opportunities = repository.list()

    assert [opportunity.company_name for opportunity in opportunities] == [
        "Beta Tech",
        "Acme Indonesia",
    ]


def test_repository_filters_by_status_source_and_search(
    repository: SavedOpportunityRepository,
) -> None:
    first = repository.create(make_opportunity("Acme Indonesia"))
    repository.create(make_opportunity("Beta Tech"))
    repository.update(first.id, SavedOpportunityUpdate(status=OpportunityStatus.APPLIED))

    filtered = repository.list(
        status=OpportunityStatus.APPLIED,
        source=OpportunitySource.LINKEDIN,
        search="acme",
    )

    assert len(filtered) == 1
    assert filtered[0].company_name == "Acme Indonesia"


def test_repository_updates_saved_opportunity(repository: SavedOpportunityRepository) -> None:
    created = repository.create(make_opportunity())

    updated = repository.update(
        created.id,
        SavedOpportunityUpdate(
            status=OpportunityStatus.INTERVIEW,
            notes="Technical interview scheduled.",
        ),
    )

    assert updated is not None
    assert updated.status is OpportunityStatus.INTERVIEW
    assert updated.notes == "Technical interview scheduled."
    assert updated.updated_at >= created.updated_at


def test_repository_deletes_saved_opportunity(repository: SavedOpportunityRepository) -> None:
    created = repository.create(make_opportunity())

    was_deleted = repository.delete(created.id)

    assert was_deleted is True
    assert repository.get(created.id) is None
    assert repository.delete(created.id) is False

