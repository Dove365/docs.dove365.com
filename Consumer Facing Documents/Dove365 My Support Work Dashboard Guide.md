# Dove365 My Support Work Dashboard Guide

This guide explains how the Dove365 My Support Work dashboard works, what each visual represents, and how users should interpret the data shown in the dashboard.

The dashboard is a personal operational workspace for the signed-in user. It is not an organisation-wide support report. It is designed to help each support user understand their own active queue work, worked queue items, activities, and case exceptions.

## Dashboard Scope

The dashboard reads live Dataverse data inside the Dove365 Support model-driven app.

The main data sources are:

- Support Cases: `dove365_case`
- Queue Items: standard Dataverse `queueitem`
- Queues: standard Dataverse `queue`
- Activities: `activitypointer`
- Managed Services: `dove365_managedservices`

The dashboard uses the current signed-in Dataverse user from the model-driven app context. It does not use a hardcoded user ID.

Case-based tables and counts are limited to active unresolved Dove365 Support Cases where possible. Queue visuals are based on standard Dataverse Queue Item records and the `Worked By` lookup.

## Personal Workload Logic

The dashboard separates three different concepts that can look similar but mean different things.

### Cases in Your Queue

These are active Dove365 Support Cases that are represented by queue items in queues owned by the signed-in user.

This drives:

- `My Open Cases`
- `My Critical Cases`
- `My Cases`
- `Cases Requiring Attention`

Interpret this as: work currently sitting in your personal queue.

### Queue Items Worked By You

These are Queue Item records where `workerid` / `Worked By` is the signed-in user.

This drives:

- `My Queue Items`
- `My Queue Work`

This is intentionally not limited to your own queue. If you pick or work an item from another queue, it should be represented here.

Interpret this as: queue work currently assigned to or being worked by you.

### Cases Available to Pick

These are Queue Items in the configured default queue where `Worked By` is blank.

This drives:

- `Cases Available to Pick`

Interpret this as: unassigned work available in the default support queue.

## KPI Tiles

The KPI tiles provide a quick summary of the signed-in user's support workload.

### My Open Cases

Counts active unresolved Cases in the signed-in user's queue.

Use this to understand how much case work is currently waiting in your own queue.

This is a case count, not a queue item count. If one Case has multiple queue items, the dashboard attempts to represent the Case once in this tile.

### My Critical Cases

Counts active Cases in your queue where priority is Critical.

Use this tile as an immediate-risk indicator. Critical Cases should normally be reviewed before lower-priority work.

### My Queue Items

Counts Queue Items where `Worked By` is the signed-in user.

This tile represents queue items, not unique Cases. It can differ from `My Cases` because a user can work queue items across queues, and because queue item counts are not always the same as case counts.

Clicking the tile opens the Queue Item table/list in the model-driven app.

### Cases Available to Pick

Counts Queue Items in the configured default queue where no user is set in `Worked By`.

Use this to identify unassigned work that may need to be picked or triaged.

This is based on the default queue environment configuration, not the signed-in user's personal queue.

### Upcoming Tasks

Counts open dated activities owned by the signed-in user where the due date is in the future.

The label follows the CRM My Work dashboard pattern, but the underlying data is open scheduled activities from `activitypointer`, not only Task records.

Use this to understand near-term planned work.

### Overdue Tasks

Counts open dated activities owned by the signed-in user where the due date is in the past.

The label follows the CRM My Work dashboard pattern, but the underlying data is open scheduled activities from `activitypointer`, not only Task records.

Use this as a personal follow-up risk indicator.

## Upcoming Activities

This section lists the next open activities owned by the signed-in user.

Activities are loaded from `activitypointer` where:

- Owner is the current user.
- State is active/open.
- Scheduled end date is populated.
- Due date is in the future.

The list shows:

- Activity subject
- Activity type
- Regarding record
- Due date and time

Interpretation:

- The first items are the most immediate upcoming activities.
- If this section is empty, there are no open future-dated activities found for the current user.

## Open Activities by Type

This visual groups the signed-in user's open dated activities by activity type.

