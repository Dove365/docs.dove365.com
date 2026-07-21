# Dove365 Support Dashboard Guide

This guide explains how the Dove365 Support Dashboard works, what each filter changes, how each visual represents the data, and how users should interpret the numbers shown on the dashboard.

The dashboard is designed for operational support reporting inside the Dove365 model-driven app. It reads live Dataverse data for support cases, queue items, managed services, queues, and related lookup values.

## Dashboard Scope

The dashboard focuses on active support operations:

- Case-based visuals use `dove365_case`.
- Queue visuals use standard Dataverse `queueitem` records.
- Managed service visuals use `dove365_managedservices`.
- Active case queries exclude inactive cases by filtering `statecode eq 0`.
- Active managed service queries also filter `statecode eq 0`.
- Queue names containing `#` are excluded from the queue list.

The dashboard is intended to be opened inside the Dove365 model-driven app. If it is opened outside that context, the Dataverse Web API and navigation features may not be available.

## Filters

The filter bar controls the data shown across the dashboard.

### From and To

The date range is based on case created date for created-case reporting.

- `From` filters cases where `createdon` is on or after the selected date.
- `To` filters cases where `createdon` is on or before the selected date.
- The default date range is the current month to today.
- Resolved-case trend data uses the selected range against `dove365_resolveddate`.

Use the date range to answer questions such as: "How many active cases were created this month?" or "What does recent case volume look like?"

### Queue

The queue filter restricts queue item loading to the selected queue.

When a queue is selected:

- Queue visuals only show queue items from that queue.
- Case KPIs and queue-backed calculations are scoped to cases represented by queue items in that queue.
- Case distribution and volume visuals are narrowed to cases that can be matched to queue items in the selected queue.

Important interpretation note: queue charts count queue items, while case KPIs count cases. If one case has more than one queue item, queue item totals can be higher than case counts.

### Case Status

The status filter applies to case queries using `statuscode`.

It affects:

- Active cases created in the selected period.
- Open active cases.
- Case distribution charts.
- Operational case tables.

The available status options are populated from the loaded case data.

### Priority

The priority filter applies to case queries using `dove365_priority`.

It affects:

- Active cases created in the selected period.
- Open active cases.
- Critical case counts.
- Priority distribution.
- Operational case tables.

The available priority options are populated from the loaded case data.

### Apply, Reset, and Refresh

- `Apply filters` reads the current filter values and reloads the dashboard.
- `Reset filters` returns the dashboard to the default current-month date range and clears queue, status, and priority.
- `Refresh dashboard` reloads using the current filter values.

## KPI Tiles

The KPI tiles give a quick operational summary.

### Open Cases

Counts active unresolved cases that are represented by active queue items.

Use this as the queue-backed open workload count. This can be lower than the total open case table if some active cases do not currently have queue items.

### New Cases

Counts active queued cases created within the selected date range.

This is not a count of all active cases in the system. It is limited to active cases that are connected to active queue items and whose created date falls inside the selected range.

### Critical Cases

Counts active queued open cases where priority equals the configured critical priority value.

This tile is intended to highlight immediate support risk in the queued workload.

### Awaiting Triage

Counts active queued open cases where the status is blank or matches the dashboard's triage status values.

This helps identify work that may not yet have been fully classified or progressed.

### Active Managed Services

Counts active managed service records.

This is independent from the queue-backed case KPIs. It represents active managed-service records, not case volume.

## Queue Overview

### Queue Items by Queue

Shows current queue item volume by queue.

Each bar represents the number of queue items currently associated with active cases. The default queue is marked with `(Default)` when the environment variable `dove365_DefaultQueueGUID` is available.

How to interpret:

- Larger bars indicate more queued work in that queue.
- This is a queue item count, not a unique case count.
- If a case appears in more than one queue item, it may contribute more than once to queue item totals.

### Queue Age

Groups active case queue items by how long they have been in the queue, based on `enteredon`.

Buckets are:

- Under 4 hours
- 4-8 hours
- 8-24 hours
- 1-3 days
- Over 3 days

How to interpret:

- Older queue items indicate work that may be stuck or waiting too long before action.
- The `Over 3 days` bucket should usually be reviewed first.

### Queue Item Assignment

Shows queue item assignment using the standard queue item `Worked By` lookup.

- `Unassigned` means the queue item has no worked-by user.
- `Currently being worked on` means the queue item has a worked-by user.

How to interpret:

- A high unassigned count can indicate queue backlog or triage gaps.
- A high worked-on count can indicate active handling, but it should be compared with queue age to understand whether work is moving quickly enough.

## Case Distribution

Case distribution visuals use active cases in the selected date range, with queue scoping applied when a queue is selected.

