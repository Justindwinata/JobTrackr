from enum import StrEnum
from typing import Annotated

from pydantic import BaseModel, Field, HttpUrl


NonEmptyText = Annotated[str, Field(min_length=1, max_length=120)]


class Skill(BaseModel):
    name: NonEmptyText


class TargetRole(BaseModel):
    title: NonEmptyText


class PreferredLocation(BaseModel):
    name: NonEmptyText


class JobBoardSource(StrEnum):
    LINKEDIN = "linkedin"
    JOBSTREET_INDONESIA = "jobstreet_indonesia"
    GLINTS = "glints"
    KARIR = "karir"
    DEALLS = "dealls"


class ExternalSearchLink(BaseModel):
    source: JobBoardSource
    label: str
    url: HttpUrl


class JobSearchRecommendation(BaseModel):
    title: str
    query: str
    matched_skills: list[Skill]
    target_role: TargetRole
    location: PreferredLocation
    source_links: list[ExternalSearchLink]


class JobSearchRecommendationRequest(BaseModel):
    skills: list[Skill] = Field(default_factory=list)
    target_roles: list[TargetRole] = Field(default_factory=list)
    preferred_locations: list[PreferredLocation] = Field(default_factory=list)


class JobSearchRecommendationResponse(BaseModel):
    recommendations: list[JobSearchRecommendation]

