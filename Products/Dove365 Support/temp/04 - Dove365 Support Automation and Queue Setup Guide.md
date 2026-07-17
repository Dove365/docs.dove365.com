# Dove365 Support Automation and Queue Setup Guide

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Support admins, Power Platform admins | Draft | 1.0.0 |

## Scope / When this applies

Use this guide to understand Dove365 Support automation, default queue setup, support mailbox intake, and Queue Item behaviour.

## Configure Default Queue

Automation:

- `Configure Default Queue`

When to run:

- Manually after solution import.
- Manually when changing the default queue.

Required input:

- Default Queue GUID.

Purpose:

- Maps the configured default queue so other support automations can place new work into the correct queue.

Admin steps:

1. Create or identify the default support queue.
2. Copy the Queue GUID.
3. Set `dove365_DefaultQueueGUID`.
4. Run `Configure Default Queue`.
5. Confirm new email-created Cases are placed into that queue.

## Triage Support Emails to Queue

Automation:

- `Triage Support Emails to Queue`

Purpose:

- Reads the support mailbox.
- Creates Dove365 Support Cases from incoming support emails.
- Adds new Cases to the configured default queue.

Admin checks:

- Support mailbox address is correct.
- Outlook connection is authenticated.
- Dataverse connection is authenticated.
- Default queue GUID is configured.
- The flow can create Case and Queue Item records.

## Daily Managed Service 80% Usage Threshold

Automation:

- `Daily Managed Service 80% Usage Threshold`

Purpose:

- Identifies Managed Services at or above 80 percent usage.
- Supports proactive review before allocation is exhausted.

Interpretation:

- 80 percent or above means the Managed Service is approaching allocation.
- 100 percent means the allocation is fully used.
- More than 100 percent means over-allocation.

## Monthly Managed Services Allocation Reset

Automation:

- `Monthly Managed Services Allocation Reset`

Purpose:

- Clears or resets monthly allocation usage values for Managed Services.

Admin guidance:

- Confirm reset timing aligns with commercial support periods.
- Confirm reporting expectations before changing schedule.

## Notify Case Escelation Manager

Automation:

- `Notify Case Escelation Manager`

Purpose:

- Notifies the escalation manager when a Case is escalated.

Trigger condition:

- A Case is marked as escalated or enters the escalation path.

User guidance:

- Escalate only when manager attention is required.
- Ensure the escalation manager field is populated where required.

## Support Case - Resolve

Automation:

- `Support Case - Resolve`

Purpose:

- Closes a support Case.
- Notifies the customer when the Case is resolved.

User guidance:

- Complete resolution notes before resolving.
- Confirm all Support Activities are entered.
- Confirm Managed Service hours are accurate.

## Aggregate Managed Service Hours

Automation / plugin-supported process:

- `Aggregate Managed Service Hours`
- `Dove365.Support.Plugins.AggregateManagedServicesHours`

Purpose:

- Aggregates Support Activity hours for a Case against the related Managed Service.
- Keeps Managed Service usage, remaining hours, and usage percentage aligned with logged service work.

## Queue Item lifecycle

1. A Case is created manually or by email triage.
2. The Case is added to a Queue as a Queue Item.
3. If no user is working it, `Worked By` is blank.
4. A user picks or works the Queue Item.
5. `Worked By` is populated.
6. The Queue Item appears in that user's My Queue Items.
7. The Case is worked and eventually resolved.

## Related documents

- `08 - User Guide - Queues and Queue Items.md`
- `09 - User Guide - Cases.md`
- `03 - Dove365 Support Admin and Configuration Guide.md`

