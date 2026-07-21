# Dove365 Support Activity Time Tracker

A Power Apps Component Framework (PCF) control for the **Dove365 Case** form. Support users start,
pause, resume and stop a timer; on stop the control writes a **completed Support Activity** record
against the Case, rounded to the nearest 15 minutes, and shows how much time they have logged today
and how much has been logged against the Case in total.

No standard Task, Appointment or Phone Call records are created. `dove365_supportactivity` is itself
an activity-enabled table, so the control writes the standard activity columns it requires
(`subject`, `actualstart`, `actualend`, `actualdurationminutes`, `regardingobjectid`) alongside the
custom `dove365_totalhours` column that the Dove365 rollups and plugins read. The control does not
set `isbilled` or any other billing column; billing is handled outside the tracker.

---

## Schema this control is built against

Everything below was read from `Solutions/Unmanaged/Dove365Support_1_0_0_0` and
`Solutions/Unmanaged/Dove365Common_1_1_1_0`. It is mirrored in code in
[schema.ts](Dove365SupportActivityTimeTracker/schema.ts).

**Publisher** — `Dove365`, customization prefix `dove365`, option value prefix `67080`.

### Case — `dove365_case` (Dove365 Common)

| Purpose | Logical name |
| --- | --- |
| Entity set | `dove365_cases` |
| Primary key | `dove365_caseid` |
| Primary name | `dove365_casename` |
| Case number | `dove365_casenumber` |
| Hours spent (rollup: SUM of related Support Activity Total Hours) | `dove365_hoursspent` |
| Managed Service flag (two options) | `dove365_managedservice` |
| Managed Service lookup | `dove365_managedservices` |

### Support Activity — `dove365_supportactivity` (Dove365 Support)

Custom **activity** table (`IsRegularActivity`, `ActivityTypeCode`, partylist columns all present).

| Purpose | Logical name |
| --- | --- |
| Entity set | `dove365_supportactivities` |
| Primary key | `activityid` |
| Primary name / subject | `subject` (required, 400 chars) |
| Link to Case | `regardingobjectid` (required) via relationship `dove365_case_dove365_SupportActivities`; bound as `regardingobjectid_dove365_case@odata.bind` |
| Start date/time | `actualstart` |
| End date/time | `actualend` |
| Duration (minutes) | `actualdurationminutes` |
| Hours (decimal, 2dp) — read by the rollup and plugin | `dove365_totalhours` |
| Notes | `description` (2000 chars) |
| Owner | `ownerid` (system required, user or team) |
| State / status | `statecode` 0 Open, 1 Completed, 2 Canceled, 3 Scheduled; `statuscode` 1 / 2 / 3 / 4 |

There is **no** Managed Service lookup on Support Activity. The link is indirect:
Support Activity → Case → Managed Services.

`statecode` is `ValidForCreateApi=0`, so the control creates the activity and then patches it to
Completed in a second call. If the patch fails the record is kept and the user is warned.

### Managed Services — `dove365_managedservices`

| Purpose | Logical name |
| --- | --- |
| Entity set | `dove365_managedserviceses` |
| Primary key | `dove365_managedservicesid` |
| Primary name | `dove365_managedservicesname` |
| Allocation hours | `dove365_monthlyallocation` |
| Hours used | `dove365_hoursused` |
| Hours remaining (calculated: allocation − used) | `dove365_hoursremaining` |
| Percentage used (calculated) | `dove365_hoursusedpercentage` |

### How time reaches the Managed Service

1. The control creates a Support Activity with `dove365_totalhours`.
2. The Case rollup `dove365_hoursspent` sums `dove365_totalhours` for its Support Activities.
3. **`Plugins/Aggregate Managed Services Hours`** fires on Support Activity Create / Update / Delete.
   For each impacted Case that has `dove365_managedservice = true` **and** a Managed Services lookup,
   it recalculates and writes `dove365_hoursused`, rounded to the nearest quarter hour with
   `MidpointRounding.AwayFromZero`.
4. `dove365_hoursremaining` and `dove365_hoursusedpercentage` recalculate from `dove365_hoursused`.
5. `DailyManagedService80UsageThreshold` and `MonthlyManagedServicesAllocationReset` flows act on the
   result. No flow aggregates Support Activity time directly; the plugin owns that.

The plugin sums **all** Support Activity Total Hours, so every entry this control creates draws down
the allocation.

### Business rules the control must satisfy

- `ValidateTotalHours` — *Total Hours cannot be 0 or less.* The control's minimum chargeable
  duration guarantees a positive value.
- `ValidateActualEndDate` / `ValidateEndDate` — *End Date cannot be before Start Date.* The start is
  the first Start click and the end is the Stop click, so this always holds.

---

## Behaviour

| Action | Effect |
| --- | --- |
| **Start timer** | Records the start instant. This becomes `actualstart`. |
| **Pause** | Banks the elapsed segment. Paused time is never counted. |
| **Resume** | Starts a new segment; the original start instant is kept. |
| **Stop and save** | Creates the Support Activity, sets it to Completed, clears the timer and refreshes the totals. |
| **Cancel** | Asks for confirmation, then discards the tracked time. Nothing is written. |

