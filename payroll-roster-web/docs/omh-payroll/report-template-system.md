# Report Template System Design

This document details how official roster and ad hoc reports are represented and executed.

## Modes

1. Official roster mode
   - Monthly roster (Additions/Changes/Deletions/Active).
   - Facility roster.
   - Strict workbook-compatible layout sections and signature/footer rules.

2. Ad hoc mode
   - Filter/column/sort/group driven tabular reporting.
   - Export to PDF/XLSX/print.

## Template shape

Stored in `ReportTemplate.definition` (JSON):

```json
{
  "mode": "OFFICIAL",
  "sourceDataset": "CURRENT_YEAR",
  "filters": [
    { "field": "controlNumber", "operator": "equals", "value": "AC1234" }
  ],
  "columns": ["agency", "itemCode", "employeeName", "employeeId"],
  "sortRules": [
    { "field": "employeeName", "direction": "asc" },
    { "field": "agency", "direction": "asc" }
  ],
  "groupRules": ["section"],
  "layoutTokens": {
    "certificateBlock": true,
    "signatureBlock": true,
    "repeatHeaderOnPageBreak": true
  },
  "exportOptions": {
    "orientation": "landscape",
    "pageSize": "letter",
    "margin": { "top": 24, "right": 18, "bottom": 24, "left": 18 }
  }
}
```

## Execution model

1. Load template + user overrides.
2. Validate filter fields against selected dataset and program.
3. Build query plan for Prisma.
4. Execute query and map rows to display schema.
5. Render HTML for on-screen preview.
6. Export with template style settings.

## Workbook compatibility

- Program-level export templates preserve title blocks, section headers, and signatures.
- Active section page splitting and repeated headers are template flags.
- PESP fiscal constants (e.g., default end date) are taken from `ProgramConfig.fiscalConstants`.
