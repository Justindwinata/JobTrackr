import json
import sqlite3
from datetime import UTC, datetime

from jobtrackr_api.models.saved_opportunity import (
    OpportunitySource,
    OpportunityStatus,
    SavedOpportunity,
    SavedOpportunityCreate,
    SavedOpportunityUpdate,
)


class SavedOpportunityRepository:
    def __init__(self, connection: sqlite3.Connection) -> None:
        self.connection = connection

    def create(self, opportunity: SavedOpportunityCreate) -> SavedOpportunity:
        now = _utc_now()
        cursor = self.connection.execute(
            """
            INSERT INTO saved_opportunities (
                company_name,
                role_title,
                source,
                job_url,
                location,
                work_type,
                employment_type,
                status,
                priority,
                deadline,
                salary_range,
                required_skills,
                notes,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                opportunity.company_name,
                opportunity.role_title,
                opportunity.source.value,
                str(opportunity.job_url),
                opportunity.location,
                opportunity.work_type.value,
                opportunity.employment_type.value,
                opportunity.status.value,
                opportunity.priority.value,
                opportunity.deadline.isoformat() if opportunity.deadline else None,
                opportunity.salary_range,
                json.dumps(opportunity.required_skills),
                opportunity.notes,
                now,
                now,
            ),
        )
        self.connection.commit()
        created = self.get(cursor.lastrowid)
        if created is None:
            raise RuntimeError("Saved opportunity was not persisted.")
        return created

    def list(
        self,
        *,
        status: OpportunityStatus | None = None,
        source: OpportunitySource | None = None,
        search: str | None = None,
    ) -> list[SavedOpportunity]:
        clauses: list[str] = []
        params: list[str] = []

        if status is not None:
            clauses.append("status = ?")
            params.append(status.value)

        if source is not None:
            clauses.append("source = ?")
            params.append(source.value)

        if search:
            clauses.append(
                "(LOWER(company_name) LIKE ? OR LOWER(role_title) LIKE ? OR LOWER(location) LIKE ?)"
            )
            normalized_search = f"%{search.lower()}%"
            params.extend([normalized_search, normalized_search, normalized_search])

        where_clause = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        rows = self.connection.execute(
            f"""
            SELECT *
            FROM saved_opportunities
            {where_clause}
            ORDER BY updated_at DESC, id DESC
            """,
            params,
        ).fetchall()
        return [_row_to_saved_opportunity(row) for row in rows]

    def get(self, opportunity_id: int) -> SavedOpportunity | None:
        row = self.connection.execute(
            "SELECT * FROM saved_opportunities WHERE id = ?",
            (opportunity_id,),
        ).fetchone()
        return _row_to_saved_opportunity(row) if row else None

    def update(
        self,
        opportunity_id: int,
        update: SavedOpportunityUpdate,
    ) -> SavedOpportunity | None:
        existing = self.get(opportunity_id)
        if existing is None:
            return None

        update_data = update.model_dump(exclude_unset=True)
        if not update_data:
            return existing

        assignments: list[str] = []
        params: list[str | None] = []

        for field_name, value in update_data.items():
            assignments.append(f"{field_name} = ?")
            params.append(_serialize_field_value(field_name, value))

        assignments.append("updated_at = ?")
        params.append(_utc_now())
        params.append(str(opportunity_id))

        self.connection.execute(
            f"""
            UPDATE saved_opportunities
            SET {', '.join(assignments)}
            WHERE id = ?
            """,
            params,
        )
        self.connection.commit()
        return self.get(opportunity_id)

    def delete(self, opportunity_id: int) -> bool:
        cursor = self.connection.execute(
            "DELETE FROM saved_opportunities WHERE id = ?",
            (opportunity_id,),
        )
        self.connection.commit()
        return cursor.rowcount > 0


def _utc_now() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def _serialize_field_value(field_name: str, value: object) -> str | None:
    if value is None:
        return None

    if field_name == "required_skills":
        return json.dumps(value)

    if hasattr(value, "value"):
        return str(value.value)

    if hasattr(value, "isoformat"):
        return str(value.isoformat())

    return str(value)


def _row_to_saved_opportunity(row: sqlite3.Row) -> SavedOpportunity:
    data = dict(row)
    data["required_skills"] = json.loads(data["required_skills"])
    return SavedOpportunity.model_validate(data)

