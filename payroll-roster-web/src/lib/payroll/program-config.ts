import {
  FieldMapping,
  ProgramConfig,
  ProgramSlug,
  WorkbookSection,
} from "@/types/payroll";

const tabDefinitions: Omit<WorkbookSection, "href">[] = [
  {
    key: "home",
    label: "Home",
    description: "Workbook landing page and quick actions.",
  },
  {
    key: "monthly-roster",
    label: "Monthly Roster for DOB",
    description:
      "Generate Additions, Changes, Deletions, and Active sections by control number.",
  },
  {
    key: "current-year",
    label: "Current-Year Database",
    description: "Operational records for the active fiscal year.",
  },
  {
    key: "master-data",
    label: "All Data / Master Database",
    description: "Historical and cross-year records for reporting and sync.",
  },
  {
    key: "facility-roster",
    label: "Facility Roster",
    description: "Generate official facility roster by facility code.",
  },
  {
    key: "contacts",
    label: "Contact Listing",
    description: "Program and facility contact management.",
  },
  {
    key: "signature",
    label: "DOB Signature",
    description: "Signature text and certificate block configuration.",
  },
  {
    key: "log",
    label: "Log",
    description: "Program-level action and workflow log.",
  },
];

function buildTabs(slug: ProgramSlug): WorkbookSection[] {
  return tabDefinitions.map((tab) => ({
    ...tab,
    href: `/programs/${slug}/${tab.key}`,
  }));
}

const officialSignature =
  "Approved By: Peggy O'Shea, Chief Budget Examiner, MHU";

const standbyMonthlyFieldMappings: FieldMapping[] = [
  { targetField: "Agency", sourceColumnRef: "Program source field (legacy mapped)" },
  { targetField: "Item", sourceColumnRef: "Program source field (legacy mapped)" },
  { targetField: "Employee Name", sourceColumnRef: "Program source field (legacy mapped)" },
  { targetField: "Base Salary", sourceColumnRef: "Column 23" },
  { targetField: "Inconvenience", sourceColumnRef: "Column 24" },
  { targetField: "Shift", sourceColumnRef: "Column 25" },
  { targetField: "Geographic", sourceColumnRef: "Column 26" },
  { targetField: "Location Amount", sourceColumnRef: "Column 27" },
  {
    targetField: "Hourly Rate",
    sourceColumnRef: "Calculated",
    notes: "Round((totalSalary * 0.038356) / 10 * 0.25 / 8, 2)",
  },
  {
    targetField: "Not to Exceed Cost",
    sourceColumnRef: "Calculated",
    notes: "totalSalary * 0.12",
  },
];

const esMonthlyFieldMappings: FieldMapping[] = [
  { targetField: "Agency", sourceColumnRef: "I" },
  { targetField: "Item #", sourceColumnRef: "S" },
  { targetField: "Employee Name", sourceColumnRef: "L" },
  { targetField: "Employee ID", sourceColumnRef: "N" },
  { targetField: "Work Location", sourceColumnRef: "Z" },
  { targetField: "Title Code", sourceColumnRef: "V" },
  { targetField: "Title Description", sourceColumnRef: "U" },
  { targetField: "Salary Grade", sourceColumnRef: "X" },
  { targetField: "Begin Date", sourceColumnRef: "D" },
  { targetField: "End Date", sourceColumnRef: "E" },
  { targetField: "ES Final Salary", sourceColumnRef: "BE" },
  { targetField: "Hourly St Rate", sourceColumnRef: "BG" },
  { targetField: "Hourly OT Rate", sourceColumnRef: "BJ" },
  {
    targetField: "Not to Exceed Cost",
    sourceColumnRef: "Calculated",
    notes: "ES Final Salary * 0.12",
  },
];

