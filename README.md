# JobTrackr

JobTrackr is a smart job discovery and application tracking platform for students and fresh graduates.

The product helps users choose skills, target roles, and preferred locations, then generates safe external job-search links for platforms such as LinkedIn, JobStreet Indonesia, Glints, Karir.com, and Dealls.

JobTrackr does not scrape job boards, ingest real-time job listings, or automate job applications.

## Product Scope

JobTrackr is designed to help early-career candidates:

- Generate targeted search queries from selected skills, roles, and locations.
- Open those searches manually on trusted external job boards.
- Save interesting opportunities manually in later contracts.
- Track job application progress through a professional dashboard in later contracts.

JobTrackr is not a scraper, not a job board clone, and not an automated application tool.

## JT-0001 Implementation

This foundation contract includes:

- FastAPI backend package with health check.
- Deterministic job search recommendation contracts.
- Recommendation API endpoint that generates safe external search URLs.
- React, TypeScript, and Vite frontend foundation.
- Backend and frontend tests.
- Product documentation and engineering decision log.

## JT-0002 Implementation

The frontend now includes a professional multi-page product UI:

- Original JobTrackr logo and navigation shell.
- Home page with hero, supported job boards, workflow, value cards, and credibility section.
- Functional Discover Jobs page connected to the backend recommendation endpoint.
- Polished future pages for Saved Opportunities, Application Tracker, and Reports.
- Brand system using `#FF9E20`, `#215E61`, `#1D2128`, and `#F4F2F2`.

The future pages are intentionally honest placeholders. They do not show fake saved jobs, fake application data, or fake reports.

## Repository Structure

```text
backend/
frontend/
docs/
README.md
CHANGELOG.md
Makefile
```

## Backend

Run the API locally:

```bash
cd backend
python3 -m pip install -e ".[dev]"
uvicorn jobtrackr_api.main:app --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Recommendation endpoint:

```bash
curl -X POST http://127.0.0.1:8000/job-search/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "skills": [{"name": "React"}, {"name": "TypeScript"}, {"name": "SQL"}],
    "target_roles": [{"title": "Frontend Developer"}],
    "preferred_locations": [{"name": "Jakarta"}]
  }'
```

## Frontend

Run the app locally:

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend calls the backend at `http://127.0.0.1:8000`. To point it elsewhere, set `VITE_API_BASE_URL`.

Build the app:

```bash
cd frontend
npm run build
```

## Testing

Run all validation checks:

```bash
make check
```

Run focused checks:

```bash
make backend-test
make frontend-test
make frontend-build
make format-check
```

## No-Scraping Statement

JobTrackr does not scrape LinkedIn, JobStreet Indonesia, Glints, Karir.com, Dealls, or any other third-party platform. The current backend only generates deterministic external search URLs from user-selected inputs. Users open those links manually in their browser.
