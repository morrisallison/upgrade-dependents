import { PackageMeta } from "get-monorepo-packages";

export function foundPackage({ name, version }: PackageMeta) {
  return `Found package ${name}@${version}.`;
}

export function dependentsMissing() {
  return "No dependent packages were found";
}

export function dependentsFound(count: number) {
  return `Found ${count} dependent ${count > 1 ? "packages" : "package"}.`;
}

export function skipPackageWithComplexRange({ name, version }: PackageMeta) {
  return `Skipping ${name}@${version}. Version range is too complex.`;
}

export function upgradeDryRun() {
  return "Dry run enabled. Changes will not be persisted.";
}

export function packageUpgraded(
  dependentMeta: PackageMeta,
  dependencyName: string,
  newRange: string
) {
  const { name, version } = dependentMeta;
  return `Upgraded ${name}@${version} with ${dependencyName}(${newRange}).`;
}
