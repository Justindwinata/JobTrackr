# Product Requirements

## Product Summary

JobTrackr is a job discovery and application tracking platform for students and fresh graduates. It helps users convert their skills, target roles, and preferred locations into structured job search directions.

## Target Users

- Informatics and computer science students.
- Fresh graduates preparing for entry-level roles.
- Early-career candidates who need a structured job search workflow.

## MVP Scope

The MVP will allow users to:

- Select skills they already have.
- Select target job roles.
- Select preferred locations or domicile.
- Generate targeted search recommendations.
- Open safe external search links manually.
- Manually save job opportunities.
- Track application status.
- Review basic analytics and reports.

## JT-0001 Scope

JT-0001 implements only the project foundation:

- Repository structure.
- Backend API foundation.
- Frontend application foundation.
- Deterministic recommendation domain contracts.
- Recommendation endpoint.
- Basic tests and tooling.
- Product documentation.

## JT-0003 Scope

JT-0003 adds the first persistence-backed tracker feature:

- Manual saved opportunity form.
- Local SQLite persistence.
- Saved opportunity CRUD API.
- Saved opportunity list and management UI.
- Status, priority, source, required skills, notes, and URL fields.
- Discover Jobs CTA into manual saving.

Saved Opportunities remains manual by design. The system does not import jobs from external platforms.

## Out of Scope

JobTrackr does not:

- Scrape job boards.
- Ingest real-time job listings.
- Integrate with LinkedIn, JobStreet Indonesia, Glints, Karir.com, or Dealls APIs.
- Use AI or LLM recommendations.
- Apply to jobs automatically.
- Provide authentication in JT-0001.
- Persist application tracker data in JT-0001.

## External Search Link Behavior

The system builds search URLs from selected roles, skills, and locations. A user opens the generated links manually on external platforms. JobTrackr does not fetch, copy, rank, or store job listings from those platforms.
