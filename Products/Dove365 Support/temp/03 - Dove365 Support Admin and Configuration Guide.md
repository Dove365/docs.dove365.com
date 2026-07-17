# Dove365 Support Admin and Configuration Guide

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Support admins, system administrators | Draft | 1.0.0 |

## Scope / When this applies

Use this guide when configuring Dove365 Support after installation or when maintaining reference data and administration settings.

## Required admin actions after import

1. Assign security roles.
2. Configure environment variables.
3. Confirm the default queue exists.
4. Run `Configure Default Queue` manually.
5. Confirm support mailbox automation is enabled.
6. Confirm Categories and Subcategories exist.
7. Confirm Service Offerings exist in Dove365 Common.
8. Confirm dashboards are available in the app.

## Environment variables

### Default Queue GUID

Environment variable:

- `dove365_DefaultQueueGUID`

Purpose:

- Identifies the default queue used by support email triage and dashboard available-to-pick logic.

Admin action:

1. Open the Queue record that should be used as the default intake queue.
2. Copy the Queue GUID.
3. Set the `dove365_DefaultQueueGUID` environment variable.
4. Run `Configure Default Queue` manually and provide the default queue GUID.

### Support Mailbox Address

Purpose:

- Identifies the mailbox monitored by the support triage automation.

Admin action:

1. Confirm the mailbox exists.
2. Confirm the Outlook connection reference is authenticated.
3. Set the mailbox address environment variable.
4. Test the email triage flow using a controlled support email.

## Categories and Subcategories

Categories and Subcategories are managed by users with the Dove365 Support Admin role.

Use them to standardise Case classification.

Admin guidance:

- Keep category names clear and support-focused.
- Use subcategories only where they improve reporting or routing.
- Retire unused values by deactivating rather than deleting where historical records exist.

## Service Offerings

Service Offerings are managed in the main Dove365 Admin/Common guides.

Support admins use Service Offerings in Dove365 Support for:

- Case classification.
- Managed Service setup.
- Support coverage context.

Do not create duplicate Service Offerings in Support-specific workflows.

## Queues

Queues are critical to Dove365 Support.

Admins should maintain:

- A configured default intake queue.
- User or team queues for routing work.
- Queue security access.
- Queue membership and ownership.

The default queue is used by automation and dashboards. If it is incorrect, support email triage and available-to-pick reporting will be wrong.

## Security roles

Assign roles based on the user's support responsibility:

- `Dove365 Support User`
- `Dove365 Support Account Manager`
- `Dove365 Support Admin`

Use the least privileged role that allows the user to do their job.

## Related documents

- `04 - Dove365 Support Automation and Queue Setup Guide.md`
- `08 - User Guide - Queues and Queue Items.md`
- `09 - User Guide - Cases.md`

