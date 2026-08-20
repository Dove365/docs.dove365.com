# Release Notes — Dove365 Common 1.2.1.0 & Dove365 CRM - Starter 1.2.1.0

**Release date:** 2026-08-20

This release moves ownership of the Opportunity table from Dove365 CRM into Dove365 Common, and replaces the Opportunity ↔ Service Offering junction-table pattern with a direct N:N relationship. It resolves the architectural conflict identified during Dove365 Sales cleanup on 2026-08-20 (see `Opportunity-Lookup-Cleanup.md`), where Sales had independently built its own `dove365_opportunity` and `dove365_opportunityserviceoffering` tables that would have collided with CRM's existing Opportunity table on import.

---

## Dove365 Common — v1.2.1.0

### Opportunity table moved from CRM to Common

Opportunity is now a Common-owned table, available to any product built on top of Common (CRM, Sales, and future modules) without requiring CRM as a dependency.

### N:N relationship with Service Offering

Opportunity now relates to Service Offering via a direct many-to-many relationship, replacing the previous approach of a dedicated `dove365_opportunityserviceoffering` junction table. This was a deliberate simplification — the junction table's only purpose had been to let one Opportunity carry multiple Service Offerings, which a native N:N relationship handles directly without a custom intersect entity to maintain.

---

## Dove365 CRM - Starter — v1.2.1.0

### Model-driven app updated for the new Opportunity ↔ Service Offering relationship

The CRM - Starter model-driven app's Opportunity forms/views have been updated to use the new N:N relationship (Service Offering as a related-records grid on Opportunity) in place of the old junction-table subgrid.

### `dove365_opportunityserviceoffering` table deleted

The junction table is removed from CRM entirely now that it's superseded by the N:N relationship.

---

## Impact on Dove365 Sales

Dove365 Sales previously had its own locally-built `dove365_opportunity` and `dove365_opportunityserviceoffering` tables in the DEV - Dove365 Sales environment, built before this Common release existed. Those were removed on 2026-08-20 specifically to clear the way for this release (full dependency inventory and execution log in `Opportunity-Lookup-Cleanup.md`).

**Once Common 1.2.1.0 is deployed into the DEV - Dove365 Sales environment**, the reinstatement checklist in `Opportunity-Lookup-Cleanup.md` §5 should be worked through:

- Recreate the `dove365_sale.dove365_opportunity` lookup, targeting Common's Opportunity table.
- Recreate the `dove365_salesresearch.dove365_opportunityid` lookup, same target.
- Decide whether an Opportunity-level forecast category is still needed (Sales' old `dove365_forecastcategory` global choice was deleted along with the old table) or whether Common's Opportunity table already carries an equivalent.
- Re-add an Opportunity SubArea to the Dove365 Sales app's sitemap Pipeline group.
- Re-grant `Dove365 Sales Admin` / `Dove365 Sales User` privileges on Common's Opportunity table and its new N:N relationship to Service Offering.
- Revisit the paused Sale/Sale Line aggregation plugin work (`Sale-Line-Aggregation-Plugin-Findings.md`) — `dove365_sale` will regain an Opportunity lookup, though the plugin's own logic only touches Sale Line → Sale, so no functional change is expected there, just confirm nothing assumed the lookup's absence.
