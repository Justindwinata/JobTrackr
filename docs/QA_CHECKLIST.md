# JobTrackr QA Checklist

This checklist supports JT-0007 stabilization and portfolio demo readiness.

## Pre-Flight

- Confirm backend starts with `cd backend && python3 -m uvicorn jobtrackr_api.main:app --reload`.
- Confirm frontend starts with `cd frontend && npm run dev`.
- Confirm `make check` passes before demo recording or screenshots.
- Confirm local SQLite data is either intentionally empty or intentionally seeded for demo.
- Confirm the app never claims scraping, real-time job listings, job board API access, AI recommendations, or automated applications.

## Discover Jobs

- Submit default skills, roles, and locations.
- Confirm recommendation cards render for each role/location combination.
- Confirm LinkedIn, JobStreet Indonesia, Glints, Karir.com, and Dealls external links appear.
- Confirm external links open in a new tab and use safe search URLs.
- Submit empty skills, roles, or locations and confirm validation is clear.
- Stop the backend and confirm the backend-down error state is understandable.
- Confirm the “Found a matching job? Save it manually” CTA routes to Saved Opportunities.

## Saved Opportunities

- Create an opportunity with valid company, role, source, URL, location, status, priority, skills, and notes.
- Submit an invalid URL and confirm validation is visible and specific.
- Confirm the new opportunity appears in the list without page reload.
- Search by company, role, or location.
- Filter by status.
- Open edit mode and update status and notes.
- Delete a temporary QA opportunity and confirm it disappears.
- Confirm empty state is polished when no opportunities exist.
- Confirm the form remains usable at 390px and 320px widths.

## Application Tracker

- Confirm empty tracker state directs the user to save an opportunity.
- Create or use a saved opportunity and confirm summary cards update.
- Confirm pipeline groups saved opportunities by Wishlist, Applied, Screening, Interview, Offer, Rejected, and Archived.
- Confirm status, source, and priority distribution bars reflect real saved records.
- Confirm upcoming deadlines and overdue opportunities are derived from saved opportunity deadlines.
- Confirm recent activity is ordered by latest updates.
- Confirm no fake tracker records or fake analytics appear.

## Reports

- Confirm empty report state directs the user to save opportunities first.
- Create or use a saved opportunity and confirm report overview cards update.
- Confirm status, source, and priority distribution sections render.
- Confirm pipeline, deadlines, overdue opportunities, and recent activity render from real records.
- Confirm refresh reloads report data.
- Confirm “Open HTML report” opens `/reports/career-progress.html`.
- Confirm report copy states manual saved opportunities, no scraping, no fake listings, and no AI-generated ranking.

## HTML Report

- Open `http://127.0.0.1:8000/reports/career-progress.html`.
- Confirm JobTrackr branding, report title, generated timestamp, summary cards, distributions, pipeline, deadlines, overdue opportunities, and recent activity are visible.
- Confirm the footer states the no-scraping and no-fake-listings boundary.
- Confirm user-entered content is escaped in backend tests.
- Confirm no PDF export is claimed.

## Responsive Views

- Check Home, Discover, Saved, Tracker, Reports, and HTML report at 1280px.
- Check Home, Discover, Saved, Tracker, Reports, and HTML report at 1024px.
- Check Home, Discover, Saved, Tracker, Reports, and HTML report at 768px.
- Check Home, Discover, Saved, Tracker, Reports, and HTML report at 390px.
- Check Home, Discover, Saved, Tracker, Reports, and HTML report at 320px.
- Confirm there is no page-level horizontal overflow.
- Confirm mobile navigation opens, closes, and routes correctly.

## Accessibility Basics

- Confirm all primary buttons and links are keyboard reachable.
- Confirm focus states are visible.
- Confirm form fields have labels.
- Confirm loading states use `aria-live` where useful.
- Confirm error messages use `role="alert"` where useful.
- Confirm external links have readable labels.
