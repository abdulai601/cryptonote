export type ProgramSlug = "standby" | "es" | "pesp";

export type WorkbookSectionKey =
  | "home"
  | "monthly-roster"
  | "current-year"
  | "master-data"
  | "facility-roster"
  | "contacts"
  | "signature"
  | "log";

export type WorkbookSection = {
  key: WorkbookSectionKey;
  label: string;
  href: string;
  description: string;
};

export type FieldMapping = {
  targetField: string;
  sourceColumnRef: string;
  notes?: string;
};

export type ProgramConfig = {
  slug: ProgramSlug;
  code: "STANDBY" | "ES" | "PESP";
  name: string;
  workbookTitle: string;
  monthlyRosterTitle: string;
  facilityRosterTitle: string;
  sourceWorkbookName: string;
  includeActiveDefault: boolean;
  activeRuleSummary: string;
  activeDedupeSummary: string;
  sortSummary: string;
  monthlyFieldMappings: FieldMapping[];
  facilityRosterNotes: string[];
  fiscalConstants: {
    defaultReportEndDate?: string;
  };
  officialSignature: string;
  tabs: WorkbookSection[];
};

export type MonthlyRosterSection = "Additions" | "Changes" | "Deletions" | "Active";

export type MonthlyRosterPreviewRow = {
  section: MonthlyRosterSection;
  employeeName: string;
  employeeId?: string;
  agency?: string;
  item?: string;
  status?: string;
  category?: string;
  beginDate?: string;
  endDate?: string;
  annualSalary?: number;
  hourlyRate?: number;
  notToExceedCost?: number;
};

export type FacilityRosterPreviewRow = {
  employeeName: string;
  employeeId?: string;
  facilityCode: string;
  status: string;
  item?: string;
  title?: string;
  category?: string;
  beginDate?: string;
  endDate?: string;
  comments?: string;
};

export type RosterFilterState = {
  controlNumber: string;
  includeActive: boolean;
};

export type FacilityFilterState = {
  facilityCode: string;
};

export type ReportBuilderMode = "official" | "adHoc";
