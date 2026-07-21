# Dove365 Support Dashboards User Guide

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Support users, managers, administrators | Draft | 1.0.0 |

## Scope / When this applies

Use this guide to understand the Support Dashboard and My Support Work Dashboard.

Both dashboards must be opened inside the Dove365 Support model-driven app so they can access Dataverse and the current user context.

## My Support Work Dashboard

The My Support Work Dashboard is personal to the signed-in user.

It shows:

- Active Cases in the user's queue.
- Queue Items worked by the user.
- Cases available to pick in the default queue.
- Upcoming and overdue activities owned by the user.
- Cases requiring attention.
- Managed Service context related to the user's queue Cases.

Key interpretation:

- `My Open Cases` is a Case count for Cases in your queue.
- `My Queue Items` is a Queue Item count where `Worked By` is you.
- `Cases Available to Pick` is an unassigned Queue Item count in the default queue.
- Queue item counts and Case counts can differ.

## How to use My Work

1. Review `Overdue Tasks` and overdue activities.
2. Review `My Queue Items` to see what is already being worked by you.
3. Review `Cases Available to Pick` to pick new unassigned work from the default queue.
4. Review `Cases Requiring Attention` for exceptions such as overdue, critical, escalated, or missing data.
5. Open Case rows directly from the dashboard to continue work.

## Support Dashboard

The Support Dashboard is an organisation-wide operational dashboard.

It shows:

- Support KPIs.
- Queue volumes.
- Queue age.
- Queue item assignment.
- Case distributions by status, priority, category, and source.
- Case volume trends.
- Managed service utilisation.
- Open Cases and Managed Services requiring attention.

Use this dashboard for team and operational oversight.

## Kanban Board

The Kanban Board is an operational queue work page.

It shows active Queue Items as Case cards grouped by work state:

- Awaiting Triage.
- Assigned.
- In Progress.
- Escalated.

Users can filter by queue, priority, source, type, and search text. They can open Cases, pick up work, assign work to Dove365 users, release work back to triage, and escalate Cases to an escalation manager.

## Dashboard filters

The Support Dashboard includes filters for date range, queue, case status, and priority.

The My Support Work Dashboard does not include a filter bar. It automatically scopes data to the signed-in user, user queues, worked queue items, and the default queue.

## Dashboard troubleshooting

If data appears missing:

1. Confirm the dashboard is opened inside the model-driven app.
2. Confirm the user has the correct security role.
3. Confirm the default queue environment variable is configured.
4. Confirm queue items exist and point to active Dove365 Cases.
5. Confirm `Worked By` is populated for items expected in `My Queue Items`.
6. Open the browser console and check dashboard diagnostics.

## Definitions

- Organisation-wide dashboard: dashboard that shows cross-user and cross-queue support operations.
- Personal dashboard: dashboard that uses the signed-in user context.

## Related documents

- `Dove365 Support Dashboard Guide.md`
- `Dove365 My Support Work Dashboard Guide.md`
- `13 - User Guide - Kanban Board.md`