### Cases by Status

Shows the count of cases grouped by status.

Use this to understand where cases sit in the support process, such as New, Queued, In Progress, Waiting, Delayed, or Inactive labels returned by Dataverse.

### Cases by Priority

Shows the count of cases grouped by priority.

Use this to understand operational risk. Critical and High priorities should be reviewed against queue age and target resolution dates.

### Cases by Category

Shows the count of cases grouped by case category lookup.

Cases without a category are shown as `Uncategorised`.

Use this to identify common support themes and data quality gaps.

### Cases by Source

Shows the count of cases grouped by source.

Use this to understand which channels are generating support demand.

## Case Volume Trends

### Cases Created by Month

Shows active cases created by month within the selected date range.

How to interpret:

- Taller bars indicate higher case creation volume.
- The visual is based on case created date.
- Because inactive cases are excluded from active case queries, this is a view of active cases created in the period rather than every case ever created.

### Created vs Resolved by Month

Compares active cases created by month with cases resolved by month.

How to interpret:

- Created bars show active cases created in each month.
- Resolved bars use `dove365_resolveddate` in the selected date range.
- If created volume is consistently higher than resolved volume, backlog may be increasing.
- If resolved volume is higher than created volume, backlog may be reducing.

## Managed Services Overview

### Utilisation Band

Groups active managed services by `dove365_hoursusedpercentage`.

Bands are:

- Under 50%
- 50-79%
- 80-99%
- Exactly 100%
- Over 100%

How to interpret:

- `Under 50%` generally indicates low consumption.
- `50-79%` indicates moderate consumption.
- `80-99%` indicates services approaching allocation.
- `Exactly 100%` indicates fully used allocation.
- `Over 100%` indicates over-allocation and should be reviewed.

### Managed Services Requiring Attention

Counts active managed service records at or above 80% utilisation.

It breaks the total into:

- `80-99%`
- `Fully used`
- `Over allocation`

How to interpret:

- Review over-allocation first.
- Review fully used services next.
- Use 80-99% as an early warning list for proactive customer management.

## Operational Tables

### Open Cases

Shows active cases sorted by urgency.

Sorting rules:

- Critical priority first.
- Earliest target resolution date next.
- Oldest created date next.

Columns include:

- Case number
- Title
- Priority
- Status
- Account
- Contact
- Category
- Managed Service
- Created date
- Target resolution date
- Owner

Rows are clickable and open the related case record in the model-driven app.

### Managed Services Requiring Attention

Shows active managed services at or above 80% utilisation.

Rows are sorted by highest usage percentage first.

Columns include:

- Managed Service
- Account
- Service Offering
- Allocation hours
- Hours used
- Hours remaining
- Usage percentage
- End date
- Status

Rows are clickable and open the related managed service record.

## Important Interpretation Notes

### Queue Items vs Cases

The dashboard intentionally distinguishes between queue items and cases.

- Queue visuals count queue items.
- Case KPI tiles count cases that are represented by active queue items.
- Operational case tables can include active cases based on the case query and current filters.

This means queue totals and case totals do not always match exactly. The most common reasons are:

- One case may have more than one queue item.
- Some active cases may not currently have a queue item.
- Queue filtering can narrow the case view to cases represented by queue items in the selected queue.

### Active Records

Inactive cases are excluded from active case queries by `statecode eq 0`. Inactive managed services are also excluded from active managed service queries.

If a number looks lower than expected, check whether the missing records are inactive.

### Date Range Behaviour

The dashboard's date range primarily uses case created date. Resolved trend data uses resolved date.

This means:

- A case created before the selected date range may not appear in created-case visuals.
- A case resolved during the selected range can appear in resolved trend data even if it was created earlier.

### Status and Priority Options

Status and priority filter options are populated from the loaded case data. If a status or priority does not exist in the current result set, it may not appear as a selectable filter option.

### Managed Services Are Not Date Filtered

Managed service records are loaded as active records and are not filtered by the case created-date range. Their utilisation visuals therefore represent current active managed service state, not only managed services related to cases created in the selected period.

## Recommended Usage

Use the dashboard in this order:

1. Start with the KPI tiles to understand current queue-backed workload.
2. Review Queue Overview to identify backlog, ageing, and assignment gaps.
3. Use Case Distribution to understand the shape of active demand.
4. Use Case Volume Trends to see whether demand and resolution are balanced.
5. Review Managed Services Overview for utilisation risk.
6. Use Operational Tables to open and act on specific records.

For daily support operations, pay particular attention to:

- Critical cases
- Awaiting triage
- Queue items over 3 days old
- Unassigned queue items
- Managed services over 100% utilisation
- Open cases with near or overdue target resolution dates
