# JobTrackr Demo Assets

This document defines the screenshot plan, demo data policy, and portfolio asset checklist for JT-0008.

JobTrackr screenshots must come from the actual running local app. They are product evidence, not mockups.

## Screenshot Inventory

Store screenshots under `assets/screenshots/`.

### Desktop

- `home-desktop.png` - Home page product overview.
- `discover-desktop.png` - Discover Jobs form before recommendation submission.
- `recommendations-desktop.png` - Discover Jobs recommendation results with external platform links.
- `saved-opportunities-desktop.png` - Saved Opportunities workspace with fictional saved records.
- `tracker-dashboard-desktop.png` - Application Tracker dashboard using fictional saved records.
- `reports-desktop.png` - Reports page using fictional saved records.
- `html-report-desktop.png` - Standalone career progress HTML report.

### Mobile

- `home-mobile.png` - Home page responsive view.
- `discover-mobile.png` - Discover Jobs responsive form.
- `saved-opportunities-mobile.png` - Saved Opportunities responsive workspace.
- `tracker-mobile.png` - Application Tracker responsive dashboard.
- `reports-mobile.png` - Optional Reports responsive view.

## Fictional Demo Data Policy

Screenshots may use fictional records only. Demo records should be clearly suitable for screenshots and should never be presented as real job listings.

Approved fictional examples:

- Companies: Nusantara Digital, Orbit Labs, Meraki Studio, Sagara Tech, BrightPath Academy.
- Roles: Frontend Developer Intern, Data Analyst Intern, Backend Engineer Intern, Product Analyst Intern.
- Locations: Jakarta, Bandung, Remote, Tangerang.
- Sources: LinkedIn, JobStreet Indonesia, Glints, Karir.com, Dealls.
- Skills: React, TypeScript, SQL, Python, FastAPI, UI/UX.

Do not expose:

- Real saved opportunity data.
- Private notes.
- Personal job search records.
- Terminal output.
- Browser developer tools.
- Stack traces.
- Local filesystem paths.
- SQLite internals or database files.

## Product Boundaries

Every screenshot and README preview must preserve the product's honest scope:

- JobTrackr generates safe external search links.
- JobTrackr does not scrape LinkedIn, JobStreet Indonesia, Glints, Karir.com, Dealls, or any third-party job board.
- JobTrackr does not ingest real-time job listings.
- Saved opportunities are manually entered by the user.
- Tracker analytics and reports are generated from manually saved opportunities.
- JobTrackr does not use AI/LLM ranking or recommendations.
- JobTrackr does not automate job applications.

## Capture Requirements

- Capture actual app screens from the local frontend and backend.
- Use a clean viewport without terminal, devtools, bookmarks, or private browser state.
- Use desktop screenshots around 1280px wide.
- Use mobile screenshots around 390px wide and manually validate 320px.
- Confirm no horizontal overflow before committing screenshots.
- Confirm text is readable and cards/forms do not break on mobile.
- Confirm screenshot paths resolve from the README.
- Do not commit SQLite database files.

## Recommended Capture Flow

1. Start backend and frontend locally.
2. Use an isolated fictional demo database or clearly removable fictional demo records.
3. Capture Home desktop.
4. Capture Discover Jobs desktop before submission.
5. Submit `React, TypeScript, SQL`, `Frontend Developer, Web Developer`, and `Jakarta, Remote`.
6. Capture recommendation results desktop.
7. Capture Saved Opportunities desktop with fictional saved records.
8. Capture Application Tracker desktop using the same fictional records.
9. Capture Reports desktop using the same fictional records.
10. Capture standalone HTML report desktop.
11. Repeat the core screens at mobile width.
12. Restore or remove local demo records after capture.

## JT-0008 Status

- Screenshot plan documented.
- Desktop screenshots captured:
  - `assets/screenshots/home-desktop.png`
  - `assets/screenshots/discover-desktop.png`
  - `assets/screenshots/recommendations-desktop.png`
  - `assets/screenshots/saved-opportunities-desktop.png`
  - `assets/screenshots/tracker-dashboard-desktop.png`
  - `assets/screenshots/reports-desktop.png`
  - `assets/screenshots/html-report-desktop.png`
- Mobile screenshots captured:
  - `assets/screenshots/home-mobile.png`
  - `assets/screenshots/discover-mobile.png`
  - `assets/screenshots/saved-opportunities-mobile.png`
  - `assets/screenshots/tracker-mobile.png`
  - `assets/screenshots/reports-mobile.png`
- 320px overflow check passed for Home, Discover, Saved Opportunities, Application Tracker, and Reports.
- README preview pending.
- Showcase checklist pending.
