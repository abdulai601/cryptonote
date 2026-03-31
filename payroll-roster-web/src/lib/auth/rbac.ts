import { AppRole } from "@prisma/client";

export function hasRole(userRoles: AppRole[], required: AppRole): boolean {
  return userRoles.includes(required);
}

export function canViewProgram(userRoles: AppRole[]): boolean {
  return hasRole(userRoles, AppRole.VIEWER) || userRoles.length > 0;
}

export function canEditData(userRoles: AppRole[]): boolean {
  return hasRole(userRoles, AppRole.EDITOR) || hasRole(userRoles, AppRole.ADMIN);
}

export function canImport(userRoles: AppRole[]): boolean {
  return hasRole(userRoles, AppRole.IMPORTER) || hasRole(userRoles, AppRole.ADMIN);
}

export function canRunReports(userRoles: AppRole[]): boolean {
  return hasRole(userRoles, AppRole.REPORT_RUNNER) || hasRole(userRoles, AppRole.ADMIN);
}

export function canAdminister(userRoles: AppRole[]): boolean {
  return hasRole(userRoles, AppRole.ADMIN);
}
