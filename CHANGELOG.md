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
