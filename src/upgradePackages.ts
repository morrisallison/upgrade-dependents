import jsonFilePlus = require("json-file-plus");
import pLimit = require("p-limit");
import * as path from "path";

import { Logger } from "./createLogger";
import { createRange } from "./createRange";
import { getDependencyRange } from "./getDependencyRange";
import { getDesignationProperty } from "./getDesignationProperty";
import * as logs from "./logs";
import { PackageInfo } from "./PackageInfo";

const limit = pLimit(20);

interface UpgradePackageOptions {
  dependentPackageInfo: PackageInfo;
  dryRun: boolean;
  workingPackageMeta: GetMonorepoPackages.PackageMeta;
  logger: Logger;
}

async function upgradePackage(options: UpgradePackageOptions) {
  const { workingPackageMeta, dependentPackageInfo, dryRun, logger } = options;
  const { name: dependencyName, version: newVersion } = workingPackageMeta;
  const { location, meta } = dependentPackageInfo;
  const oldRange = getDependencyRange(dependencyName, meta);
  const newRange = createRange(oldRange, newVersion);
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
  logger: Logger;
  packageInfos: PackageInfo[];
  workingPackageMeta: GetMonorepoPackages.PackageMeta;
}

export function upgradePackages(options: UpgradePackagesOptions) {
  const { workingPackageMeta, packageInfos, dryRun, logger } = options;

  if (dryRun) {
    logger.log(logs.upgradeDryRun());
  }

  const operations = packageInfos.map(dependentPackageInfo => {
    return limit(() =>
      upgradePackage({
        dependentPackageInfo,
        dryRun,
        logger,
        workingPackageMeta
      })
    );
  });

  return Promise.all(operations);
}
