from datetime import date, datetime
from enum import StrEnum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


RequiredText = Annotated[str, Field(min_length=1, max_length=160)]
OptionalShortText = Annotated[str, Field(min_length=1, max_length=160)]


class OpportunitySource(StrEnum):
    LINKEDIN = "linkedin"
    JOBSTREET_INDONESIA = "jobstreet_indonesia"
    GLINTS = "glints"
    KARIR = "karir"
    DEALLS = "dealls"
    OTHER = "other"


class WorkType(StrEnum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ON_SITE = "on_site"
    UNKNOWN = "unknown"


class EmploymentType(StrEnum):
    INTERNSHIP = "internship"
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    FREELANCE = "freelance"
    UNKNOWN = "unknown"


class OpportunityStatus(StrEnum):
    WISHLIST = "wishlist"
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class OpportunityPriority(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class SavedOpportunityBase(BaseModel):
    company_name: RequiredText
    role_title: RequiredText
    source: OpportunitySource
    job_url: HttpUrl
    location: RequiredText
    work_type: WorkType = WorkType.UNKNOWN
    employment_type: EmploymentType = EmploymentType.UNKNOWN
    status: OpportunityStatus = OpportunityStatus.WISHLIST
    priority: OpportunityPriority = OpportunityPriority.MEDIUM
    deadline: date | None = None
    salary_range: OptionalShortText | None = None
    required_skills: list[OptionalShortText] = Field(default_factory=list)
    notes: Annotated[str, Field(max_length=2000)] | None = None

    @field_validator("company_name", "role_title", "location", mode="before")
    @classmethod
    def normalize_required_text(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("salary_range", "notes", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized = value.strip()
        return normalized or None

    @field_validator("required_skills", mode="before")
    @classmethod
    def normalize_required_skills(cls, value: list[str] | str | None) -> list[str]:
        if value is None:
            return []

        if isinstance(value, str):
            raw_skills = value.split(",")
        else:
            raw_skills = value

        return [skill.strip() for skill in raw_skills if skill.strip()]


class SavedOpportunityCreate(SavedOpportunityBase):
    pass


class SavedOpportunityUpdate(BaseModel):
    company_name: RequiredText | None = None
    role_title: RequiredText | None = None
    source: OpportunitySource | None = None
    job_url: HttpUrl | None = None
    location: RequiredText | None = None
    work_type: WorkType | None = None
    employment_type: EmploymentType | None = None
    status: OpportunityStatus | None = None
    priority: OpportunityPriority | None = None
    deadline: date | None = None
    salary_range: OptionalShortText | None = None
    required_skills: list[OptionalShortText] | None = None
    notes: Annotated[str, Field(max_length=2000)] | None = None

    @field_validator("company_name", "role_title", "location", mode="before")
    @classmethod
    def normalize_required_text(cls, value: str | None) -> str | None:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("salary_range", "notes", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized = value.strip()
        return normalized or None

    @field_validator("required_skills", mode="before")
    @classmethod
    def normalize_required_skills(cls, value: list[str] | str | None) -> list[str] | None:
        if value is None:
            return None

        if isinstance(value, str):
            raw_skills = value.split(",")
        else:
            raw_skills = value

        return [skill.strip() for skill in raw_skills if skill.strip()]


class SavedOpportunity(SavedOpportunityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class SavedOpportunityListResponse(BaseModel):
    opportunities: list[SavedOpportunity]

