import getPackages = require("get-monorepo-packages");

import { createDependentPackageDeterminer } from "./createDependentPackageDeterminer";
import { Logger } from "./createLogger";

function normalizeInfo({
  location,
  package: meta
}: GetMonorepoPackages.PackageInfo) {
  return {
    location,
    meta
  };
}

interface Options {
  force: boolean;
  logger: Logger;
  workingPackageMeta: GetMonorepoPackages.PackageMeta;
  workspaceDir: string;
}

export async function getDependentPackages({
  force,
  logger,
  workingPackageMeta,
  workspaceDir
}: Options) {
  const packageInfos = getPackages(workspaceDir).map(normalizeInfo);

  if (packageInfos.length === 0) {
    return [];
  }

  const isDependentPackage = createDependentPackageDeterminer({
    force,
    logger,
    workingPackageMeta
  });

  return packageInfos.filter(isDependentPackage);
}
