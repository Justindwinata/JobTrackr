# JobTrackr Demo Script

This script supports local portfolio demos and screenshot capture.

## Demo Setup

Start the backend:

```bash
cd backend
python3 -m uvicorn jobtrackr_api.main:app --reload
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Run validation before recording:

```bash
make check
```

## Recommended Demo Record

Use fictional data only. Do not present demo entries as real job listings.

```text
Company: Nusantara Product Lab
Role: Frontend Developer Intern
Source: LinkedIn
Job URL: https://www.linkedin.com/jobs/view/demo-jobtrackr
Location: Jakarta
Work type: Hybrid
Employment type: Internship
Status: Applied
Priority: High
Deadline: choose a future date
Required skills: React, TypeScript, CSS
Notes: Fictional demo opportunity for portfolio walkthrough.
```

Delete demo records after screenshots if they are not needed anymore.

## Walkthrough

1. Open Home.
   - Show the product positioning and no-scraping boundary.
   - Mention that JobTrackr is a manual tracking workflow, not a job scraper.

2. Open Discover Jobs.
   - Use `React, TypeScript, SQL` as skills.
   - Use `Frontend Developer, Web Developer` as target roles.
   - Use `Jakarta, Remote` as preferred locations.
   - Generate recommendations.
   - Show external search links for LinkedIn, JobStreet Indonesia, Glints, Karir.com, and Dealls.

3. Open Saved Opportunities.
   - Save a fictional opportunity manually.
   - Show status/source/priority badges.
   - Search for the company.
   - Filter by status.
   - Edit status and notes.

4. Open Application Tracker.
   - Show overview cards.
   - Show status pipeline.
   - Show status/source/priority distributions.
   - Show upcoming deadlines and recent activity.

5. Open Reports.
   - Show report overview cards.
   - Show distributions and pipeline summary.
   - Open the standalone HTML report.
   - Mention that reports are generated from manually saved opportunities only.

## Screenshot Checklist

- Home hero and workflow preview.
- Discover Jobs results with external platform buttons.
- Saved Opportunities form and saved card.
- Application Tracker dashboard with pipeline visible.
- Reports page with summary and distributions.
- Standalone HTML report.

## Demo Boundaries

- No scraping.
- No real-time listings.
- No external job board API integration.
- No AI-generated recommendation or ranking.
- No automated applications.
- No PDF export.
- No authentication or cloud database yet.
