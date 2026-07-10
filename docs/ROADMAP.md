# JobTrackr Roadmap

## JT-0001 - Project Bootstrap and Product Foundation

- Establish repository structure. Completed.
- Add backend FastAPI foundation. Completed.
- Add frontend React foundation. Completed.
- Define deterministic job search recommendation contracts. Completed.
- Expose recommendation API endpoint. Completed.
- Document product scope, architecture, and engineering decisions. Completed.

## JT-0002 - Frontend Job Discovery Form and Results UI

- Build skill, role, and location input UI. Completed.
- Display generated recommendation results. Completed.
- Add external search link cards. Completed.
- Connect the frontend to `POST /job-search/recommendations`. Completed.
- Add frontend tests for form validation and results rendering. Completed.
- Add professional multi-page UI foundation. Completed.
- Add original JobTrackr logo and brand system. Completed.

## JT-0003 - Saved Opportunities Foundation and Manual Job Saving Workflow

- Add persistence foundation. Completed.
- Let users manually save opportunities found through external search links. Completed.
- Store source URL, company, role, location, notes, and status. Completed.
- Keep saving manual and user-controlled. Completed.
- Add saved opportunity list, edit status/notes, delete, search, and filters. Completed.

## JT-0004 - Stitch-Inspired UI Redesign

- Inspect Stitch design package and document implementation direction. Completed.
- Redesign app shell and global navigation. Completed.
- Redesign Home page as a career-tech SaaS product surface. Completed.
- Redesign Discover Jobs while preserving deterministic backend integration. Completed.
- Redesign Saved Opportunities while preserving CRUD behavior. Completed.
- Redesign Application Tracker and Reports as honest future-feature previews. Completed.

## JT-0005 - Application Tracker Dashboard and Status Pipeline Analytics

- Build dashboard views from real saved opportunities.
- Add status pipeline counts.
- Add simple tracker analytics by source, role, location, and status.
- Keep reports grounded in local user-entered data.

## JT-0006 - Reports and Export Foundation

- Show application status counts.
- Add simple progress reports.
- Prepare export-friendly summaries.
