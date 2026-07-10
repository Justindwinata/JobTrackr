from datetime import date

import pytest
from pydantic import ValidationError

from jobtrackr_api.models.saved_opportunity import (
    OpportunityPriority,
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunityCreate,
    SavedOpportunityUpdate,
    WorkType,
)


def test_saved_opportunity_create_normalizes_text_and_skills() -> None:
    opportunity = SavedOpportunityCreate(
        company_name="  Acme Indonesia ",
        role_title=" Frontend Developer ",
        source=OpportunitySource.LINKEDIN,
        job_url="https://www.linkedin.com/jobs/view/123",
        location=" Jakarta ",
        work_type=WorkType.HYBRID,
        status=OpportunityStatus.WISHLIST,
        priority=OpportunityPriority.HIGH,
        deadline=date(2026, 8, 1),
        required_skills="React, TypeScript, SQL",
        notes="  Prepare portfolio link. ",
    )

    assert opportunity.company_name == "Acme Indonesia"
    assert opportunity.role_title == "Frontend Developer"
    assert opportunity.location == "Jakarta"
    assert opportunity.required_skills == ["React", "TypeScript", "SQL"]
    assert opportunity.notes == "Prepare portfolio link."


def test_saved_opportunity_requires_company_role_source_and_url() -> None:
    with pytest.raises(ValidationError) as error:
        SavedOpportunityCreate(
            company_name="",
            role_title="",
            source=OpportunitySource.GLINTS,
            job_url="not-a-url",
            location="Jakarta",
        )

    error_text = str(error.value)
    assert "company_name" in error_text
    assert "role_title" in error_text
    assert "job_url" in error_text


def test_saved_opportunity_update_accepts_partial_status_update() -> None:
    update = SavedOpportunityUpdate(
        status=OpportunityStatus.APPLIED,
        notes="Applied through company website.",
    )

    assert update.status is OpportunityStatus.APPLIED
    assert update.notes == "Applied through company website."
    assert update.company_name is None


def test_saved_opportunity_rejects_invalid_enum_values() -> None:
    with pytest.raises(ValidationError):
        SavedOpportunityCreate(
            company_name="Acme Indonesia",
            role_title="Frontend Developer",
            source="unknown-board",
            job_url="https://example.com/jobs/1",
            location="Remote",
            status="waiting",
        )

