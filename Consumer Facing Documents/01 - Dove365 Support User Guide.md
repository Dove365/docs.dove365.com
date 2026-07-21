# Dove365 Support User Guide

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Support users, account managers, support admins | Draft | 1.0.0 |

## Scope / When this applies

Use this guide when working day to day in the Dove365 Support model-driven app. It covers the user lifecycle from customer records through Cases, Queues, Managed Services, Support Activities, and dashboards.

## How users should start each day

1. Open the Dove365 Support app.
2. Open the My Work dashboard.
3. Review `My Queue Items` to see work currently assigned to you through Queue Item `Worked By`.
4. Review `My Open Cases` to see active Cases in your queue.
5. Review `Cases Available to Pick` to understand unassigned work in the default queue.
6. Review overdue activities before starting new work.
7. Open high-priority or overdue Cases first.

## Accounts

Accounts represent customer organisations.

Support users can read and update Accounts where permitted. Account Managers can create and manage Accounts. Admins can fully manage Account data.

Use Account records to:

- Store customer organisation details.
- Review related Contacts.
- Review related Cases.
- Review related Managed Services.
- View activity history.

## Contacts

Contacts represent people at customer organisations.

Use Contact records to:

- Store the customer's support contact details.
- Link Cases to the correct person.
- Track activities and communications.
- Understand account relationships.

## Service Offerings

Service Offerings define what type of service is being provided.

Support users select Service Offerings on Cases and Managed Services. Creation and administration of Service Offerings is handled in the Dove365 Admin/Common area and is not covered in this user guide.

## Managed Services

Managed Services represent contracted support allocations for an Account and Service Offering.

Use Managed Services to:

- Track monthly support allocation.
- Track hours used.
- Track hours remaining.
- Identify services approaching or exceeding allocation.
- Provide context when working Cases.

## Cases

Cases are the core support work records.

Users create Cases manually or Cases can be created automatically from the support mailbox. Cases should be linked to the correct Account, Contact, Category, Subcategory, Service Offering, and Managed Service where applicable.

## Support Activities

Support Activities record work performed against a Case.

Use Support Activities to:

- Log time spent.
- Capture support notes.
- Feed hour rollups for Managed Services.
- Maintain a clear service delivery history.

## Queues and Queue Items

Queues control support work intake and allocation.

Queue Items are created when a Case is placed in a queue. Users can pick queue items, which sets the Queue Item `Worked By` value.

Important:

- Queue Items are not the same as Cases.
- A Case can be represented by a Queue Item.
- `Worked By` identifies who is actively working the Queue Item.
- The default queue is used for email triage and unassigned intake.

## Dashboards

Use the dashboards to understand workload.

- Support Dashboard: organisation-wide operational view.
- My Work Dashboard: personal view for the signed-in user.
- Kanban Board: queue work board for picking, assigning, progressing, releasing, and escalating Cases.

## Definitions

- Default Queue: the configured intake queue for new support email Cases.
- Pick: the user action that marks a Queue Item as being worked by the user.
- Escalation Manager: the user notified when a Case is escalated.

## Related documents

- `08 - User Guide - Queues and Queue Items.md`
- `09 - User Guide - Cases.md`
- `12 - User Guide - Dashboards.md`
- `13 - User Guide - Kanban Board.md`
