# OMH Payroll Roster Web Application Blueprint

This document is the implementation blueprint for rebuilding the three Excel/VBA payroll workbooks as a single internal web system while preserving workbook behavior:

- **Standby**
- **Extra Service (ES)**
- **PESP (Physician's Extra Service)**

---

## 1) Complete Architecture Plan

### 1.1 High-level architecture

```text
Users (Internal OMH Staff)
  -> Next.js App Router UI (program modules + report builder + roster previews)
  -> Route Handlers / Server Actions (authz, orchestration, business rules)
  -> Domain Services (monthly roster engine, facility roster engine, import/sync engine, PDF renderer)
  -> Prisma ORM
  -> PostgreSQL (normalized operational schema + staging + audit + templates)
  -> Object storage/shared file path for export artifacts (PDF/XLSX)
```

### 1.2 Bounded contexts

1. **Program Configuration**
   - Program-specific mappings, active rules, dedupe keys, sort, export style, signatures, fiscal constants.
2. **Roster Generation**
   - Monthly roster generation (Additions/Changes/Deletions + Active).
   - Facility roster generation with program-specific filters and layout.
3. **Data Management**
   - Current-year records, master records, contacts, facilities, titles/jobs.
4. **Import and Sync**
   - Workbook import staging, validation preview, duplicate detection, configurable upsert keys.
5. **Reporting**
   - Official roster mode and ad hoc mode (filters, columns, grouping, export).
6. **Audit and Operations**
   - User sessions and action-level audit logs.

### 1.3 Technical stack

- **Frontend/Backend**: Next.js + TypeScript (App Router)
- **Styling**: Tailwind CSS
- **Data access**: Prisma ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Excel import/export**: xlsx
- **PDF rendering**: server-side HTML to PDF (Playwright/Puppeteer plan; shell stubs included)
- **AuthN/AuthZ**: Internal role-based access control (Viewer, Editor, Importer, Report Runner, Admin)

### 1.4 Configuration-first logic

All workbook-preservation logic is represented as data/config:

- section classification rules
- active inclusion rules
- active dedupe composite keys
- sort rules
- source-field to report-column mappings
- facility roster row block mappings
- fiscal-year constants (including PESP end date)

This allows preserving legacy behavior first and changing settings second.

---

## 2) Database Schema (Relational Design)

### 2.1 Core entities

- `User`, `UserSession`, `RoleGrant`
- `Program` (STANDBY, ES, PESP)
- `Facility`
- `Employee`
- `TitleJob`
- `ProgramRecord` (normalized business row for current-year/master datasets)
- `Contact`

### 2.2 Configuration entities

- `ProgramConfig`
- `ProgramFieldMapping`
- `ProgramCompositeKeyField`
- `ProgramSectionRule`
- `ProgramExportTemplate`

### 2.3 Workflow entities

- `RosterRun` and `RosterRunSectionRow`
- `SavedReport`
- `ReportTemplate`
- `ExportJob`

### 2.4 Import/sync entities

- `ImportBatch`
- `ImportStagingRow`

### 2.5 Audit entities

- `AuditLog`

### 2.6 Notes

- `ProgramRecord` uses normalized columns for common business fields and `rawPayload` JSON for workbook-specific leftovers.
- Current-year vs master is represented via `datasetType`.
- Upsert matching is driven by `ProgramCompositeKeyField` ordering, not hardcoded logic.

---

## 3) Prisma Models

Prisma models are defined in `prisma/schema.prisma` and include:

- enums for roles, programs, dataset types, status, roster sections, export formats, import statuses
- normalized relation graph between users/programs/facilities/employees/records/imports/reports/audits
- indexes for frequent queries:
  - program + dataset + control number
  - program + dataset + status + facility
  - employee external ID
  - import batch and row validation states

---

## 4) Page-by-Page App Map

### Global routes

- `/` - redirects to dashboard
- `/dashboard` - organization overview and quick access
- `/reports` - custom report builder shell

### Program routes (tab-equivalent sections)

Pattern: `/programs/{standby|es|pesp}/{section}`

- `home` (Workbook Home)
- `monthly-roster` (Monthly Roster for DOB)
- `current-year` (Current-year database)
- `master-data` (All data/master database)
- `facility-roster` (Facility roster)
- `contacts` (Contact listing)
- `signature` (DOB signature settings)
- `log` (Program activity log)

This preserves the workbook tab mental model.

---

## 5) Program-by-Program Field Mappings

Field mappings are represented in `src/lib/payroll/program-config.ts`.

### 5.1 Standby monthly roster

- Additions/Changes/Deletions by exact control number
- Active: include when `status = A` and include-active flag checked
- Active dedupe key: `employeeName + "|" + item`
- Sort: Employee Name, Agency
- Calculations:
  - `totalSalary = baseSalary + inconv + shift + geo + locationAmt`
  - `hourlyRate = Round((totalSalary * 0.038356) / 10 * 0.25 / 8, 2)`
  - `notToExceedCost = totalSalary * 0.12`

### 5.2 ES monthly roster

- Additions/Changes/Deletions by exact control number + category
- Active eligibility: `status = A` AND `column O (active eligibility) = YES` AND include-active
- Active dedupe key: `employeeId + "|" + esItem`
- Sort: Employee Name, Agency
- Mapping includes:
  - Agency <- I
  - Item # <- S
  - Employee Name <- L
  - Employee ID <- N
  - Work Location <- Z
  - Title Code <- V
  - Title Description <- U
  - Salary Grade <- X
  - Begin Date <- D
  - End Date <- E
  - ES Final Salary <- BE
  - Hourly St Rate <- BG
  - Hourly OT Rate <- BJ
  - Not to Exceed <- ES Final Salary * 0.12

### 5.3 PESP monthly roster

- Additions/Changes/Deletions by exact control number
- Active: include when `status = A` and include-active
- Active dedupe key: `employeeId + "|" + esItem`
- Mapping:
  - Agency <- 8
  - Item # <- 23
  - Employee Name <- 11 + " " + 12
  - Employee ID <- 14
  - Work Location <- 9
  - Title Code <- 28
  - Title Description <- 30
  - Salary Grade <- 21
  - Annual Salary <- 31
  - Begin Date <- 4
  - End Date <- configurable fiscal default (legacy starts at `3/31/2026`)
  - Additional Comp Hourly Rate <- 32
  - Not to Exceed <- Annual Salary * 0.12

---

## 6) Report-Template System Design

Two-mode report builder:

1. **Official roster mode**
   - monthly roster
   - facility roster
   - enforces official template and section ordering
2. **Ad hoc mode**
   - dynamic filters/columns/sort/group
   - printable/exportable tabular reports

Template definition JSON includes:

- data source type
- selected columns
- filters and operators
- grouping and sorting
- layout tokens (title block, signature block, footer style, repeated headers)
- export options (PDF page size/orientation/margins)

Entities:

- `ReportTemplate` (system/admin-level)
- `SavedReport` (user-level)

---

## 7) Import/Sync Design

### 7.1 Import pipeline

1. Upload workbook
2. Parse sheet rows into `ImportStagingRow`
3. Apply program mapping configuration
4. Validate required fields and type conversions
5. Duplicate detection against current dataset and within batch
6. Preview summary (new/update/invalid)
7. Commit selected rows into `ProgramRecord`
8. Persist audit and batch summary

### 7.2 Sync to master

- Configurable composite key fields from `ProgramCompositeKeyField`
- default pattern: field1, field2, field5, formatted field7 date, field10, field11
- upsert mode driven by configuration (`UPSERT`, `INSERT_ONLY`)

---

## 8) Audit-Log Design

`AuditLog` captures:

- session ID
- timestamp
- username
- device/computer name (if available)
- action
- details payload JSON
- app version
- row counters added/updated/deleted
- reference IDs for import batches, roster runs, exports

Tracked actions include:

- populate monthly roster
- create facility roster
- import, validate, commit, sync to master
- export PDF/Excel
- clear report
- update/delete data row

---

## 9) PDF Rendering Plan

### 9.1 Rendering strategy

1. Convert official template + payload to server-rendered HTML
2. Apply print CSS matching workbook/PDF style
3. Generate PDF with headless browser
4. Merge PDFs when necessary (main + active sections)

### 9.2 Workbook fidelity features

- title/certificate blocks
- section headers (Additions/Changes/Deletions/Active)
- repeated table headers on page breaks
- forced page break before Active where required
- signature block:
  - Approved By: Peggy O'Shea, Chief Budget Examiner, MHU
  - Signature
  - Date Signed
- footer with current date and `Page X of Y`
- Standby facility two-row employee block layout

---

## 10) UI Wireframes (Text)

### 10.1 Global shell

```text
+----------------------------------------------------------------------------------+
| OMH Payroll Roster | Program Switcher | User Menu                                |
+----------------------+-----------------------------------------------------------+
| Left Nav             | Breadcrumbs: Dashboard > Standby > Monthly Roster       |
| - Dashboard          +-----------------------------------------------------------+
| - Reports            | Control Number [________]  [x] Include Active [Generate]|
| - Standby            | [Clear] [Export PDF] [Export Excel] [Print Preview]     |
|   - Home             +-----------------------------------------------------------+
|   - Monthly Roster   | Additions (card/table preview)                            |
|   - Current-Year DB  | Changes   (card/table preview)                            |
|   - Master DB        | Deletions (card/table preview)                            |
|   - Facility Roster  | Active    (card/table preview)                            |
|   - Contacts         +-----------------------------------------------------------+
|   - Signature        | Audit / Last generated metadata                            |
|   - Log              |                                                           |
+----------------------+-----------------------------------------------------------+
```

### 10.2 Facility roster

```text
Facility Code [____] [Generate] [Clear] [Export PDF]
----------------------------------------------------------------
Preview panel:
- Standby: continuous two-row employee blocks
- ES: facility/staff roster two-row blocks
- PESP: physician facility roster with FY/status filters
----------------------------------------------------------------
```

### 10.3 Report builder

```text
Program [Standby|ES|PESP]
Mode [Official|Ad Hoc]
Source [Current-Year|Master|Contacts|Facility]
Filters builder (field/operator/value rows)
Columns selector (multi-select)
Sort/group controls
[Run] [Save Definition] [Export PDF] [Export Excel] [Print]
```

---

## 11) Full Folder Structure (Starter)

```text
payroll-roster-web/
  docs/omh-payroll/
    solution-blueprint.md
  prisma/
    schema.prisma
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      (workspace)/
        layout.tsx
        dashboard/page.tsx
        reports/page.tsx
        programs/
          [program]/
            layout.tsx
            home/page.tsx
            monthly-roster/page.tsx
            current-year/page.tsx
            master-data/page.tsx
            facility-roster/page.tsx
            contacts/page.tsx
            signature/page.tsx
            log/page.tsx
    components/
      layout/
        app-shell.tsx
        sidebar.tsx
        topbar.tsx
      program/
        program-tabs.tsx
        monthly-roster-shell.tsx
        facility-roster-shell.tsx
      reports/
        report-builder-shell.tsx
      ui/
        card.tsx
        pill.tsx
    lib/
      db/prisma.ts
      payroll/program-config.ts
      payroll/program-resolver.ts
    types/
      payroll.ts
```

---

## 12) Starter Code Scope Delivered

Delivered in this first implementation:

- App shell with left navigation, top header, breadcrumb-style context
- Program switcher + workbook-tab-equivalent sections
- Dashboard page
- Program pages for Home, Monthly Roster, Current-Year, Master, Facility, Contacts, Signature, Log
- Monthly roster preview shell with control number + include-active controls
- Facility roster preview shell with facility code controls
- Report builder shell with official/ad hoc mode
- Prisma schema representing normalized data + config + workflow + audit models
- API route shells for monthly roster, facility roster, report run, and import preview
- Backend service shells for roster engine, report execution, and import preview

---

## 13) Phased Build Plan

### Phase 1 - Foundation (current)
- app shell, navigation, program pages, schema, typed configs, placeholder roster/report shells

### Phase 2 - Auth + RBAC
- internal auth integration, role middleware, route/data-level permissions

### Phase 3 - Import pipeline
- workbook upload, parser, staging preview, validation, duplicate detection, commit and upsert

### Phase 4 - Official roster engine
- configuration-driven monthly/facility generators per program
- active dedupe and section sorting parity with VBA

### Phase 5 - PDF and Excel fidelity
- official print templates, repeated headers, merged section exports, page/footers

### Phase 6 - Report builder execution
- dynamic query planner, saved reports, export jobs

### Phase 7 - Admin configuration
- field mappings, sync key editor, fiscal constants, template editor, signature text management

### Phase 8 - Hardening
- performance tuning, automated tests, operational dashboards, backup/retention policies

---

## 14) First Implementation Status

Initial implementation includes:

- dashboard
- program pages
- Prisma database models/tables
- report builder shell
- monthly roster preview shell
- facility roster preview shell

Ambiguities are handled with **legacy behavior preserved first**, then exposed as configuration for future admin updates.

Additional implementation docs:

- `docs/omh-payroll/report-template-system.md`
- `docs/omh-payroll/import-sync-design.md`

