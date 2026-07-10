from collections.abc import Iterator

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from jobtrackr_api.models.saved_opportunity import (
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunity,
    SavedOpportunityCreate,
    SavedOpportunityListResponse,
    SavedOpportunityUpdate,
)
from jobtrackr_api.persistence.database import connect, initialize_database
from jobtrackr_api.repositories.saved_opportunities import SavedOpportunityRepository

router = APIRouter(prefix="/opportunities", tags=["Saved Opportunities"])


def get_saved_opportunity_repository() -> Iterator[SavedOpportunityRepository]:
    connection = connect()
    initialize_database(connection)
    try:
        yield SavedOpportunityRepository(connection)
    finally:
        connection.close()


@router.post(
    "",
    response_model=SavedOpportunity,
    status_code=status.HTTP_201_CREATED,
)
def create_opportunity(
    opportunity: SavedOpportunityCreate,
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> SavedOpportunity:
    return repository.create(opportunity)


@router.get("", response_model=SavedOpportunityListResponse)
def list_opportunities(
    status_filter: OpportunityStatus | None = Query(default=None, alias="status"),
    source: OpportunitySource | None = None,
    search: str | None = None,
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> SavedOpportunityListResponse:
    return SavedOpportunityListResponse(
        opportunities=repository.list(
            status=status_filter,
            source=source,
            search=search,
        )
    )


@router.get("/{opportunity_id}", response_model=SavedOpportunity)
def get_opportunity(
    opportunity_id: int,
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> SavedOpportunity:
    opportunity = repository.get(opportunity_id)
    if opportunity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved opportunity not found.",
        )
    return opportunity


@router.put("/{opportunity_id}", response_model=SavedOpportunity)
def update_opportunity(
    opportunity_id: int,
    update: SavedOpportunityUpdate,
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> SavedOpportunity:
    opportunity = repository.update(opportunity_id, update)
    if opportunity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved opportunity not found.",
        )
    return opportunity


@router.delete("/{opportunity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(
    opportunity_id: int,
    repository: SavedOpportunityRepository = Depends(get_saved_opportunity_repository),
) -> Response:
    was_deleted = repository.delete(opportunity_id)
    if not was_deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved opportunity not found.",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)

