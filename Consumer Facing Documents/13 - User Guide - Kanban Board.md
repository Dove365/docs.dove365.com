# User Guide - Kanban Board

| Product | Audience | Status | Version |
| --- | --- | --- | --- |
| Dove365 Support | Support users, team leads, support admins | Draft | 1.0.0 |

## Purpose

The Dove365 Kanban Board gives support users a visual way to review queue work, pick up Cases, assign Cases to users, move work through active support states, and escalate Cases that need manager attention.

The board is opened inside the Dove365 Support model-driven app and uses the signed-in user's Dataverse permissions.

## When to use the Kanban Board

Use the Kanban Board when you want to:

- Review unassigned Cases waiting for triage.
- Pick up a Case from a queue.
- Assign a Case to another Dove365 user.
- Move a Case into active work.
- Escalate a Case to an escalation manager.
- Filter support work by queue, priority, source, type, or search text.

## Board columns

The board groups Cases into four columns.

### Awaiting Triage

Cases appear in Awaiting Triage when the related Queue Item has no `Worked By` user.

Use this column for new or unassigned queue work.

### Assigned

Cases appear in Assigned when the Queue Item has a `Worked By` user and the Case status is `New`, `Queued`, or `Not Started`.

Use this column for work that has been allocated but has not yet moved into active progress.

### In Progress

Cases appear in In Progress when the Queue Item has a `Worked By` user and the Case status is one of the active support statuses, such as `In Progress`, `Waiting on Customer`, `Waiting on Third Party`, or `Delayed`.

Use this column for Cases currently being progressed.

### Escalated

Cases appear in Escalated when the Case is marked as escalated, has a `Worked By` user, and is still in an active support status.

Use this column for Cases that need manager or specialist attention.

## Filters

The filter bar appears above the board.

Available filters:

- Queue: limits the board to a selected queue.
- Priority: limits the board by Case priority.
- Source: limits the board by Case source.
- Type: limits the board by Case type.
- Search: searches Case title, Case number, customer, priority, source, type, status, worked-by user, and queue name.

Use `Clear filters` to reset the board.

## Case cards

Each card shows key Case and Queue Item information.

Typical card information includes:

- Case number.
- Case title.
- Next action, where populated.
- Priority.
- Source.
- Type.
- Status.
- Customer.
- Queue.
- Worked By.
- Due date or target date.

Select `Open` to open the Case record.

## Pick up a Case

Use `Pick up` when you want to work an unassigned or available Case yourself.

When you pick up a Case, Dove365 Support attempts to:

1. Set the Queue Item `Worked By` user to you.
2. Route the Queue Item to your user queue.
3. Set the Case status to `New`.
4. Refresh the board.

After a successful pick up, the Case should appear in Assigned.

## Assign a Case to another user

To assign a Case from the board:

1. Drag the card to Assigned.
2. Select the Dove365 user who should work the Case.
3. Confirm the assignment.

When assignment is confirmed, Dove365 Support attempts to:

- Set the Queue Item `Worked By` user to the selected user.
- Route the Queue Item to that user's queue.
- Set the Case status to `New`.
- Refresh the board.

The user list is based on the Dove365 Users view.

## Move a Case to In Progress

Drag a card to In Progress when work has started.

If the card is not already worked by a user, Dove365 Support assigns it to the signed-in user before moving it to In Progress.

Moving to In Progress updates the Case status and refreshes the board.

## Escalate a Case

To escalate a Case:

1. Drag the card to Escalated.
2. Select the escalation manager.
3. Confirm the escalation.

When escalation is confirmed, Dove365 Support attempts to:

- Ensure the Queue Item has a `Worked By` user.
- Route the Queue Item to the working user's queue where needed.
- Set the Case as escalated.
- Populate the escalation manager.
- Move the Case into an active support status.
- Refresh the board.

The `Notify Case Escelation Manager` automation notifies the escalation manager when the Case is escalated.

## Release a Case

Use `Release` when you are no longer working a Case and it should return to triage.

When released, Dove365 Support attempts to:

1. Clear the Queue Item `Worked By` user.
2. Move the Queue Item back to the default queue.
3. Clear the Case escalation flag.
4. Refresh the board.

The Release button is hidden for Cases already in Awaiting Triage.

## Queue behaviour

The Kanban Board works from Queue Items, not only from Case records.

Important queue behaviour:

- A Case may have more than one Queue Item.
- The board only shows active Queue Items available to the user through the current queue scope.
- `Worked By` controls who is actively working the Queue Item.
- The Case owner is separate from the Queue Item queue and `Worked By` user.
- Routing to a user's queue depends on that user having an active queue that Dove365 Support can identify.

## Admin requirements

Admins should confirm:

1. The default queue environment variable `dove365_DefaultQueueGUID` is configured.
2. Support users have active Dataverse user records.
3. Dove365 users are included in the Dove365 Users view.
4. Each support user has an active user queue or queue membership that can be used for routing.
5. Users have permission to read Cases, read Queue Items, update Queue Items, update Cases, and use queue actions.
6. The Kanban Board web resource is available in the Dove365 Support model-driven app.

## Troubleshooting

If a Case does not appear on the board:

1. Confirm the Case has an active Queue Item.
2. Confirm the Queue Item points to a Dove365 Case.
3. Confirm the selected queue filter is correct.
4. Confirm the user's security role allows access to the Case and Queue Item.
5. Clear filters and refresh the board.

If a picked Case does not move to Assigned:

1. Confirm the Queue Item `Worked By` field has been populated.
2. Confirm the Case status is `New`, `Queued`, or `Not Started`.
3. Confirm the user has an active queue.
4. Confirm queue routing permissions.
5. Refresh the board after assignment.

If assignment or escalation fails:

1. Confirm the selected user is active.
2. Confirm the selected user appears in the Dove365 Users view.
3. Confirm the current user has permission to update the Case and Queue Item.
4. Confirm the Case status transition is allowed.
5. Ask an admin to review browser console errors and Dataverse plugin or flow run history.

## Definitions

- Queue: a Dataverse container for work items.
- Queue Item: the queue representation of a Case.
- Worked By: the user actively working the Queue Item.
- User queue: a queue associated with or available to a specific user.
- Default queue: the configured support intake queue.
- Escalation manager: the user selected to oversee an escalated Case.

## Related documents

- `01 - Dove365 Support User Guide.md`
- `02 - Dove365 Support Dashboards User Guide.md`
- `08 - User Guide - Queues and Queue Items.md`
- `09 - User Guide - Cases.md`
- `12 - User Guide - Dashboards.md`
