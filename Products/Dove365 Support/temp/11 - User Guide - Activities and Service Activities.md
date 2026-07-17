# User Guide - Activities and Service Activities

## Purpose

Activities and Support Activities record work and communication around customers and Cases.

Standard Dataverse activities include tasks, appointments, phone calls, and emails. Dove365 Support Activities are used to record support work and hours against Cases.

## When to use standard activities

Use standard activities for:

- Follow-up tasks.
- Calls.
- Meetings.
- Emails.
- Customer reminders.

These activities appear in dashboards when they are open, owned by the user, and have a scheduled end date.

## When to use Support Activities

Use Support Activities when recording support work against a Case, especially where time should contribute to Managed Service usage.

Examples:

- Investigation time.
- Customer troubleshooting.
- Configuration work.
- Remote support session.
- Resolution work.

## Creating a Support Activity

Steps:

1. Open the Case.
2. Open related Support Activities.
3. Select New Support Activity.
4. Enter the subject or activity description.
5. Enter hours or time spent.
6. Enter start and end details where required.
7. Save.

## Rollup of hours

Support Activity hours are aggregated against the related Case and Managed Service.

The plugin `Dove365.Support.Plugins.AggregateManagedServicesHours` runs on Support Activity create, update, and delete.

Interpretation:

- Adding a Support Activity can increase hours used.
- Updating hours can adjust usage.
- Deleting a Support Activity can reduce usage.
- Managed Service remaining hours and usage percentage depend on accurate Support Activity data.

## Working with timeline

Use the timeline to understand communication history and recent actions.

Best practice:

- Keep customer-facing communication clear.
- Use Support Activities for time-bearing work.
- Use standard activities for reminders and scheduling.

## Best practice

- Log work as soon as it is completed.
- Do not wait until Case closure to add all hours.
- Use clear notes so another user can understand the work performed.
- Confirm hours before resolving the Case.

