# User Guide - Queues and Queue Items

## Purpose

Queues and Queue Items are central to Dove365 Support. They control how support work is received, assigned, picked, worked, and monitored.

## What is a Queue

A Queue is a container for work.

Common queue types include:

- Default support intake queue.
- User queues.
- Team queues.
- Specialist queues.

Admins configure queues and queue access. Users work with Queue Items inside those queues.

## What is a Queue Item

A Queue Item is the queue representation of a record, usually a support Case.

Important fields:

- Queue: where the item is waiting or being worked.
- Object: the related Case.
- Entered Queue: when it entered the queue.
- Worked By: the user currently working the item.
- Status: queue item state/status.

## Default queue

The default queue is configured using `dove365_DefaultQueueGUID`.

It is used by:

- Email triage automation.
- Cases available to pick.
- Default intake reporting.

If the default queue is wrong, email-created Cases and available-to-pick dashboard counts will be wrong.

## Admin queue setup

Admins should:

1. Create or identify the default support queue.
2. Copy the queue GUID.
3. Set `dove365_DefaultQueueGUID`.
4. Run `Configure Default Queue`.
5. Confirm users can see the queue.
6. Confirm email triage creates Queue Items in the default queue.

## User queue work

Users should:

1. Open their queue or My Work dashboard.
2. Review available items.
3. Pick an item before working it.
4. Work the Case.
5. Log Support Activities.
6. Resolve or route the Case as needed.

## Worked By

`Worked By` identifies who is currently working a Queue Item.

Dashboard behaviour:

- Blank `Worked By`: unassigned.
- Populated `Worked By`: currently being worked.
- `Worked By` equals signed-in user: appears in My Queue Items.

## Picked work across queues

A user can work Queue Items from queues other than their own.

That means:

- `My Queue Items` should show items worked by the user across all queues.
- `My Open Cases` shows active Cases in the user's own queue.
- These counts can be different.

## Queue age

Queue age is calculated from Queue Item `enteredon`.

Use Queue Age to identify work that has waited too long.

Older queue items should be reviewed first, especially if they are critical or overdue.

## Best practice

- Do not work directly from a Case list if the work should be controlled by queue intake.
- Pick the Queue Item so `Worked By` is populated.
- Do not leave Queue Items worked by you if you are no longer progressing them.
- Escalate stuck queue items early.