**Rounding.** Elapsed working time is rounded to the nearest 15 minutes (configurable), with exact
halves rounded up, matching the plugin. Any non-zero session is lifted to the minimum chargeable
duration — 15 minutes by default — so a 3 minute call is saved as 15 minutes rather than zero.

**Totals.** *Today, by you* is a FetchXML aggregate over Support Activity filtered by `eq-userid` and
the `today` operator, both evaluated in the user's own time zone. *This Case* sums Total Hours for
every Support Activity regarding the Case, with no state filter, exactly as the plugin does. If an
aggregate fails (for example the 50,000 record aggregate limit) the control falls back to the Case
`dove365_hoursspent` rollup and says so.

**Managed service warnings.**

| Situation | Level |
| --- | --- |
| Projected usage would exceed the monthly allocation | Error |
| Projected usage at or above the warning threshold (default 80%) | Warning |
| Case flagged as Managed Service but no Managed Services record linked | Warning |
| Managed Services record has no monthly allocation | Warning |
| Agreement has ended, or has not started yet | Warning |
| Case linked to a Managed Service but the Managed Service flag is off | Info |

Warnings are advisory. The control never blocks a save — support work still has to be recorded.

**Resilience.** The running timer is kept in `localStorage`, keyed by user and Case, so a form
reload, a navigation away or a closed tab does not lose in-flight time. Only epoch timestamps are
stored, so a timer left running keeps counting correctly. Corrupt entries and a `running` entry with
no start instant are demoted to paused rather than inventing time.

**Accessibility.**

- The stopwatch is a `role="timer"` live region announced at minute granularity, so a screen reader
  is not interrupted every second. The visual HH:MM:SS read-out is `aria-hidden`.
- Errors use `role="alert"`; status and success messages use `role="status"`.
- Cancel confirmation is a `role="alertdialog"`.
- The allocation meter is a `progressbar` with `aria-valuenow` and `aria-valuetext`.
- Every control is keyboard reachable with a visible `:focus-visible` outline, and the stylesheet has
  a `forced-colors` block for Windows High Contrast.

---

## Configuration

Bind the control to the Case form field **Hours Spent** (`dove365_hoursspent`). The binding satisfies
the framework's requirement for a bound field and gives the control a fallback total; the control
never writes to it.

| Property | Default | Notes |
| --- | --- | --- |
| Rounding Increment | 15 | 5 / 6 / 10 / 15 / 30 / 60 minutes. |
| Minimum Chargeable Minutes | *blank* | Blank tracks the rounding increment. |
| Require Notes | No | When Yes, Stop and save is disabled until notes are entered. |
| Subject Prefix | `Time logged` | Subject is `<prefix> – <case number> – <duration>`. |
| Today Totals Basis | Actual End | Which date drives the "logged today" figure. |
| Managed Service Warning Threshold | 80 | Percent. Zero disables the threshold warning. |
| Idle Warning Minutes | 240 | Warns about a timer left running. Zero disables. |

### Adding it to the Case form

1. Import the solution (below), or push the control with `pac pcf push`.
2. Open the **Case** main form in the modern designer.
3. Add the **Hours Spent** field to the form.
4. With the field selected, choose **Components → Get more components → Dove365 Support Activity
   Time Tracker**, and enable it for Web, Phone and Tablet.
5. Hide the field label, and give the section enough height (about 420px) for the panels.
6. Save and publish.

### Required privileges

Users need Create, Read and Write on **Support Activity**, Read on **Case**, and Read on **Managed
Services** to see the allocation panel. Without the Managed Services read privilege the tracker still
works — the allocation panel is simply omitted.

---

## Development

```bash
npm install
npm test          # 84 unit and component tests
npm run build     # manifest validation, ESLint, TypeScript and webpack bundle
npm run start:watch   # test harness
```

### Deploy

```bash
# Quick developer loop
pac auth create --environment <environment url>
pac pcf push --publisher-prefix dove365

# Solution packaging — produces both an unmanaged and a managed zip in Solution/bin/Release
cd Solution
dotnet build -c Release
pac solution import --path bin/Release/Dove365SupportActivityTimeTracker.zip --publish-changes
```

The solution project in [Solution/](Solution/) references the PCF project directly, uses the existing
`Dove365` publisher with prefix `dove365` and option value prefix `67080`, and packs the control as
`dove365_Dove365.Dove365SupportActivityTimeTracker`.

### Layout

| Path | Purpose |
| --- | --- |
| `Dove365SupportActivityTimeTracker/index.ts` | Control lifecycle, wiring the React view to Dataverse. |
| `.../schema.ts` | Every logical name in one place. |
| `.../config.ts` | Manifest property reading and host record discovery. |
| `.../time.ts` | Rounding, conversion and formatting. Pure. |
| `.../timer.ts` | Stopwatch state machine. Pure, clock injected. |
| `.../managedService.ts` | Allocation projection and warning rules. Pure. |
| `.../persistence.ts` | localStorage round-trip and validation. |
| `.../dataverse.ts` | Payload and FetchXML builders plus the Web API service. |
| `.../components/` | React 16 view, rendered as a virtual control. |
| `.../__tests__/` | Jest suites for each module and the component. |
