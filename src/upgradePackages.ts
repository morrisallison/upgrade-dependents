import { PackageMeta } from "get-monorepo-packages";
import jsonFilePlus = require("json-file-plus");
import pLimit from "p-limit";

import { createRange } from "./createRange";
import { getDependencyRange } from "./getDependencyRange";
import { getDesignationProperty } from "./getDesignationProperty";
import { Logger } from "./createLogger";
import { PackageInfo } from "./PackageInfo";
import * as logs from "./logs";
import * as path from "path";

const limit = pLimit(20);

interface UpgradePackageOptions {
  dependentPackageInfo: PackageInfo;
  dryRun: boolean;
  force: boolean;
  workingPackageMeta: PackageMeta;
  logger: Logger;
}

async function upgradePackage(options: UpgradePackageOptions) {
  const {
    workingPackageMeta,
    dependentPackageInfo,
    dryRun,
    force,
    logger
  } = options;
  const { name: dependencyName, version: newVersion } = workingPackageMeta;
  const { location, meta } = dependentPackageInfo;
  const oldRange = getDependencyRange(dependencyName, meta);
  const newRange = force ? `^${newVersion}` : createRange(oldRange, newVersion);
  const packageJsonPath = path.join(location, "package.json");
  const property = getDesignationProperty(dependencyName, meta);

  if (!property) {
    throw new Error("Dependency not found.");
  }

  const file = await jsonFilePlus(packageJsonPath);

  file.set({
    [property]: {
      [dependencyName]: newRange
    }
  });

  if (!dryRun) {
    await file.save();
  }

  logger.log(logs.packageUpgraded(meta, dependencyName, newRange));
}

interface UpgradePackagesOptions {
  dryRun: boolean;
  force: boolean;
  logger: Logger;
  packageInfos: PackageInfo[];
  workingPackageMeta: PackageMeta;
}

export function upgradePackages(options: UpgradePackagesOptions) {
  const { workingPackageMeta, packageInfos, dryRun, force, logger } = options;

  if (dryRun) {
    logger.log(logs.upgradeDryRun());
  }

  const operations = packageInfos.map(dependentPackageInfo => {
    return limit(() =>
      upgradePackage({
        dependentPackageInfo,
        dryRun,
        force,
        logger,
        workingPackageMeta
      })
    );
  });

  return Promise.all(operations);
}
