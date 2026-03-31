# Import and Sync Design

This document specifies workbook import behavior and sync-to-master behavior.

## Import workflow

1. Upload workbook file.
2. Select program and dataset target (current-year/master).
3. Parse Excel sheets using `xlsx`.
4. Stage rows into `ImportStagingRow`.
5. Apply program field mappings.
6. Validate required fields, date/number formats, and constrained values.
7. Calculate program composite key from configured key fields.
8. Detect duplicates:
   - within batch
   - against target dataset
9. Show preview summary (valid/invalid/duplicate).
10. Commit valid rows to `ProgramRecord`.
11. Write `AuditLog` entries and import summary.

## Composite key configuration

Stored in `ProgramCompositeKeyField` records.

Default order for Standby and PESP:

1. field1
2. field2
3. field5
4. formatted field7 date
5. field10
6. field11

Each program can override this sequence in Admin settings.

## Sync modes

- `UPSERT` (default): update existing rows matched by composite key, insert missing.
- `INSERT_ONLY`: insert only, never update matched rows.

Mode is stored in `ProgramConfig.syncMode`.

