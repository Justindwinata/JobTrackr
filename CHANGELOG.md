# Changelog

All notable changes to JobTrackr will be documented in this file.

## 0.1.0 - 2026-07-10

### Added

- Initialized JobTrackr project foundation.
- Added repository documentation structure.
- Added FastAPI backend package with `/health`.
- Added React, TypeScript, and Vite frontend foundation.
- Added deterministic job search recommendation models and service.
- Added `POST /job-search/recommendations` endpoint.
- Added backend and frontend tests.
- Added root Makefile validation commands.
- Added product requirements and system architecture documentation.

### Notes

- JobTrackr does not scrape job boards.
- JobTrackr does not integrate with external job board APIs in JT-0001.
- JobTrackr does not include authentication, database persistence, or AI recommendations yet.

## 0.2.0 - 2026-07-10

### Added

- Added original JobTrackr logo asset and responsive app shell.
- Added React Router multi-page navigation.
- Added professional Home page experience.
- Added functional Discover Jobs UI connected to the existing recommendation API.
- Added loading, validation, backend error, empty, and recommendation result states.
- Added polished placeholder pages for Saved Opportunities, Application Tracker, and Reports.
- Added frontend tests for Discover Jobs validation and recommendation rendering.

### Notes

- Future pages do not show fake records or analytics.
- Discover Jobs generates external search links only.
- No scraping, real-time listing ingestion, authentication, database, deployment, or AI/LLM features were added.

## 0.3.0 - 2026-07-10

### Added

- Added saved opportunity Pydantic models and enums.
- Added local SQLite persistence for manually saved opportunities.
- Added saved opportunity repository with create, list, detail, update, and delete behavior.
- Added `POST /opportunities`, `GET /opportunities`, `GET /opportunities/{id}`, `PUT /opportunities/{id}`, and `DELETE /opportunities/{id}`.
- Added functional Saved Opportunities frontend page.
- Added manual save form with validation and API integration.
- Added saved opportunity list, status/source badges, search, status filtering, edit status/notes, and delete action.
- Added Discover Jobs CTA to save matching jobs manually.
- Added backend and frontend tests for saved opportunities.

### Notes

- Saved opportunities are manually entered by users.
- SQLite is local-only and stored under an ignored `backend/data/` path.
- JobTrackr still does not scrape, import, or ingest real-time job listings.

## 0.4.0 - 2026-07-11

### Added

- Added Stitch-inspired UI implementation notes.
- Added redesigned SaaS-style app shell with desktop sidebar navigation.
- Added denser Home page with product mockup, workflow preview, and trust boundaries.
- Added redesigned Discover Jobs workspace with parsed input metrics and polished recommendation cards.
- Added redesigned Saved Opportunities workspace with summary metrics, richer cards, and improved edit foundation.
- Added polished Application Tracker and Reports future-preview pages with clearly labeled non-data skeletons.

### Changed

- Refined global CSS tokens, cards, badges, forms, empty states, and responsive layouts.
- Allowed adjacent local Vite fallback ports for backend CORS during development.

### Notes

- No fake listings, fake saved opportunities, or fake analytics were added.
- JobTrackr remains a no-scraping, user-controlled workflow.

## 0.5.0 - 2026-07-11

### Added

- Added application tracker analytics response models.
- Added deterministic tracker analytics service derived from saved opportunities.
- Added `GET /tracker/summary` endpoint.
- Added functional Application Tracker dashboard UI.
- Added overview cards, status pipeline, status/source/priority distributions, deadline panels, overdue items, and recent activity.
- Added backend tests for tracker calculations and API output.
- Added frontend tracker API client and Application Tracker page tests.

### Changed

- Replaced the Application Tracker future-preview page with a real dashboard powered by local SQLite saved opportunity data.
- Updated product documentation to describe the tracker dashboard and no-fake-analytics boundary.

### Notes

- Tracker analytics are derived only from manually saved opportunities.
- No fake records, fake analytics, scraping, AI recommendations, authentication, cloud database, report generation, or drag-and-drop pipeline behavior were added.

## 0.6.0 - 2026-07-11

### Added

- Added career progress report response models.
- Added deterministic report service that reuses tracker analytics and saved opportunity data.
- Added `GET /reports/career-progress` JSON endpoint.
- Added `GET /reports/career-progress.html` standalone HTML report endpoint.
- Added safe HTML renderer that escapes user-entered opportunity content.
- Added functional Reports frontend page with overview cards, distributions, pipeline summary, deadlines, overdue items, recent activity, refresh action, and HTML report link.
- Added backend and frontend tests for reports.

### Changed

- Replaced the Reports future-preview page with a real reporting workflow.
- Updated documentation to describe report generation from manually saved opportunities.

### Notes

- Reports are generated only from local user-entered saved opportunities and deterministic tracker analytics.
- No fake records, fake analytics, scraping, external job board APIs, AI ranking, authentication, cloud database, PDF export, or drag-and-drop pipeline behavior were added.