Examples can include:

- Task
- Appointment
- Phone Call
- Email
- Support Activity

Interpretation:

- Longer bars indicate more open work of that type.
- This is useful for understanding the shape of your work, such as whether your activity load is mainly calls, tasks, or appointments.
- The chart only represents open activities owned by you.

## My Cases

This table shows active unresolved Cases in the signed-in user's queue.

Columns include:

- Case
- Account
- Contact
- Priority
- Status
- Category
- Managed Service
- Target Resolution

Rows are sorted to bring urgent work forward:

- Critical priority first
- Overdue target dates next
- Earliest target resolution dates next
- Oldest created Cases after that

Interpretation:

- This is your active queue case list.
- Cases with missing account, contact, category, or managed service context may appear again in `Cases Requiring Attention`.
- Clicking a row opens the Case record.

## My Queue Work

This table shows Case-related Queue Items where `Worked By` is the signed-in user.

Columns include:

- Case
- Work Type
- Queue
- Account
- Priority
- Status
- Entered Queue
- Queue Age

The `Work Type` column explains how the queue item relates to the user:

- `Worked by you`: the Queue Item has you in `Worked By`.
- `Your queue, worked by you`: the Queue Item is both in your queue and worked by you.

Interpretation:

- This is the best section for seeing what you are actively working, regardless of which queue the item came from.
- Queue Age is based on the Queue Item `enteredon` date.
- Older queue ages may indicate work that has been held too long.

## Cases Requiring Attention

This section highlights active Cases in the signed-in user's queue that may need review.

Reasons can include:

- Critical
- Overdue
- Escalated
- Triage
- Missing customer
- Missing contact
- No category
- No Managed Service
- Managed Service at allocation

Interpretation:

- A Case can have more than one attention reason.
- Use this as an exception list, not a full workload list.
- Review this section regularly to catch data quality gaps and operational risks.

## Overdue Activities

This table shows open dated activities owned by the signed-in user where the due date is in the past.

Columns include:

- Activity
- Type
- Regarding
- Due

Interpretation:

- Older overdue activities should be reviewed first.
- If this section is empty, no overdue open activities were found for the current user.
- Clicking a row opens the underlying activity record.

## Managed Service Context

The dashboard does not show organisation-wide managed service analytics.

Managed Service information is shown only where it helps interpret a Case, such as in the `My Cases` table. When available, the dashboard can show:

- Managed Service name
- Usage percentage
- Hours remaining

Interpretation:

- A Case linked to a heavily used or exhausted Managed Service may require closer commercial or service delivery review.
- A Case flagged as managed-service related but missing a Managed Service link may appear in `Cases Requiring Attention`.

## Refresh Behaviour

Use `Refresh dashboard` to reload the dashboard without refreshing the full browser page.

When refreshed:

- Queue items are reloaded.
- Activities are reloaded.
- Cases are resolved from related queue items.
- Managed Service context is refreshed.
- The Updated timestamp changes after loading finishes.

The refresh button is disabled while loading to prevent duplicate requests.

## Empty and Error States

Each section has an empty state when no matching records are found.

Examples:

- `No open Cases in your queue`
- `No queue items are currently worked by you`
- `No upcoming activities`
- `No overdue activities`

If a query fails, the dashboard logs technical details to the browser console and shows a friendly message in the dashboard. One failed section should not prevent all other sections from loading.

## Important Interpretation Notes

Queue item counts and case counts are not always the same.

- `My Queue Items` counts Queue Item records.
- `My Open Cases` counts active Cases in your queue.
- `Cases Available to Pick` counts unassigned Queue Items in the default queue.

A Queue Item can exist without resolving cleanly to an active Dove365 Case. In that situation, a KPI based on queue items may be higher than a Case table count.

The dashboard is personal to the signed-in user.

- It does not show organisation-wide case totals.
- It does not show team performance.
- It does not include sales pipeline, revenue, leads, or opportunities.

Use the landing Dove365 Support Dashboard for organisation-wide operational reporting. Use this dashboard for your own day-to-day workload.
