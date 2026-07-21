# Dove365 Support Release Notes

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Administrators, support managers, support users | Draft | 1.0.0 |

## Scope / When this applies

This document applies to the Dove365 Support solution and its supporting documentation, dashboards, automations, security roles, and user workflows.

Dove365 Support depends on Dove365 Common and should be installed after the Common solution.

## Release 1.0.0 - Dove365 Support

### Summary

Dove365 Support provides a model-driven support workspace for managing customers, contacts, managed services, support cases, service activities, categories, queues, queue items, and support dashboards.

### Initial features

- Dove365 Support model-driven app.
- Support-focused Account and Contact forms.
- Case management using `dove365_case`.
- Managed Service records for contracted support allocation and usage.
- Service Offering lookup usage for classifying support coverage.
- Support Activity records for logging time against Cases.
- Category and Subcategory administration for Case classification.
- Queue and Queue Item handling for default queue intake, user queues, and picked work.
- Organisation-wide Support Dashboard.
- Personal My Support Work Dashboard.
- Support overview and training web resources.
- Automation for support email triage, default queue configuration, managed service usage, monthly allocation reset, escalation notifications, and case resolution.
- Plugin support for aggregating Support Activity hours against Managed Services.
- Security roles for Support User, Support Account Manager, and Support Admin.

### Post-deployment checks

After importing the solution:

1. Assign the required Support security roles to users.
2. Configure the `dove365_DefaultQueueGUID` environment variable.
3. Configure the support mailbox address environment variable.
4. Run the `Configure Default Queue` automation manually and provide the default queue GUID.
5. Confirm the support mailbox connection is signed in and enabled.
6. Confirm `Triage Support Emails to Queue` can create Cases and Queue Items.
7. Create or confirm Categories and Subcategories.
8. Confirm Service Offerings exist in Dove365 Common.
9. Confirm Managed Service records can be created by account managers.
10. Open both dashboards inside the model-driven app and confirm Dataverse data loads.

### Known interpretation notes

- Queue item counts and case counts are different measures.
- `My Queue Items` counts Queue Items where the signed-in user is set as `Worked By`.
- `My Open Cases` counts active Cases represented in the signed-in user's queue.
- `Cases Available to Pick` counts unassigned Queue Items in the configured default queue.

## Definitions

- Case: a support request, issue, complaint, change request, billing query, or general enquiry tracked in Dove365 Support.
- Queue Item: a Dataverse queue record that places a Case into a queue for triage, pickup, or work allocation.
- Worked By: the standard Queue Item user lookup used to indicate who is actively working an item.
- Managed Service: a support contract or allocation record linked to an Account and Service Offering.
- Support Activity: a time-based support activity record used to record work performed against a Case.

## Related documents

- `01 - Dove365 Support User Guide.md`
- `02 - Dove365 Support Dashboards User Guide.md`
- `03 - Dove365 Support Admin and Configuration Guide.md`
- `04 - Dove365 Support Automation and Queue Setup Guide.md`