const pespMonthlyFieldMappings: FieldMapping[] = [
  { targetField: "Agency", sourceColumnRef: "8" },
  { targetField: "Item #", sourceColumnRef: "23" },
  {
    targetField: "Employee Name",
    sourceColumnRef: "11 + ' ' + 12",
    notes: "Concatenate first and last names as in workbook",
  },
  { targetField: "Employee ID", sourceColumnRef: "14" },
  { targetField: "Work Location", sourceColumnRef: "9" },
  { targetField: "Title Code", sourceColumnRef: "28" },
  { targetField: "Title Description", sourceColumnRef: "30" },
  { targetField: "Salary Grade", sourceColumnRef: "21" },
  { targetField: "Annual Salary", sourceColumnRef: "31" },
  { targetField: "Begin Date", sourceColumnRef: "4" },
  {
    targetField: "End Date",
    sourceColumnRef: "Fiscal Constant",
    notes: "Legacy output default 3/31/2026, admin-configurable by fiscal year",
  },
  { targetField: "Additional Compensation Hourly Rate", sourceColumnRef: "32" },
  {
    targetField: "Not to Exceed Cost",
    sourceColumnRef: "Calculated",
    notes: "Annual Salary * 0.12",
  },
];

export const PROGRAM_CONFIGS: Record<ProgramSlug, ProgramConfig> = {
  standby: {
    slug: "standby",
    code: "STANDBY",
    name: "Standby",
    workbookTitle: "2025 Standby Database",
    monthlyRosterTitle: "Standby Monthly Roster for DOB",
    facilityRosterTitle: "Continuous Standby Roster",
    sourceWorkbookName: "2025 Standby Database",
    includeActiveDefault: true,
    activeRuleSummary: "Status = A and Include Active checked.",
    activeDedupeSummary: "EmployeeName + '|' + Item",
    sortSummary: "Employee Name, Agency",
    monthlyFieldMappings: standbyMonthlyFieldMappings,
    facilityRosterNotes: [
      "Prompt for facility code.",
      "Filter Status = A and matching Facility Code.",
      "Render two-row employee blocks as Continuous Standby Roster.",
      "Sort by employee name.",
    ],
    fiscalConstants: {},
    officialSignature,
    tabs: buildTabs("standby"),
  },
  es: {
    slug: "es",
    code: "ES",
    name: "Extra Service (ES)",
    workbookTitle: "2025 ES Database",
    monthlyRosterTitle: "ES Monthly Roster for DOB",
    facilityRosterTitle: "ES Facility Roster",
    sourceWorkbookName: "2025 ES Database",
    includeActiveDefault: true,
    activeRuleSummary:
      "Status = A AND eligibility column O = YES and Include Active checked.",
    activeDedupeSummary: "EmployeeID + '|' + ES Item",
    sortSummary: "Employee Name, Agency",
    monthlyFieldMappings: esMonthlyFieldMappings,
    facilityRosterNotes: [
      "Prompt for facility code and require Status = A.",
      "Render two-row staff blocks preserving existing ES roster appearance.",
      "Sort by employee name.",
      "Row block includes Name/ID/Category/Status/Title/ES Item and salary-rate row.",
    ],
    fiscalConstants: {},
    officialSignature,
    tabs: buildTabs("es"),
  },
  pesp: {
    slug: "pesp",
    code: "PESP",
    name: "PESP",
    workbookTitle: "2025 PESP Database",
    monthlyRosterTitle: "PESP Monthly Roster for DOB",
    facilityRosterTitle: "PESP Facility Roster",
    sourceWorkbookName: "2025 PESP Database",
    includeActiveDefault: true,
    activeRuleSummary: "Status = A and Include Active checked.",
    activeDedupeSummary: "Employee ID + '|' + ES Item",
    sortSummary: "Employee Name, Agency",
    monthlyFieldMappings: pespMonthlyFieldMappings,
    facilityRosterNotes: [
      "Prompt for facility code.",
      "Filter requires matching facility code, FY2025 AC1588 = YES, and Status = A.",
      "Preserve physician roster columns and warning text.",
      "Maintain rule: physicians work no more than 76 hours in two payroll periods.",
    ],
    fiscalConstants: {
      defaultReportEndDate: "2026-03-31",
    },
    officialSignature,
    tabs: buildTabs("pesp"),
  },
};

